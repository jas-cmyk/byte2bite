/* Navigation toggle.
   Desktop: the sidebar is always visible (CSS handles that).
   Mobile: the hamburger opens the sidebar as an off-canvas dropdown. */
(function () {
  var toggle = document.querySelector(".menu-toggle");
  var sidebar = document.querySelector(".sidebar");
  if (!toggle || !sidebar) return;

  var DESKTOP = 720;

  function setOpen(open) {
    sidebar.classList.toggle("is-open", open);
    toggle.classList.toggle("is-active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function isOpen() {
    return sidebar.classList.contains("is-open");
  }

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    setOpen(!isOpen());
  });

  // Close after choosing a link
  sidebar.addEventListener("click", function (event) {
    if (event.target.closest(".nav__link")) setOpen(false);
  });

  // Close on outside click
  document.addEventListener("click", function (event) {
    if (isOpen() && !sidebar.contains(event.target) && !toggle.contains(event.target)) {
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

/* Hero carousel.
   Auto-advances, pauses on hover/focus/tab-hidden, and supports
   buttons, dots, arrow keys, touch swipes and reduced-motion. */
(function () {
  var root = document.querySelector("[data-carousel]");
  if (!root) return;

  var track = root.querySelector(".hero__track");
  if (!track) return;

  var AUTOPLAY_MS = 6000;

  /* Build the slides from the shared seed data (lib/seed.js). */
  function renderSlides(items) {
    items.forEach(function (item, i) {
      var slide = document.createElement("li");
      slide.className = "hero__slide";

      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt || "";
      if (i > 0) img.loading = "lazy";
      slide.appendChild(img);

      var caption = document.createElement("div");
      caption.className = "hero__caption";

      if (item.eyebrow) {
        var eyebrow = document.createElement("p");
        eyebrow.className = "hero__eyebrow";
        eyebrow.textContent = item.eyebrow;
        caption.appendChild(eyebrow);
      }

      var title = document.createElement("h2");
      title.className = "hero__title";
      title.textContent = item.title || "";
      caption.appendChild(title);

      if (item.text) {
        var text = document.createElement("p");
        text.className = "hero__text";
        text.textContent = item.text;
        caption.appendChild(text);
      }

      if (item.cta && item.cta.label) {
        var link = document.createElement("a");
        link.className = "btn btn--primary";
        link.href = item.cta.href || "#";
        link.textContent = item.cta.label;
        caption.appendChild(link);
      }

      slide.appendChild(caption);
      track.appendChild(slide);
    });
  }

  var seed = window.BYTE2BITE_SEED;
  if (seed && seed.carousel && seed.carousel.length) {
    renderSlides(seed.carousel);
  }

  var slides = Array.prototype.slice.call(track.querySelectorAll(".hero__slide"));
  var prevBtn = root.querySelector(".hero__nav--prev");
  var nextBtn = root.querySelector(".hero__nav--next");
  var dotsWrap = root.querySelector(".hero__dots");

  if (slides.length < 2) return;

  var index = 0;
  var timer = null;
  var paused = false;
  var reduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  function forEach(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }

  // Label each slide for assistive technology.
  forEach(slides, function (slide, i) {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", i + 1 + " of " + slides.length);
  });

  // Build the dot indicators.
  var dots = slides.map(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero__dot";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () {
      goTo(i);
      restart();
    });
    if (dotsWrap) dotsWrap.appendChild(dot);
    return dot;
  });

  function goTo(next) {
    index = (next + slides.length) % slides.length;
    track.style.transform = "translateX(" + -index * 100 + "%)";

    forEach(slides, function (slide, i) {
      var active = i === index;
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      // Keep off-screen slides out of the tab order.
      forEach(slide.querySelectorAll("a, button"), function (el) {
        if (active) el.removeAttribute("tabindex");
        else el.setAttribute("tabindex", "-1");
      });
    });

    forEach(dots, function (dot, i) {
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
      dot.tabIndex = i === index ? 0 : -1;
    });
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (paused || reduced.matches || document.hidden) return;
    timer = setInterval(function () {
      goTo(index + 1);
    }, AUTOPLAY_MS);
  }

  function restart() {
    start();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goTo(index - 1);
      restart();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goTo(index + 1);
      restart();
    });
  }

  // Pause while the pointer or keyboard focus is inside the carousel.
  root.addEventListener("mouseenter", function () {
    paused = true;
    stop();
  });
  root.addEventListener("mouseleave", function () {
    paused = false;
    start();
  });
  root.addEventListener("focusin", function () {
    paused = true;
    stop();
  });
  root.addEventListener("focusout", function () {
    paused = false;
    start();
  });

  // Arrow keys when the carousel has focus.
  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      goTo(index - 1);
      restart();
    } else if (event.key === "ArrowRight") {
      goTo(index + 1);
      restart();
    }
  });

  // Touch swipe.
  var startX = null;
  root.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse") return;
    startX = event.clientX;
  });
  root.addEventListener("pointerup", function (event) {
    if (startX === null) return;
    var dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? index + 1 : index - 1);
      restart();
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  if (reduced.addEventListener) {
    reduced.addEventListener("change", function () {
      if (reduced.matches) stop();
      else start();
    });
  }

  goTo(0);
  start();
})();

