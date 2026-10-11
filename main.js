/* Mobile navigation toggle */
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  var DESKTOP = 720;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function isOpen() {
    return nav.classList.contains("is-open");
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  // Close after choosing a link
  nav.addEventListener("click", function (event) {
    if (event.target.closest(".nav__link")) setOpen(false);
  });

  // Close on outside click
  document.addEventListener("click", function (event) {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  // Close on Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });

  // Reset if the viewport grows back to desktop
  window.addEventListener("resize", function () {
    if (window.innerWidth > DESKTOP) setOpen(false);
  });
})();
