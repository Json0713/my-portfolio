// src/js/chatbot/chatbot.js — AI Chatbot Widget Controller
// Calls /api/chat (Vercel serverless proxy) — NEVER calls Gemini directly.

import DOMPurify from 'dompurify';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_ENDPOINT = '/api/chat';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 20;

/** Client-side rate limit mirroring the server (for UX feedback only) */
const CLIENT_RATE_LIMIT = 10;
const CLIENT_RATE_WINDOW_MS = 60_000;

const CLIENT_DAILY_LIMIT = 100;
const CLIENT_DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;

const SUGGESTION_CHIPS = [
  "What are Jason's skills?",
  'Tell me about his projects',
  'How can I contact Jason?',
  "What's his tech stack?",
];

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {{ role: 'user' | 'model'; parts: { text: string }[] }[]} */
let conversationHistory = [];

/** Client-side rate limit tracking */
let requestCount = 0;
let windowStart = Date.now();

/** @type {ReturnType<typeof setTimeout> | null} */
let rateLimitTimer = null;

/** Whether the panel is currently open */
let isPanelOpen = false;
let isMaximized = false;

// ─── DOM References (set during init) ─────────────────────────────────────────
let fabEl = null;
let panelEl = null;
let messagesEl = null;
let inputEl = null;
let sendBtnEl = null;
let charCountEl = null;
let rateMsgEl = null;

// ─── Markdown-lite Renderer ───────────────────────────────────────────────────

/**
 * Convert a minimal set of markdown patterns to safe HTML.
 * Only handles: **bold**, `code`, [links](url), bullet lists.
 * Output is always passed through DOMPurify before insertion.
 * @param {string} text
 * @returns {string}
 */
function renderMarkdown(text) {
  let html = text
    // Escape HTML entities first (XSS prevention before DOMPurify)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // **bold**
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // `inline code`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // [text](url) — only allow https:// and relative URLs
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bullet list items (- item or * item)
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    // Newlines to <br> (only outside list items)
    .replace(/\n(?!<li>)/g, '<br>');

  // Wrap consecutive <li> tags in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<br>\s*(<li>.*?<\/li>))*/gs, (match) => {
    const cleaned = match.replace(/<br>\s*/g, '');
    return `<ul>${cleaned}</ul>`;
  });

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'code', 'a', 'ul', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

// ─── Client Rate Limiter ──────────────────────────────────────────────────────

/**
 * Check client-side rate limit (burst). Returns { allowed, waitSeconds }.
 * @returns {{ allowed: boolean; waitSeconds: number }}
 */
function checkClientRate() {
  const now = Date.now();
  if (now - windowStart > CLIENT_RATE_WINDOW_MS) {
    requestCount = 0;
    windowStart = now;
  }
  if (requestCount >= CLIENT_RATE_LIMIT) {
    const waitSeconds = Math.ceil((CLIENT_RATE_WINDOW_MS - (now - windowStart)) / 1000);
    return { allowed: false, waitSeconds };
  }
  requestCount++;
  return { allowed: true, waitSeconds: 0 };
}

/**
 * Check client-side daily rate limit using localStorage (survives refreshes).
 * @returns {{ allowed: boolean; waitHours: number }}
 */
function checkClientDailyRate() {
  const now = Date.now();
  let dailyData = { count: 0, start: now };
  
  try {
    const stored = localStorage.getItem('chatbotDailyLimit');
    if (stored) {
      dailyData = JSON.parse(stored);
    }
  } catch (e) {
    // Ignore parse error
  }

  if (now - dailyData.start > CLIENT_DAILY_WINDOW_MS) {
    dailyData = { count: 0, start: now };
  }

  if (dailyData.count >= CLIENT_DAILY_LIMIT) {
    const waitHours = Math.ceil((CLIENT_DAILY_WINDOW_MS - (now - dailyData.start)) / (1000 * 60 * 60));
    return { allowed: false, waitHours };
  }

  dailyData.count++;
  try {
    localStorage.setItem('chatbotDailyLimit', JSON.stringify(dailyData));
  } catch (e) {
    // Ignore storage errors
  }
  
  return { allowed: true, waitHours: 0 };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Get current time formatted as HH:MM.
 * @returns {string}
 */
function getTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Auto-resize textarea to fit its content.
 * @param {HTMLTextAreaElement} textarea
 */
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
}

