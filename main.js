/* Put Tools In Schools — site behaviour
   Progressive enhancement: every page works without this script. */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ---------- Hero entrance ---------- */
  function ready() { root.classList.add("is-ready"); }
  if (doc.readyState === "complete" || doc.readyState === "interactive") { requestAnimationFrame(ready); }
  else { doc.addEventListener("DOMContentLoaded", ready); }

  /* ---------- Footer year ---------- */
  var year = doc.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Preselect contact topic from ?topic= ---------- */
  var topicSelect = doc.getElementById("topic");
  if (topicSelect && window.URLSearchParams) {
    var wanted = new URLSearchParams(window.location.search).get("topic");
    if (wanted) {
      var match = Array.prototype.find.call(topicSelect.options, function (o) { return o.value === wanted; });
      if (match) topicSelect.value = wanted;
    }
  }

  /* ---------- Nav: solid background after scroll ---------- */
  var nav = doc.querySelector(".nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = doc.querySelector(".menu-toggle");
  var links = doc.getElementById("primary-nav");
  function setMenu(open) {
    if (!toggle || !links) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    links.classList.toggle("open", open);
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = doc.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = doc.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffixEl = el.querySelector("sup");
    var decimals = (el.getAttribute("data-decimals") || "0") | 0;
    if (reduceMotion) {
      el.firstChild.nodeValue = target.toFixed(decimals);
      return;
    }
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.firstChild.nodeValue = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else if (suffixEl) el.firstChild.nodeValue = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------- Card spotlight + tilt (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    doc.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        var rx = ((y / r.height) - 0.5) * -5;
        var ry = ((x / r.width) - 0.5) * 5;
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Cursor glow (fine pointers only) ---------- */
  if (finePointer && !reduceMotion) {
    var glow = doc.createElement("div");
    glow.className = "glow";
    glow.setAttribute("aria-hidden", "true");
    doc.body.appendChild(glow);
    var gx = 0, gy = 0, tx = 0, ty = 0, raf = null;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("on");
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });
    window.addEventListener("pointerleave", function () { glow.classList.remove("on"); });
    function follow() {
      gx += (tx - gx) * 0.14;
      gy += (ty - gy) * 0.14;
      glow.style.transform = "translate(" + (gx - 210) + "px," + (gy - 210) + "px)";
      raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(follow) : null;
    }
  }

  /* ---------- Forms ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    var wrap = field.closest(".field, .check");
    var value = (field.value || "").trim();
    var ok = true;
    if (field.hasAttribute("required") && (field.type === "checkbox" ? !field.checked : !value)) ok = false;
    if (ok && field.type === "email" && value && !EMAIL.test(value)) ok = false;
    if (wrap) wrap.classList.toggle("invalid", !ok);
    return ok;
  }

  doc.querySelectorAll("form[data-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");

    form.addEventListener("input", function (e) {
      if (e.target.matches("input, select, textarea")) validateField(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Honeypot: real people leave this empty. Bots fill it, so pretend success and send nothing.
      var trap = form.querySelector("input[name=website]");
      if (trap && trap.value) {
        if (status) { status.className = "form-status show ok"; status.textContent = "Thanks! We got it and will be in touch soon."; }
        form.reset();
        return;
      }
      var fields = form.querySelectorAll("input, select, textarea");
      var allOk = true;
      var firstBad = null;
      fields.forEach(function (f) {
        if (f.disabled || f.type === "hidden") return;
        if (!validateField(f)) { allOk = false; if (!firstBad) firstBad = f; }
      });
      if (!allOk) {
        if (status) { status.className = "form-status show warn"; status.textContent = "Please fix the highlighted fields."; }
        if (firstBad) firstBad.focus();
        return;
      }

      var endpoint = form.getAttribute("data-endpoint") || "";
      if (!endpoint) {
        // No backend connected yet: say so honestly instead of pretending it sent.
        if (status) {
          status.className = "form-status show warn";
          status.innerHTML = "This form isn't connected to an inbox yet. Email <a href=\"mailto:hello@puttoolsinschools.org\">hello@puttoolsinschools.org</a> in the meantime.";
        }
        return;
      }

      var submit = form.querySelector("button[type=submit]");
      if (submit) { submit.disabled = true; submit.dataset.label = submit.textContent; submit.textContent = "Sending..."; }
      var body = new FormData(form);
      fetch(endpoint, { method: "POST", body: body, headers: { Accept: "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          if (status) { status.className = "form-status show ok"; status.textContent = "Thanks! We got it and will be in touch soon."; }
        })
        .catch(function () {
          if (status) { status.className = "form-status show warn"; status.textContent = "Something went wrong. Please try again or email us directly."; }
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = submit.dataset.label || "Send"; }
        });
    });
  });

  /* ---------- Donate amount chips ---------- */
  doc.querySelectorAll("[data-amount-group]").forEach(function (group) {
    var input = doc.getElementById(group.getAttribute("data-amount-group"));
    group.querySelectorAll("button[data-amount]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        if (input) input.value = btn.getAttribute("data-amount");
      });
    });
  });
})();
