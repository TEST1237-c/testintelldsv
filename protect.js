(function () {
  'use strict';

  /* ══════════════════════════════════════════
     1. DISABLE RIGHT CLICK
  ══════════════════════════════════════════ */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  /* ══════════════════════════════════════════
     2. DISABLE KEYBOARD SHORTCUTS
  ══════════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) { e.preventDefault(); return false; }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault(); return false;
    }

    // Ctrl+U (view source)
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }

    // Ctrl+S (save page)
    if (e.ctrlKey && e.keyCode === 83) { e.preventDefault(); return false; }

    // Ctrl+A (select all)
    if (e.ctrlKey && e.keyCode === 65) { e.preventDefault(); return false; }

    // Ctrl+P (print)
    if (e.ctrlKey && e.keyCode === 80) { e.preventDefault(); return false; }
  });

  /* ══════════════════════════════════════════
     3. DISABLE TEXT SELECTION & DRAG
  ══════════════════════════════════════════ */
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart',   function (e) { e.preventDefault(); });
  document.addEventListener('copy',        function (e) { e.preventDefault(); });

  /* ══════════════════════════════════════════
     4. DEVTOOLS OPEN DETECTION (size trick)
     Redirects / blurs page if DevTools detected
  ══════════════════════════════════════════ */
  var devtools = { open: false, orientation: null };
  var threshold = 160;

  function detectDevTools() {
    var widthDiff  = window.outerWidth  - window.innerWidth;
    var heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        onDevToolsOpen();
      }
    } else {
      devtools.open = false;
    }
  }

  function onDevToolsOpen() {
    // Clear the page content and show a warning
    document.body.innerHTML =
      '<div style="' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'height:100vh;background:#0f1117;color:#e2e8f0;font-family:Segoe UI,sans-serif;' +
        'text-align:center;gap:16px;padding:24px;' +
      '">' +
        '<div style="font-size:3rem;">🚫</div>' +
        '<div style="font-size:1.4rem;font-weight:800;color:#e53e3e;">Access Denied</div>' +
        '<div style="color:#8892a4;max-width:360px;font-size:14px;">' +
          'Developer tools are not allowed on this page.' +
        '</div>' +
      '</div>';
  }

  setInterval(detectDevTools, 1000);

  /* ══════════════════════════════════════════
     5. DEBUGGER TRAP
     Pauses execution if DevTools console is open
  ══════════════════════════════════════════ */
  (function devToolsTrap() {
    var start = new Date();
    debugger;
    var end = new Date();
    if (end - start > 100) {
      onDevToolsOpen();
    }
    setTimeout(devToolsTrap, 3000);
  })();

  /* ══════════════════════════════════════════
     6. CONSOLE OVERRIDE — disable console output
  ══════════════════════════════════════════ */
  (function () {
    var noop = function () {};
    var methods = ['log','warn','error','info','debug','dir','table','trace','group','groupEnd','time','timeEnd','assert','profile'];
    methods.forEach(function (m) {
      try { console[m] = noop; } catch (e) {}
    });
  })();

  /* ══════════════════════════════════════════
     7. IFRAME BUSTING (prevent embedding)
  ══════════════════════════════════════════ */
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }

})();
