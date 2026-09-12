/**
 * ENTYTEC VIDEO GAME STUDIO - MAIN JAVASCRIPT
 * Interactions, Hero Slider, Filtering, Modals, Forms & UX Polish
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initHeroCarousel();
  initPortfolioFilters();
  initScrollSpy();
  initKeyboardEvents();
});

/* ==========================================================================
   01. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const onScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ==========================================================================
   02. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!mobileToggle || !navMenu) return;

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle("open");
    mobileToggle.classList.toggle("is-active", isOpen);
    mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  mobileToggle.addEventListener("click", toggleMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      mobileToggle.classList.remove("is-active");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   03. HERO / INICIO (ROCKSTAR GAMES IMMERSIVE DRAGGABLE SLIDER)
   ========================================================================== */
let currentSlide = 0;
let carouselInterval = null;
let isPlaying = true;
const SLIDE_DURATION = 6000;

function initHeroCarousel() {
  const heroSection = document.getElementById("inicio");
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.getElementById("hero-prev");
  const nextBtn = document.getElementById("hero-next");
  const playPauseBtn = document.getElementById("hero-play-pause");

  if (!slides.length || !heroSection) return;

  // --- Auto-play control ---
  const startAutoPlay = () => {
    stopAutoPlay();
    if (!isPlaying) return;
    carouselInterval = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);
  };

  const stopAutoPlay = () => {
    if (carouselInterval) clearInterval(carouselInterval);
  };

  // --- Play/Pause Button ---
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isPlaying = !isPlaying;
      const pauseIcon = document.getElementById("pause-icon");
      const playIcon = document.getElementById("play-icon");

      if (isPlaying) {
        if (pauseIcon) pauseIcon.style.display = "block";
        if (playIcon) playIcon.style.display = "none";
        startAutoPlay();
      } else {
        if (pauseIcon) pauseIcon.style.display = "none";
        if (playIcon) playIcon.style.display = "block";
        stopAutoPlay();
      }
    });
  }

  // --- Prev / Next Buttons ---
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prevSlide();
      if (isPlaying) startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextSlide();
      if (isPlaying) startAutoPlay();
    });
  }

  // --- DRAG / SWIPE WITH CURSOR & TOUCH ---
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;

  const onDragStart = (e) => {
    // Avoid triggering when clicking buttons or links
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".hero-bottom-bar")) {
      return;
    }
    isDragging = true;
    startX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    heroSection.classList.add("is-dragging");
    stopAutoPlay();
  };

  const onDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    currentTranslateX = currentX - startX;
  };

  const onDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    heroSection.classList.remove("is-dragging");

    // Threshold of 45px to change slide
    if (currentTranslateX < -45) {
      nextSlide();
    } else if (currentTranslateX > 45) {
      prevSlide();
    }

    currentTranslateX = 0;
    if (isPlaying) startAutoPlay();
  };

  // Mouse drag listeners
  heroSection.addEventListener("mousedown", onDragStart);
  window.addEventListener("mousemove", onDragMove);
  window.addEventListener("mouseup", onDragEnd);

  // Touch swipe listeners
  heroSection.addEventListener("touchstart", onDragStart, { passive: true });
  window.addEventListener("touchmove", onDragMove, { passive: true });
  window.addEventListener("touchend", onDragEnd);

  // Keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      nextSlide();
      if (isPlaying) startAutoPlay();
    } else if (e.key === "ArrowLeft") {
      prevSlide();
      if (isPlaying) startAutoPlay();
    }
  });

  // Initialize first slide and start timer
  goToSlide(0);
  startAutoPlay();
}

function goToSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const pills = document.querySelectorAll("#hero-progress-dots .progress-pill");
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });

  pills.forEach((pill, i) => {
    pill.classList.toggle("active", i === currentSlide);
  });
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

/* ==========================================================================
   04. LATEST PROJECT MEDIA SWITCHER
   ========================================================================== */
function switchLatestImage(src, btnElement) {
  const mainImg = document.getElementById("latest-hero-view");
  const allThumbs = document.querySelectorAll(".latest-gallery-thumbs .thumb-btn");

  if (mainImg) {
    mainImg.style.opacity = "0.4";
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = "1";
    }, 150);
  }

  if (allThumbs && btnElement) {
    allThumbs.forEach((btn) => btn.classList.remove("active"));
    btnElement.classList.add("active");
  }
}

