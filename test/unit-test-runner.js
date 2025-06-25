// test/unit-test-runner.js

console.log("✅ Unit Test Runner Started");

function test(description, callback) {
  try {
    callback();
    console.log(`✅ PASS: ${description}`);
  } catch (error) {
    console.error(`❌ FAIL: ${description}`);
    console.error(error);
  }
}

function logResult(message, isPass) {
  const div = document.createElement("div");
  div.textContent = message;
  div.className = isPass ? "pass" : "fail";
  document.getElementById("test-output")?.appendChild(div);
}

// Delay service worker test until after page load
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistration()
      .then(reg => {
        if (!reg) throw new Error("Service Worker not found");
        logResult("✅ PASS: Service Worker registration exists", true);
      })
      .catch(err => {
        logResult("❌ FAIL: Service Worker registration", false);
        console.error(err);
      });
  });
} else {
  console.warn("❌ Service Worker not supported in this environment");
}

logResult("ℹ️ Manually test offline fallback by visiting /fake-page.html while offline", true);
