/**
 * PietSuess.com — Main Interactions
 * Dark gradient wrapper edition
 * Full animation systems from resume
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     1. NAME SLICE SYSTEM — hero name splits on scroll
     ------------------------------------------------------- */
  (function() {
    const NUM_SLICES = 12;
    const wrapper = document.getElementById('heroNameWrapper');
    if (!wrapper) return;

    const source = wrapper.querySelector('.landing-name-source');
    if (!source) return;

    const slices = [];
    const innerHTML = source.innerHTML;

    for (let i = 0; i < NUM_SLICES; i++) {
      const slice = document.createElement('div');
      slice.className = 'name-slice';
      slice.innerHTML = innerHTML;

      const top = (i / NUM_SLICES) * 100;
      const bottom = ((NUM_SLICES - i - 1) / NUM_SLICES) * 100;
      slice.style.clipPath = `inset(${top}% 0 ${bottom}% 0)`;

      wrapper.appendChild(slice);
      slices.push(slice);
    }

    function updateSlices() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(scrollY / (vh * 0.5), 1);

      for (let i = 0; i < NUM_SLICES; i++) {
        const sliceDelay = (i / NUM_SLICES) * 0.55;
        const sliceProgress = Math.max(0, Math.min(1,
          (progress - sliceDelay) / (1 - sliceDelay) * 1.8
        ));

        if (sliceProgress <= 0) {
          slices[i].style.transform = 'translateX(0)';
          slices[i].style.opacity = '1';
          continue;
        }

        const direction = i % 2 === 0 ? -1 : 1;
        const distFromCenter = Math.abs(i - NUM_SLICES / 2) / (NUM_SLICES / 2);
        const maxOffset = 60 + distFromCenter * 120;

        slices[i].style.transform = `translateX(${direction * sliceProgress * maxOffset}px)`;
        slices[i].style.opacity = (1 - sliceProgress).toString();
      }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => { updateSlices(); ticking = false; });
        ticking = true;
      }
    }, { passive: true });

    updateSlices();
  })();


  /* -------------------------------------------------------
     2. GHOST #1 — parallax zone name, right side
     ------------------------------------------------------- */
  (function() {
    const ghost = document.getElementById('ghost1');
    if (!ghost) return;

    const G1_FADE_IN_START = 0.05;
    const G1_FADE_IN_END = 0.9;
    const G1_HOLD_END = 1.15;
    const G1_FADE_OUT_END = 1.85;

    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function easeInQuart(t) { return t * t * t * t; }

    function updateGhost() {
      const sv = window.scrollY / window.innerHeight;

      const rawIn = Math.max(0, Math.min(1,
        (sv - G1_FADE_IN_START) / (G1_FADE_IN_END - G1_FADE_IN_START)
      ));
      const rawOut = sv > G1_HOLD_END
        ? Math.max(0, Math.min(1, (sv - G1_HOLD_END) / (G1_FADE_OUT_END - G1_HOLD_END)))
        : 0;

      const clarity = easeOutQuart(rawIn) * (1 - easeInQuart(rawOut));
      const distortion = 1 - clarity;

      ghost.style.opacity = (clarity * 0.14).toString();
      ghost.style.filter = `blur(${8 * distortion}px)`;
      ghost.style.transform = `translateY(calc(-50% + ${-window.scrollY * 0.12}px)) translateX(${30 * distortion}px) scale(${1 + 0.15 * distortion})`;
      ghost.style.letterSpacing = `${0.3 * distortion}em`;
    }

    let ghostTicking = false;
    window.addEventListener('scroll', () => {
      if (!ghostTicking) {
        requestAnimationFrame(() => { updateGhost(); ghostTicking = false; });
        ghostTicking = true;
      }
    }, { passive: true });

    updateGhost();
  })();


  /* -------------------------------------------------------
     3. GHOST #2 — cascading horizontal scroll lines
     ------------------------------------------------------- */
  (function() {
    const container = document.getElementById('ghost2');
    if (!container) return;

    const NUM_LINES = 6;
    container.style.top = '0px';

    // Spread lines across the page content
    const docH = Math.max(document.body.scrollHeight, 2000);
    const FIRST_Y = docH * 0.25;
    const LAST_Y = docH * 0.75;

    const lines = [];
    for (let i = 0; i < NUM_LINES; i++) {
      const line = document.createElement('div');
      line.className = 'cascade-line';
      const ghost1 = document.getElementById('ghost1');
      const cascadeText = ghost1 ? ghost1.textContent.toUpperCase() : 'PIET SUESS';
      line.textContent = (cascadeText + ' \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ').repeat(50);
      const y = FIRST_Y + (i / (NUM_LINES - 1)) * (LAST_Y - FIRST_Y);
      line.style.top = y + 'px';
      container.appendChild(line);
      lines.push({ el: line, pageY: y });
    }

    function updateCascade() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        const lineH = 40;
        const enterScroll = l.pageY - vh;
        const exitScroll = l.pageY + lineH;

        const scrolledPast = scrollY - enterScroll;
        const visible = scrolledPast > 0 && scrollY < exitScroll;

        const x = -vw + scrolledPast * 0.8;
        let op = 0;

        if (visible) {
          const fadeInZone = vh * 0.15;
          const fadeOutZone = vh * 0.15;
          if (scrolledPast < fadeInZone) op = 0.05 * (scrolledPast / fadeInZone);
          else if (scrollY > exitScroll - fadeOutZone) op = 0.05 * ((exitScroll - scrollY) / fadeOutZone);
          else op = 0.05;
        }

        l.el.style.transform = `translateX(${x}px)`;
        l.el.style.opacity = op.toString();
      }
    }

    let cascadeTicking = false;
    window.addEventListener('scroll', () => {
      if (!cascadeTicking) {
        requestAnimationFrame(() => { updateCascade(); cascadeTicking = false; });
        cascadeTicking = true;
      }
    }, { passive: true });

    updateCascade();
  })();


  /* -------------------------------------------------------
     4. BACKGROUND ZONE LABEL — parallax fade
     ------------------------------------------------------- */
  (function() {
    const el = document.getElementById('bgZoneLabel');
    if (!el) return;

    function update() {
      const y = -window.scrollY * 0.15;
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.8));
      const scrollPct = Math.min(1, window.scrollY / (window.innerHeight * 0.6));
      const rotX = scrollPct * 25;
      const scaleY = 1 + scrollPct * 0.3;
      el.style.transform = `translateX(-50%) translateY(${y}px) perspective(600px) rotateX(${rotX}deg) scaleY(${scaleY})`;
      el.style.transformOrigin = 'center bottom';
      el.style.opacity = fade.toString();
    }

    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    update();
  })();


  /* -------------------------------------------------------
     5. MEASURING TAPE — sidebar ruler
     ------------------------------------------------------- */
  (function() {
    // Only show on pages with enough content
    if (document.body.scrollHeight < window.innerHeight * 1.5) return;

    const TAPE_COLOR = document.body.classList.contains('design-page') ? '#000' : '#fff';

    const strip = document.createElement('div');
    strip.style.cssText = 'position:fixed;right:0;top:0;width:50px;height:100%;z-index:98;pointer-events:none;overflow:visible;';
    document.body.appendChild(strip);

    let markers = [];

    function buildMarkers() {
      markers = [];

      // Page hero
      const hero = document.querySelector('.page-hero, .page-header, .landing-hero, .photo-hero-wrap, .design-hero');
      if (hero) markers.push({ el: hero, name: 'HERO' });

      // Named sections
      document.querySelectorAll('.portfolio-grid, .animate-grid, .photo-dark-section, .design-projects, .contact-section, .about-grid, .bio-section').forEach(sec => {
        const cls = sec.className.split(' ')[0].toUpperCase().replace(/-/g, ' ').replace(/\./g, '');
        markers.push({ el: sec, name: cls.substring(0, 16) });
      });

      // Footer
      const footer = document.querySelector('.site-footer');
      if (footer) markers.push({ el: footer, name: 'FOOTER' });

      markers.forEach(m => {
        const rect = m.el.getBoundingClientRect();
        m.topPx = rect.top + window.scrollY;
      });
    }

    function render() {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      strip.innerHTML = '';

      const focusY = vh * (5/6);

      function calcOpacity(screenY) {
        if (screenY >= focusY) return Math.max(0, 1 - (screenY - focusY) / (vh - focusY));
        return Math.max(0, screenY / focusY);
      }

      // Tick marks
      const startPx = Math.floor(scrollY / 50) * 50;
      for (let px = startPx; px <= scrollY + vh; px += 50) {
        const screenY = px - scrollY;
        if (screenY < 0 || screenY > vh) continue;

        const opacity = calcOpacity(screenY);
        if (opacity < 0.02) continue;

        const isMajor = px % 500 === 0;
        const isMid = px % 100 === 0;
        const w = isMajor ? 50 : isMid ? 22 : 10;

        const tick = document.createElement('div');
        tick.style.cssText = `position:absolute;right:0;top:${screenY}px;width:${w}px;height:1px;background:${TAPE_COLOR};opacity:${(isMajor ? opacity : isMid ? opacity * 0.5 : opacity * 0.2).toFixed(2)};`;

        if (isMajor) {
          const lbl = document.createElement('div');
          lbl.textContent = px + 'px';
          lbl.style.cssText = `position:absolute;right:0;top:-14px;font:bold 9px monospace;color:${TAPE_COLOR};opacity:${opacity.toFixed(2)};white-space:nowrap;`;
          tick.appendChild(lbl);
        }
        strip.appendChild(tick);
      }

      // Section markers
      markers.forEach(m => {
        const screenY = m.topPx - scrollY;
        if (screenY >= 0 && screenY <= vh) {
          const opacity = calcOpacity(screenY);
          if (opacity < 0.02) return;

          const mark = document.createElement('div');
          mark.style.cssText = `position:absolute;right:0;top:${screenY}px;width:50px;height:2px;background:${TAPE_COLOR};opacity:${opacity.toFixed(2)};`;

          const lbl = document.createElement('div');
          lbl.textContent = m.name;
          lbl.style.cssText = `position:absolute;right:0;top:-14px;font:bold 9px monospace;color:${TAPE_COLOR};opacity:${opacity.toFixed(2)};white-space:nowrap;`;
          mark.appendChild(lbl);
          strip.appendChild(mark);
        }
      });
    }

    setTimeout(buildMarkers, 800);
    window.addEventListener('scroll', () => requestAnimationFrame(render), { passive: true });
    window.addEventListener('resize', () => { buildMarkers(); render(); });
    render();
  })();


  /* -------------------------------------------------------
     6. SCROLL FADE-IN (individual .fade-in elements)
     ------------------------------------------------------- */
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 200px 0px' });

  document.querySelectorAll('.fade-in, .entrance').forEach(el => fadeObserver.observe(el));

  // Scroll-driven slide-in-left — position tied to scroll, reversible
  (function() {
    const els = document.querySelectorAll('.slide-in-left');
    if (!els.length) return;
    function update() {
      const vh = window.innerHeight;
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        // progress 0 = element just entering bottom, 1 = element at 40% from top
        const start = vh;
        const end = vh * 0.4;
        const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
        const eased = 1 - Math.pow(1 - progress, 3);
        el.style.transform = 'translateX(' + (-100 + eased * 100) + '%)';
        el.style.opacity = eased;
      });
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  })();


  // Bio walking squares — two squares tipping in place, back to back
  (function() {
    const bios = document.querySelectorAll('.edit-bio-inner');
    if (!bios.length) return;

    function drawRoundedRect(ctx, x, y, s, r) {
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.lineTo(x+s-r,y);
      ctx.quadraticCurveTo(x+s,y,x+s,y+r); ctx.lineTo(x+s,y+s-r);
      ctx.quadraticCurveTo(x+s,y+s,x+s-r,y+s); ctx.lineTo(x+r,y+s);
      ctx.quadraticCurveTo(x,y+s,x,y+s-r); ctx.lineTo(x,y+r);
      ctx.quadraticCurveTo(x,y,x+r,y);
      ctx.closePath(); ctx.fill();
    }

    const canvases = [];
    bios.forEach(bio => {
      const c = document.createElement('canvas');
      c.className = 'bio-dots-canvas';
      bio.appendChild(c);
      canvases.push(c);
    });

    const bigS = 48, smS = 36;

    let startTime = null;
    function render(time) {
      if (!startTime) startTime = time;
      const elapsed = (time - startTime) * 0.001;

      canvases.forEach(c => {
        const rect = c.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const dpr = window.devicePixelRatio || 1;
        const w = rect.width, h = rect.height;
        if (c.width !== Math.round(w*dpr) || c.height !== Math.round(h*dpr)) {
          c.width = Math.round(w*dpr);
          c.height = Math.round(h*dpr);
        }
        const ctx = c.getContext('2d');
        ctx.setTransform(dpr,0,0,dpr,0,0);
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = 'rgba(254,249,240,0.5)';

        const groundY = h * 0.55;
        const centerX = w * 0.5;

        // Big square — tips right from bottom-right corner, smooth continuous
        const bigAngle = Math.sin(elapsed * 0.8) * (Math.PI / 6);
        ctx.save();
        ctx.translate(centerX, groundY);
        ctx.rotate(bigAngle);
        drawRoundedRect(ctx, -bigS, -bigS, bigS, bigS * 0.15);
        ctx.restore();

        // Small square — tips left from bottom-left corner, slightly different speed
        const smAngle = Math.sin(elapsed * 1.1 + Math.PI) * (Math.PI / 6);
        ctx.save();
        ctx.translate(centerX, groundY);
        ctx.rotate(smAngle);
        drawRoundedRect(ctx, 0, -smS, smS, smS * 0.15);
        ctx.restore();
      });
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  })();

  /* -------------------------------------------------------
     7. SECTION REVEAL — sections animate in
     ------------------------------------------------------- */
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 200px 0px' });

  document.querySelectorAll('.reveal-section').forEach(el => sectionObserver.observe(el));


  /* -------------------------------------------------------
     8. STAGGERED CARD REVEALS
     ------------------------------------------------------- */
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.portfolio-item, .animate-item, .anim-item, .design-project, .photo-full, .photo-grid-3');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.style.transition = `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.06}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        });
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 200px 0px' });

  document.querySelectorAll('.portfolio-grid, .animate-grid, .photo-dark-section, .design-projects').forEach(el => cardObserver.observe(el));


  /* -------------------------------------------------------
     9. SCROLL HINT FADE
     ------------------------------------------------------- */
  let scrollHintHidden = false;
  window.addEventListener('scroll', () => {
    if (!scrollHintHidden && window.scrollY > 100) {
      const hint = document.querySelector('.scroll-hint');
      if (hint) {
        hint.style.opacity = '0';
        hint.style.transition = 'opacity 0.5s';
      }
      scrollHintHidden = true;
    }
  }, { passive: true });


  /* -------------------------------------------------------
     10. HEADER SCROLL EFFECT
     ------------------------------------------------------- */
  const header = document.querySelector('.site-header');

  if (header) {
    const onHeaderScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }


  /* -------------------------------------------------------
     11. MOBILE HAMBURGER MENU
     ------------------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.mobile-nav-overlay a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!document.body.classList.contains('menu-open')) return;
      const overlay = document.querySelector('.mobile-nav-overlay');
      if (overlay && !overlay.contains(e.target) && !hamburger.contains(e.target)) {
        document.body.classList.remove('menu-open');
      }
    });
  }


  /* -------------------------------------------------------
     12. PHOTO LIGHTBOX
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

    const hasMultiple = currentGallery.length > 1;
    lightboxPrev.style.display = hasMultiple ? '' : 'none';
    lightboxNext.style.display = hasMultiple ? '' : 'none';
  }

  function showLightboxImage() {
    if (!lightboxImg || !currentGallery.length) return;
    const trigger = currentGallery[currentIndex];
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

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      e.preventDefault();
      openLightbox(trigger);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });


  /* -------------------------------------------------------
     13. PROJECT POPUP MODAL
     ------------------------------------------------------- */
  (function() {
    let modalOverlay = null;

    function buildModal() {
      if (modalOverlay) return;
      modalOverlay = document.createElement('div');
      modalOverlay.className = 'project-modal-overlay';
      modalOverlay.innerHTML = `
        <div class="project-modal">
          <button class="project-modal-close" aria-label="Close">&times;</button>
          <div class="project-modal-body"></div>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      modalOverlay.querySelector('.project-modal-close').addEventListener('click', closeModal);
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    function closeModal() {
      if (!modalOverlay) return;
      // Stop any playing videos
      modalOverlay.querySelectorAll('iframe').forEach(f => { f.src = ''; });
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function openModal(href) {
      buildModal();
      const body = modalOverlay.querySelector('.project-modal-body');
      body.innerHTML = '<p style="text-align:center;padding:40px;opacity:0.5;">Loading...</p>';
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      fetch(href)
        .then(r => r.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const detail = doc.querySelector('.project-detail');
          if (detail) {
            body.innerHTML = detail.innerHTML;
          } else {
            // Fallback: show main content
            const main = doc.querySelector('main');
            body.innerHTML = main ? main.innerHTML : '<p style="text-align:center;padding:40px;">Content not available.</p>';
          }
          // Wrap title + subtitle into a side-by-side row
          const title = body.querySelector('.project-title');
          const subtitle = body.querySelector('.project-subtitle');
          if (title && subtitle) {
            const row = document.createElement('div');
            row.className = 'project-header-row';
            title.parentNode.insertBefore(row, title);
            row.appendChild(title);
            row.appendChild(subtitle);
          }
          // Scroll modal to top
          modalOverlay.querySelector('.project-modal').scrollTop = 0;
        })
        .catch(() => {
          body.innerHTML = '<p style="text-align:center;padding:40px;">Could not load content.</p>';
        });
    }

    // Intercept portfolio item clicks
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.portfolio-item a, a.portfolio-item');
      if (!item) return;
      const href = item.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      e.preventDefault();
      openModal(href);
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  })();


  /* -------------------------------------------------------
     14. ACTIVE NAV LINK
     ------------------------------------------------------- */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('.main-nav a, .mobile-nav-overlay a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

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
     14. SMOOTH SCROLL FOR ANCHOR LINKS
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
      history.pushState(null, '', targetId);
    }
  });


  /* -------------------------------------------------------
     15. CONTACT FORM
     ------------------------------------------------------- */
  document.querySelectorAll('.service-checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('checked');
      const input = cb.querySelector('input[type="checkbox"]');
      if (input) input.checked = cb.classList.contains('checked');
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const required = contactForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach(field => {
        field.classList.remove('error');
        const value = field.value.trim();
        if (!value) { valid = false; field.classList.add('error'); }
        if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          valid = false; field.classList.add('error');
        }
      });

      if (!valid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('.submit-btn');
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const body = {
          access_key: '0f45da86-7dcf-4c66-8881-d7597d02d720',
          subject: 'New message from pietsuess.com',
          from_name: formData.get('name'),
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || '',
          services: formData.getAll('services').join(', ') || 'None selected',
          message: formData.get('message')
        };

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();

        if (data.success) {
          const thankYou = document.createElement('div');
          thankYou.className = 'form-thank-you';
          thankYou.textContent = 'Thank you! Your message has been sent.';
          contactForm.style.display = 'none';
          contactForm.parentNode.insertBefore(thankYou, contactForm.nextSibling);
        } else {
          submitBtn.textContent = 'Error — try again';
          submitBtn.disabled = false;
        }
      } catch (err) {
        submitBtn.textContent = 'Error — try again';
        submitBtn.disabled = false;
      }
    });

    contactForm.addEventListener('input', (e) => {
      if (e.target.classList.contains('error')) {
        e.target.classList.remove('error');
      }
    });
  }


  /* -------------------------------------------------------
     16. BACK TO TOP
     ------------------------------------------------------- */
  (function() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 18000);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();


  /* -------------------------------------------------------
     17. ROLE TICKER — cycles through disciplines
     ------------------------------------------------------- */
  (function() {
    const ticker = document.getElementById('roleTicker');
    if (!ticker) return;

    const words = ticker.querySelectorAll('.role-word');
    if (words.length < 2) return;

    let current = 0;

    setInterval(() => {
      words[current].classList.remove('active');
      words[current].classList.add('exit');

      const prev = current;
      current = (current + 1) % words.length;
      words[current].classList.add('active');

      setTimeout(() => {
        words[prev].classList.remove('exit');
      }, 600);
    }, 2200);
  })();


  /* -------------------------------------------------------
     17. PARTICLE SYSTEM — ambient floating particles
     ------------------------------------------------------- */
  (function() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Colours from the palette
    const colors = [
      'rgba(244,197,66,',   // gold
      'rgba(232,115,90,',   // coral
      'rgba(212,84,122,',   // rose
      'rgba(184,61,142,',   // magenta
      'rgba(254,249,240,',  // cream
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.08;
            ctx.strokeStyle = `rgba(254,249,240,${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();
  })();

  /* -------------------------------------------------------
     DESIGN PARTICLES — black swirling dots
     ------------------------------------------------------- */
  (function() {
    const canvas = document.getElementById('designParticles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h;
    const dots = [];
    const DOT_COUNT = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < DOT_COUNT; i++) {
      // Depth: 0 = far background, 1 = foreground
      const depth = Math.random();
      dots.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        r: 0.5 + depth * 2.5,
        alpha: 0.3 + depth * 0.7,
        depth: depth,
        // Orbital motion — deeper dots orbit slower
        cx: Math.random() * 2000,
        cy: Math.random() * 2000,
        orbitR: 20 + depth * 100,
        orbitSpeed: (Math.random() - 0.5) * (0.003 + depth * 0.012),
        angle: Math.random() * Math.PI * 2,
        // Drift — deeper dots drift faster
        driftX: (Math.random() - 0.5) * (0.05 + depth * 0.3),
        driftY: (Math.random() - 0.5) * (0.05 + depth * 0.3),
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const scrollY = window.scrollY || 0;

      for (const d of dots) {
        d.angle += d.orbitSpeed;
        d.cx += d.driftX;
        d.cy += d.driftY;

        // Wrap drift
        if (d.cx < -100) d.cx = w + 100;
        if (d.cx > w + 100) d.cx = -100;
        if (d.cy < -100) d.cy = h + 100;
        if (d.cy > h + 100) d.cy = -100;

        const screenX = d.cx + Math.cos(d.angle) * d.orbitR;
        // Parallax: foreground dots scroll faster than background
        const parallax = 0.02 + d.depth * 0.15;
        const screenY = d.cy + Math.sin(d.angle) * d.orbitR - scrollY * parallax;

        // Wrap vertically with scroll
        const drawY = ((screenY % h) + h) % h;

        ctx.beginPath();
        ctx.arc(screenX, drawY, d.r, 0, Math.PI * 2);
        // Dark dots for light backgrounds, white for dark
        const isDark = document.body.classList.contains('design-page');
        ctx.fillStyle = isDark ? `rgba(0,0,0,${d.alpha})` : `rgba(255,255,255,${d.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();
  })();


  /* -------------------------------------------------------
     WALKING SQUARES — scroll-driven along grid edges
     Uses proven horizontal walk logic, rotated 90° for vertical.
     Edit: right face, left edge (body on grid), walking down
     Direct: left face, right edge (body on grid), walking down
     ------------------------------------------------------- */
  (function() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;

    const page = location.pathname;
    const isEdit = page.includes('edit');
    const isDirect = page.includes('direct');
    if (!isEdit && !isDirect) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:10;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const walkers = [
      { size: 48, speed: 1.2, offset: 0 },
      { size: 38, speed: 0.9, offset: 400 },
    ];

    // Exact horizontal walk function from working test3
    function walkSquare(ctx, lineX, lineY, lineLen, size, dist, side) {
      const totalLen = lineLen;
      const rawDist = ((dist % totalLen) + totalLen) % totalLen;

      const steps = rawDist / size;
      const stepIdx = Math.floor(steps);
      const frac = steps - stepIdx;

      // Gravity easing
      const eased = frac < 0.5
        ? 0.5 * Math.pow(frac * 2, 0.7)
        : 1 - 0.5 * Math.pow((1 - frac) * 2, 0.7);
      const tipAngle = eased * (Math.PI / 2);

      // Pivot = leading corner on the ground line
      const pivotX = lineX + ((stepIdx + 1) * size) % totalLen;

      ctx.save();
      ctx.translate(pivotX, lineY);
      ctx.rotate(tipAngle);

      // Draw square: bottom-right corner at origin
      const s = size;
      const r = s * 0.15;
      const yOff = side === 'above' ? -s : 0;
      const x = -s;
      const y = yOff;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + s - r, y);
      ctx.quadraticCurveTo(x + s, y, x + s, y + r);
      ctx.lineTo(x + s, y + s - r);
      ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
      ctx.lineTo(x + r, y + s);
      ctx.quadraticCurveTo(x, y + s, x, y + s - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function render() {
      const dpr = window.devicePixelRatio || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (canvas.width !== Math.round(vw * dpr) || canvas.height !== Math.round(vh * dpr)) {
        canvas.width = Math.round(vw * dpr);
        canvas.height = Math.round(vh * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      // Use first thumbnail's edge, not the grid container (which has padding)
      const firstItem = grid.querySelector('.portfolio-item');
      if (!firstItem) { requestAnimationFrame(render); return; }
      const ir = firstItem.getBoundingClientRect();
      const gr = grid.getBoundingClientRect();

      const scrollY = window.scrollY || 0;
      const totalLen = gr.height;

      // Get thumbnail edges
      const allItems = grid.querySelectorAll('.portfolio-item');
      const lastInRow = allItems.length > 1 ? allItems[1] : allItems[0];
      const thumbLeft = ir.left;
      const thumbRight = lastInRow.getBoundingClientRect().right;

      ctx.fillStyle = 'rgba(255,255,255,0.5)';

      if (isEdit) {
        // EDIT PAGE:
        // Big box: right face, walking down, left edge of thumbnails
        ctx.save();
        ctx.translate(thumbLeft, gr.top);
        ctx.scale(-1, 1);
        ctx.rotate(Math.PI / 2);
        walkSquare(ctx, 0, 0, totalLen, 48, scrollY * 1.2, 'above');
        ctx.restore();

        // Small box: left face, walking down, left screen edge
        ctx.save();
        ctx.translate(0, gr.top);
        ctx.rotate(Math.PI / 2);
        walkSquare(ctx, 0, 0, totalLen, 38, scrollY * 0.9 + 400, 'above');
        ctx.restore();

      } else {
        // DIRECT PAGE:
        // Big box: left face, walking down, right edge of thumbnails
        ctx.save();
        ctx.translate(thumbRight, gr.top);
        ctx.rotate(Math.PI / 2);
        walkSquare(ctx, 0, 0, totalLen, 48, scrollY * 1.2, 'above');
        ctx.restore();

        // Small box: right face, walking up, right screen edge
        ctx.save();
        ctx.translate(vw, gr.top);
        ctx.scale(-1, 1);
        ctx.rotate(Math.PI / 2);
        walkSquare(ctx, 0, 0, totalLen, 38, scrollY * 0.9 + 400, 'above');
        ctx.restore();
      }
      requestAnimationFrame(render);
    }

    render();
  })();


  /* -------------------------------------------------------
     FULLSCREEN TOGGLE — persists across page navigation
     ------------------------------------------------------- */
  const fsBtn = document.querySelector('.fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  /* -------------------------------------------------------
     ARCADE ICON — slides top-right to bottom-right while fading
     ------------------------------------------------------- */
  (function() {
    const arcade = document.querySelector('.arcade-link');
    if (!arcade) return;

    // Max travel = viewport height minus icon height minus top/bottom margins
    const maxTravel = () => window.innerHeight - arcade.offsetHeight - 40;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;

          if (docHeight <= 0) { arcade.style.opacity = '0.6'; ticking = false; return; }

          const scrollPct = Math.min(1, scrollY / docHeight);

          // Slide from top to bottom
          const slideY = scrollPct * maxTravel();
          arcade.style.transform = `translateY(${slideY}px)`;

          // Fade: visible at top, fade out through middle, fade back in at bottom
          let opacity;
          if (scrollPct < 0.05) {
            opacity = 0.6;
          } else if (scrollPct < 0.15) {
            opacity = 0.6 * (1 - (scrollPct - 0.05) / 0.10);
          } else if (scrollPct < 0.85) {
            opacity = 0;
          } else if (scrollPct < 0.95) {
            opacity = 0.6 * ((scrollPct - 0.85) / 0.10);
          } else {
            opacity = 0.6;
          }

          arcade.style.opacity = String(opacity);
          arcade.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
          ticking = false;
        });
        ticking = true;
      }
    });
  })();

  /* -------------------------------------------------------
     WEBSITE ANALYTICS — sends to same Google Sheet as Navigator
     Tracks: page views, nav clicks, project popups, social clicks,
     scroll depth, arcade link, fullscreen, contact form, time on page
     ------------------------------------------------------- */
  (function() {
    const ANALYTICS_URL = 'https://script.google.com/macros/s/AKfycbxQcS_M7eZe3ob69qbxaH3QDUUqDQGvec6BKDN94wildC5p3LGTSwytm_2ZyutpznB4/exec';
    const session = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    const pageLoadTime = Date.now();
    const page = location.pathname.split('/').pop() || 'index.html';
    let maxScroll = 0;
    let actions = [];

    // Geo lookup
    let geo = { ip:'', city:'', region:'', country:'' };
    try {
      fetch('https://api.db-ip.com/v2/free/self').then(r=>r.json()).then(d=>{
        geo.ip = d.ipAddress || '';
        geo.city = d.city || '';
        geo.region = d.stateProv || '';
        geo.country = d.countryName || '';
      }).catch(()=>{});
    } catch(e){}

    function track(action) {
      if (actions.length < 100) actions.push(action);
    }

    function payload(event) {
      return {
        game: 'WEBSITE',
        session: session,
        event: event,
        zone: page,
        timePlayed: Math.round((Date.now() - pageLoadTime) / 1000),
        actions: actions.join(';'),
        score: maxScroll,
        userAgent: navigator.userAgent.slice(0, 120),
        ip: geo.ip,
        city: geo.city,
        region: geo.region,
        country: geo.country
      };
    }

    function send(event) {
      try { navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(payload(event))); } catch(e){}
    }

    // Page view
    send('pageview');

    // Track scroll depth
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) maxScroll = Math.max(maxScroll, Math.round((window.scrollY / docH) * 100));
    }, { passive: true });

    // Nav clicks
    document.querySelectorAll('.main-nav a, .mobile-nav-overlay a').forEach(a => {
      a.addEventListener('click', () => track('nav:' + (a.textContent.trim())));
    });

    // Social icon clicks
    document.querySelectorAll('.social-icons a').forEach(a => {
      a.addEventListener('click', () => track('social:' + (a.getAttribute('aria-label') || 'link')));
    });

    // Project popup clicks
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.portfolio-item a, a.portfolio-item');
      if (item) track('project:' + (item.getAttribute('href') || '').replace(/.*\//, '').replace('.html',''));
    });

    // Design lightbox clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.lightbox-trigger')) track('lightbox:' + (e.target.alt || 'image'));
    });

    // Arcade link click
    const arcadeEl = document.querySelector('.arcade-link');
    if (arcadeEl) arcadeEl.addEventListener('click', () => track('arcade-click'));

    // Fullscreen button
    const fsBtn = document.querySelector('.fullscreen-btn');
    if (fsBtn) fsBtn.addEventListener('click', () => track('fullscreen'));

    // Back to top
    const btt = document.querySelector('.back-to-top');
    if (btt) btt.addEventListener('click', () => track('back-to-top'));

    // Contact form submit
    const form = document.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const services = data.getAll('services').join(',');
        track('contact-submit:' + services);
        // Send form data to sheet
        const formPayload = payload('contact');
        formPayload.contactName = data.get('name') || '';
        formPayload.contactEmail = data.get('email') || '';
        formPayload.contactPhone = data.get('phone') || '';
        formPayload.contactServices = services;
        formPayload.contactMessage = data.get('message') || '';
        try {
          navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(formPayload));
        } catch(ex){}
        // Show confirmation
        form.innerHTML = '<p style="text-align:center;padding:40px;font-size:18px;">Thank you! I\'ll be in touch soon.</p>';
      });
    }

    // Send final data on page leave
    window.addEventListener('beforeunload', () => send('leave'));

    // Heartbeat every 30s
    setInterval(() => send('heartbeat'), 30000);
  })();

});
