/* PenTrix VulnLab: search.js. Vanilla JS site search, index inlined
   (no fetch, works from file://). Never throws. */
(function () {
  "use strict";

  /* p: page, s: section, u: URL, d: description, k: keywords. */
  var SEARCH_INDEX = [
    { p: "Home", s: "PenTrix VulnLab", u: "index.html", d: "Learn web security by breaking real sites: 201 challenges, 29 modules.", k: "home overview start website" },
    { p: "Home", s: "See the first flag fall, simulated", u: "index.html#demo-h", d: "Scripted demo: SQLi login bypass in a terminal. Simulated only.", k: "" },
    { p: "Home", s: "Everything a web pentest lab should be", u: "index.html#features-h", d: "Challenge library, break-then-fix, scenarios, paths, hint ladders.", k: "features hints" },
    { p: "Home", s: "A peek inside the lab", u: "index.html#gallery-h", d: "Screenshots: dashboard, SQLi module, scenarios, certificate.", k: "gallery preview" },
    { p: "Home", s: "Why PenTrix", u: "index.html#compare-h", d: "How PenTrix compares to Juice Shop, WebGoat, PortSwigger Academy.", k: "" },
    { p: "Home", s: "Quick answers", u: "index.html#faq-h", d: "Is it safe to run? Can it go online? How do flags work?", k: "faq questions internet" },
    { p: "Home", s: "More from Muhammad Izaz Haider", u: "index.html#projects-h", d: "Other open-source projects: Security-Books, Ai-Terminal-X, Intel-Scan.", k: "github portfolio" },
    { p: "Install", s: "Install PenTrix VulnLab", u: "install.html", d: "One Docker command, or Node 20+ locally. First boot, troubleshooting.", k: "setup start verify" },
    { p: "Install", s: "Prerequisites", u: "install.html#prereqs", d: "What you need first: Docker or Node 20+, plus Git.", k: "" },
    { p: "Install", s: "Method 1: Docker (recommended)", u: "install.html#docker", d: "Clone the repo, build and start the container, open the lab.", k: "compose" },
    { p: "Install", s: "Method 2: Run it locally with Node", u: "install.html#node", d: "Clone, install dependencies, start the app with Node 20+.", k: "npm" },
    { p: "Install", s: "What happens on first boot", u: "install.html#first-boot", d: "Random per-install flags are generated on your machine.", k: "" },
    { p: "Install", s: "Troubleshooting", u: "install.html#troubleshooting", d: "Fixes for common install problems.", k: "errors" },
    { p: "Install", s: "Uninstall", u: "install.html#uninstall", d: "Remove the container and volumes, then delete the folder.", k: "clean" },
    { p: "Quick Start", s: "Your first flag in 5 minutes", u: "quickstart.html", d: "Bypass the login in the SQLi module. Scoreboard to 1/201.", k: "quickstart beginner" },
    { p: "Quick Start", s: "Open the SQL Injection module", u: "quickstart.html", d: "Step 2: open the SQLi module from the grid.", k: "two" },
    { p: "Quick Start", s: "Open the Login Bypass challenge", u: "quickstart.html", d: "Step 3: pick the Login Bypass challenge.", k: "three" },
    { p: "Quick Start", s: "Type the payload and log in", u: "quickstart.html", d: "Step 4: type the payload, submit the login form.", k: "admin dash four" },
    { p: "Quick Start", s: "Check your scoreboard", u: "quickstart.html", d: "Step 6: scoreboard reads 1/201 after the first flag.", k: "progress six" },
    { p: "Quick Start", s: "Next steps", u: "quickstart.html#next-steps", d: "Zero to Web Pentester path, a kill-chain scenario.", k: "docs" },
    { p: "Docs", s: "How PenTrix works", u: "docs.html", d: "Random flags, hint ladders, claiming, break-then-fix, certificates.", k: "docs it reset" },
    { p: "Docs", s: "How flags work", u: "docs.html#flags", d: "PENTRIX{32 hex}, generated on your machine. None in source.", k: "random format" },
    { p: "Docs", s: "Hint ladders", u: "docs.html#hints", d: "Every challenge has a 3-level hint ladder.", k: "hints stuck help" },
    { p: "Docs", s: "Claiming flags", u: "docs.html#claiming", d: "How earned flags get claimed. Beacons and replays get 400.", k: "submit" },
    { p: "Docs", s: "Break-then-fix", u: "docs.html#break-then-fix", d: "Exploit the bug, then patch it. The lab re-tests your fix.", k: "defender sandbox" },
    { p: "Docs", s: "Scenarios", u: "docs.html#scenarios", d: "Three kill-chains: Shop Takeover, API Heist, Ghost in the CMS.", k: "" },
    { p: "Docs", s: "Paths and certificates", u: "docs.html#paths", d: "Guided career paths with verifiable PNG certificates.", k: "" },
    { p: "Docs", s: "FAQ", u: "docs.html#faq", d: "The long answers: safety, flags, setup and rules.", k: "questions" },
    { p: "Tools", s: "Web Hacking Toolkit", u: "tools.html", d: "Burp Suite setup, proxy config, intercept and replay.", k: "tools" },
    { p: "Tools", s: "Burp Suite", u: "tools.html#burp-suite", d: "Community vs Pro, download, install, first launch.", k: "" },
    { p: "Tools", s: "Proxy setup", u: "tools.html#proxy-setup", d: "Manual proxy in any browser, or FoxyProxy. Scope to the lab.", k: "intercept" },
    { p: "Tools", s: "Core workflow", u: "tools.html#core-workflow", d: "Proxy, Repeater, Intruder, Decoder: intercept and replay.", k: "" },
    { p: "Tools", s: "Other tools", u: "tools.html#other-tools", d: "OWASP ZAP, sqlmap, ffuf, gobuster, nmap, hashcat.", k: "jwt" },
    { p: "Tools", s: "Tool-to-module mapping", u: "tools.html#tool-mapping", d: "Which tool fits which module.", k: "" },
    { p: "Tools", s: "Bug hunting methodology", u: "tools.html#methodology", d: "A repeatable methodology for working a challenge.", k: "process" },
    { p: "Modules", s: "29 Modules, 201 Challenges", u: "modules.html", d: "29 vulnerable app areas: Foundations to Advanced.", k: "catalog list" },
    { p: "Modules", s: "Foundations", u: "modules.html#foundations", d: "CSRF, Clickjacking, CSV Injection, HTTP Flaws, Open Redirect.", k: "" },
    { p: "Modules", s: "Injection", u: "modules.html#injection", d: "SQLi, Command Injection, XSS, SSTI, XXE, Path Traversal, Upload.", k: "lfi" },
    { p: "Modules", s: "Auth and Sessions", u: "modules.html#auth-sessions", d: "Broken Auth, JWT Attacks, OAuth Flaws, Session Management, CORS.", k: "authentication" },
    { p: "Modules", s: "Advanced", u: "modules.html#advanced", d: "API Flaws, Business Logic, SSRF, Prototype Pollution, ReDoS.", k: "race" },
    { p: "Privacy", s: "Privacy Policy", u: "privacy.html", d: "This static site collects no personal data, sets no cookies, runs no analytics.", k: "tracking third party lab contact changes" },
    { p: "Terms", s: "Terms of Use", u: "terms.html", d: "Educational content as-is. The lab is intentionally vulnerable, run it locally only.", k: "legal responsible warranty links contact changes" },
    { p: "404", s: "Lost in the lab?", u: "404.html", d: "This page does not exist. Links back to the lab.", k: "404 found missing" }
  ];

  var MAX_RESULTS = 8, MIN_QUERY = 2;

  var overlay, input, list, closeBtn, openBtn, status;
  var results = [], active = -1, openedBy = null;
  var isOpen = false;

  /* Screen reader announcement for result counts. The results list is a
     listbox, which does not announce changes reliably, so render() also
     writes a short summary here. */
  function announce(text) {
    try { if (status) status.textContent = text; } catch (e) {}
  }

  function $(id) { return document.getElementById(id); }

  /* Lowercase + strip accents: case- and accent-insensitive matching. */
  function norm(s) {
    var x = String(s == null ? "" : s).toLowerCase();
    try { x = x.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); } catch (e) {}
    return x;
  }

  function toks(s) {
    return norm(s).split(/[^a-z0-9]+/).filter(Boolean);
  }

  /* AND over tokens. Rank: page title, then section heading, then
     keywords, then description. A token with no hit excludes the entry. */
  function scoreEntry(e, ts) {
    var p = norm(e.p), s = norm(e.s), d = norm(e.d), kw = toks(e.k);
    var total = 0, i, j, t, v, best, hit;
    for (i = 0; i < ts.length; i++) {
      t = ts[i]; hit = false; best = 0;
      if (p.indexOf(t) === 0) { best = 30; hit = true; }
      else if (p.indexOf(t) !== -1) { best = 20; hit = true; }
      v = s.indexOf(t) === 0 ? 15 : (s.indexOf(t) !== -1 ? 12 : 0);
      if (v) { hit = true; if (v > best) best = v; }
      for (j = 0; j < kw.length; j++) {
        v = kw[j].indexOf(t) === 0 ? 10 : (kw[j].indexOf(t) !== -1 ? 4 : 0);
        if (v) { hit = true; if (v > best) best = v; }
      }
      if (d.indexOf(t) !== -1) { hit = true; if (best < 2) best = 2; }
      if (!hit) return -1;
      total += best;
    }
    return total;
  }

  function search(query) {
    var ts = toks(query), out = [], i, sc;
    if (!ts.length) return out;
    for (i = 0; i < SEARCH_INDEX.length; i++) {
      sc = scoreEntry(SEARCH_INDEX[i], ts);
      if (sc >= 0) out.push({ e: SEARCH_INDEX[i], sc: sc, i: i });
    }
    out.sort(function (a, b) { return b.sc !== a.sc ? b.sc - a.sc : a.i - b.i; });
    return out.slice(0, MAX_RESULTS).map(function (x) { return x.e; });
  }

  function escHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function highlight(text, ts) {
    var safe = escHtml(text);
    var sorted = ts.slice().sort(function (a, b) { return b.length - a.length; });
    if (!sorted.length) return safe;
    try {
      var pat = sorted.map(function (w) {
        return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }).join("|");
      return safe.replace(new RegExp("(" + pat + ")", "gi"), "<mark>$1</mark>");
    } catch (e) { return safe; }
  }

  function setActive(i) {
    try {
      active = i;
      var kids = list.children, k, el;
      for (k = 0; k < kids.length; k++) {
        kids[k].classList.toggle("active", k === i);
        kids[k].setAttribute("aria-selected", k === i ? "true" : "false");
      }
      el = kids[i];
      if (el && el.id) {
        input.setAttribute("aria-activedescendant", el.id);
        try { el.scrollIntoView({ block: "nearest" }); } catch (e2) {}
      }
    } catch (e) {}
  }

  function itemHtml(e, i, ts) {
    return '<li class="search-result" role="option" id="sr-' + i + '" aria-selected="false">' +
      '<span class="sr-title">' + highlight(e.s, ts) + "</span>" +
      '<span class="sr-meta"><span class="sr-page">' + escHtml(e.p) + "</span>" +
      '<span class="sr-desc">' + highlight(e.d, ts) + "</span></span></li>";
  }

  function render(query) {
    try {
      var q = String(query == null ? "" : query).replace(/^\s+|\s+$/g, "");
      var ts = toks(q), html = "", i;
      results = [];
      active = -1;
      input.removeAttribute("aria-activedescendant");
      if (q.length < MIN_QUERY) {
        list.innerHTML = "";
        input.setAttribute("aria-expanded", "false");
        announce("");
        return;
      }
      results = search(q);
      if (!results.length) {
        html = '<li class="search-empty" role="option" aria-selected="false" aria-disabled="true">No matches for \u201C' + escHtml(q) + "\u201D. Try fewer words, or check the spelling.</li>";
        announce("No matches for " + q + ". Try fewer words, or check the spelling.");
      } else {
        for (i = 0; i < results.length; i++) html += itemHtml(results[i], i, ts);
        announce(results.length + (results.length === 1 ? " result" : " results") + " for " + q + ". Use the arrow keys to choose one, then press Enter.");
      }
      list.innerHTML = html;
      input.setAttribute("aria-expanded", results.length ? "true" : "false");
    } catch (e) {}
  }

  function openSearch() {
    try {
      if (isOpen) { input.focus(); return; }
      isOpen = true;
      openedBy = document.activeElement;
      overlay.hidden = false;
      void overlay.offsetWidth;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render("");
      openBtn.setAttribute("aria-expanded", "true");
      /* The overlay is visibility:hidden until the .open transition runs,
         and browsers refuse to focus elements inside a hidden subtree, so
         an immediate focus() silently fails and focus stays on the search
         button. Focus again on the next frame and once the transition has
         finished, keeping whichever attempt lands first. */
      var focusInput = function () { try { input.focus(); } catch (e) {} };
      focusInput();
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { window.requestAnimationFrame(focusInput); });
      }
      setTimeout(function () {
        try { if (isOpen && document.activeElement !== input) focusInput(); } catch (e) {}
      }, 300);
    } catch (e) {}
  }

  function closeSearch() {
    try {
      if (!isOpen) return;
      isOpen = false;
      overlay.classList.remove("open");
      document.body.style.overflow = "";
      openBtn.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-expanded", "false");
      overlay.hidden = true;
      if (openedBy && openedBy.focus) {
        try { openedBy.focus(); } catch (e) {}
      }
    } catch (e) {}
  }

  function go(url) {
    try { window.location.assign(url); } catch (e) {}
  }

  function isEditable(el) {
    if (!el) return false;
    var tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    try { return !!el.isContentEditable; } catch (e) { return false; }
  }

  function onDocKey(e) {
    try {
      var key = e.key;
      if (key === "Escape" && isOpen) {
        e.preventDefault();
        closeSearch();
        return;
      }
      if (key === "Tab" && isOpen) {
        /* Trap: input and close are the only tabbables. */
        if (e.shiftKey && document.activeElement === input) {
          e.preventDefault(); closeBtn.focus();
        } else if (!e.shiftKey && document.activeElement === closeBtn) {
          e.preventDefault(); input.focus();
        }
        return;
      }
      if (key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (isOpen) {
          if (document.activeElement !== input) { e.preventDefault(); input.focus(); }
        } else if (!isEditable(e.target)) {
          e.preventDefault();
          openSearch();
        }
        return;
      }
      if (e.target === input && isOpen) {
        var n = results.length;
        if (key === "ArrowDown") {
          e.preventDefault();
          if (n) setActive(active < n - 1 ? active + 1 : 0);
        } else if (key === "ArrowUp") {
          e.preventDefault();
          if (n) setActive(active > 0 ? active - 1 : n - 1);
        } else if (key === "Enter") {
          e.preventDefault();
          if (active >= 0 && active < n) {
            go(results[active].u);
          } else if (n) {
            /* No arrow selection yet: Enter opens the top result. */
            go(results[0].u);
          }
        }
      }
    } catch (err) {}
  }

  function init() {
    try {
      openBtn = $("search-open");
      overlay = $("search-overlay");
      input = $("search-input");
      list = $("search-results");
      closeBtn = $("search-close");
      if (!openBtn || !overlay || !input || !list || !closeBtn) return;
      if (!status) {
        try {
          status = document.createElement("p");
          status.className = "visually-hidden";
          status.setAttribute("aria-live", "polite");
          status.setAttribute("role", "status");
          var panel = overlay.querySelector(".search-panel");
          (panel || overlay).appendChild(status);
        } catch (e) { status = null; }
      }
      input.addEventListener("input", function () {
        try { render(input.value); } catch (e) {}
      });
      openBtn.addEventListener("click", function () {
        try { openSearch(); } catch (e) {}
      });
      closeBtn.addEventListener("click", function () {
        try { closeSearch(); } catch (e) {}
      });
      var backdrop = overlay.querySelector(".search-backdrop");
      if (backdrop) {
        backdrop.addEventListener("click", function () {
          try { closeSearch(); } catch (e) {}
        });
      }
      list.addEventListener("click", function (e) {
        try {
          var li = e.target && e.target.closest ? e.target.closest(".search-result") : null;
          var idx = li ? parseInt(li.id.slice(3), 10) : -1;
          if (idx >= 0 && idx < results.length) go(results[idx].u);
        } catch (err) {}
      });
      document.addEventListener("keydown", onDocKey);
    } catch (e) {}
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {}
})();
