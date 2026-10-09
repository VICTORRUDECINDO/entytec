/**
 * ENTYTEC VIDEO GAME STUDIO - MAIN JAVASCRIPT
 * Interactions, Hero Slider, Filtering, Modals, Forms & UX Polish
 */

/* ==========================================================================
   EMAILJS CONFIGURATION
   ========================================================================== */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "BISgrx9Em1Ja8r6LK",
  SERVICE_ID: "service_d043mt3",
  CONTACT_TEMPLATE_ID: "template_u139egk",
  SUBSCRIBE_TEMPLATE_ID: "template_u139egk",
  NEWSLETTER_TEMPLATE_ID: "template_u139egk"
};

/* ==========================================================================
   GOOGLE SHEETS (SUBSCRIPTION / LEADS DATABASE)
   Guarda automáticamente Gamertag + Email en tu documento de Google Sheets
   ========================================================================== */
const GOOGLE_SHEETS_CONFIG = {
  WEBAPP_URL: "https://script.google.com/macros/s/AKfycbwe_iPJsnTR1ZnT5v0pMgrLqPqnD2ZvyGSxToN59F6dgL4TApQgqQtXY4wQ5S63w5x2IQ/exec"
};

function initEmailJS() {
  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log("EmailJS initialized with public key.");
    } catch (err) {
      console.error("EmailJS init failed:", err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEmailJS();
  initStickyHeader();
  initMobileMenu();
  initHeroCarousel();
  renderPortfolio();
  initPortfolioPage();
  initScrollSpy();
  initKeyboardEvents();
  checkInitialHashOrTab();
  initMobileCarousels();
  initMobileHeroGifs();
});

function checkInitialHashOrTab() {
  const hash = window.location.hash;
  const storedTab = localStorage.getItem("openTab");

  if (hash === "#subscribe" || storedTab === "subscribe") {
    localStorage.removeItem("openTab");
    setTimeout(() => goToSubscribe(), 400);
  } else if (hash === "#contacto" || storedTab === "contact") {
    localStorage.removeItem("openTab");
    setTimeout(() => goToContact(), 400);
  }
}

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
  const btn = form.querySelector("button[type='submit']");
  const originalText = btn.innerHTML;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const intentInput = document.getElementById("selected-intent");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const subject = subjectInput ? subjectInput.value.trim() : "General Inquiry";
  const message = messageInput ? messageInput.value.trim() : "";
  const intent = intentInput ? intentInput.value : "Contact";

  if (!name || !email || !message) {
    showToast("Please fill in all required fields.");
    return;
  }

  // Disable button and show loading state
  btn.disabled = true;
  btn.innerHTML = `<span>SENDING...</span>`;

  // Always ensure initialized before sending
  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }

  // Parameters mapped to match all common EmailJS variable names
  const templateParams = {
    name: name,
    from_name: name,
    email: email,
    from_email: email,
    reply_to: email,
    to_email: "info@entytec.com",
    subject: subject,
    message: message,
    intent: intent,
    date: new Date().toLocaleString()
  };

  emailjs
    .send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CONTACT_TEMPLATE_ID, templateParams)
    .then(() => {
      showToast("Thank you! Your message has been sent successfully. We'll get back to you soon.");
      form.reset();
    })
    .catch((error) => {
      console.error("EmailJS Error:", error);
      showToast("Oops! Something went wrong. Please email us directly at info@entytec.com");
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
    });
}

function handlePlaytesterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("pt-name").value.trim();
  const email = document.getElementById("pt-email").value.trim();

  // Collect checked platforms
  const checkedBoxes = Array.from(event.target.querySelectorAll("input[type='checkbox']:checked"));
  const platforms = checkedBoxes.map((cb) => cb.parentElement.textContent.trim()).join(", ") || "PC / Steam";

  closeModal("playtester-modal");
  showToast(`Welcome to the Playtester team, ${name}! We've registered your interest.`);

  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CONTACT_TEMPLATE_ID, {
      name: name,
      from_name: name,
      email: email,
      from_email: email,
      reply_to: email,
      to_email: "info@entytec.com",
      subject: "🎮 New Playtester Registration",
      message: `New playtester signed up!\nName: ${name}\nEmail: ${email}\nPlatforms: ${platforms}`,
      intent: "Playtester Signup",
      date: new Date().toLocaleString()
    }).catch((err) => console.error("Playtester EmailJS Error:", err));
  }

  event.target.reset();
}

