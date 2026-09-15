/**
 * ENTYTEC VIDEO GAME STUDIO - MAIN JAVASCRIPT
 * Interactions, Hero Slider, Filtering, Modals, Forms & UX Polish
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initHeroCarousel();
  renderPortfolio();
  initPortfolioPage();
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
   05. PORTFOLIO DYNAMIC RENDERING & FILTERING (Visual Hover Cards)
   ========================================================================== */
function renderPortfolio() {
  const grid = document.getElementById("portfolio-grid");
  const filtersContainer = document.getElementById("portfolio-filters");

  if (!grid || typeof ENT_PROJECTS === "undefined" || !ENT_PROJECTS.length) {
    return;
  }

  // Home page presentation: exactly 5 games
  const homeProjects = ENT_PROJECTS.slice(0, 5);

  if (filtersContainer) {
    filtersContainer.style.display = "none";
  }

  // Render Visual Project Cards (pure image in default state + rich hover info)
  grid.innerHTML = homeProjects.map((project) => {
    const badgeBg = project.badgeColor ? `badge-${project.badgeColor}` : "badge-orange";
    return `
      <div class="portfolio-card-visual" data-category="${project.category}" onclick="openProjectModal('${project.id}')">
        <img src="${project.thumbnail}" alt="${project.title}" class="pv-img" loading="lazy" onerror="this.onerror=null;this.src='Antrio/1.jpg';">
        
        <div class="pv-overlay">
          <div class="pv-tags">
            <span class="badge ${badgeBg}">${project.category}</span>
            <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff;">${project.platform}</span>
            ${project.itchUrl ? `<span class="badge badge-itch">itch.io</span>` : ""}
            ${project.steamUrl && project.id === "antrio" ? `<span class="badge badge-steam">Steam</span>` : ""}
          </div>
          <h3 class="pv-title">${project.title}</h3>
          <p class="pv-tagline">${project.tagline}</p>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: auto;">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openProjectModal('${project.id}')">
              <span>View Details / Play</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            ${project.itchUrl ? `
            <a href="${project.itchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-itch btn-sm" onclick="event.stopPropagation()">
              <span>itch.io</span>
            </a>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   05B. SCHELL GAMES-STYLE PORTFOLIO PAGE LOGIC (portfolio.html)
   ========================================================================== */
let portfolioFilterCategory = "all";
let portfolioFilterPlatform = "all";
let portfolioSearchQuery = "";

function initPortfolioPage() {
  const pageGrid = document.getElementById("portfolio-page-grid");
  if (!pageGrid || typeof ENT_PROJECTS === "undefined") return;

  const searchInput = document.getElementById("portfolio-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  const categoryPills = document.querySelectorAll("#category-filter-pills .filter-pill");
  const platformPills = document.querySelectorAll("#platform-filter-pills .filter-pill");
  const resetBtn = document.getElementById("btn-reset-filters");

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      portfolioSearchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = portfolioSearchQuery ? "flex" : "none";
      }
      applyPortfolioFilters();
    });
  }

  // Clear search button
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      portfolioSearchQuery = "";
      clearBtn.style.display = "none";
      applyPortfolioFilters();
      searchInput.focus();
    });
  }

  // Category pills
  categoryPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      categoryPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      portfolioFilterCategory = pill.getAttribute("data-category");
      applyPortfolioFilters();
    });
  });

  // Platform pills
  platformPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      platformPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      portfolioFilterPlatform = pill.getAttribute("data-platform");
      applyPortfolioFilters();
    });
  });

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", resetPortfolioFilters);
  }

  // Initial render
  applyPortfolioFilters();
}

function resetPortfolioFilters() {
  portfolioFilterCategory = "all";
  portfolioFilterPlatform = "all";
  portfolioSearchQuery = "";

  const searchInput = document.getElementById("portfolio-search-input");
  const clearBtn = document.getElementById("search-clear-btn");
  if (searchInput) searchInput.value = "";
  if (clearBtn) clearBtn.style.display = "none";

  document.querySelectorAll("#category-filter-pills .filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.getAttribute("data-category") === "all");
  });

  document.querySelectorAll("#platform-filter-pills .filter-pill").forEach((pill) => {
    pill.classList.toggle("active", pill.getAttribute("data-platform") === "all");
  });

  applyPortfolioFilters();
}

