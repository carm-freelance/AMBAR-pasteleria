(function () {
  "use strict";

  /* Header elevation on scroll */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile navigation */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    var closeNav = function () {
      navToggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content permanently invisible.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }, 4000);
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* La Carta — tasting notes toggles */
  document.querySelectorAll(".notes-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = document.getElementById(btn.getAttribute("aria-controls"));
      if (!row) return;
      var willOpen = row.hasAttribute("hidden");
      if (willOpen) row.removeAttribute("hidden");
      requestAnimationFrame(function () {
        row.classList.toggle("is-open", willOpen);
      });
      btn.setAttribute("aria-expanded", String(willOpen));
      if (!willOpen) {
        row.addEventListener("transitionend", function hide() {
          row.setAttribute("hidden", "");
          row.removeEventListener("transitionend", hide);
        });
      }
    });
  });

  /* Order form -> mailto */
  var orderForm = document.getElementById("orderForm");
  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }
      var data = new FormData(orderForm);
      var nombre = data.get("nombre");
      var contacto = data.get("contacto");
      var pieza = data.get("pieza");
      var fecha = data.get("fecha");
      var mensaje = data.get("mensaje") || "Sin comentarios adicionales.";

      var subject = "Solicitud de encargo — " + pieza;
      var body =
        "Nombre: " + nombre + "\n" +
        "Contacto: " + contacto + "\n" +
        "Pieza deseada: " + pieza + "\n" +
        "Fecha de recogida deseada: " + fecha + "\n" +
        "Mensaje: " + mensaje;

      var mailto =
        "mailto:pedidos@ambar.example" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
  }

  /* Batch card — today's date could be shown near the label if needed */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