function handleNewsletterSubmit(event, form) {
  event.preventDefault();
  const input = form.querySelector("input[type='email']");
  if (!input || !input.value.trim()) return;

  const emailVal = input.value.trim();

  // Guardar en Google Sheets automáticamente
  if (GOOGLE_SHEETS_CONFIG.WEBAPP_URL && !GOOGLE_SHEETS_CONFIG.WEBAPP_URL.includes("TU_GOOGLE_")) {
    const payload = new URLSearchParams();
    payload.append("name", "Newsletter Subscriber");
    payload.append("email", emailVal);
    payload.append("date", new Date().toLocaleString());

    fetch(GOOGLE_SHEETS_CONFIG.WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload
    }).catch((err) => console.error("Google Sheets Error:", err));
  }

  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID, {
      email: emailVal,
      from_email: emailVal,
      reply_to: emailVal,
      subject: "📬 Newsletter Subscription",
      message: `New newsletter subscription: ${emailVal}`,
      intent: "Newsletter",
      date: new Date().toLocaleString()
    })
      .then(() => {
        showToast("You have successfully subscribed to the Entytec newsletter!");
        input.value = "";
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        showToast("Subscription failed. Please try again or email info@entytec.com");
      });
  } else {
    showToast("You have successfully subscribed to the Entytec newsletter!");
    input.value = "";
  }
}

function handleSubscribeSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn = form.querySelector("button[type='submit']");
  const originalText = btn.innerHTML;

  const nameVal = document.getElementById("sub-name").value.trim();
  const emailVal = document.getElementById("sub-email").value.trim();

  btn.disabled = true;
  btn.innerHTML = `<span>SUBSCRIBING...</span>`;

  // 1. Guardar en Google Sheets automáticamente
  if (GOOGLE_SHEETS_CONFIG.WEBAPP_URL && !GOOGLE_SHEETS_CONFIG.WEBAPP_URL.includes("TU_GOOGLE_")) {
    const payload = new URLSearchParams();
    payload.append("name", nameVal);
    payload.append("email", emailVal);
    payload.append("date", new Date().toLocaleString());

    fetch(GOOGLE_SHEETS_CONFIG.WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload
    }).catch((err) => console.error("Google Sheets Error:", err));
  }

  // 2. Notificación EmailJS
  if (typeof emailjs !== "undefined" && EMAILJS_CONFIG.PUBLIC_KEY) {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.SUBSCRIBE_TEMPLATE_ID, {
      name: nameVal,
      from_name: nameVal,
      email: emailVal,
      from_email: emailVal,
      reply_to: emailVal,
      to_email: "info@entytec.com",
      subject: "📬 Community Subscription",
      message: `New community subscription:\nName: ${nameVal}\nEmail: ${emailVal}`,
      intent: "Subscribe",
      date: new Date().toLocaleString()
    })
      .then(() => {
        showToast(`Thank you for subscribing! We'll notify you about upcoming playtests and releases.`);
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        showToast(`Thank you for subscribing! We'll notify you about upcoming playtests and releases.`);
        form.reset();
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
      });
  } else {
    showToast(`Thank you for subscribing! We'll notify you about upcoming playtests and releases.`);
    form.reset();
    btn.disabled = false;
    btn.innerHTML = originalText;
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

/* ==========================================================================
   07C. COMMUNITY & HUB NAVIGATION HELPERS
   ========================================================================== */
function goToContact(intent = null) {
  const contactSection = document.getElementById("contacto");
  if (!contactSection) {
    localStorage.setItem("openTab", "contact");
    window.location.href = "index.html#contacto";
    return;
  }

  switchContactTab("contact");

  if (intent) {
    const subjectSelect = document.getElementById("contact-subject");
    if (subjectSelect) subjectSelect.value = intent;
  }

  // Close mobile navigation menu if open
  const navMenu = document.getElementById("nav-menu");
  const mobileToggle = document.getElementById("mobile-toggle");
  if (navMenu && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    if (mobileToggle) {
      mobileToggle.classList.remove("is-active");
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  }

  contactSection.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    const nameInput = document.getElementById("contact-name");
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add("input-pulse");
      setTimeout(() => nameInput.classList.remove("input-pulse"), 1500);
    }
  }, 400);
}

