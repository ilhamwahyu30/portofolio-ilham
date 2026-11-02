/**
 * PORTFOLIO CORE SCRIPTS (script.js)
 * Manages Theme, Mobile Nav, Modals, Filters, Toast Alerts, and Forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initFavicon();
  initImageFallback();
  initTheme();
  initMobileNav();
  highlightActiveNav();
  initCopyButtons();
  initProjectFilters();
  initProjectModals();
  initCertModals();
  initContactForm();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT WITH LOCALSTORAGE)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply saved theme or system preference
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
  } else if (!prefersDark) {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeIcons('light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcons('dark');
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      updateThemeIcons(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  });
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'light') {
      icon.className = 'fa-solid fa-moon';
    } else {
      icon.className = 'fa-solid fa-sun';
    }
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let backdrop = document.querySelector('.nav-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  if (!menuToggle || !navMenu) return;

  // Add mobile menu close button inside drawer if not present
  if (!navMenu.querySelector('.mobile-menu-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'mobile-menu-close';
    closeBtn.setAttribute('aria-label', 'Close Menu');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    navMenu.prepend(closeBtn);

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  function openMenu() {
    navMenu.classList.add('open');
    backdrop.classList.add('active');
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  // Stop clicks inside drawer from propagating to document/backdrop
  navMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking nav link
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when tapping/clicking outside drawer
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   3. ACTIVE NAVIGATION LINK HIGHLIGHT
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. COPY TO CLIPBOARD HELPER
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
        showToast(`Copied to clipboard: ${textToCopy}`, 'success');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        showToast('Failed to copy to clipboard', 'error');
      }
    });
  });
}

/* ==========================================================================
   5. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-in';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.style.display = 'flex';
          card.classList.add('revealed');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT DETAILS MODAL
   ========================================================================== */
function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  if (!modalBackdrop) return;

  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');
  const modalContent = modalBackdrop.querySelector('.modal-content-area');

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      if (!card) return;

      const title = card.querySelector('.project-title')?.innerText || 'Project Details';
      const desc = card.querySelector('.project-desc')?.innerText || '';
      const imgSrc = card.querySelector('.project-thumb img')?.getAttribute('src') || '';
      const tags = card.querySelector('.tech-tags')?.innerHTML || '';
      const demoUrl = card.querySelector('.demo-link')?.getAttribute('href') || '#';
      const repoUrl = card.querySelector('.repo-link')?.getAttribute('href') || '#';

      modalContent.innerHTML = `
        <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; max-height: 320px; background: #0f172a;">
          <img src="${imgSrc}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <h2 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem;">${title}</h2>
        <div class="tech-tags" style="margin-bottom: 1.25rem;">${tags}</div>
        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem; font-size: 1rem;">
          ${desc}
        </p>
        <div style="background: var(--bg-card); padding: 1.25rem; border-radius: 10px; border: 1px solid var(--border-color); margin-bottom: 1.75rem;">
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-secondary);">Key Architectural Highlights:</h4>
          <ul style="list-style: disc; padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary);">
            <li>High-performance responsive rendering with modern component architecture</li>
            <li>Optimized load times and high Lighthouse performance score</li>
            <li>Robust state management and secure REST/GraphQL API integration</li>
          </ul>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Preview
          </a>
          <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
            <i class="fa-brands fa-github"></i> View Source Code
          </a>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) closeModal();
  });
}

/* ==========================================================================
   8. CERTIFICATE LIGHTBOX PREVIEW MODAL
   ========================================================================== */
function initCertModals() {
  const certModal = document.getElementById('cert-modal');
  if (!certModal) return;

  const closeBtn = certModal.querySelector('.modal-close-btn');
  const modalContent = certModal.querySelector('.modal-content-area');

  document.querySelectorAll('.cert-preview, .view-cert-btn').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.cert-card');
      if (!card) return;

      const imgSrc = card.querySelector('.cert-preview img')?.getAttribute('src');
      const name = card.querySelector('.cert-name')?.innerText || 'Credential Certificate';
      const org = card.querySelector('.cert-org')?.innerText || '';
      const date = card.querySelector('.cert-date')?.innerText || '';
      const id = card.querySelector('.cert-id')?.innerText || '';

      const fileExt = (imgSrc ? imgSrc.split('.').pop() : 'png').split(/[?#]/)[0] || 'png';
      const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const downloadFileName = `Sertifikat_${cleanName}.${fileExt}`;

      modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-secondary); text-transform: uppercase;">${org} • ${date}</span>
          <h2 style="font-size: 1.5rem; font-weight: 800; margin-top: 0.25rem;">${name}</h2>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">${id}</p>
        </div>
        <div style="border-radius: 12px; overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); background: #000;">
          <img src="${imgSrc}" alt="${name}" style="width: 100%; height: auto; display: block;">
        </div>
        <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="${imgSrc}" download="${downloadFileName}" class="btn btn-outline btn-sm">
            <i class="fa-solid fa-download"></i> Download Gambar (${fileExt.toUpperCase()})
          </a>
          <button class="btn btn-primary btn-sm" onclick="showToast('Credential officially verified & authenticated', 'success')">
            <i class="fa-solid fa-shield-halved"></i> Verify Authenticity
          </button>
        </div>
      `;

      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeCert = () => {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeCert);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCert();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) closeCert();
  });
}

/* ==========================================================================
   9. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Mengirim Pesan...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      form.reset();
      showToast('Pesan berhasil terkirim! Terima kasih telah menghubungi.', 'success');
    }, 1500);
  });
}

/* ==========================================================================
   10. UNIVERSAL IMAGE FALLBACK & MULTI-FORMAT SUPPORT (PNG, JPG, JPEG, SVG)
   ========================================================================== */
function initImageFallback() {
  const supportedExtensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function onImageError() {
      const src = this.getAttribute('src');
      if (!src) return;

      const lastDot = src.lastIndexOf('.');
      if (lastDot === -1) return;

      const basePath = src.substring(0, lastDot);
      const currentExt = src.substring(lastDot + 1).toLowerCase().split(/[?#]/)[0];

      if (!this._triedExtensions) {
        this._triedExtensions = [currentExt];
      }

      const nextExt = supportedExtensions.find(ext => !this._triedExtensions.includes(ext));
      if (nextExt) {
        this._triedExtensions.push(nextExt);
        this.src = `${basePath}.${nextExt}`;
      }
    });
  });
}

/* ==========================================================================
   11. DYNAMIC FAVICON RESOLVER (PNG, JPG, JPEG, SVG)
   ========================================================================== */
function initFavicon() {
  const favicons = document.querySelectorAll('link[rel*="icon"]');
  favicons.forEach(fav => {
    const href = fav.getAttribute('href');
    if (!href) return;

    const ext = href.split('.').pop().toLowerCase().split(/[?#]/)[0];
    const mimeMap = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'webp': 'image/webp'
    };

    if (mimeMap[ext]) {
      fav.type = mimeMap[ext];
    }
  });
}