/* ==========================================================================
   05. PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll("#portfolio-filters .filter-btn");
  const cards = document.querySelectorAll("#portfolio-grid .portfolio-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.transition = "opacity 0.3s ease";
            card.style.opacity = "1";
          }, 20);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   06. MODALS SYSTEM (PROJECT DETAIL & PLAYTESTER)
   ========================================================================== */
function openProjectModal(projectId) {
  if (typeof ENT_PROJECTS === "undefined") return;

  const project = ENT_PROJECTS.find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("project-modal");
  const title = document.getElementById("modal-title");
  const tagline = document.getElementById("modal-tagline");
  const desc = document.getElementById("modal-desc");
  const platform = document.getElementById("modal-platform");
  const engine = document.getElementById("modal-engine");
  const year = document.getElementById("modal-year");
  const heroImg = document.getElementById("modal-project-img");
  const categoryBadge = document.getElementById("modal-category");
  const statusBadge = document.getElementById("modal-status");
  const galleryStrip = document.getElementById("modal-gallery-strip");
  const steamLink = document.getElementById("modal-steam-link");

  if (title) title.textContent = project.title;
  if (tagline) tagline.textContent = project.tagline;
  if (desc) desc.textContent = project.description;
  if (platform) platform.textContent = project.platform;
  if (engine) engine.textContent = project.engine;
  if (year) year.textContent = project.releaseYear;
  if (heroImg) heroImg.src = project.coverImage;
  if (categoryBadge) categoryBadge.textContent = project.category;
  if (statusBadge) statusBadge.textContent = project.status;
  if (steamLink) steamLink.href = project.steamUrl || "https://store.steampowered.com";

  // Build Gallery Thumbnails
  if (galleryStrip && project.gallery) {
    galleryStrip.innerHTML = "";
    project.gallery.forEach((imgPath, idx) => {
      const thumb = document.createElement("div");
      thumb.className = `modal-thumb ${idx === 0 ? "active" : ""}`;
      thumb.innerHTML = `<img src="${imgPath}" alt="${project.title} Screenshot ${idx + 1}">`;
      thumb.addEventListener("click", () => {
        heroImg.src = imgPath;
        document.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
      galleryStrip.appendChild(thumb);
    });
  }

  openModal("project-modal");
}

function openPlaytesterModal() {
  openModal("playtester-modal");
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function handleBackdropClick(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}

function initKeyboardEvents() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal("project-modal");
      closeModal("playtester-modal");
    }
  });
}

/* ==========================================================================
   07. CONTACT FORM & INTENT HANDLING
   ========================================================================== */
function selectIntent(button, intentText) {
  const chips = document.querySelectorAll(".intent-chip");
  chips.forEach((c) => c.classList.remove("active"));
  button.classList.add("active");

  const hiddenInput = document.getElementById("selected-intent");
  if (hiddenInput) hiddenInput.value = intentText;
}

function preselectIntent(intentKey) {
  const select = document.getElementById("contact-project-type");
  const chips = document.querySelectorAll(".intent-chip");

  if (intentKey === "publisher") {
    if (select) select.value = "Publicación / Publishing";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "publisher");
    });
  } else if (intentKey === "outsourcing") {
    if (select) select.value = "Outsourcing de Programación o Arte";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "outsourcing");
    });
  } else if (intentKey === "game-dev") {
    if (select) select.value = "Desarrollo de Videojuego Completo";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "game-dev");
    });
  } else if (intentKey === "consulting") {
    if (select) select.value = "Consultoría y Auditoría Técnica";
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = document.getElementById("contact-name").value;

  showToast(`¡Gracias ${name}! Hemos recibido tu propuesta. Te responderemos pronto.`);
  form.reset();
}

function handlePlaytesterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("pt-name").value;
  closeModal("playtester-modal");
  showToast(`¡Bienvenido al equipo de Playtesters, ${name}! Te hemos enviado un email.`);
  event.target.reset();
}

function handleNewsletterSubmit(event, form) {
  event.preventDefault();
  const input = form.querySelector("input[type='email']");
  if (input && input.value) {
    showToast("¡Te has suscrito correctamente al boletín de Entytec!");
    input.value = "";
  }
}

/* ==========================================================================
   08. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message, duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, duration);
}
