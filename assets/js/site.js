/*
 * PenTrix website, small progressive enhancements.
 * Vanilla JS, no dependencies. Light only, no theme logic.
 */
(function () {
  "use strict";

  function init() {
    copyButtons();
    navHighlight();
    smoothScroll();
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
                btn.setAttribute("disabled", "disabled");
                setTimeout(function () {
                  btn.textContent = original;
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

  /* Boot once the DOM is ready. */
  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  } catch (e) {
    /* Nothing else to do. */
  }
})();
