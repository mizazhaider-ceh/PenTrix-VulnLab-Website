/* PenTrix website: progressive enhancements. Vanilla JS, no dependencies. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    document.documentElement.classList.add("js");
    copyButtons();
    navHighlight();
    smoothScroll();
    try { reveals(); } catch (e) {}
    try { countUps(); } catch (e) {}
    try { navScroll(); } catch (e) {}
    try { tilt(); } catch (e) {}
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

  /* 4. Scroll reveals: [data-reveal] enters view with stagger via data-rdg */
  function reveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("in");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.style.transitionDelay = (Math.min(el.dataset.rdg || 0, 5) * 70) + "ms";
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

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {}
})();
