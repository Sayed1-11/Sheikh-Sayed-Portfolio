/* =========================================
   PAGES.JS — Shared JS for Work, About, Contact
   ========================================= */

(function () {
  'use strict';

  /* ------------------------------------------
     1. LENIS SMOOTH SCROLL INITIALIZATION
  ------------------------------------------ */
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    wheelMultiplier: 1.1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);


  /* ------------------------------------------
     2. MOBILE MENU
  ------------------------------------------ */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  let menuOpen = false;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      menuOpen = !menuOpen;
      menuBtn.classList.toggle('open', menuOpen);
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
    mobileLinks.forEach(link => link.addEventListener('click', () => {
      menuOpen = false;
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ------------------------------------------
     3. SIDEBAR & FLOATING BUTTON LOGIC
  ------------------------------------------ */
  const sidebar = document.getElementById('sidebar');
  const sidebarMenuBtn = document.getElementById('sidebar-menu-btn');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const sidebarPath = document.getElementById('sidebar-path');
  let sidebarOpen = false;

  // SVG Path states for the curved sidebar effect
  const pathInitial = 'M100,0 L100,1000 L100,1000 C100,1000 100,500 100,0 L100,0 Z';
  const pathCurve = 'M100,0 L100,1000 L0,1000 C0,1000 100,500 0,0 L100,0 Z';

  let isScrolling = false;
  function handleScroll() {
    if (!sidebarMenuBtn) return;

    // Show/hide floating button based on scroll
    const triggerPoint = 100;
    if (window.scrollY > triggerPoint) {
      if (!sidebarMenuBtn.classList.contains('visible')) {
        sidebarMenuBtn.classList.add('visible');
      }
    } else {
      if (sidebarMenuBtn.classList.contains('visible')) {
        sidebarMenuBtn.classList.remove('visible');
        if (sidebarOpen) closeSidebar();
      }
    }
    isScrolling = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScroll);
      isScrolling = true;
    }
  }, { passive: true });

  if (sidebarMenuBtn) sidebarMenuBtn.addEventListener('click', toggleSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  function toggleSidebar() {
    sidebarOpen ? closeSidebar() : openSidebar();
  }

  function openSidebar() {
    sidebarOpen = true;
    sidebar.classList.add('open');
    if (sidebarMenuBtn) sidebarMenuBtn.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (sidebarPath) {
      sidebarPath.setAttribute('d', pathCurve);
      setTimeout(() => {
        sidebarPath.style.transition = 'd 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
        sidebarPath.setAttribute('d', pathInitial);
      }, 10);
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.remove('open');
    if (sidebarMenuBtn) sidebarMenuBtn.classList.remove('open');
    document.body.style.overflow = '';

    if (sidebarPath) {
      sidebarPath.style.transition = 'd 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
      sidebarPath.setAttribute('d', pathCurve);
      setTimeout(() => {
        sidebarPath.style.transition = 'none';
        sidebarPath.setAttribute('d', pathInitial);
      }, 800);
    }
  }

  // Close when clicking a link
  if (sidebar) {
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });
  }

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarOpen) closeSidebar();
  });

  // MAGNETIC EFFECT for floating button
  function initMagneticFAB() {
    if (!sidebarMenuBtn) return;

    sidebarMenuBtn.addEventListener('mousemove', (e) => {
      const rect = sidebarMenuBtn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      sidebarMenuBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
    });

    sidebarMenuBtn.addEventListener('mouseleave', () => {
      sidebarMenuBtn.style.transform = '';
    });
  }
  initMagneticFAB();

  const heroGlobe = document.getElementById('hero-globe');
  if (heroGlobe) {
    magneticButton(heroGlobe);
  }

  // Apply to Contact Page elements
  const formSubmit = document.getElementById('form-submit');

  // Note: magneticButton helper is defined later in the file and applied to relevant elements there.

  /* ------------------------------------------
     4. LOCAL TIME
   ------------------------------------------ */
  function updateTime() {
    const timeEl = document.getElementById('local-time');
    const timeEl2 = document.getElementById('local-time-contact');
    const opts = { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    const timeStr = new Date().toLocaleTimeString('en-US', opts);
    if (timeEl) timeEl.textContent = timeStr;
    if (timeEl2) timeEl2.textContent = timeStr;
  }
  updateTime();
  setInterval(updateTime, 60000);

  /* ------------------------------------------
     5. SCROLL REVEAL
  ------------------------------------------ */
  function observeReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => obs.observe(el));
  }

  // Add reveal class to elements
  const revealSelectors = [
    '.page-title', '.page-subtitle', '.project-item',
    '.bio-headline', '.bio-body', '.stat-item',
    '.service-row', '.timeline-item', '.stack-item',
    '.about-big-title', '.contact-big-title',
    '.contact-info-item', '.social-big-item',
    '.form-group', '.footer-heading',
    '.about-massive-title', '.about-intro-text', '.service-massive-item',
    '.parallax-item'
  ];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 4) el.classList.add(`reveal-delay-${Math.min(i + 1, 3)}`);
    });
  });
  observeReveal();

  /* ------------------------------------------
     6. WORK PAGE & HOME — DYNAMIC RENDERING
  ------------------------------------------ */
  let PROJECTS_DATA = [];
  let projectKeys = [];

  async function initProjects() {
    console.log('Initializing projects...');
    try {
      const response = await fetch('projects.json');
      console.log('Project data fetched:', response.status);
      PROJECTS_DATA = await response.json();
      projectKeys = PROJECTS_DATA.map(p => p.id);

      renderProjectLists();
      loadProjectDetails();
      initHomeGallery(); // Now called here
      initWorkHover();
      if (window.observeReveal) window.observeReveal();
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback or alert for local file access issues
      if (window.location.protocol === 'file:') {
        alert('Local project loading failed. Please run this site through a local server (e.g., Live Server) to see projects.');
      }
    }
  }

  function renderProjectLists() {
    const homeWorkList = document.querySelector('.work-list'); // Older style (if any left)
    const homeMassiveGrid = document.getElementById('home-project-list'); // New Massive Home
    const workPageGrid = document.querySelector('.project-list-massive:not(#home-project-list)'); // Work Page

    if (homeWorkList) {
      homeWorkList.innerHTML = '';
      PROJECTS_DATA.slice(0, 5).forEach((project, index) => {
        const item = document.createElement('a');
        item.href = `project-detail.html?id=${project.id}`;
        item.className = 'work-item reveal';
        item.setAttribute('data-color', project.color);
        item.setAttribute('data-image', project.gallery?.[0] || '');
        item.innerHTML = `
          <div class="work-item-left">
            <span class="work-num">0${index + 1}</span>
            <h2 class="work-title">${project.title}</h2>
          </div>
          <span class="work-tag">${project.role}</span>
        `;
        homeWorkList.appendChild(item);
      });
    }

    if (homeMassiveGrid) {
      homeMassiveGrid.innerHTML = '';
      PROJECTS_DATA.slice(0, 5).forEach(project => {
        const item = document.createElement('article');
        item.className = 'project-item-massive reveal';
        item.setAttribute('data-color', project.color);
        item.setAttribute('data-image', project.gallery?.[0] || '');
        item.innerHTML = `
          <a href="project-detail.html?id=${project.id}" class="project-massive-link">
            <div class="project-massive-left">
              <h2 class="project-massive-name">${project.title}</h2>
            </div>
            <div class="project-massive-right">
              <span class="project-massive-cat">${project.role}</span>
              <span class="project-massive-year">${project.year}</span>
            </div>
          </a>
        `;
        homeMassiveGrid.appendChild(item);
      });
    }

    if (workPageGrid) {
      workPageGrid.innerHTML = '';
      PROJECTS_DATA.forEach(project => {
        const item = document.createElement('article');
        item.className = 'project-item-massive reveal';
        item.setAttribute('data-category', project.category);
        item.setAttribute('data-color', project.color);
        item.setAttribute('data-image', project.gallery?.[0] || '');
        item.innerHTML = `
          <a href="project-detail.html?id=${project.id}" class="project-massive-link">
            <div class="project-massive-left">
              <h2 class="project-massive-name">${project.title}</h2>
            </div>
            <div class="project-massive-right">
              <span class="project-massive-cat">${project.role}</span>
              <span class="project-massive-year">${project.year}</span>
            </div>
          </a>
        `;
        workPageGrid.appendChild(item);
      });
      initFilterLogic();
    }
  }

  function initWorkHover() {
    const projectItems = document.querySelectorAll('.work-item, .project-item-massive');
    const workHoverContainer = document.getElementById('work-hover-container') || document.querySelector('.work-hover-container');
    const hoverImagesWrap = document.querySelector('.work-hover-images');

    if (!workHoverContainer || !hoverImagesWrap || !projectItems.length) return;

    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let targetScale = 0.3;
    let currentScale = 0.3;
    let currentIndex = -1;
    let currentReelY = 0;

    // Create REEL structure (vertical stack of images)
    hoverImagesWrap.innerHTML = '';
    const reel = document.createElement('div');
    reel.className = 'work-hover-reel';
    hoverImagesWrap.appendChild(reel);

    PROJECTS_DATA.forEach(data => {
      const imgDiv = document.createElement('div');
      imgDiv.className = 'work-hover-image';

      const imgInner = document.createElement('div');
      imgInner.className = 'work-hover-image-inner';

      const firstImg = data.gallery?.[0];
      if (firstImg && !firstImg.includes('linear-gradient') && !firstImg.startsWith('#')) {
        imgInner.style.backgroundImage = `url("${firstImg}")`;
        imgInner.style.backgroundSize = 'contain';
        imgInner.style.backgroundRepeat = 'no-repeat';
        imgInner.style.backgroundPosition = 'center';
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'work-placeholder';
        placeholder.style.background = firstImg || `linear-gradient(135deg, ${data.color} 0%, #1a1a1a 100%)`;
        placeholder.innerHTML = `<span>${data.title}</span>`;
        imgInner.appendChild(placeholder);
      }

      imgDiv.appendChild(imgInner);
      reel.appendChild(imgDiv);
    });

    const workHoverBtn = document.querySelector('.work-hover-btn');

    // Smooth Lerp loop control
    if (window.workHoverLoop) cancelAnimationFrame(window.workHoverLoop);

    function tick() {
      // 1. Container follow mouse (Faster Lerp)
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      // 2. Scale in/out (Faster Lerp)
      targetScale = currentIndex !== -1 ? 1 : 0.3;
      currentScale += (targetScale - currentScale) * 0.25;

      // 3. Reel vertical slide (Snappier Liquid Lerp)
      const targetReelY = currentIndex !== -1 ? currentIndex * 100 : currentReelY;
      currentReelY += (targetReelY - currentReelY) * 0.25;

      const transformStr = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale})`;
      workHoverContainer.style.transform = transformStr;

      // Vertical translation of the reel
      reel.style.transform = `translate3d(0, -${currentReelY}%, 0)`;

      window.workHoverLoop = requestAnimationFrame(tick);
    }
    window.workHoverLoop = requestAnimationFrame(tick);

    // Track mouse
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    projectItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        workHoverContainer.classList.add('visible');
        currentIndex = index;

        const title = item.querySelector('.work-title, .project-massive-name');
        if (title) title.style.color = PROJECTS_DATA[index].color;

        // Dynamic background color for the frame
        if (hoverImagesWrap) hoverImagesWrap.style.backgroundColor = PROJECTS_DATA[index].color;
      });

      item.addEventListener('mouseleave', () => {
        const title = item.querySelector('.work-title, .project-massive-name');
        if (title) title.style.color = '';
      });
    });

    // Hide when leaving the lists
    const lists = document.querySelectorAll('.work-list, .project-list-massive');
    lists.forEach(list => {
      list.addEventListener('mouseleave', () => {
        workHoverContainer.classList.remove('visible');
        currentIndex = -1;
        if (hoverImagesWrap) hoverImagesWrap.style.backgroundColor = '';
      });
    });
  }

  function initFilterLogic() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item-massive');

    if (filterBtns.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const filter = btn.getAttribute('data-filter');
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          projectItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
              item.style.display = 'block';
              item.style.animation = 'fadeIn 0.4s ease forwards';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }
  }

  /* ------------------------------------------
     NEW: HOME GALLERY POPULATION
     Populates the gallery section with the 1st image of every project
  ------------------------------------------ */
  function initHomeGallery() {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection || !PROJECTS_DATA.length) return;

    const galleryRow1 = gallerySection.querySelector('.gallery-row-1');
    const galleryRow2 = gallerySection.querySelector('.gallery-row-2');
    
    if (!galleryRow1 || !galleryRow2) return;

    // Clear existing static items
    galleryRow1.innerHTML = '';
    galleryRow2.innerHTML = '';

    const mid = Math.ceil(PROJECTS_DATA.length / 2);
    const row1Count = mid;
    const row2Count = PROJECTS_DATA.length - mid;

    // Adjust grid columns and width to accommodate all projects without squashing
    // Base: 4 items = 120% width. So ~30% per item.
    galleryRow1.style.gridTemplateColumns = `repeat(${row1Count}, 1fr)`;
    galleryRow1.style.width = `${row1Count * 30}%`;
    galleryRow1.style.minWidth = `${row1Count * 385}px`;

    galleryRow2.style.gridTemplateColumns = `repeat(${row2Count}, 1fr)`;
    galleryRow2.style.width = `${row2Count * 30}%`;
    galleryRow2.style.minWidth = `${row2Count * 385}px`;

    PROJECTS_DATA.forEach((project, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      
      const img = document.createElement('div');
      img.className = 'gallery-img';
      
      const asset = project.gallery?.[0];
      
      if (asset && !asset.includes('linear-gradient') && !asset.startsWith('#')) {
        img.style.backgroundImage = `url("${asset}")`;
        img.style.backgroundSize = 'cover';
        img.style.backgroundPosition = 'center';
      } else {
        img.style.background = asset || project.color || 'var(--accent-color)';
      }

      item.appendChild(img);
      
      // Make it interactive
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        window.location.href = `project-detail.html?id=${project.id}`;
      });

      // Distribute to rows
      if (index < mid) {
        galleryRow1.appendChild(item);
      } else {
        galleryRow2.appendChild(item);
      }
    });
  }

  /* ------------------------------------------
     7. ABOUT PAGE — Duplicate marquees
  ------------------------------------------ */
  const aboutMarquee = document.getElementById('about-marquee');
  if (aboutMarquee) {
    const clone = aboutMarquee.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    aboutMarquee.parentElement.appendChild(clone);
  }

  const stackMarquee = document.getElementById('stack-marquee');
  if (stackMarquee) {
    const clone = stackMarquee.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    stackMarquee.parentElement.appendChild(clone);
  }

  /* ------------------------------------------
     11. DYNAMIC PROJECT DETAILS
  ------------------------------------------ */
  function loadProjectDetails() {
    if (!document.body.classList.contains('page-project-detail')) return;

    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id') || 'ecommerce';
    const project = PROJECTS_DATA.find(p => p.id === projectId);

    if (!project) return;

    // Update Meta Title
    document.title = `${project.title} — Sheikh Sayed`;

    // Populate Hero
    const titleEl = document.querySelector('.project-detail-title');
    const categoryEl = document.querySelector('.project-hero-category');
    const heroImgEl = document.querySelector('.project-hero-image');
    
    if (titleEl) titleEl.textContent = project.title;
    if (categoryEl) categoryEl.textContent = project.category;
    
    const firstImg = project.gallery?.[0];
    if (heroImgEl) {
      if (firstImg && !firstImg.includes('linear-gradient') && !firstImg.startsWith('#')) {
        heroImgEl.style.backgroundImage = `url("${firstImg}")`;
        heroImgEl.style.backgroundSize = 'cover';
        heroImgEl.style.backgroundPosition = 'center';
        
        const placeholder = heroImgEl.querySelector('.img-placeholder-text');
        if (placeholder) placeholder.style.display = 'none';
      } else {
        heroImgEl.style.background = project.heroColor;
      }
    }

    // Populate Metadata
    const metaLabels = {
      'ROLE': project.role,
      'SERVICES': project.services,
      'YEAR': project.year,
      'LOCATION': project.location
    };
    document.querySelectorAll('.metadata-item').forEach(item => {
      const label = item.querySelector('.meta-label').textContent;
      if (metaLabels[label]) {
        item.querySelector('.meta-val').textContent = metaLabels[label];
      }
    });

    // Populate Intro
    const introHeadingEl = document.querySelector('.intro-heading');
    const introTextEl = document.querySelector('.intro-text');
    if (introHeadingEl) introHeadingEl.innerHTML = project.heading;
    if (introTextEl) introTextEl.textContent = project.description;

    // Populate Gallery
    const galleryItems = document.querySelectorAll('.parallax-img');
    project.gallery.forEach((bg, index) => {
      if (galleryItems[index]) {
        if (bg.includes('linear-gradient') || bg.startsWith('#')) {
          galleryItems[index].style.background = bg;
        } else {
          galleryItems[index].style.backgroundImage = `url("${bg}")`;
          galleryItems[index].style.backgroundSize = 'cover';
          galleryItems[index].style.backgroundPosition = 'center';
        }
        const textPlaceholder = galleryItems[index].querySelector('.img-placeholder-text');
        if (textPlaceholder) textPlaceholder.style.display = 'none';
      }
    });

    // Handle Next Case
    const currentIndex = projectKeys.indexOf(projectId);
    const nextIndex = projectKeys.length > 0 ? (currentIndex + 1) % projectKeys.length : -1;

    if (nextIndex !== -1) {
      const nextProjectId = projectKeys[nextIndex];
      const nextProject = PROJECTS_DATA.find(p => p.id === nextProjectId);

      if (nextProject) {
        const nextTitleEl = document.querySelector('.next-case-title');
        const nextLinkEl = document.querySelector('.next-case-link');
        if (nextTitleEl) nextTitleEl.textContent = nextProject.title;
        if (nextLinkEl) nextLinkEl.href = `project-detail.html?id=${nextProjectId}`;
      }
    }

    // Re-apply magnetic to dynamic visit button
    const visitBtn = document.getElementById('visit-btn');
    if (visitBtn) magneticButton(visitBtn);

  }

  /* ------------------------------------------
     HELPER: MAGNETIC BUTTONS
  ------------------------------------------ */
  function magneticButton(el) {
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.76,0,0.24,1)';
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'transform 0.1s'; });
  }

  // Initial magnetic applications
  document.querySelectorAll('.magnetic, .circle-btn, #hero-globe, .get-in-touch-btn').forEach(magneticButton);

  /* ------------------------------------------
     CONTACT FORM
  ------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const successEl = document.getElementById('form-success');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // 1. Validation Check (checks 'required' fields)
      if (!form.checkValidity()) {
        form.reportValidity(); // Shows native browser tooltips for missing fields
        return; // Stop submission
      }

      const submitBtn = document.getElementById('form-submit');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        // Optional: change text to "Sending..."
        const btnText = submitBtn.querySelector('.submit-text');
        if (btnText) btnText.textContent = 'Sending...';
      }

      try {
        const formData = new FormData(form);
        const actionUrl = form.getAttribute('action');

        // Only fetch if a real action URL is provided
        if (actionUrl && !actionUrl.includes('YOUR_FORM_ID') && actionUrl !== '') {
          const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (!response.ok) throw new Error('Submission failed');
        } else {
          // Simulated delay if no real endpoint is configured yet
          console.warn('Form action is set to a placeholder. Simulating submission.');
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 2. Hide inputs and show success message
        const elementsToHide = form.querySelectorAll('.form-step, .form-footer');
        elementsToHide.forEach(el => el.style.display = 'none');
        
        if (successEl) {
          successEl.classList.add('visible');
        }
      } catch (error) {
        alert("Oops! There was a problem submitting your form. Please check your action URL.");
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          const btnText = submitBtn.querySelector('.submit-text');
          if (btnText) btnText.textContent = 'Send it!';
        }
      }
    });
  }

  // Start the engine
  window.addEventListener('DOMContentLoaded', () => {
    initProjects();
  });

})();
