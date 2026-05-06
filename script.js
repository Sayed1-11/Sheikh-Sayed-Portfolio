/* =========================================
   SHEIKH SAYED PORTFOLIO — script.js
   ========================================= */

(function () {
  'use strict';

  /* ------------------------------------------
     1. LOADER
  ------------------------------------------ */
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loader-fill');
  let progress = 0;
  let loaderDone = false;

  const loadInterval = setInterval(() => {
    progress += Math.random() * 15 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadInterval);
      fill.style.width = '100%';
    }
    fill.style.width = progress + '%';
  }, 100);

  // Hide loader after greetings complete (1.8s) + small buffer
  setTimeout(() => {
    if (!loaderDone && loader) {
      loader.classList.add('hidden');
      loaderDone = true;
      if (window.observeReveal) window.observeReveal();
      if (revealObserver) {
        revealObserver.observe(document.body.querySelectorAll('.reveal')[0] || document.body);
      }
    }
  }, 2200);


  /* ------------------------------------------
     4. SMOOTH SCROLL for anchor links (Lenis)
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      if (window.lenis) {
        window.lenis.scrollTo(target, {
          offset: 0,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------
     5. MARQUEE — duplicate items for seamless loop
  ------------------------------------------ */
  const marqueeTrack = document.getElementById('marquee-track');
  if (marqueeTrack) {
    const clone = marqueeTrack.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    marqueeTrack.parentElement.appendChild(clone);
  }

  /* ------------------------------------------
     8. LOCAL TIME in footer
  ------------------------------------------ */
  function updateTime() {
    const timeEl = document.getElementById('local-time') || document.getElementById('local-time-contact');
    if (!timeEl) return;
    const now = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    timeEl.textContent = now.toLocaleTimeString('en-US', opts);
  }
  updateTime();
  setInterval(updateTime, 60000);

  /* ------------------------------------------
     7. SCROLL REVEAL
  ------------------------------------------ */
  let revealObserver;

  window.observeReveal = function () {
    const revealEls = document.querySelectorAll('.reveal');
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------
     13. GALLERY CAROUSEL — Liquid Scroll-Based Motion
  ------------------------------------------ */
  const gallerySection = document.querySelector('.gallery');
  const workMoreWrap = document.querySelector('.work-more-wrap');
  const footer = document.querySelector('.footer');
  const galleryRow1 = document.querySelector('.gallery-row-1');
  const galleryRow2 = document.querySelector('.gallery-row-2');

  if (galleryRow1 && galleryRow2 && gallerySection && workMoreWrap && footer) {
    function calculateGalleryBounds() {
      const viewportWidth = gallerySection.offsetWidth;
      const row1Width = galleryRow1.offsetWidth;
      const row2Width = galleryRow2.offsetWidth;
      
      // Start rows perfectly centered relative to their own widths
      const offset1 = -(row1Width - viewportWidth) / 2;
      const offset2 = -(row2Width - viewportWidth) / 2;
      
      return { offset1, offset2, viewportWidth };
    }

    let bounds = calculateGalleryBounds();
    let currentX = 0;
    let targetX = 0;
    const lerpFactor = 0.1; // Smooth liquid damping

    function updateGallery() {
      const moreWrapRect = workMoreWrap.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const galleryRect = gallerySection.getBoundingClientRect();

      const hasReachedMoreWrap = moreWrapRect.top < window.innerHeight;
      const hasReachedFooter = footerRect.top < window.innerHeight;
      const isVisible = galleryRect.top < window.innerHeight && galleryRect.bottom > 0;

      // Update the target position based on scroll, but only within the active zone
      if (hasReachedMoreWrap && !hasReachedFooter && isVisible) {
        const viewportCenterY = window.innerHeight / 2;
        const galleryCenterY = galleryRect.top + galleryRect.height / 2;

        // Multiplier for a dynamic and premium parallax feel (1.2x)
        targetX = (viewportCenterY - galleryCenterY) * 1.2;
      }

      // Liquid smoothing — calculates the "glide" effect
      currentX += (targetX - currentX) * lerpFactor;

      // Apply hardware-accelerated transforms in opposite directions
      // Row 1 slides Left, Row 2 slides Right
      galleryRow1.style.transform = `translate3d(${bounds.offset1 - currentX}px, 0, 0)`;
      galleryRow2.style.transform = `translate3d(${bounds.offset2 + currentX}px, 0, 0)`;

      requestAnimationFrame(updateGallery);
    }

    // Start the constant animation engine
    requestAnimationFrame(updateGallery);

    window.addEventListener('resize', () => {
      bounds = calculateGalleryBounds();
    });
  }

  // Initial reveal call
  if (window.observeReveal) window.observeReveal();

})();