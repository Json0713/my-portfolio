## Jason B. Portfolio | Progressive Web App (PWA)

This project is a manually built Single Page Application (SPA) with full PWA capabilities, offline support, and installability
---

- Project Portfolio Mobile based Version.
- Built from scratch using vanilla HTML, CSS, and JS.
- Full Frontend skills with Logics and Architectural workflow

---

## Features

- Fully installable as a PWA (Add to Home Screen)
- Works with offline via Service Worker
- Custom `offline.html` fallback for cold requests
- SPA routing using hash (`#`) based navigation
- Theme toggle with persistent dark/light mode
- Bootstrap + Icons fully self-hosted (no CDN dependency)
- Unit-tested via `unit-tester`

---

## Project Structure

```
/ (root)
├── index.html
├── offline.html
├── manifest.json
├── services/
│   └── service.js
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── bootstrap.min.css
│   │   └── bootstrap-icons.css
│   ├── js/
│   │   ├── main.js
│   │   └── ...
│   ├── fonts/
│   │   ├── bootstrap-icons.woff
│   │   └── bootstrap-icons.woff2
│   └── images/
│       └── ...
├── test/
│   ├── unit-test-runner.js
│   └── unit-tester.html
```

---

## Install & Serve

> You can use any static server (Live Server, http-server, etc.)

```bash
npx http-server ./ -p 
```

Visit: `https://my-portfolio-fawn-six-spddunmlyp.vercel.app/`

---

## PWA Installation (Mobile)

1. Open in **Chrome Mobile**
2. Wait for prompt or tap menu `⋮`
3. Tap **"Add to Home Screen"**
4. App will open in standalone mode

---

## Offline Support

Once the site has been loaded at least once:
- Turn on **Airplane Mode**
- Reload any route → works offline
- Visit non-existent route → `offline.html` is served

---

## Unit Testing
```
To verify:
- Service Worker registration
- Offline fallback instruction
- Additional test cases can be added
- Routing SPA Capabilities 
---

## Deployment

You can host on:
- GitHub Pages
- Vercel

Ensure the following are in place:
- `manifest.json` linked in `<head>`
- `<script>` to register Service Worker with scope `/`
- All local assets precached in `service.js`

---

## Credits

- Built with [SPCK] on Android 
- Powered by Bootstrap 5.3.3 and Bootstrap Icons
- Service Worker + Manifest: vanilla setup

---

Feel free to fork or adapt this structure for any simple or large-scale SPA needing installable/offline behavior.