/**
 * Scroll the messages container to the bottom.
 */
function scrollToBottom() {
  if (messagesEl) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

/**
 * Show a rate limit message below the input.
 * @param {string} text
 */
function showRateMsg(text) {
  if (!rateMsgEl) return;
  rateMsgEl.textContent = text;
  rateMsgEl.style.display = 'block';
  clearTimeout(rateLimitTimer);
  rateLimitTimer = setTimeout(() => {
    if (rateMsgEl) rateMsgEl.style.display = 'none';
  }, 5000);
}

function hideRateMsg() {
  if (!rateMsgEl) rateMsgEl.style.display = 'none';
}

// ─── DOM Builders ─────────────────────────────────────────────────────────────

/**
 * Create and append the FAB button to document.body.
 * @returns {HTMLButtonElement}
 */
function createFab() {
  const btn = document.createElement('button');
  btn.id = 'chatbot-fab';
  btn.className = 'chatbot-fab';
  btn.setAttribute('aria-label', 'Open AI chat assistant');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'chatbot-panel');
  btn.innerHTML = `
    <i class="bi bi-chat-dots-fill icon-chat" aria-hidden="true"></i>
    <span class="chatbot-badge" id="chatbot-badge" aria-hidden="true"></span>
  `;
  document.body.appendChild(btn);
  return btn;
}

/**
 * Build the suggestion chips HTML.
 * @returns {string}
 */
function buildSuggestionsHTML() {
  return SUGGESTION_CHIPS.map(
    (chip) =>
      `<button class="chatbot-suggestion-chip" data-msg="${chip}" aria-label="Ask: ${chip}">${chip}</button>`
  ).join('');
}

/**
 * Create and append the chat panel to document.body.
 * @returns {HTMLElement}
 */
function createPanel() {
  const panel = document.createElement('div');
  panel.id = 'chatbot-panel';
  panel.className = 'chatbot-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', "Jason's AI Portfolio Assistant");
  panel.setAttribute('aria-hidden', 'true');

  panel.innerHTML = `
    <div class="chatbot-header">
      <div class="chatbot-avatar" aria-hidden="true">
        <i class="bi bi-stars"></i>
      </div>
      <div class="chatbot-header-info">
        <div class="chatbot-header-name">Jason's AI Assistant</div>
        <div class="chatbot-header-status">
          <span class="chatbot-status-dot" aria-hidden="true"></span>
          <span>Online • Portfolio Assistant</span>
        </div>
      </div>
      <div class="chatbot-header-actions">
        <button class="chatbot-header-btn" id="chatbot-maximize-btn" title="Maximize chat" aria-label="Maximize chat">
          <i class="bi bi-arrows-fullscreen" aria-hidden="true"></i>
        </button>
        <button class="chatbot-header-btn" id="chatbot-clear-btn" title="Reset chat" aria-label="Reset conversation history">
          <i class="bi bi-trash3" aria-hidden="true"></i>
        </button>
        <button class="chatbot-header-btn" id="chatbot-close-btn" title="Close chat" aria-label="Close chat">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div class="chatbot-messages" id="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages">
      <div class="chatbot-welcome" id="chatbot-welcome" aria-label="Welcome message">
        <div class="chatbot-welcome-icon" aria-hidden="true">
          <i class="bi bi-stars"></i>
        </div>
        <h6>Hi! I'm Jason's AI Assistant</h6>
        <p>Ask me anything about Jason's skills, projects, or how to get in touch!</p>
        <div class="chatbot-suggestions" role="list" aria-label="Suggested questions">
          ${buildSuggestionsHTML()}
        </div>
      </div>
    </div>

    <div class="chatbot-char-count" id="chatbot-char-count" aria-live="polite" aria-atomic="true"></div>
    <div class="chatbot-rate-msg" id="chatbot-rate-msg" role="alert" style="display:none;"></div>

    <div class="chatbot-input-area">
      <textarea
        id="chatbot-input"
        class="chatbot-input"
        placeholder="Ask about Jason's skills, projects…"
        rows="1"
        maxlength="${MAX_MESSAGE_LENGTH}"
        aria-label="Type your message"
        aria-required="true"
      ></textarea>
      <button
        id="chatbot-send-btn"
        class="chatbot-send-btn"
        aria-label="Send message"
        disabled
      >
        <i class="bi bi-send-fill" aria-hidden="true"></i>
      </button>
    </div>
  `;

  document.body.appendChild(panel);
  return panel;
}

