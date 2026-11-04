/* Put Tools In Schools: decorative effects.
   Sparks, cursor ring, magnetic buttons, letter reveals, and the trade switcher.
   Everything here is optional. It is skipped entirely when reduced motion is requested. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---------- Letter-by-letter reveals ---------- */
  function splitLetters(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          // Keep each word together so lines still wrap at word boundaries.
          var word = document.createElement("span");
          word.style.display = "inline-block";
          word.style.whiteSpace = "nowrap";
          chunk.split("").forEach(function (ch) {
            var s = document.createElement("span");
            s.className = "ltr";
            s.setAttribute("aria-hidden", "true");
            s.style.setProperty("--i", counter.n++);
            s.textContent = ch;
            word.appendChild(s);
          });
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        splitLetters(child, counter);
      }
    });
  }

  var letterEls = document.querySelectorAll("[data-letters]");
  letterEls.forEach(function (el) {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    splitLetters(el, { n: 0 });
    el.classList.add("letters");
  });
  if (letterEls.length) {
    if ("IntersectionObserver" in window) {
      var lio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            lio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      letterEls.forEach(function (el) { lio.observe(el); });
    } else {
      letterEls.forEach(function (el) { el.classList.add("in"); });
    }
  }

  /* ---------- Spark field (hero canvas) ---------- */
  var canvas = document.querySelector("canvas.sparks");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var host = canvas.parentElement;
    var parts = [];
    var W = 0, H = 0;
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      var r = host.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * DPR);
      canvas.height = Math.round(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawn(x, y, power) {
      var a = Math.random() * Math.PI * 2;
      var s = (Math.random() * 1.6 + 0.4) * power;
      parts.push({
        x: x, y: y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 0.3,
        life: 1,
        size: Math.random() * 2.2 + 0.6,
        hue: Math.random() < 0.6 ? 356 : 40
      });
      if (parts.length > 260) parts.splice(0, parts.length - 260);
    }

    function localPos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    host.addEventListener("pointermove", function (e) {
      var p = localPos(e);
      spawn(p.x, p.y, 0.5);
    }, { passive: true });

    host.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a, button")) return;
      var p = localPos(e);
      for (var i = 0; i < 60; i++) spawn(p.x, p.y, 3);
    });

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vx *= 0.985;
        p.life -= 0.018;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "hsl(" + p.hue + ", 100%, 60%)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- Cursor ring and magnetic buttons (fine pointers only) ---------- */
  if (finePointer) {
    var ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);

    var rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      ring.style.opacity = "1";
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      var hot = !!(e.target.closest && e.target.closest("a, button, .card, .chip, .res, .tier, .trade-tab"));
      ring.classList.toggle("hover", hot);
    });
    (function follow() {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      requestAnimationFrame(follow);
    })();

    document.querySelectorAll(".btn-primary, .btn-ghost, .chip").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.25;
        var y = (e.clientY - (r.top + r.height / 2)) * 0.35;
        el.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Timeline progress line ---------- */
  var timelines = document.querySelectorAll(".timeline");
  if (timelines.length) {
    var tickTimeline = function () {
      timelines.forEach(function (t) {
        var r = t.getBoundingClientRect();
        var p = (window.innerHeight * 0.6 - r.top) / r.height;
        t.style.setProperty("--p", Math.max(0, Math.min(1, p)).toFixed(3));
      });
    };
    window.addEventListener("scroll", tickTimeline, { passive: true });
    window.addEventListener("resize", tickTimeline);
    tickTimeline();
  }

  /* ---------- Trade switcher ---------- */
  document.querySelectorAll("[data-trades]").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-trade-tab]"));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-trade-panel]"));
    var index = 0;
    var timer = null;

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    function show(i) {
      index = (i + tabs.length) % tabs.length;
      var name = tabs[index].getAttribute("data-trade-tab");
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", String(j === index));
        t.tabIndex = j === index ? 0 : -1;
      });
      panels.forEach(function (p) {
        var on = p.getAttribute("data-trade-panel") === name;
        p.hidden = !on;
        if (on) {
          p.classList.remove("swap");
          void p.offsetWidth;
          p.classList.add("swap");
        }
      });
    }

    tabs.forEach(function (t, j) {
      t.addEventListener("click", function () { stop(); show(j); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") { stop(); show(j + 1); tabs[index].focus(); }
        if (e.key === "ArrowLeft") { stop(); show(j - 1); tabs[index].focus(); }
      });
    });

    show(0);
    timer = setInterval(function () { show(index + 1); }, 5000);
  });
})();