function applyPortfolioFilters() {
  const pageGrid = document.getElementById("portfolio-page-grid");
  const noResults = document.getElementById("portfolio-no-results");
  const visibleCountEl = document.getElementById("visible-count");
  const totalCountEl = document.getElementById("total-count");
  const resetBtn = document.getElementById("btn-reset-filters");

  if (!pageGrid || typeof ENT_PROJECTS === "undefined") return;

  const filtered = ENT_PROJECTS.filter((project) => {
    // Category match
    const matchesCategory =
      portfolioFilterCategory === "all" ||
      project.category.toLowerCase().includes(portfolioFilterCategory.toLowerCase());

    // Platform match
    let matchesPlatform = true;
    if (portfolioFilterPlatform !== "all") {
      const platformLower = project.platform.toLowerCase();
      const targetPlatform = portfolioFilterPlatform.toLowerCase();
      if (targetPlatform === "steam") {
        matchesPlatform = platformLower.includes("steam") || !!project.steamUrl;
      } else if (targetPlatform === "itch.io") {
        matchesPlatform = platformLower.includes("itch") || platformLower.includes("web") || !!project.itchUrl;
      } else if (targetPlatform === "mobile") {
        matchesPlatform = platformLower.includes("mobile") || platformLower.includes("android") || platformLower.includes("ios");
      } else if (targetPlatform === "consolas") {
        matchesPlatform = platformLower.includes("consolas") || platformLower.includes("console");
      } else {
        matchesPlatform = platformLower.includes(targetPlatform);
      }
    }

    // Search query match
    let matchesSearch = true;
    if (portfolioSearchQuery) {
      const searchSource = `${project.title} ${project.tagline} ${project.category} ${project.platform} ${project.engine} ${project.description || ""}`.toLowerCase();
      matchesSearch = searchSource.includes(portfolioSearchQuery);
    }

    return matchesCategory && matchesPlatform && matchesSearch;
  });

  // Update counts
  if (visibleCountEl) visibleCountEl.textContent = filtered.length;
  if (totalCountEl) totalCountEl.textContent = ENT_PROJECTS.length;

  // Toggle reset button
  const hasActiveFilters =
    portfolioFilterCategory !== "all" ||
    portfolioFilterPlatform !== "all" ||
    portfolioSearchQuery !== "";

  if (resetBtn) {
    resetBtn.style.display = hasActiveFilters ? "inline-flex" : "none";
  }

  // Handle empty state
  if (filtered.length === 0) {
    pageGrid.style.display = "none";
    if (noResults) noResults.style.display = "block";
    return;
  }

  pageGrid.style.display = "grid";
  if (noResults) noResults.style.display = "none";

  // Render cards (pure clean image resting state + rich hover overlay)
  pageGrid.innerHTML = filtered.map((project) => {
    const badgeBg = project.badgeColor ? `badge-${project.badgeColor}` : "badge-orange";
    return `
      <div class="portfolio-card-visual" data-category="${project.category}" onclick="openProjectModal('${project.id}')">
        <img src="${project.thumbnail}" alt="${project.title}" class="pv-img" loading="lazy" onerror="this.onerror=null;this.src='Antrio/1.jpg';">
        
        <div class="pv-overlay">
          <div class="pv-tags">
            <span class="badge ${badgeBg}">${project.category}</span>
            <span class="badge" style="background: rgba(255,255,255,0.15); color: #fff;">${project.platform}</span>
            ${project.itchUrl ? `<span class="badge badge-itch">itch.io</span>` : ""}
            ${project.steamUrl && project.id === "antrio" ? `<span class="badge badge-steam">Steam</span>` : ""}
          </div>
          <h3 class="pv-title">${project.title}</h3>
          <p class="pv-tagline">${project.tagline}</p>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: auto;">
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); openProjectModal('${project.id}')">
              <span>View Details / Play</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            ${project.itchUrl ? `
            <a href="${project.itchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-itch btn-sm" onclick="event.stopPropagation()">
              <span>itch.io</span>
            </a>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll("#portfolio-filters .filter-btn");
  const cards = document.querySelectorAll("#portfolio-grid .portfolio-card-visual");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "block";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.transition = "opacity 0.3s ease, transform var(--transition-normal)";
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
  const featuresList = document.getElementById("modal-features-list");
  const actionsContainer = document.getElementById("modal-actions-container");

  if (title) title.textContent = project.title;
  if (tagline) tagline.textContent = project.tagline;
  if (desc) desc.textContent = project.description;
  if (platform) platform.textContent = project.platform;
  if (engine) engine.textContent = project.engine;
  if (year) year.textContent = project.releaseYear;
  if (heroImg) heroImg.src = project.coverImage || project.thumbnail;

  if (categoryBadge) {
    categoryBadge.textContent = project.category;
    categoryBadge.className = `badge badge-${project.badgeColor || "orange"}`;
  }
  if (statusBadge) {
    statusBadge.textContent = project.status;
    statusBadge.className = project.status.toLowerCase().includes("steam")
      ? "badge badge-steam"
      : "badge badge-orange";
  }

  // Build Features List
  if (featuresList) {
    featuresList.innerHTML = "";
    if (project.features && project.features.length) {
      project.features.forEach((feat) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.gap = "8px";
        li.style.fontSize = "0.92rem";
        li.style.color = "var(--color-text-main)";
        li.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2.5" style="flex-shrink:0;">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>${feat}</span>
        `;
        featuresList.appendChild(li);
      });
    }
  }

  // Build Gallery Thumbnails
  if (galleryStrip) {
    galleryStrip.innerHTML = "";
    const galleryItems = project.gallery && project.gallery.length ? project.gallery : [project.thumbnail];
    if (galleryItems.length > 1) {
      galleryItems.forEach((imgPath, idx) => {
        const thumb = document.createElement("div");
        thumb.className = `modal-thumb ${idx === 0 ? "active" : ""}`;
        thumb.innerHTML = `<img src="${imgPath}" alt="${project.title} Screenshot ${idx + 1}" onerror="this.onerror=null;this.src='Antrio/1.jpg';">`;
        thumb.addEventListener("click", () => {
          heroImg.src = imgPath;
          document.querySelectorAll(".modal-thumb").forEach((t) => t.classList.remove("active"));
          thumb.classList.add("active");
        });
        galleryStrip.appendChild(thumb);
      });
    }
  }

  // Build Dynamic Action Buttons
  if (actionsContainer) {
    actionsContainer.innerHTML = "";

    if (project.demoUrl) {
      const demoBtn = document.createElement("a");
      demoBtn.href = project.demoUrl;
      demoBtn.target = "_blank";
      demoBtn.rel = "noopener noreferrer";
      demoBtn.className = "btn btn-primary";
      demoBtn.innerHTML = `
        <span>Play Demo</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      `;
      actionsContainer.appendChild(demoBtn);
    }

    if (project.itchUrl) {
      const itchBtn = document.createElement("a");
      itchBtn.href = project.itchUrl;
      itchBtn.target = "_blank";
      itchBtn.rel = "noopener noreferrer";
      itchBtn.className = "btn btn-itch";
      itchBtn.innerHTML = `
        <span>View on itch.io</span>
      `;
      actionsContainer.appendChild(itchBtn);
    }

    if (project.steamUrl && project.id === "antrio") {
      const steamBtn = document.createElement("a");
      steamBtn.href = project.steamUrl;
      steamBtn.target = "_blank";
      steamBtn.rel = "noopener noreferrer";
      steamBtn.className = "btn btn-steam";
      steamBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0a12 12 0 0 0-12 12c0 5.4 3.5 10 8.4 11.5l1.6-4.8c-.2-.1-.4-.2-.6-.3a2.9 2.9 0 0 1-1.7-2.6 3 3 0 0 1 3-3c.4 0 .8.1 1.2.3l4.3-3.1C16.1 10 16 9.5 16 9a5 5 0 1 1 5 5c-.7 0-1.4-.2-2-.5l-3.3 4.6c.1.4.1.8.1 1.2a3.7 3.7 0 0 1-3.7 3.7c-1.3 0-2.5-.7-3.1-1.8L3.6 23.3A12 12 0 0 0 12 24a12 12 0 0 0 12-12A12 12 0 0 0 12 0z" />
        </svg>
        <span>View on Steam</span>
      `;
      actionsContainer.appendChild(steamBtn);
    }
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
  const select = document.getElementById("contact-subject") || document.getElementById("contact-project-type");
  const chips = document.querySelectorAll(".intent-chip");

  if (intentKey === "publisher") {
    if (select) select.value = "Collaboration / Publishing";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "publisher");
    });
  } else if (intentKey === "outsourcing") {
    if (select) select.value = "Outsourcing";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "outsourcing");
    });
  } else if (intentKey === "game-dev") {
    if (select) select.value = "Full Game Development";
    chips.forEach((c) => {
      c.classList.toggle("active", c.getAttribute("data-intent") === "game-dev");
    });
  } else if (intentKey === "consulting") {
    if (select) select.value = "General Inquiry";
  }
}

function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const name = document.getElementById("contact-name").value;

  showToast(`Thank you ${name}! We have received your inquiry. We'll get back to you soon.`);
  form.reset();
}

function handlePlaytesterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("pt-name").value;
  closeModal("playtester-modal");
  showToast(`Welcome to the Playtester team, ${name}! We've sent you a confirmation email.`);
  event.target.reset();
}

function handleNewsletterSubmit(event, form) {
  event.preventDefault();
  const input = form.querySelector("input[type='email']");
  if (input && input.value) {
    showToast("You have successfully subscribed to the Entytec newsletter!");
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


/* ==========================================================================
   07B. CONTACT TAB SWITCHER & SUBSCRIBE HANDLERS
   ========================================================================== */
function switchContactTab(tab) {
  const buttons = document.querySelectorAll(".contact-tab-btn");
  const panes = document.querySelectorAll(".contact-pane");

  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });

  panes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === "pane-" + tab);
  });
}

function handleSubscribeSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const emailInput = form.querySelector("input[type='email']");
  const email = emailInput ? emailInput.value : "";
  showToast(`Thank you for subscribing (${email})! We'll notify you about upcoming playtests and releases.`);
  form.reset();
}