/* Drinks grid, rendered from the shared seed data (lib/seed.js). */
(function () {
  var grid = document.querySelector("[data-drinks]");
  if (!grid) return;

  var seed = window.BYTE2BITE_SEED;
  var drinks = seed && seed.drinks_seed;
  if (!drinks || !drinks.length) return;

  var currency = seed.currency || "";

  drinks.forEach(function (drink) {
    var card = document.createElement("article");
    card.className = "drink-card";

    var media = document.createElement("div");
    media.className = "drink-card__media";
    var img = document.createElement("img");
    img.src = drink.img;
    img.alt = drink.name || "";
    img.loading = "lazy";
    media.appendChild(img);
    card.appendChild(media);

    var body = document.createElement("div");
    body.className = "drink-card__body";

    var name = document.createElement("h3");
    name.className = "drink-card__name";
    name.textContent = drink.name || "";
    body.appendChild(name);

    if (drink.description) {
      var desc = document.createElement("p");
      desc.className = "drink-card__desc";
      desc.textContent = drink.description;
      body.appendChild(desc);
    }

    if (typeof drink.price === "number") {
      var price = document.createElement("p");
      price.className = "drink-card__price";
      price.textContent = currency + drink.price.toFixed(2);
      body.appendChild(price);
    }

    card.appendChild(body);
    grid.appendChild(card);
  });
})();

/* Offers grid, rendered from the shared seed data (lib/seed.js).
   Images are shown at their original aspect ratio (no cropping).
   data-base on the container resolves root-relative seed paths. */
(function () {
  var grid = document.querySelector("[data-offers]");
  if (!grid) return;

  var seed = window.BYTE2BITE_SEED;
  var offers = seed && seed.offers_seed;
  if (!offers || !offers.length) return;

  var currency = seed.currency || "";
  var base = grid.getAttribute("data-base") || "";

  offers.forEach(function (offer) {
    var card = document.createElement("article");
    card.className = "offer-card";

    var media = document.createElement("div");
    media.className = "offer-card__media";
    var img = document.createElement("img");
    img.src = base + offer.img;
    img.alt = offer.name || "";
    img.loading = "lazy";
    media.appendChild(img);
    card.appendChild(media);

    var body = document.createElement("div");
    body.className = "offer-card__body";

    var name = document.createElement("h3");
    name.className = "offer-card__name";
    name.textContent = offer.name || "";
    body.appendChild(name);

    if (typeof offer.price === "number") {
      var price = document.createElement("p");
      price.className = "offer-card__price";
      price.textContent = currency + offer.price.toFixed(2);
      body.appendChild(price);
    }

    card.appendChild(body);
    grid.appendChild(card);
  });
})();
