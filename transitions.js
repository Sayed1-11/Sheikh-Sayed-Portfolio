/* =========================================
   TRANSITIONS.JS — Curved Curtain Logic
   ========================================= */

(function () {
  'use strict';

  // Create the transition element if it doesn't exist
  function createTransitionOverlay() {
    if (document.querySelector('.transition-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'transition-overlay';
    overlay.id = 'transition-overlay';

    // SVG with a path that we can animate
    overlay.innerHTML = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path id="transition-path" d="M 0 100 V 0 Q 50 -25 100 0 V 100 z" />
      </svg>
      <div class="transition-text" id="transition-text"></div>
    `;

    document.body.prepend(overlay);
    return overlay;
  }

  const overlay = createTransitionOverlay();
  const path = document.getElementById('transition-path');
  const transitionText = document.getElementById('transition-text');

  // Animation settings
  const duration = 1000; // ms
  const easing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // custom cubic ease

  let isAnimating = false;

  /**
   * Animates the SVG path
   * @param {string} targetPath - The 'd' attribute value to animate to
   * @param {number} animDuration - Duration in ms
   * @returns {Promise}
   */
  function animatePath(targetPath, animDuration) {
    return new Promise((resolve) => {
      const startPath = path.getAttribute('d');
      const startTime = performance.now();

      function getInterpolatedPath(progress) {


        const startValues = startPath.match(/M 0 ([\d.-]+) V ([\d.-]+) Q 50 ([\d.-]+) 100 ([\d.-]+) V ([\d.-]+)/);
        const endValues = targetPath.match(/M 0 ([\d.-]+) V ([\d.-]+) Q 50 ([\d.-]+) 100 ([\d.-]+) V ([\d.-]+)/);

        if (!startValues || !endValues) return targetPath;

        const vals = [];
        for (let i = 1; i <= 6; i++) {
          const s = parseFloat(startValues[i]);
          const e = parseFloat(endValues[i]);
          vals.push(s + (e - s) * progress);
        }

        return `M 0 ${vals[0]} V ${vals[1]} Q 50 ${vals[2]} 100 ${vals[3]} V ${vals[4]} z`;
      }

      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / animDuration, 3);
        const easedProgress = easing(progress);

        path.setAttribute('d', getInterpolatedPath(easedProgress));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(step);
    });
  }

  /**
   * Reveal Page (Curtain goes UP and away)
   */
  async function revealPage() {
    if (isAnimating) return;
    isAnimating = true;

    overlay.style.pointerEvents = 'none';
    overlay.classList.remove('is-hidden');
    
    if (transitionText) {
      const pageTitle = document.title.split('—')[0].trim();
      transitionText.textContent = pageTitle;
      // Start at center, then move UP as curtain leaves
      transitionText.className = 'transition-text is-entering';
    }

    // Start state: Covered
    path.setAttribute('d', 'M 0 100 V 0 Q 50 -25 100 0 V 100 z');

    // Slight delay before lifting
    await new Promise(r => setTimeout(r, 100));

    if (transitionText) {
      transitionText.classList.remove('is-entering');
      transitionText.classList.add('is-exiting');
    }

    // Animate to exit at the top
    await animatePath('M 0 0 V -100 Q 50 -100 100 -100 V 0 z', duration * 0.7);

    overlay.classList.add('is-hidden');
    isAnimating = false;
    
    // Reset text state for next use
    setTimeout(() => {
      if (transitionText) transitionText.className = 'transition-text';
    }, 500);
  }

  /**
   * Leave Page (Curtain comes FROM BOTTOM up to cover)
   */
  async function leavePage(url, label) {
    if (isAnimating) return;
    isAnimating = true;

    overlay.style.pointerEvents = 'all';
    overlay.classList.remove('is-hidden');

    if (transitionText && label) {
      transitionText.textContent = label;
      // Start below center and move to center
      transitionText.className = 'transition-text pre-enter';
      // Force reflow
      transitionText.offsetHeight;
      transitionText.classList.remove('pre-enter');
      transitionText.classList.add('is-entering');
    }

    // Start state: Hidden at bottom
    path.setAttribute('d', 'M 0 200 V 200 Q 50 200 100 200 V 200 z');

    // Step 1: Curve up fast to cover the screen
    if (window.lenis) window.lenis.stop();
    await animatePath('M 0 100 V 0 Q 50 -25 100 0 V 100 z', duration * 0.8);

    window.location.href = url;
  }

  // Intercept links
  function initLinks() {
    const links = document.querySelectorAll('a[href]:not([href^="#"]):not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"])');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      link.addEventListener('click', (e) => {
        if (href === window.location.pathname.split('/').pop()) return;
        
        let label = link.textContent.trim();
        // If it's the logo or an icon, use a fallback
        if (!label || label.includes('©')) label = 'Loading';

        e.preventDefault();
        leavePage(href, label);
      });
    });
  }

  // On Load
  window.addEventListener('DOMContentLoaded', () => {
    initLinks();

    // If there is a loader on this page (home page), skip curtain reveal
    const loader = document.getElementById('loader');
    if (loader) {
      overlay.classList.add('is-hidden');
    } else {
      revealPage();
    }
  });

  // Handle back/forward button (BF Cache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      const loader = document.getElementById('loader');
      if (!loader) {
        revealPage();
      } else {
        overlay.classList.add('is-hidden');
      }
    }
  });

})();
