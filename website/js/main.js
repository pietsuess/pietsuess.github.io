/**
 * PietSuess.com — Main Interactions
 * Vanilla JS, no dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. SCROLL FADE-IN ANIMATION
     ------------------------------------------------------- */
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* -------------------------------------------------------
     2. HEADER SCROLL EFFECT
     ------------------------------------------------------- */
  const header = document.querySelector('header');

  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll(); // set initial state
  }

  /* -------------------------------------------------------
     3. MOBILE HAMBURGER MENU
     ------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelectorAll('nav a');

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('menu-open');
    });

    // Close when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
      });
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('menu-open')) return;
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        document.body.classList.remove('menu-open');
      }
    });
  }

  /* -------------------------------------------------------
     4. PHOTO LIGHTBOX
     ------------------------------------------------------- */
  let lightboxOverlay = null;
  let lightboxImg = null;
  let lightboxClose = null;
  let lightboxPrev = null;
  let lightboxNext = null;
  let currentGallery = [];
  let currentIndex = 0;

  function buildLightbox() {
    if (lightboxOverlay) return;

    lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.setAttribute('role', 'dialog');
    lightboxOverlay.setAttribute('aria-modal', 'true');

    lightboxOverlay.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>
      <img class="lightbox-image" src="" alt="">
      <button class="lightbox-next" aria-label="Next image">&#8250;</button>
    `;

    document.body.appendChild(lightboxOverlay);

    lightboxImg = lightboxOverlay.querySelector('.lightbox-image');
    lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    lightboxPrev = lightboxOverlay.querySelector('.lightbox-prev');
    lightboxNext = lightboxOverlay.querySelector('.lightbox-next');

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on clicking outside the image
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  function openLightbox(trigger) {
    buildLightbox();

    const galleryId = trigger.getAttribute('data-gallery') || '__default';
    const allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

    currentGallery = allTriggers.filter(t => {
      return (t.getAttribute('data-gallery') || '__default') === galleryId;
    });
    currentIndex = currentGallery.indexOf(trigger);

    showLightboxImage();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Show/hide arrows based on gallery size
    const hasMultiple = currentGallery.length > 1;
    lightboxPrev.style.display = hasMultiple ? '' : 'none';
    lightboxNext.style.display = hasMultiple ? '' : 'none';
  }

  function showLightboxImage() {
    if (!lightboxImg || !currentGallery.length) return;
    const trigger = currentGallery[currentIndex];
    // Use data-full for a high-res source, otherwise fall back to the element's src
    const src = trigger.getAttribute('data-full') || trigger.src || trigger.getAttribute('src');
    const alt = trigger.getAttribute('alt') || '';
    lightboxImg.src = src;
    lightboxImg.alt = alt;
  }

  function navigateLightbox(direction) {
    if (!currentGallery.length) return;
    currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
    showLightboxImage();
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Delegate clicks on lightbox triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      e.preventDefault();
      openLightbox(trigger);
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* -------------------------------------------------------
     5. ACTIVE NAV LINK
     ------------------------------------------------------- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Normalise: strip trailing slash, resolve relative paths
    let linkPath;
    try {
      linkPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    } catch (_) {
      linkPath = href.replace(/\/$/, '') || '/';
    }

    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  /* -------------------------------------------------------
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      // Update URL without jumping
      history.pushState(null, '', targetId);
    }
  });

  /* -------------------------------------------------------
     7. CONTACT FORM
     ------------------------------------------------------- */
  // Service checkbox toggle
  document.querySelectorAll('.service-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('checked');
      // If there's an underlying hidden checkbox, sync it
      const input = cb.querySelector('input[type="checkbox"]');
      if (input) input.checked = cb.classList.contains('checked');
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        // Remove previous error state
        field.classList.remove('error');

        const value = field.value.trim();
        if (!value) {
          valid = false;
          field.classList.add('error');
        }

        // Basic email check
        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          valid = false;
          field.classList.add('error');
        }
      });

      if (!valid) {
        // Focus the first errored field
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Success — show inline thank-you or alert
      const thankYou = document.createElement('div');
      thankYou.className = 'form-thank-you';
      thankYou.textContent = 'Thank you! Your message has been received.';
      contactForm.style.display = 'none';
      contactForm.parentNode.insertBefore(thankYou, contactForm.nextSibling);
    });

    // Clear error state on input
    contactForm.addEventListener('input', (e) => {
      if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
      }
    });
  }

  /* -------------------------------------------------------
     8. DESIGN PAGE ACCORDIONS
     ------------------------------------------------------- */
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.accordion-toggle');
    if (!toggle) return;

    e.preventDefault();

    const content = toggle.closest('.accordion')?.querySelector('.accordion-content');
    if (!content) return;

    const isOpen = content.classList.contains('open');

    // Optionally close other accordions in the same parent
    const parent = toggle.closest('.accordion-group');
    if (parent) {
      parent.querySelectorAll('.accordion-content.open').forEach(other => {
        if (other !== content) {
          other.classList.remove('open');
          other.style.maxHeight = null;
          const otherToggle = other.closest('.accordion')?.querySelector('.accordion-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (isOpen) {
      content.classList.remove('open');
      content.style.maxHeight = null;
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      content.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

});
