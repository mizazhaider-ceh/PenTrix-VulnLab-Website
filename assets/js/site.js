/* PenTrix website: progressive enhancements. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    try { document.documentElement.classList.add("js"); } catch (e) {}
    try { copyButtons(); } catch (e) {}
    try { navHighlight(); } catch (e) {}
    try { smoothScroll(); } catch (e) {}
    try { reveals(); } catch (e) {}
    try { countUps(); } catch (e) {}
    try { navScroll(); } catch (e) {}
    try { tilt(); } catch (e) {}
    try { lastUpdated(); } catch (e) {}
    try { mobileNav(); } catch (e) {}
    try { mobileCta(); } catch (e) {}
    try { floatingUI(); } catch (e) {}
    try { mediaLoading(); } catch (e) {}
    try {
      var hv = document.querySelector(".hero-video video");
      if (hv && reducedMotion) { hv.removeAttribute("autoplay"); hv.pause(); }
    } catch (e) {}
  }

  /* 1. Copy buttons for every <pre> containing <code> */
  function copyButtons() {
    var blocks;
    try {
      blocks = document.querySelectorAll("pre");
    } catch (e) {
      return;
    }
    for (var i = 0; i < blocks.length; i++) {
      (function (pre) {
        try {
          var code = pre.querySelector("code");
          if (!code) return;
          if (pre.querySelector(".copy-btn")) return; /* already attached */

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "copy-btn";
          btn.textContent = "Copy";
          btn.setAttribute("aria-label", "Copy code to clipboard");

          btn.addEventListener("click", function () {
            var text = code.textContent;
            copyText(text).then(function (ok) {
              if (ok) {
                var original = btn.textContent;
                btn.textContent = "Copied";
                btn.classList.add("copied");
                btn.setAttribute("disabled", "disabled");
                setTimeout(function () {
                  btn.textContent = original;
                  btn.classList.remove("copied");
                  btn.removeAttribute("disabled");
                }, 1500);
              }
            });
          });

          /* Keep the block positioned so the button can sit in its corner. */
          if (window.getComputedStyle(pre).position === "static") {
            pre.style.position = "relative";
          }
          pre.appendChild(btn);
        } catch (e) {
          /* Skip this block, keep going with the rest. */
        }
      })(blocks[i]);
    }
  }

  function copyText(text) {
    /* Prefer the async clipboard API, fall back to a temp textarea. */
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(
          function () {
            return true;
          },
          function () {
            return legacyCopy(text);
          }
        );
      }
    } catch (e) {
      /* Fall through to the legacy path. */
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  /* 2. Nav highlighting: set aria-current on the link matching the URL */
  function navHighlight() {
    try {
      var links = document.querySelectorAll(".topbar nav a");
      if (!links.length) return;

      var path = location.pathname || "";
      var current = path.split("/").pop() || "index.html";
      /* Strip query/hash leftovers, just in case. */
      current = current.split("?")[0].split("#")[0] || "index.html";

      for (var i = 0; i < links.length; i++) {
        (function (a) {
          try {
            var href = a.getAttribute("href") || "";
            /* Only local page links, never anchors or the GitHub button. */
            if (!href || href.charAt(0) === "#" || href.indexOf("://") !== -1) {
              return;
            }
            var target = href.split("/").pop().split("?")[0].split("#")[0];
            if (target === current) {
              a.setAttribute("aria-current", "page");
            }
          } catch (e) {
            /* Skip this link, keep going. */
          }
        })(links[i]);
      }
    } catch (e) {
      /* Nav highlighting is enhancement only; pages also hardcode it. */
    }
  }

  /* 3. Smooth scroll for in-page anchor links */
  function smoothScroll() {
    try {
      document.addEventListener("click", function (event) {
        var a = event.target && event.target.closest
          ? event.target.closest('a[href^="#"]')
          : null;
        if (!a) return;
        var hash = a.getAttribute("href");
        if (!hash || hash === "#") return;
        var target = null;
        try {
          target = document.querySelector(hash);
        } catch (e) {
          return;
        }
        if (!target) return;
        event.preventDefault();
        try {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          /* Move keyboard focus along so screen readers follow the jump. */
          if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
          }
          target.focus({ preventScroll: true });
        } catch (e) {
          target.scrollIntoView();
        }
        /* Keep the URL in sync without a hard jump. */
        if (history.replaceState) {
          try {
            history.replaceState(null, "", hash);
          } catch (e) {
            /* Fine to ignore on file:// or odd contexts. */
          }
        }
      });
    } catch (e) {
      /* Smooth scroll is enhancement only. */
    }
  }

  /* 4. Scroll + hero reveals: [data-hero] elements are above the fold by
     definition, so they get .in immediately during init and their CSS
     [data-hero="N"] stagger delays still animate them in beautifully.
     IntersectionObserver watches ONLY [data-reveal] below-fold elements.
     A 600ms safety net force-reveals everything as a backstop, so nothing
     can stay invisible even if the observer never fires. */
  function reveals() {
    /* Above-the-fold hero content: reveal instantly at init. Never blank. */
    var heroes = document.querySelectorAll("[data-hero]");
    for (var h = 0; h < heroes.length; h++) heroes[h].classList.add("in");
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("in");
      return;
    }
    /* Safety net FIRST: backstop after 600ms so content can never stay
       invisible, even if the observer setup below throws. The observer
       is the primary reveal path for below-fold content; this only fires
       if something went wrong. */
    setTimeout(function () {
      try {
        var all = document.querySelectorAll("[data-hero],[data-reveal]");
        for (var k = 0; k < all.length; k++) all[k].classList.add("in");
      } catch (e) {}
    }, 600);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (!el.hasAttribute("data-hero")) {
          el.style.transitionDelay = (Math.min(el.dataset.rdg || 0, 5) * 70) + "ms";
        }
        el.classList.add("in");
        io.unobserve(el);
        el.addEventListener("transitionend", function h() {
          el.style.willChange = "auto";
          el.removeEventListener("transitionend", h);
        });
      });
    }, { threshold: 0.12, rootMargin: "0 0 -8% 0" });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  }

  /* 5. Count-up stats */
  function countUps() {
    var els = document.querySelectorAll(".stat strong[data-count]");
    if (!els.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var target = +el.dataset.count;
        if (isNaN(target)) return;
        var dur = 1200, start = null;
        function frame(now) {
          start = start || now;
          var t = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(2, -10 * t)));
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.4 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  /* 6. Nav scrolled state */
  function navScroll() {
    var bar = document.querySelector(".topbar");
    if (!bar) return;
    var ticking = false;
    function update() {
      ticking = false;
      bar.classList.toggle("scrolled", window.scrollY > 8);
    }
    update();
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  /* 7. Card tilt: 3D lean on hover-capable pointers */
  function tilt() {
    if (reducedMotion) return;
    if (!window.matchMedia || !window.matchMedia("(hover: hover)").matches) return;
    function apply(card, ev) {
      var r = card.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      var rx = Math.max(-4, Math.min(4, y * -8));
      var ry = Math.max(-4, Math.min(4, x * 8));
      card.style.setProperty("--rx", rx + "deg");
      card.style.setProperty("--ry", ry + "deg");
      card.classList.add("tilt");
    }
    function clear(card) {
      card.classList.remove("tilt");
      card.style.removeProperty("--rx");
      card.style.removeProperty("--ry");
    }
    function attachGrid(grid) {
      var current = null, raf = null;
      grid.addEventListener("mousemove", function (ev) {
        var card = ev.target && ev.target.closest
          ? ev.target.closest(".clay-card") : null;
        if (card !== current) {
          if (current) clear(current);
          current = card;
        }
        if (!current) return;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          raf = null;
          apply(current, ev);
        });
      });
      grid.addEventListener("mouseleave", function () {
        if (current) clear(current);
        current = null;
        cancelAnimationFrame(raf);
        raf = null;
      });
    }
    var grids = document.querySelectorAll(".grid");
    var g;
    if (grids.length) {
      for (g = 0; g < grids.length; g++) attachGrid(grids[g]);
    } else {
      var cards = document.querySelectorAll(".clay-card");
      for (var i = 0; i < cards.length; i++) {
        (function (card) {
          var raf = null;
          card.addEventListener("mousemove", function (ev) {
            if (raf) return;
            raf = requestAnimationFrame(function () {
              raf = null;
              apply(card, ev);
            });
          });
          card.addEventListener("mouseleave", function () {
            cancelAnimationFrame(raf);
            raf = null;
            clear(card);
          });
        })(cards[i]);
      }
    }
  }


  /* 8. Footer "Last updated" line: rendered from document.lastModified,
     formatted en-GB ("20 Oct 2026"). JS injects it after the credit line,
     so without JS the line simply does not appear. No manual upkeep. */
  function lastUpdated() {
    try {
      var foot = document.querySelector("footer.foot");
      if (!foot) return;
      var credit = foot.querySelector(".credit");
      if (!credit) return;
      var d = new Date(document.lastModified);
      if (isNaN(d.getTime())) return;
      var text = d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      var p = document.createElement("p");
      p.className = "updated";
      p.textContent = "Last updated: " + text;
      credit.insertAdjacentElement("afterend", p);
    } catch (e) {}
  }

  /* 9. Mobile nav toggle (hamburger, <=720px) */
  function mobileNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("mainnav");
    if (!btn || !nav) return;
    var mq = window.matchMedia ? window.matchMedia("(max-width:720px)") : null;

    function close(returnFocus) {
      if (!nav.classList.contains("open")) return;
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Open menu");
      if (returnFocus) { try { btn.focus(); } catch (e) {} }
    }

    function open() {
      nav.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      var first = nav.querySelector("a");
      if (first) { try { first.focus(); } catch (e) {} }
    }

    btn.addEventListener("click", function () {
      if (nav.classList.contains("open")) { close(false); } else { open(); }
    });

    nav.addEventListener("click", function (ev) {
      if (ev.target.closest("a")) close(false);
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") close(true);
    });

    document.addEventListener("click", function (ev) {
      if (!nav.classList.contains("open")) return;
      if (ev.target.closest(".topbar")) return;
      close(false);
    });

    if (mq) {
      var onChange = function () { if (!mq.matches) close(false); };
      if (mq.addEventListener) { mq.addEventListener("change", onChange); }
      else if (mq.addListener) { mq.addListener(onChange); }
    }
  }

  /* 10. Mobile sticky CTA bar: show once, dismiss forever, slide away over the footer. */
  function mobileCta() {
    var STORAGE_KEY = "pentrix-mobile-cta-dismissed";
    var bar = document.getElementById("mobileCta");
    if (!bar) return;

    var path = "";
    try { path = window.location.pathname || ""; } catch (e) {}
    if (/(^|\/)install\.html$/.test(path)) return;

    var dismissed = false;
    try { dismissed = window.localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) {}
    if (dismissed) {
      bar.parentNode.removeChild(bar);
      return;
    }

    var dismissBtn = document.getElementById("mobileCtaDismiss");

    function dismiss(permanent) {
      bar.classList.add("is-dismissed");
      if (permanent) {
        try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
      }
      setTimeout(function () {
        if (bar.parentNode) bar.parentNode.removeChild(bar);
      }, 450);
    }

    if (dismissBtn) {
      dismissBtn.addEventListener("click", function () { dismiss(true); });
    }

    var foot = document.querySelector("footer.foot");
    if (!foot) return;

    function setOverFooter(isOver) {
      bar.classList.toggle("is-over-footer", isOver);
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          setOverFooter(entries[i].isIntersecting);
        }
      }, { threshold: 0.05 });
      io.observe(foot);
    } else {
      function onScroll() {
        var r;
        try { r = foot.getBoundingClientRect(); } catch (e) { return; }
        setOverFooter(r.top < window.innerHeight && r.bottom > 0);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }
  }

  /* 11. Floating UI: scroll progress bar + back-to-top button.
     One rAF-throttled scroll listener drives both. */
  function floatingUI() {
    var bar = document.getElementById("progressBar");
    var toTop = document.getElementById("toTop");
    var ticking = false;

    function docHeight() {
      try {
        return document.documentElement.scrollHeight - window.innerHeight;
      } catch (e) {
        return 0;
      }
    }

    function update() {
      ticking = false;
      var y = 0;
      try { y = window.scrollY || window.pageYOffset || 0; } catch (e) {}
      var max = docHeight();

      if (bar) {
        var p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
        try { bar.style.transform = "scaleX(" + p + ")"; } catch (e) {}
      }

      if (toTop) {
        var show = y > 600;
        if (show !== toTop.classList.contains("is-visible")) {
          toTop.classList.toggle("is-visible", show);
        }
      }
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(update);
      } else {
        setTimeout(update, 16);
      }
    }

    if (bar || toTop) {
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate);
      update();
    }

    if (toTop) {
      toTop.addEventListener("click", function (event) {
        event.preventDefault();
        try {
          window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
          });
        } catch (e) {
          try { window.scrollTo(0, 0); } catch (e2) {}
        }
      });
    }
  }

  /* 12. Soft shimmer placeholders for hero video and screenshots.
     Adds .loaded to each .skel wrapper once the asset is ready. */
  function mediaLoading() {
    var items;
    try {
      items = document.querySelectorAll(".skel");
    } catch (e) {
      return;
    }
    for (var i = 0; i < items.length; i++) {
      (function (box) {
        var media = box.querySelector("img, video");
        if (!media) return;
        function done() {
          box.classList.add("loaded");
        }
        if (media.tagName === "VIDEO") {
          if (media.readyState >= 2) { done(); return; }
          media.addEventListener("canplay", done, { once: true });
          media.addEventListener("error", done, { once: true });
        } else {
          if (media.complete && media.naturalWidth > 0) { done(); return; }
          media.addEventListener("load", done, { once: true });
          media.addEventListener("error", done, { once: true });
        }
      })(items[i]);
    }
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {}
})();