// ─── Message Renderers ─────────────────────────────────────────────────────────

/**
 * Remove the welcome/empty-state element if present.
 */
function removeWelcome() {
  const welcome = document.getElementById('chatbot-welcome');
  if (welcome) welcome.remove();
}

/**
 * Append a message bubble to the messages list.
 * @param {'user' | 'bot' | 'error'} role
 * @param {string} content  — Raw text (will be sanitized / rendered)
 * @returns {HTMLElement}  The bubble element
 */
function appendMessage(role, content) {
  removeWelcome();

  const wrapper = document.createElement('div');
  wrapper.className = `chatbot-message ${role === 'user' ? 'user' : 'bot'}`;

  const icon = document.createElement('div');
  icon.className = 'chatbot-message-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML =
    role === 'user'
      ? '<i class="bi bi-person-fill"></i>'
      : '<i class="bi bi-stars"></i>';

  const bubble = document.createElement('div');
  bubble.className = `chatbot-bubble${role === 'error' ? ' error' : ''}`;

  if (role === 'user') {
    // User text: escape only, no markdown
    bubble.textContent = content;
  } else {
    // Bot/error: render markdown-lite then sanitize
    bubble.innerHTML = renderMarkdown(content);
  }

  const timestamp = document.createElement('div');
  timestamp.className = 'chatbot-timestamp';
  timestamp.setAttribute('aria-label', `Sent at ${getTimestamp()}`);
  timestamp.textContent = getTimestamp();

  const inner = document.createElement('div');
  inner.className = 'chatbot-message-inner';
  inner.style.display = 'flex';
  inner.style.flexDirection = 'column';
  inner.style.alignItems = role === 'user' ? 'flex-end' : 'flex-start';
  inner.appendChild(bubble);
  inner.appendChild(timestamp);

  wrapper.appendChild(icon);
  wrapper.appendChild(inner);
  messagesEl.appendChild(wrapper);

  scrollToBottom();
  return wrapper;
}

/**
 * Append the typing indicator and return a function to remove it.
 * @returns {() => void}
 */
function showTypingIndicator() {
  removeWelcome();

  const wrapper = document.createElement('div');
  wrapper.className = 'chatbot-typing';
  wrapper.id = 'chatbot-typing-indicator';
  wrapper.setAttribute('aria-live', 'polite');
  wrapper.setAttribute('aria-label', 'AI is typing');

  const icon = document.createElement('div');
  icon.className = 'chatbot-message-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = '<i class="bi bi-stars"></i>';
  icon.style.cssText = 'background: linear-gradient(135deg, var(--accent), rgba(var(--accent-rgb), 0.5)); color: var(--accent-contrast); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:.75rem;';

  const bubble = document.createElement('div');
  bubble.className = 'chatbot-typing-bubble';
  bubble.innerHTML = `
    <span class="chatbot-typing-dot" aria-hidden="true"></span>
    <span class="chatbot-typing-dot" aria-hidden="true"></span>
    <span class="chatbot-typing-dot" aria-hidden="true"></span>
  `;

  wrapper.appendChild(icon);
  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  scrollToBottom();

  return () => wrapper.remove();
}

// ─── API Call ─────────────────────────────────────────────────────────────────

/**
 * Send a message to the /api/chat proxy and return the reply text.
 * @param {string} message
 * @returns {Promise<string>}
 */
