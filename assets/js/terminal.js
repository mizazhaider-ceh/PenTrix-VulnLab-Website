/* ============================================================
   PenTrix VulnLab: terminal.js
   Animated SIMULATED terminal demo. Pure front-end, zero
   network calls (no fetch, no XHR, no WebSocket anywhere).
   Every keystroke is scripted; the transcript below is the
   entire show. The flag is obviously fake by design.

   Robustness contract (mirrors site.js):
   - Everything runs inside try/catch; this file never throws.
   - prefers-reduced-motion OR no IntersectionObserver means
     the static transcript stays visible and JS does nothing.
   - The site's own 2s safety net force-reveals [data-reveal],
     so this widget can never stay invisible.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Scripted transcripts. Simulated only. ---------- */
  var TRANSCRIPTS = {
    compact: [
      { t: "$ ./pentrix-demo --target login-bypass", c: "l-cmd" },
      { t: "[*] SIMULATION: no real system involved", c: "l-info" },
      { t: "[+] typing username: admin' -- ", c: "l-ok" },
      { t: "[+] typing password: ********", c: "l-ok" },
      { t: "[+] server: 200 OK, welcome back, admin", c: "l-ok" },
      { t: "[+] flag captured: PENTRIX{DEMO-SIMULATED-FLAG}", c: "l-ok", flag: true }
    ],
    full: [
      { t: "$ ./pentrix-demo --target login-bypass", c: "l-cmd" },
      { t: "[*] SIMULATION: no real system involved", c: "l-info" },
      { t: "POST /api/login -> 200 OK (18 ms)", c: "l-info" },
      { t: "[*] payload echo: admin' --  (the trailing space is part of it)", c: "l-info" },
      { t: "[+] typing username: admin' -- ", c: "l-ok" },
      { t: "[+] typing password: ********", c: "l-ok" },
      { t: "[*] built query: SELECT * FROM users WHERE username = 'admin' -- ' ...", c: "l-info" },
      { t: "[*] server: comment swallowed the password check", c: "l-info" },
      { t: "[+] server: 200 OK, welcome back, admin", c: "l-ok" },
      { t: "[+] flag captured: PENTRIX{DEMO-SIMULATED-FLAG}", c: "l-ok", flag: true },
      { t: "[*] scoreboard: 1/201", c: "l-info" }
    ]
  };

  var SPEEDS = {
    compact: { perChar: 26, linePause: 160, flagPause: 700 },
    full:    { perChar: 20, linePause: 160, flagPause: 700 }
  };

  function getTranscript(key) {
    if (Object.prototype.hasOwnProperty.call(TRANSCRIPTS, key)) return TRANSCRIPTS[key];
    return TRANSCRIPTS.compact;
  }

  function getSpeed(key) {
    if (Object.prototype.hasOwnProperty.call(SPEEDS, key)) return SPEEDS[key];
    return SPEEDS.compact;
  }

  /* Run id guard: replay cancels any in-flight typing on the same widget. */
  function bumpRun(root) {
    var n = parseInt(root.getAttribute("data-term-run") || "0", 10);
    n = (isNaN(n) ? 0 : n) + 1;
    root.setAttribute("data-term-run", String(n));
    return n;
  }

  function isCurrent(root, run) {
    return root.getAttribute("data-term-run") === String(run);
  }

  function makeCursor(doc) {
    var s = doc.createElement("span");
    s.className = "term-cursor";
    return s;
  }

  function typeWidget(root) {
    var doc = root.ownerDocument;
    var live = root.querySelector(".term-live");
    if (!live) return;
    var key = root.getAttribute("data-term") || "compact";
    var lines = getTranscript(key);
    var speed = getSpeed(key);
    var run = bumpRun(root);

    try { root.classList.add("is-typing"); } catch (e) {}

    /* Clear and restart. */
    while (live.firstChild) live.removeChild(live.firstChild);
    var cursor = makeCursor(doc);
    live.appendChild(cursor);

    var li = 0, ci = 0, lineEl = null;

    function finish() {
      /* Keep a blinking cursor at the end of the demo. */
    }

    function nextLine() {
      if (!isCurrent(root, run)) return;
      if (li >= lines.length) { finish(); return; }
      lineEl = doc.createElement("div");
      if (lines[li].c) lineEl.className = lines[li].c;
      live.insertBefore(lineEl, cursor);
      ci = 0;
      setTimeout(typeChar, speed.perChar);
    }

    function typeChar() {
      try {
        if (!isCurrent(root, run)) return;
        var text = lines[li].t;
        if (ci < text.length) {
          lineEl.appendChild(doc.createTextNode(text.charAt(ci)));
          ci += 1;
          setTimeout(typeChar, speed.perChar);
        } else {
          li += 1;
          var pause = speed.linePause;
          if (li < lines.length && lines[li].flag) pause = speed.flagPause;
          setTimeout(nextLine, pause);
        }
      } catch (e) {
        /* A failed keystroke must never break the page. */
      }
    }

    setTimeout(nextLine, 250);
  }

  function initWidget(root) {
    try {
      var replay = root.querySelector(".term-replay");
      if (replay) {
        replay.addEventListener("click", function () {
          try { typeWidget(root); } catch (e) {}
        });
      }
      if (!("IntersectionObserver" in window)) return; /* static transcript stays */
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          try {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
              io.unobserve(entry.target);
              typeWidget(entry.target);
            }
          } catch (e) {}
        });
      }, { threshold: 0.4 });
      io.observe(root);
    } catch (e) {
      /* Widget enhancement failed; static transcript remains visible. */
    }
  }

  function init() {
    try {
      var reduced = false;
      try {
        reduced = window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch (e) {}
      /* Reduced motion or no IntersectionObserver: keep the static
         transcript, do nothing else. */
      if (reduced || !("IntersectionObserver" in window)) return;
      var widgets = document.querySelectorAll(".term[data-term]");
      for (var i = 0; i < widgets.length; i++) initWidget(widgets[i]);
    } catch (e) {
      /* Never throw. */
    }
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {
    /* Never throw. */
  }
})();