function goToContactForPartnership() {
  goToContact("Collaboration / Publishing");
}

function goToSubscribe() {
  switchContactTab("subscribe");

  // Close mobile navigation menu if open
  const navMenu = document.getElementById("nav-menu");
  const mobileToggle = document.getElementById("mobile-toggle");
  if (navMenu && navMenu.classList.contains("open")) {
    navMenu.classList.remove("open");
    if (mobileToggle) {
      mobileToggle.classList.remove("is-active");
      mobileToggle.setAttribute("aria-expanded", "false");
    }
  }

  const contactSection = document.getElementById("contacto");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
  }
  setTimeout(() => {
    const subInput = document.getElementById("sub-name") || document.getElementById("sub-email");
    if (subInput) {
      subInput.focus();
      subInput.classList.add("input-pulse");
      setTimeout(() => subInput.classList.remove("input-pulse"), 1500);
    }
  }, 400);
}

/* ==========================================================================
   09. MOBILE CAROUSELS — Portfolio & Community Hub
   ========================================================================== */
function initMobileCarousels() {
  const isMobile = () => window.innerWidth <= 768;

  // ---- Portfolio Carousel ----
  function buildPortfolioCarousel() {
    const track = document.getElementById("portfolio-carousel-track");
    const dotsContainer = document.getElementById("portfolio-carousel-dots");
    const prevBtn = document.getElementById("portfolio-carousel-prev");
    const nextBtn = document.getElementById("portfolio-carousel-next");
    const sourceGrid = document.getElementById("portfolio-grid");
    if (!track || !sourceGrid) return;

    track.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    const cards = Array.from(sourceGrid.querySelectorAll(".portfolio-card-visual"));
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const clone = card.cloneNode(true);
      // Re-attach onclick handlers via attribute (cloneNode preserves attribute onclick)
      track.appendChild(clone);

      if (dotsContainer) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Game " + (i + 1));
        dot.addEventListener("click", () => scrollCarouselTo(track, i, cards.length, dotsContainer));
        dotsContainer.appendChild(dot);
      }
    });

    let currentIndex = 0;
    const scrollTo = (idx) => {
      currentIndex = Math.max(0, Math.min(idx, cards.length - 1));
      scrollCarouselTo(track, currentIndex, cards.length, dotsContainer);
    };
    if (prevBtn) prevBtn.addEventListener("click", () => scrollTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollTo(currentIndex + 1));

    track.addEventListener("scroll", () => {
      const children = track.children;
      if (!children.length) return;
      const itemWidth = children[0].offsetWidth + 16; // 16 = 1rem gap
      const newIdx = Math.round(track.scrollLeft / itemWidth);
      if (newIdx !== currentIndex) {
        currentIndex = newIdx;
        updateCarouselDots(dotsContainer, currentIndex);
      }
    }, { passive: true });
  }

  // ---- Community Hub Carousel ----
  function buildHubCarousel() {
    const track = document.getElementById("hub-carousel-track");
    const dotsContainer = document.getElementById("hub-carousel-dots");
    const prevBtn = document.getElementById("hub-carousel-prev");
    const nextBtn = document.getElementById("hub-carousel-next");
    const sourceGrid = document.getElementById("hub-grid");
    if (!track || !sourceGrid) return;

    track.innerHTML = "";
    if (dotsContainer) dotsContainer.innerHTML = "";

    const cards = Array.from(sourceGrid.querySelectorAll(".hub-card"));
    if (!cards.length) return;

    cards.forEach((card, i) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);

      if (dotsContainer) {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Card " + (i + 1));
        dot.addEventListener("click", () => scrollCarouselTo(track, i, cards.length, dotsContainer));
        dotsContainer.appendChild(dot);
      }
    });

    let currentIndex = 0;
    const scrollTo = (idx) => {
      currentIndex = Math.max(0, Math.min(idx, cards.length - 1));
      scrollCarouselTo(track, currentIndex, cards.length, dotsContainer);
    };
    if (prevBtn) prevBtn.addEventListener("click", () => scrollTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => scrollTo(currentIndex + 1));

    track.addEventListener("scroll", () => {
      const children = track.children;
      if (!children.length) return;
      const itemWidth = children[0].offsetWidth + 16;
      const newIdx = Math.round(track.scrollLeft / itemWidth);
      if (newIdx !== currentIndex) {
        currentIndex = newIdx;
        updateCarouselDots(dotsContainer, currentIndex);
      }
    }, { passive: true });
  }

  // ---- Helpers ----
  function scrollCarouselTo(track, index, total, dotsContainer) {
    const children = track.children;
    if (!children.length) return;
    const itemWidth = children[0].offsetWidth + 16;
    track.scrollTo({ left: itemWidth * index, behavior: "smooth" });
    updateCarouselDots(dotsContainer, index);
  }

  function updateCarouselDots(dotsContainer, activeIndex) {
    if (!dotsContainer) return;
    Array.from(dotsContainer.children).forEach((dot, i) => {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  // ---- Init & responsive rebuild ----
  function initAll() {
    if (isMobile()) {
      buildPortfolioCarousel();
      buildHubCarousel();
    }
  }

  requestAnimationFrame(() => {
    initAll();
  });

  // Rebuild if window resizes across the breakpoint
  let wasMobile = isMobile();
  window.addEventListener("resize", () => {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      if (nowMobile) initAll();
    }
  });
}

/* ==========================================================================
   10. MOBILE HERO GIFS (Antrio 3-GIF Gameplay Loop on Mobile)
   ========================================================================== */
function initMobileHeroGifs() {
  const container = document.getElementById("hero-mobile-gifs");
  const dotsContainer = document.getElementById("hero-mobile-dots");
  if (!container) return;

  const gifs = container.querySelectorAll(".hero-mobile-gif");
  const dots = dotsContainer ? dotsContainer.querySelectorAll(".mobile-dot") : [];
  if (!gifs.length) return;

  let currentGifIndex = 0;
  let gifInterval = null;
  const GIF_INTERVAL_MS = 4000; // 4 seconds per gameplay clip

  const isMobile = () => window.innerWidth <= 768;

  const showGif = (index) => {
    currentGifIndex = (index + gifs.length) % gifs.length;
    gifs.forEach((gif, i) => {
      gif.classList.toggle("active", i === currentGifIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentGifIndex);
    });
  };

  const nextGif = () => {
    showGif(currentGifIndex + 1);
  };

  const prevGif = () => {
    showGif(currentGifIndex - 1);
  };

  const startLoop = () => {
    stopLoop();
    if (isMobile()) {
      gifInterval = setInterval(nextGif, GIF_INTERVAL_MS);
    }
  };

  const stopLoop = () => {
    if (gifInterval) {
      clearInterval(gifInterval);
      gifInterval = null;
    }
  };

  // Dots click events
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      showGif(idx);
      startLoop();
    });
  });

  // Touch swipe support on the hero section for mobile
  const heroSection = document.getElementById("inicio");
  if (heroSection) {
    let touchStartX = 0;
    let touchStartY = 0;

    heroSection.addEventListener("touchstart", (e) => {
      if (!isMobile()) return;
      if (e.target.closest("button") || e.target.closest("a")) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopLoop();
    }, { passive: true });

    heroSection.addEventListener("touchend", (e) => {
      if (!isMobile()) return;
      if (e.target.closest("button") || e.target.closest("a")) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
        if (diffX < 0) {
          nextGif();
        } else {
          prevGif();
        }
      }
      startLoop();
    }, { passive: true });
  }

  // Handle window resizing
  window.addEventListener("resize", () => {
    if (isMobile()) {
      if (!gifInterval) startLoop();
    } else {
      stopLoop();
    }
  });

  // Initial startup
  if (isMobile()) {
    showGif(0);
    startLoop();
  }
}
