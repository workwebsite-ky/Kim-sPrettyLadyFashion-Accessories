/* =====================================================================
   Kim's Pretty Lady Fashion — Interactions
   Loader · sticky nav · mobile menu · scroll reveal · counters ·
   FAQ accordion · back-to-top · contact form (mailto fallback)
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Page loader ---- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (loader) {
      setTimeout(function () { loader.classList.add("hidden"); }, 550);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {

    /* ---- Sticky nav shadow on scroll ---- */
    var nav = document.querySelector(".nav");
    var backTop = document.querySelector(".fab--top");

    function onScroll() {
      var y = window.scrollY;
      if (nav) nav.classList.toggle("scrolled", y > 40);
      if (backTop) backTop.classList.toggle("show", y > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- Mobile menu toggle ---- */
    var toggle = document.querySelector(".nav__toggle");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
        toggle.classList.toggle("open");
        var expanded = nav.classList.contains("open");
        toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
      // close menu when a link is tapped
      nav.querySelectorAll(".nav__links a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("open");
          toggle.classList.remove("open");
        });
      });
    }

    /* ---- Scroll reveal via IntersectionObserver ---- */
    var reveals = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(function (el) { io.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add("in"); });
    }

    /* ---- Animated counters ---- */
    var counters = document.querySelectorAll("[data-count]");
    function runCounter(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var decimals = (target % 1 !== 0) ? 1 : 0;
      var dur = 1600, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals) + suffix;
      }
      requestAnimationFrame(step);
    }
    if (counters.length && "IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCounter);
    }

    /* ---- FAQ accordion ---- */
    document.querySelectorAll(".faq__q").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.closest(".faq__item");
        var answer = item.querySelector(".faq__a");
        var isOpen = item.classList.contains("open");
        // close siblings
        var parent = item.parentElement;
        parent.querySelectorAll(".faq__item.open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("open");
            other.querySelector(".faq__a").style.maxHeight = null;
            other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
          }
        });
        if (isOpen) {
          item.classList.remove("open");
          answer.style.maxHeight = null;
          q.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
          q.setAttribute("aria-expanded", "true");
        }
      });
    });

    /* ---- Back to top ---- */
    if (backTop) {
      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---- Subtle parallax on elements with data-parallax ---- */
    var parallaxEls = document.querySelectorAll("[data-parallax]");
    if (parallaxEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.2;
          el.style.transform = "translateY(" + (y * speed) + "px)";
        });
      }, { passive: true });
    }

    /* ---- Contact form: builds a mailto link (no backend required) ---- */
    var form = document.getElementById("contactForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = (form.querySelector("#name") || {}).value || "";
        var email = (form.querySelector("#email") || {}).value || "";
        var phone = (form.querySelector("#phone") || {}).value || "";
        var subject = (form.querySelector("#subject") || {}).value || "Inquiry from website";
        var message = (form.querySelector("#message") || {}).value || "";
        var status = document.getElementById("formStatus");

        var body =
          "Name: " + name + "\n" +
          "Email: " + email + "\n" +
          "Phone: " + phone + "\n\n" +
          message;

        var mailto = "mailto:carterk343@gmail.com" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        window.location.href = mailto;
        if (status) {
          status.textContent = "Opening your email app… if nothing happens, email us directly at carterk343@gmail.com";
          status.classList.add("ok");
        }
      });
    }

    /* ---- Footer year ---- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();

/* ===== Lightbox (added in enhancement pass) =====
   Opens any gallery image (.card__media img) in an elegant overlay.
   Keyboard: Esc to close, ← / → to move between images on the page. */
(function () {
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.card__media img'));
  if (!imgs.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image viewer');
  box.innerHTML =
    '<button class="lightbox__close" aria-label="Close">&times;</button>' +
    '<button class="lightbox__btn lightbox__btn--prev" aria-label="Previous image">&#8249;</button>' +
    '<img class="lightbox__img" alt="" />' +
    '<button class="lightbox__btn lightbox__btn--next" aria-label="Next image">&#8250;</button>' +
    '<div class="lightbox__cap" aria-live="polite"></div>';
  document.body.appendChild(box);

  var bigImg = box.querySelector('.lightbox__img');
  var cap = box.querySelector('.lightbox__cap');
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + imgs.length) % imgs.length;
    var src = imgs[current];
    bigImg.src = src.getAttribute('src');
    bigImg.alt = src.getAttribute('alt') || '';
    cap.textContent = src.getAttribute('alt') || '';
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lightbox__close').focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  imgs.forEach(function (img, i) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(i); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__btn--prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lightbox__btn--next').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
})();