async function sendToAPI(message) {
  let response;

  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: conversationHistory.slice(-MAX_HISTORY_TURNS * 2),
      }),
    });
  } catch {
    // Network-level failure (no server, offline, CORS block)
    throw new Error(
      'Unable to reach the AI service. Make sure you are running `npm run dev:api` (not `npm run dev`) to enable the API.'
    );
  }

  // 404 means the /api/chat serverless function is not running.
  // This happens when using plain `npm run dev` (Vite only) instead of `npm run dev:api` (Vercel Dev).
  if (response.status === 404) {
    throw new Error(
      'API not found (404). Run `npm run dev:api` instead of `npm run dev` to enable the AI chatbot locally.'
    );
  }

  // Safely parse JSON — the response body may be empty or HTML on unexpected errors
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Received an unexpected response from the server. Please try again.');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Something went wrong. Please try again.');
  }

  return data.reply;
}


// ─── Send Handler ─────────────────────────────────────────────────────────────

/**
 * Core send flow: validate → rate check → append user msg →
 * show typing → call API → append bot response → update history.
 * @param {string} message
 */
async function handleSend(message) {
  const trimmed = message.trim();
  if (!trimmed) return;

  // 1. Client-side daily rate limit check
  const daily = checkClientDailyRate();
  if (!daily.allowed) {
    showRateMsg(`⏱ Daily limit reached. Please try again in ${daily.waitHours} hour(s).`);
    return;
  }

  // 2. Client-side burst rate limit check
  const burst = checkClientRate();
  if (!burst.allowed) {
    // Revert the daily count we just incremented since the burst limit caught it
    try {
      let dailyData = JSON.parse(localStorage.getItem('chatbotDailyLimit'));
      if (dailyData && dailyData.count > 0) {
        dailyData.count--;
        localStorage.setItem('chatbotDailyLimit', JSON.stringify(dailyData));
      }
    } catch (e) {}

    showRateMsg(`⏱ Rate limit reached. Please wait ${burst.waitSeconds}s before sending again.`);
    return;
  }

  // Disable input while waiting
  inputEl.value = '';
  inputEl.style.height = 'auto';
  inputEl.disabled = true;
  sendBtnEl.disabled = true;
  charCountEl.textContent = '';

  // Render user message
  appendMessage('user', trimmed);

  // Typing indicator
  const removeTyping = showTypingIndicator();

  try {
    const reply = await sendToAPI(trimmed);

    removeTyping();

    // Update conversation history for context
    conversationHistory.push({ role: 'user', parts: [{ text: trimmed }] });
    conversationHistory.push({ role: 'model', parts: [{ text: reply }] });

    // Keep history within limits
    if (conversationHistory.length > MAX_HISTORY_TURNS * 2) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY_TURNS * 2);
    }

    sessionStorage.setItem('chatbotHistory', JSON.stringify(conversationHistory));

    appendMessage('bot', reply);
  } catch (err) {
    removeTyping();
    appendMessage('error', err.message || 'Something went wrong. Please try again.');
  } finally {
    inputEl.disabled = false;
    inputEl.focus();
  }
}

// ─── Panel Toggle ─────────────────────────────────────────────────────────────

/**
 * Toggle the chat panel visibility.
 */
function togglePanel() {
  if (isPanelOpen) {
    closePanel();
  } else {
    openPanel();
  }
}

function toggleMaximize() {
  isMaximized = !isMaximized;
  if (isMaximized) {
    panelEl.classList.add('is-maximized');
  } else {
    panelEl.classList.remove('is-maximized');
  }
}

function openPanel() {
  if (!panelEl) return;
  isPanelOpen = true;
  panelEl.classList.add('is-visible');
  fabEl.classList.add('is-open');
  fabEl.setAttribute('aria-expanded', 'true');
  panelEl.setAttribute('aria-hidden', 'false');

  const badge = document.getElementById('chatbot-badge');
  if (badge) badge.classList.remove('visible');

  document.body.classList.add('chatbot-no-scroll');

  if (conversationHistory.length === 0) {
    setTimeout(() => {
      inputEl?.focus();
    }, 350);
  } else {
    scrollToBottom();
    inputEl?.focus();
  }
}

function closePanel() {
  if (!panelEl) return;
  isPanelOpen = false;
  panelEl.classList.remove('is-visible');
  fabEl.classList.remove('is-open');
  fabEl.setAttribute('aria-expanded', 'false');
  fabEl.focus(); // Move focus away from panel buttons to prevent ARIA errors
  panelEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('chatbot-no-scroll');
}

// ─── Clear Conversation ────────────────────────────────────────────────────────

function clearConversation() {
  conversationHistory = [];
  requestCount = 0;
  windowStart = Date.now();
  sessionStorage.removeItem('chatbotHistory');

  if (!messagesEl) return;
  messagesEl.innerHTML = `
    <div class="chatbot-welcome" id="chatbot-welcome" aria-label="Welcome message">
      <div class="chatbot-welcome-icon" aria-hidden="true">
        <i class="bi bi-stars"></i>
      </div>
      <h6>Conversation cleared!</h6>
      <p>Ask me anything about Jason's skills, projects, or how to get in touch!</p>
      <div class="chatbot-suggestions" role="list" aria-label="Suggested questions">
        ${buildSuggestionsHTML()}
      </div>
    </div>
  `;
  bindSuggestions();
}

// ─── Event Bindings ───────────────────────────────────────────────────────────

/**
 * Bind click handlers to suggestion chips inside the messages area.
 */
function bindSuggestions() {
  const chips = messagesEl?.querySelectorAll('.chatbot-suggestion-chip');
  chips?.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent global outside-click listener from firing
      const msg = chip.dataset.msg;
      if (msg) handleSend(msg);
    });
  });
}

/**
 * Set up all event listeners.
 */
function bindEvents() {
  // FAB toggle
  fabEl.addEventListener('click', togglePanel);

  // Clear button
  const clearBtn = document.getElementById('chatbot-clear-btn');
  clearBtn?.addEventListener('click', clearConversation);

  // Maximize button
  const maximizeBtn = document.getElementById('chatbot-maximize-btn');
  maximizeBtn?.addEventListener('click', toggleMaximize);

  // Close button
  const closeBtn = document.getElementById('chatbot-close-btn');
  closeBtn?.addEventListener('click', closePanel);

  // Input — auto-resize + char count + send button state
  inputEl.addEventListener('input', () => {
    autoResizeTextarea(inputEl);

    const len = inputEl.value.length;
    const remaining = MAX_MESSAGE_LENGTH - len;

    if (len > 0) {
      charCountEl.textContent = `${len} / ${MAX_MESSAGE_LENGTH}`;
      charCountEl.className = 'chatbot-char-count';
      if (remaining < 200) charCountEl.classList.add('warn');
      if (remaining < 50) {
        charCountEl.classList.remove('warn');
        charCountEl.classList.add('danger');
      }
    } else {
      charCountEl.textContent = '';
    }

    sendBtnEl.disabled = len === 0 || inputEl.disabled;
  });

  // Keyboard: Enter to send, Shift+Enter for newline
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtnEl.disabled) {
        handleSend(inputEl.value);
      }
    }
  });

  // Send button click
  sendBtnEl.addEventListener('click', () => {
    if (!sendBtnEl.disabled) {
      handleSend(inputEl.value);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPanelOpen) {
      closePanel();
    }
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (
      isPanelOpen &&
      !panelEl.contains(e.target) &&
      !fabEl.contains(e.target)
    ) {
      closePanel();
    }
  });

  // Initial suggestion chips
  bindSuggestions();
}

// ─── Public Init ──────────────────────────────────────────────────────────────

/**
 * Initialize the chatbot widget.
 * Call once from main.js after DOMContentLoaded.
 */
export function initChatbot() {
  // Avoid double-initialization
  if (document.getElementById('chatbot-fab')) return;

  fabEl = createFab();
  panelEl = createPanel();

  // Cache DOM references
  messagesEl = document.getElementById('chatbot-messages');
  inputEl = document.getElementById('chatbot-input');
  sendBtnEl = document.getElementById('chatbot-send-btn');
  charCountEl = document.getElementById('chatbot-char-count');
  rateMsgEl = document.getElementById('chatbot-rate-msg');
  bindEvents();

  // Load cached history
  const savedHistory = sessionStorage.getItem('chatbotHistory');
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        conversationHistory = parsed;
        removeWelcome();
        parsed.forEach(turn => {
          if (turn.parts && turn.parts[0]) {
            appendMessage(turn.role === 'model' ? 'bot' : 'user', turn.parts[0].text);
          }
        });
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
      sessionStorage.removeItem('chatbotHistory');
    }
  }
}
