/**
 * PROBUILD DIGITAL SOLUTIONS - INTERACTIVE LOGIC & ANIMATIONS
 * Modern Agency Web Experience
 */

// Prevent unwanted horizontal scroll drift
window.addEventListener('scroll', () => {
  if (window.scrollX !== 0) {
    window.scrollTo(0, window.scrollY);
  }
}, { passive: true });

/* ==========================================================================
   0. LIGHT THEME CONTROLLER (PERMANENT DAY MODE)
   ========================================================================== */
function initTheme() {
  localStorage.removeItem('probuild-theme');
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
}

window.toggleTheme = function() {
  // Night mode permanently disabled
  document.body.classList.remove('dark-theme');
  document.body.classList.add('light-theme');
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAmbientCanvas();
  initNavbar();
  initOdometerCounters();
  initHeroGrowthSuite();
  initVideoShowreel();
  init3DTilt();
  initPortfolioFilters();
  initFaqAccordion();
  initBeforeAfterSlider();
  initSocialProofToast();
  initAnalyticsTracking();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND CANVAS ANIMATION (HIGH INTENSITY WHITE DOTS)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    // Update and draw particles in elegant subtle ambient style
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 55, 69, ${p.opacity * 0.35})`;
      ctx.fill();

      // Connect nearby particles with subtle lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(37, 55, 69, ${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. NAVBAR & MOBILE DRAWER LOGIC (Squarespace Sticky Header & Scrollspy)
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const overlay = document.getElementById('drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const navItems = document.querySelectorAll('.nav-menu .nav-item');
  const sections = document.querySelectorAll('section[id]');

  // Sticky navbar: stays transparent until hero section is fully scrolled past
  const heroSection = document.getElementById('hero');
  function handleScroll() {
    if (header) {
      // Use hero section height as scroll threshold - navbar turns white only AFTER hero is gone
      const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
      const scrollThreshold = heroHeight - 72; // subtract navbar height
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scrollspy for active nav item
    let currentSectionId = '';
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Mobile Drawer Services Accordion
  const drawerServicesToggle = document.getElementById('drawer-services-toggle');
  const drawerServicesCollapse = document.getElementById('drawer-services-collapse');
  if (drawerServicesToggle && drawerServicesCollapse) {
    drawerServicesToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = drawerServicesToggle.getAttribute('aria-expanded') === 'true';
      drawerServicesToggle.setAttribute('aria-expanded', !isExpanded);
      drawerServicesToggle.classList.toggle('active');
      drawerServicesCollapse.classList.toggle('open');
    });
  }

  // Close drawer on sublink click
  const drawerSublinks = document.querySelectorAll('.drawer-sublink');
  drawerSublinks.forEach(sublink => {
    sublink.addEventListener('click', closeDrawer);
  });

  // Desktop Mega Menu Keyboard & Click Controller
  const navDropdown = document.querySelector('.nav-item-dropdown');
  const navServicesTrigger = document.getElementById('nav-services-trigger');
  const desktopMegaMenu = document.getElementById('nav-mega-menu');

  if (navDropdown && navServicesTrigger && desktopMegaMenu) {
    navServicesTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        navDropdown.classList.toggle('is-open');
        const isOpen = navDropdown.classList.contains('is-open');
        navServicesTrigger.setAttribute('aria-expanded', isOpen);
        if (isOpen) {
          const firstLink = desktopMegaMenu.querySelector('.mega-menu-item');
          if (firstLink) firstLink.focus();
        }
      }
    });

    navDropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        navDropdown.classList.remove('is-open');
        navServicesTrigger.setAttribute('aria-expanded', 'false');
        navServicesTrigger.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('is-open');
        navServicesTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

}

/* ==========================================================================
   3. ODOMETER NUMBER COUNTERS (INTERSECTION OBSERVER)
   ========================================================================== */
function initOdometerCounters() {
  const counters = document.querySelectorAll('.odometer-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetValue = parseFloat(counter.getAttribute('data-target'));
        const isDecimal = targetValue % 1 !== 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = targetValue * easeProgress;

          counter.textContent = isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = isDecimal ? targetValue.toFixed(1) : targetValue;
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   4. INTERACTIVE 3D TILT EFFECT
   ========================================================================== */
function init3DTilt() {
  const heroCard = document.querySelector('.hero-glass-card');
  const tiltCards = document.querySelectorAll('[data-tilt]');

  if (heroCard && window.innerWidth > 860) {
    heroCard.parentElement.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 7;
      const rotateY = (x / (rect.width / 2)) * 7;

      heroCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    heroCard.parentElement.addEventListener('mouseleave', () => {
      heroCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      heroCard.style.transition = 'transform 0.5s ease';
    });

    heroCard.parentElement.addEventListener('mouseenter', () => {
      heroCard.style.transition = 'none';
    });
  } else if (heroCard) {
    heroCard.style.transform = 'none';
  }

  // Tilt effect for cards on desktop
  if (window.innerWidth > 992) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateX = -(y / (rect.height / 2)) * 5;
        const rotateY = (x / (rect.width / 2)) * 5;
        card.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) translateY(0) rotateX(0) rotateY(0)';
      });
    });
  }
}

/* ==========================================================================
   5. PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'cardAppear 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Keyframes helper for card filter
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes cardAppear {
  from { opacity: 0; transform: translateY(15px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}`;
document.head.appendChild(styleSheet);

/* ==========================================================================
   6. INTERACTIVE GROWTH & REVENUE CALCULATOR
   ========================================================================== */
function initCalculator() {
  const slider = document.getElementById('budget-slider');
  const budgetDisplay = document.getElementById('budget-display');
  const modelBtns = document.querySelectorAll('.model-btn');
  
  const revOutput = document.getElementById('calc-revenue');
  const roasOutput = document.getElementById('calc-roas');
  const leadsOutput = document.getElementById('calc-leads');
  const tierOutput = document.getElementById('calc-tier');

  if (!slider) return;

  let currentMultiplier = 5.2;
  let orderAvgTicket = 850;

  function updateCalculations() {
    const budget = parseInt(slider.value, 10);
    budgetDisplay.textContent = formatINR(budget);

    // Calculate revenue
    const projectedRevenue = Math.round(budget * currentMultiplier);
    revOutput.textContent = formatINR(projectedRevenue);
    roasOutput.textContent = `${currentMultiplier.toFixed(1)}x`;

    // Calculate orders / leads
    const estOrders = Math.round(projectedRevenue / orderAvgTicket);
    leadsOutput.textContent = `${estOrders.toLocaleString('en-IN')}+`;

    // Recommend tier
    if (budget < 35000) {
      tierOutput.textContent = 'START-UP';
      tierOutput.style.color = '#38bdf8';
    } else if (budget <= 120000) {
      tierOutput.textContent = 'GROWTH ENGINE';
      tierOutput.style.color = '#00f2fe';
    } else {
      tierOutput.textContent = 'DOMINANCE';
      tierOutput.style.color = '#a855f7';
    }
  }

  slider.addEventListener('input', updateCalculations);

  modelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const model = btn.getAttribute('data-model');
      if (model === 'ecommerce') {
        currentMultiplier = 5.2;
        orderAvgTicket = 950;
      } else if (model === 'service') {
        currentMultiplier = 4.6;
        orderAvgTicket = 2800;
      } else if (model === 'saas') {
        currentMultiplier = 5.8;
        orderAvgTicket = 4500;
      }
      updateCalculations();
    });
  });

  updateCalculations();
}

function formatINR(number) {
  return '₹' + number.toLocaleString('en-IN');
}

/* ==========================================================================
   7. FAQ ACCORDION LOGIC
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));

      // If wasn't active, activate it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   9. CASE STUDY MODAL DATA & CONTROLLER
   ========================================================================== */
const caseStudiesData = {
  'lifto': {
    title: 'Lifto — Smart Commuter Pooling Platform',
    client: 'Lifto Mobility Technologies',
    image: 'assets/images/platform-showcase.jpg',
    category: 'Full-Stack Web App & Mobility Architecture',
    overview: 'Daily commuters and college students in dense metropolitan hubs face unpredictable travel costs, scheduling friction, and safety verification issues. Lifto needed a verified platform to facilitate carpooling and shared commuter routes.',
    solution: 'ProBuild engineered a full-stack responsive web application with interactive map-based route planning, user profile verification, dynamic seat reservation logic, and direct WhatsApp trip coordination.',
    metrics: [
      { label: 'Route Lookup', value: '<0.4s' },
      { label: 'Verified Profiles', value: '100%' },
      { label: 'Responsive UI', value: 'Mobile-First' },
      { label: 'Architecture', value: 'Full-Stack' }
    ],
    techStack: ['React 19', 'Node.js', 'Express', 'Leaflet / Mapbox API', 'MongoDB Atlas', 'Tailwind CSS']
  },
  'fake-news': {
    title: 'Fake News Detection Engine (AI & NLP Verification)',
    client: 'AI & Data Science Research Lab',
    image: 'assets/images/probuild_tech_stack_showcase.jpg',
    category: 'Machine Learning & Natural Language Processing',
    overview: 'Digital misinformation spreads rapidly across online media. Manual verification cannot scale to evaluate thousands of articles, necessitating an automated, linguistically rigorous classification model.',
    solution: 'ProBuild engineered an end-to-end Machine Learning pipeline utilizing NLP feature extraction (TF-IDF, n-grams) and ensemble classification algorithms to evaluate linguistic veracity and detect deceptive patterns in real time.',
    metrics: [
      { label: 'Test Accuracy', value: '93.4%' },
      { label: 'Inference Speed', value: '<120ms' },
      { label: 'Precision Score', value: '92.8%' },
      { label: 'Model Type', value: 'NLP Ensemble' }
    ],
    techStack: ['Python 3.11', 'Scikit-Learn', 'Flask REST API', 'NLTK / SpaCy', 'React Frontend']
  },
  'rero': {
    title: 'RERO — Verified Accommodation Marketplace',
    client: 'RERO Living (Student PropTech)',
    image: 'assets/images/shop-ecommerce.jpg',
    category: 'Rental Marketplace & Student Accommodation',
    overview: 'Students relocating to educational hubs in Pune and Maharashtra face exorbitant broker commissions, fake room listings, and lack of verified property photos.',
    solution: 'ProBuild designed and developed a hyper-local room discovery platform featuring zero brokerage fees, radius-based search filters, verified photographic listings, and direct one-click WhatsApp landlord connections.',
    metrics: [
      { label: 'Brokerage Fee', value: '₹0 Zero' },
      { label: 'Verified Listings', value: '100%' },
      { label: 'Search Radius', value: '1-10 km' },
      { label: 'Direct Connect', value: '1-Click WA' }
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Cloudinary Media API', 'WhatsApp Business API']
  },
  'boutique-luxe': {
    title: 'Boutique Luxe Online Storefront',
    client: 'Boutique Luxe (Retail Fashion)',
    image: 'assets/images/ecommerce-showcase.jpg',
    category: 'High-Performance E-Commerce & WhatsApp Commerce',
    overview: 'A premier retail boutique wanted to expand online pan-India without paying exorbitant commission cuts to multi-brand e-commerce marketplaces.',
    solution: 'ProBuild launched a headless, mobile-first digital storefront with sub-second page loads, instant UPI checkout via Razorpay, dynamic catalog filters, and automated WhatsApp order confirmations.',
    metrics: [
      { label: 'Page Load Speed', value: '0.6s' },
      { label: 'Checkout Flow', value: '1-Tap UPI' },
      { label: 'Payment Gateway', value: 'Razorpay' },
      { label: 'Launch Time', value: '10 Days' }
    ],
    techStack: ['Next.js', 'Shopify Storefront API', 'Razorpay Gateway', 'WhatsApp Cloud API']
  },
  'nexus-ads': {
    title: 'Nexus Multi-Channel Performance Scaling (Meta + Google)',
    client: 'Nexus Media & Multi-Location Brand',
    image: 'assets/images/ads-showcase.jpg',
    category: 'Performance Marketing & Conversion Funnels',
    overview: 'Stagnant returns and rising customer acquisition costs due to post-iOS14 pixel tracking dropoffs and ad creative fatigue.',
    solution: 'ProBuild rebuilt their tracking architecture with Server-Side Conversions API (CAPI), launched high-converting multi-angle video ad campaigns, and structured high-intent Google Search and Performance Max funnels.',
    metrics: [
      { label: 'Blended ROAS', value: '4.6x' },
      { label: 'CAPI Event Match', value: '92%' },
      { label: 'Cost Per Lead', value: '-34% Lower' },
      { label: 'Reporting', value: 'Real-Time GA4' }
    ],
    techStack: ['Meta Ads Manager', 'Google Ads (Search & P-Max)', 'Server CAPI', 'Google Tag Manager', 'GA4']
  }
};

window.openCaseModal = function(caseId) {
  const data = caseStudiesData[caseId];
  if (!data) return;

  const modal = document.getElementById('case-study-modal');
  const content = document.getElementById('case-modal-content');

  content.innerHTML = `
    <div class="modal-case-header">
      <span class="category-pill" style="position: static; display: inline-block; margin-bottom: 0.8rem;">${data.category}</span>
      <h2 class="modal-case-title" style="font-size: 1.8rem; margin-bottom: 0.4rem;">${data.title}</h2>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;"><strong>Client:</strong> ${data.client}</p>
    </div>
    
    <div style="margin-bottom: 1.6rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--line);">
      <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 260px; object-fit: cover;">
    </div>

    <div class="case-modal-metrics-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.8rem; margin-bottom: 1.8rem; padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--line); text-align: center;">
      ${data.metrics.map(m => `
        <div>
          <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan);">${m.value}</div>
          <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">${m.label}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom: 1.4rem;">
      <h4 class="modal-section-title" style="font-size: 1.1rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-triangle-exclamation" style="color: #f59e0b; margin-right: 0.4rem;"></i> The Challenge</h4>
      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.65;">${data.overview}</p>
    </div>

    <div style="margin-bottom: 1.6rem;">
      <h4 class="modal-section-title" style="font-size: 1.1rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-cyan); margin-right: 0.4rem;"></i> The ProBuild Solution</h4>
      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.65;">${data.solution}</p>
    </div>

    <div style="margin-bottom: 2rem;">
      <h4 style="font-size: 0.82rem; font-family: var(--font-mono); color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.6rem;">Technologies Applied:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${data.techStack.map(t => `
          <span style="background: rgba(37, 99, 235, 0.08); border: 1px solid var(--line-strong); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.76rem; font-family: var(--font-mono); color: var(--accent-cyan);">${t}</span>
        `).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 1rem;">
      <a href="#contact" class="btn btn-primary btn-full glow-btn" onclick="closeCaseModal(); preselectService('${data.title}')">
        <span>Build Similar Solution For My Business</span>
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeCaseModal = function() {
  const modal = document.getElementById('case-study-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

window.openLegalNotice = function(type) {
  const modal = document.getElementById('legal-modal');
  const content = document.getElementById('legal-modal-content');
  if (!modal || !content) return;

  const notices = {
    privacy: {
      title: 'Privacy Policy',
      html: `
        <h3 id="legal-modal-title" style="margin-bottom: 0.85rem; color: #0B1020; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-shield-halved" style="color: #3867FF;"></i> Privacy Commitment
        </h3>
        <p style="color: #64748B; font-size: 0.90rem; line-height: 1.6; margin-bottom: 1rem;">
          At <strong>ProBuild Digital Solutions</strong> (Pune, Maharashtra, India), we hold client privacy, technical IP, and business data with strict institutional confidence.
        </p>
        <ul style="color: #334155; font-size: 0.86rem; line-height: 1.65; margin-bottom: 1.25rem; padding-left: 1.2rem;">
          <li><strong>Confidentiality:</strong> All shared project requirements, architecture diagrams, APIs, credentials, and customer datasets are kept strictly confidential.</li>
          <li><strong>Information Usage:</strong> Contact details (name, phone, email) submitted through our scoping forms are used exclusively to prepare customized roadmaps and quotes.</li>
          <li><strong>Zero Third-Party Sharing:</strong> We never sell, lease, or monetize your contact information or project data to third-party data brokers or marketing lists.</li>
        </ul>
        <p style="color: #64748B; font-size: 0.82rem; margin: 0;">Direct inquiries: <a href="mailto:contact@probuilddigital.co" style="color: #3867FF; font-weight: 700;">contact@probuilddigital.co</a> &bull; +91 92842 48444</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      html: `
        <h3 id="legal-modal-title" style="margin-bottom: 0.85rem; color: #0B1020; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-file-contract" style="color: #3867FF;"></i> Terms of Service
        </h3>
        <p style="color: #64748B; font-size: 0.90rem; line-height: 1.6; margin-bottom: 1rem;">
          Every digital project, custom web platform, and performance growth sprint executed by ProBuild is governed by clear, milestone-driven Service Level Agreements.
        </p>
        <ul style="color: #334155; font-size: 0.86rem; line-height: 1.65; margin-bottom: 1.25rem; padding-left: 1.2rem;">
          <li><strong>Scope Alignment:</strong> Project development commences only after milestone schedules, sprint deliverables, and pricing scopes are approved in writing.</li>
          <li><strong>Intellectual Property:</strong> Following milestone completion and settlement, all custom source code, brand assets, and creative deliverables become 100% client property.</li>
          <li><strong>Transparency & Reporting:</strong> Active clients receive weekly progress reports, staging previews, and direct access to their assigned technical strategist.</li>
        </ul>
        <p style="color: #64748B; font-size: 0.82rem; margin: 0;">Official inquiries: <a href="mailto:contact@probuilddigital.co" style="color: #3867FF; font-weight: 700;">contact@probuilddigital.co</a> &bull; +91 92842 48444</p>
      `
    },
    security: {
      title: 'Security Standards',
      html: `
        <h3 id="legal-modal-title" style="margin-bottom: 0.85rem; color: #0B1020; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-lock" style="color: #3867FF;"></i> Security Architecture
        </h3>
        <p style="color: #64748B; font-size: 0.90rem; line-height: 1.6; margin-bottom: 1rem;">
          ProBuild engineers platforms according to modern, enterprise-grade cloud security best practices:
        </p>
        <ul style="color: #334155; font-size: 0.86rem; line-height: 1.65; margin-bottom: 1.25rem; padding-left: 1.2rem;">
          <li><strong>End-to-End Encryption:</strong> Automated SSL/TLS 1.3 certificates enforced on all domains with strict HSTS policies.</li>
          <li><strong>OWASP Hardened:</strong> Sanitized form submissions, CSRF tokens, secure headers (nosniff, SAMEORIGIN, X-XSS), and rate limiting.</li>
          <li><strong>Compliant Gateways:</strong> Integration with verified PCI-DSS compliant payment gateways (Razorpay, Stripe) with zero plain-text card storage.</li>
        </ul>
        <p style="color: #64748B; font-size: 0.82rem; margin: 0;">Security team: <a href="mailto:contact@probuilddigital.co" style="color: #3867FF; font-weight: 700;">contact@probuilddigital.co</a></p>
      `
    }
  };

  const notice = notices[type] || notices.privacy;
  content.innerHTML = notice.html;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeLegalNotice = function() {
  const modal = document.getElementById('legal-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
};

/* ==========================================================================
   9b. CUSTOM QUOTATION MODAL & SERVICES FILTER CONTROLLER
   ========================================================================== */
window.filterServices = function(category) {
  const tabs = document.querySelectorAll('.service-cat-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-cat') === category) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-service-cat');
    if (category === 'all' || cat === category) {
      card.style.display = 'flex';
      card.style.animation = 'cardAppear 0.35s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
};

window.openQuotationModal = function(preselectedService) {
  const modal = document.getElementById('quotation-modal');
  if (!modal) return;

  // Reset to step 1
  window.goToQuoteStep(1);

  if (preselectedService) {
    const checkboxes = modal.querySelectorAll('input[name="qservices"]');
    checkboxes.forEach(cb => {
      const match = cb.value.toLowerCase().includes(preselectedService.toLowerCase()) ||
                    preselectedService.toLowerCase().includes(cb.value.toLowerCase());
      if (match) {
        cb.checked = true;
        const parentCard = cb.closest('.quote-service-checkbox-card');
        if (parentCard) parentCard.classList.add('selected');
      }
    });
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeQuotationModal = function() {
  const modal = document.getElementById('quotation-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Aliases for backwards compatibility
window.openMetaAdsModal = function() {
  window.openQuotationModal('Digital Marketing & Growth');
};
window.closeMetaAdsModal = function() {
  window.closeQuotationModal();
};
window.selectMetaPackage = function(packageName) {
  window.closeQuotationModal();
  window.openQuotationModal(packageName);
};
window.selectPackage = function(packageName) {
  window.openQuotationModal(packageName);
};
window.openProposalModal = function(service) {
  window.openQuotationModal(service);
};

window.goToQuoteStep = function(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById(`qstep-tab-${i}`);
    const view = document.getElementById(`quote-step-${i}`);
    if (tab) {
      if (i < stepNum) {
        tab.classList.add('completed');
        tab.classList.remove('active');
      } else if (i === stepNum) {
        tab.classList.add('active');
        tab.classList.remove('completed');
      } else {
        tab.classList.remove('active', 'completed');
      }
    }
    if (view) {
      if (i === stepNum) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    }
  }

  if (stepNum === 4) {
    updateQuoteReviewCard();
  }
};

window.toggleServiceOption = function(cardEl) {
  const cb = cardEl.querySelector('input[type="checkbox"]');
  if (cb) {
    setTimeout(() => {
      if (cb.checked) {
        cardEl.classList.add('selected');
      } else {
        cardEl.classList.remove('selected');
      }
    }, 10);
  }
};

function updateQuoteReviewCard() {
  const checkedServices = [];
  document.querySelectorAll('input[name="qservices"]:checked').forEach(cb => {
    checkedServices.push(cb.value);
  });
  const selectedStage = document.querySelector('input[name="qstage"]:checked');
  const selectedTimeline = document.querySelector('input[name="qtimeline"]:checked');
  const selectedBudget = document.querySelector('input[name="qbudget"]:checked');

  const sReview = document.getElementById('qreview-services');
  const stageReview = document.getElementById('qreview-stage');
  const tbReview = document.getElementById('qreview-timeline-budget');

  if (sReview) {
    sReview.textContent = checkedServices.length > 0 ? checkedServices.join(', ') : 'Custom Scope';
  }
  if (stageReview && selectedStage) {
    stageReview.textContent = selectedStage.value;
  }
  if (tbReview && selectedTimeline && selectedBudget) {
    tbReview.textContent = `${selectedTimeline.value} • ${selectedBudget.value}`;
  }
}

window.handleQuoteSubmit = function(event) {
  event.preventDefault();

  const name = document.getElementById('q-name').value.trim();
  const phone = document.getElementById('q-phone').value.trim();
  const email = document.getElementById('q-email').value.trim();
  const notes = document.getElementById('q-notes').value.trim();

  const checkedServices = [];
  document.querySelectorAll('input[name="qservices"]:checked').forEach(cb => {
    checkedServices.push(cb.value);
  });
  const stage = document.querySelector('input[name="qstage"]:checked')?.value || 'Custom Scope';
  const timeline = document.querySelector('input[name="qtimeline"]:checked')?.value || 'Flexible';
  const budget = document.querySelector('input[name="qbudget"]:checked')?.value || 'Milestone Based';

  const submitBtn = document.getElementById('q-submit-btn');
  const originalHtml = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp fa-bounce"></i> Opening WhatsApp...`;

  const waLines = [
    `*⚡ CUSTOM PROJECT INQUIRY — PROBUILD DIGITAL*`,
    ``,
    `👤 *Client / Brand:* ${name}`,
    `📞 *Phone / WhatsApp:* ${phone}`,
    `📧 *Email:* ${email}`,
    `🛠️ *Capabilities:* ${checkedServices.join(', ') || 'Custom'}`,
    `📌 *Stage:* ${stage}`,
    `⏱️ *Target Timeline:* ${timeline}`,
    `💰 *Budget Scope:* ${budget}`,
    `📝 *Brief Notes:* ${notes || 'N/A'}`
  ];

  const encodedMsg = encodeURIComponent(waLines.join('\n'));
  const waUrl = `https://wa.me/919284248444?text=${encodedMsg}`;

  try {
    const inquiries = JSON.parse(localStorage.getItem('probuild_custom_quotes') || '[]');
    inquiries.push({ name, phone, email, services: checkedServices, stage, timeline, budget, notes, time: new Date().toLocaleString() });
    localStorage.setItem('probuild_custom_quotes', JSON.stringify(inquiries));
  } catch (err) {}

  // Record verified lead event in GA4 (Strictly Non-PII)
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'Lead Generation',
      event_label: 'Custom Project Proposal Modal',
      lead_source: 'quotation_modal',
      project_stage: stage,
      timeline_target: timeline,
      budget_range: budget,
      services_selected: checkedServices.join(', ') || 'Custom'
    });
  }

  if (typeof showToast === 'function') {
    showToast(`🚀 Connecting directly to ProBuild WhatsApp, ${name}!`);
  }

  setTimeout(() => {
    const newTab = window.open(waUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      window.location.href = waUrl;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Redirected to WhatsApp!`;

    setTimeout(() => {
      submitBtn.innerHTML = originalHtml;
      window.closeQuotationModal();
      document.getElementById('modal-quotation-form').reset();
    }, 2500);
  }, 400);
};

window.scrollToSection = function(sectionId) {
  const sec = document.getElementById(sectionId);
  if (sec) {
    sec.scrollIntoView({ behavior: 'smooth' });
  }
};

// Close modals on outside backdrop click
document.addEventListener('click', (e) => {
  const caseModal = document.getElementById('case-study-modal');
  if (caseModal && e.target === caseModal) {
    window.closeCaseModal();
  }
  const quoteModal = document.getElementById('quotation-modal');
  if (quoteModal && e.target === quoteModal) {
    window.closeQuotationModal();
  }
  const legalModal = document.getElementById('legal-modal');
  if (legalModal && e.target === legalModal) {
    window.closeLegalNotice();
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCaseModal();
    window.closeQuotationModal();
    window.closeLegalNotice();
  }
});

/* ==========================================================================
   10. PROPOSAL PRESELECTION & ACTIONS
   ========================================================================== */
window.preselectService = function(serviceName) {
  const serviceSelect = document.getElementById('service-required');
  if (!serviceSelect) return;

  for (let i = 0; i < serviceSelect.options.length; i++) {
    if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) || 
        serviceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
      serviceSelect.selectedIndex = i;
      break;
    }
  }

  const contactSec = document.getElementById('contact');
  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ==========================================================================
   11. FORM SUBMISSION SIMULATION & TOAST NOTIFICATION
   ========================================================================== */
window.handleFormSubmit = function(event) {
  event.preventDefault();

  const name = document.getElementById('client-name').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const service = document.getElementById('service-required').value;
  const budget = document.getElementById('client-budget').value;
  const message = document.getElementById('client-message').value.trim();

  const submitBtn = document.getElementById('submit-btn');
  const originalText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-brands fa-whatsapp fa-bounce"></i> Opening WhatsApp...`;

  // Structured inquiry message with all client details
  const waLines = [
    `*⚡ NEW STRATEGY INQUIRY — PROBUILD DIGITAL*`,
    ``,
    `👤 *Client / Brand:* ${name}`,
    `📞 *Phone / WhatsApp:* ${phone}`,
    `📧 *Email:* ${email}`,
    `🎯 *Service Required:* ${service}`,
    `💰 *Budget Range:* ${budget}`,
    `📝 *Business Details:* ${message || 'N/A'}`
  ];
  const encodedMsg = encodeURIComponent(waLines.join('\n'));
  const waUrl = `https://wa.me/919284248444?text=${encodedMsg}`;

  // Save safety backup copy in browser localStorage
  try {
    const leads = JSON.parse(localStorage.getItem('probuild_leads') || '[]');
    leads.push({ name, phone, email, service, budget, message, time: new Date().toLocaleString() });
    localStorage.setItem('probuild_leads', JSON.stringify(leads));
  } catch (err) {
    /* ignore storage errors */
  }

  // Record verified lead event in GA4 (Strictly Non-PII)
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'Lead Generation',
      event_label: 'Contact Strategy Proposal Form',
      lead_source: 'contact_form',
      service_required: service || 'General Scoping',
      budget_range: budget || 'Not Specified'
    });
  }

  showToast(`🚀 Connecting directly to ProBuild WhatsApp with your plan, ${name}!`);

  // Direct Auto-Open to WhatsApp without prompt
  setTimeout(() => {
    const newTab = window.open(waUrl, '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
      window.location.href = waUrl;
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Redirected to WhatsApp!`;
    document.getElementById('probuild-contact-form').reset();

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
    }, 4000);
  }, 450);
};

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-cyan); font-size: 1.1rem;"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* ==========================================================================
   GROWTH SUITE INTERACTIVE DASHBOARD ENGINE (Hero Pillar Showcase)
   ========================================================================== */
function initHeroGrowthSuite() {
  const tiltCard = document.getElementById('hero-tilt-card');
  const tabs = document.querySelectorAll('.suite-tab');
  const screens = document.querySelectorAll('.suite-screen');
  if (!tabs.length || !screens.length) return;

  const suites = ['ads', 'web', 'social', 'nfc'];
  let currentIndex = 0;
  let isPaused = false;
  let autoTimer = null;

  window.switchSuiteTab = function(suiteId, tabBtn) {
    const targetScreen = document.getElementById('pane-' + suiteId);
    if (!targetScreen) return;

    // Update active tab button
    tabs.forEach(btn => btn.classList.remove('active'));
    if (tabBtn) {
      tabBtn.classList.add('active');
    } else {
      const matchingBtn = document.querySelector(`.suite-tab[data-suite="${suiteId}"]`);
      if (matchingBtn) matchingBtn.classList.add('active');
    }

    // Update active screen
    screens.forEach(screen => screen.classList.remove('active'));
    targetScreen.classList.add('active');

    // Update current index for auto rotation
    const idx = suites.indexOf(suiteId);
    if (idx !== -1) currentIndex = idx;

    // Trigger animations depending on selected pane
    if (suiteId === 'ads') {
      const cyanWave = document.getElementById('wave-line-cyan');
      const violetWave = document.getElementById('wave-line-violet');
      if (cyanWave) {
        cyanWave.style.animation = 'none';
        void cyanWave.offsetWidth;
        cyanWave.style.animation = 'drawWaveLine 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
      }
      if (violetWave) {
        violetWave.style.animation = 'none';
        void violetWave.offsetWidth;
        violetWave.style.animation = 'drawWaveLine 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s forwards';
      }
    } else if (suiteId === 'web') {
      const bars = targetScreen.querySelectorAll('.stage-bar-fill');
      bars.forEach(bar => {
        const cls = bar.className;
        bar.style.width = '0%';
        setTimeout(() => {
          if (cls.includes('fill-100')) bar.style.width = '100%';
          else if (cls.includes('fill-65')) bar.style.width = '65%';
          else if (cls.includes('fill-35')) bar.style.width = '35%';
        }, 50);
      });
    }
  };

  // Auto-cycle tabs every 4.8s unless user is interacting
  function startAutoCycle() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      if (!isPaused) {
        currentIndex = (currentIndex + 1) % suites.length;
        window.switchSuiteTab(suites[currentIndex]);
      }
    }, 4800);
  }

  if (tiltCard) {
    tiltCard.addEventListener('mouseenter', () => { isPaused = true; });
    tiltCard.addEventListener('mouseleave', () => { isPaused = false; });
  }

  startAutoCycle();

  // Dynamic live activity ticker rotation for the Ads Engine
  const adsTickerFeed = document.getElementById('ads-live-feed');
  if (adsTickerFeed) {
    const tickerUpdates = [
      '⚡ Lead Generated: 3BHK Real Estate Enquiry (Meta Ads • Just now)',
      '📈 ROAS Spike: Luxury Fashion Brand hit 6.8x ROAS on Instagram Reels',
      '🎯 Dental Clinic Booking: ₹142 CPL on Google Search Ads (4m ago)',
      '🚀 High-Intent Lead: Interior Architecture ₹18 Lakhs (Google Ads • 9m ago)',
      '🛍️ E-Commerce Spike: 48 Instant Orders in last 25 minutes (Meta Ads)'
    ];
    let tickerIdx = 0;
    setInterval(() => {
      tickerIdx = (tickerIdx + 1) % tickerUpdates.length;
      adsTickerFeed.style.opacity = '0';
      setTimeout(() => {
        adsTickerFeed.textContent = tickerUpdates[tickerIdx];
        adsTickerFeed.style.opacity = '1';
      }, 250);
    }, 4200);
  }
}

/* ==========================================================================
   CINEMATIC VIDEO SHOWREEL ENGINE (Why Brands Choose ProBuild)
   ========================================================================== */
function initVideoShowreel() {
  const container = document.getElementById('video-showreel');
  if (!container) return;

  const scenes = document.querySelectorAll('.video-scene');
  const chapterBtns = document.querySelectorAll('.chapter-btn');
  const toggleBtn = document.getElementById('video-toggle-btn');
  const playIcon = document.getElementById('video-play-icon');
  const progressFill = document.getElementById('video-progress-fill');
  const progressBar = document.getElementById('video-progress-bar');
  const currTimeDisplay = document.getElementById('video-curr-time');
  const timecodeTop = document.getElementById('video-timecode');

  const totalDuration = 24; // 24 seconds total (6s per scene across 4 scenes)
  const sceneCount = 4;
  const sceneDuration = totalDuration / sceneCount; // 6 seconds

  let currentTime = 0;
  let isPlaying = true;
  let timerInterval = null;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `00:${secs < 10 ? '0' : ''}${secs}`;
  }

  function activateScene(sceneNum) {
    scenes.forEach(s => s.classList.remove('active'));
    chapterBtns.forEach(b => b.classList.remove('active'));

    const targetScene = document.getElementById(`vscene-${sceneNum}`);
    const targetBtn = document.querySelector(`.chapter-btn[data-scene="${sceneNum}"]`);

    if (targetScene) targetScene.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');

    // Trigger scene-specific micro-animations
    if (sceneNum === 1) {
      const meterFill = document.querySelector('.fill-speed');
      if (meterFill) {
        meterFill.style.strokeDashoffset = '251';
        setTimeout(() => { meterFill.style.strokeDashoffset = '25'; }, 50);
      }
    } else if (sceneNum === 2) {
      const bars = document.querySelectorAll('.col-bar');
      bars.forEach(bar => {
        bar.style.transform = 'scaleY(0)';
        bar.style.transformOrigin = 'bottom';
        setTimeout(() => { bar.style.transform = 'scaleY(1)'; }, 60);
      });
    }
  }

  window.jumpToVideoScene = function(sceneNum) {
    currentTime = (sceneNum - 1) * sceneDuration;
    activateScene(sceneNum);
    updateTimeline();
  };

  function updateTimeline() {
    const progressPercent = (currentTime / totalDuration) * 100;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const formatted = formatTime(currentTime);
    if (currTimeDisplay) currTimeDisplay.textContent = formatted;
    if (timecodeTop) timecodeTop.textContent = formatted;

    const currentSceneIndex = Math.min(Math.floor(currentTime / sceneDuration) + 1, sceneCount);
    const activeSceneEl = document.querySelector('.video-scene.active');
    if (!activeSceneEl || parseInt(activeSceneEl.dataset.scene) !== currentSceneIndex) {
      activateScene(currentSceneIndex);
    }
  }

  function startPlayback() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (isPlaying) {
        currentTime += 0.2;
        if (currentTime >= totalDuration) {
          currentTime = 0; // Seamless continuous loop
        }
        updateTimeline();
      }
    }, 200);
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (playIcon) {
      if (isPlaying) {
        playIcon.className = 'fa-solid fa-pause';
      } else {
        playIcon.className = 'fa-solid fa-play';
      }
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePlay);
  }

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = pct * totalDuration;
      updateTimeline();
    });
  }

  // Initial activate & start
  activateScene(1);
  startPlayback();
}

/* ==========================================================================
   11. BEFORE VS AFTER INTERACTIVE REDESIGN SLIDER (SQUARESPACE STYLE)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('ba-interactive-container');
  const sliderInput = document.getElementById('ba-slider-input');
  const beforeWrapper = document.getElementById('ba-before-wrapper');
  const handle = document.getElementById('ba-divider-handle');

  if (!container || !sliderInput || !beforeWrapper || !handle) return;

  function updateSlider(val) {
    const clamped = Math.max(0, Math.min(100, val));
    beforeWrapper.style.width = `${clamped}%`;
    handle.style.left = `${clamped}%`;
  }

  // Range input event (smooth across touch & mouse)
  sliderInput.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  // Mouse / Touch movement tracking for direct click-and-drag
  let isDragging = false;

  function handleDrag(clientX) {
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const pct = (offsetX / rect.width) * 100;
    sliderInput.value = pct;
    updateSlider(pct);
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    handleDrag(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    handleDrag(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length) handleDrag(e.touches[0].clientX);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches.length) handleDrag(e.touches[0].clientX);
  }, { passive: true });

  // Initial set at 50%
  updateSlider(50);
}

/* ==========================================================================
   11. DYNAMIC SOCIAL PROOF TRUST NOTIFICATION TOASTS
   ========================================================================== */
function initSocialProofToast() {
  const toast = document.getElementById('social-proof-toast');
  const avatar = document.getElementById('sp-avatar');
  const title = document.getElementById('sp-title');
  const action = document.getElementById('sp-action');
  const time = document.getElementById('sp-time');
  const closeBtn = document.getElementById('sp-close-btn');

  if (!toast || !title || !action) return;

  const proofEvents = [
    {
      title: 'New Client Onboarded',
      action: 'Lifto Commuter Platform development milestone completed',
      time: '4 mins ago',
      icon: 'fa-solid fa-laptop-code'
    },
    {
      title: 'Performance Marketing',
      action: 'Server-side CAPI event tracking deployed for client brand',
      time: '12 mins ago',
      icon: 'fa-brands fa-meta'
    },
    {
      title: 'Smart Solution',
      action: 'Contactless Executive NFC Cards dispatched to client team',
      time: '24 mins ago',
      icon: 'fa-solid fa-wifi'
    },
    {
      title: 'Engineering Milestone',
      action: 'AI & NLP Fake News Detection API successfully benchmarked',
      time: '36 mins ago',
      icon: 'fa-solid fa-brain'
    },
    {
      title: 'Discovery Call Booked',
      action: 'Custom Next.js Web Application scope consultation confirmed',
      time: '48 mins ago',
      icon: 'fa-solid fa-bolt'
    }
  ];

  let currentIndex = 0;
  let isDismissed = false;

  function showNextProof() {
    if (isDismissed) return;

    const data = proofEvents[currentIndex];
    title.textContent = data.title;
    action.textContent = data.action;
    time.textContent = data.time;
    if (avatar) avatar.innerHTML = `<i class="${data.icon}"></i>`;

    toast.classList.add('show');

    // Hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5200);

    currentIndex = (currentIndex + 1) % proofEvents.length;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.classList.remove('show');
      isDismissed = true;
    });
  }

  // First toast after 3 seconds, then every 18 seconds
  setTimeout(showNextProof, 3500);
  setInterval(showNextProof, 19000);
}



/* Squarespace Interactive Showcase Switcher (Studio MacBook <-> 3D Tech Architecture) */
window.switchHeroView = function(viewType, btnElement) {
  const img = document.getElementById('sq-hero-main-img');
  const badgeText = document.getElementById('sq-badge-text');
  const tabs = document.querySelectorAll('.sq-tab-btn');
  if (!img) return;

  tabs.forEach(t => t.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  img.style.opacity = '0.15';
  img.style.transform = 'scale(0.98)';

  setTimeout(() => {
    if (viewType === 'architecture') {
      img.src = 'assets/images/probuild_tech_stack_showcase.jpg';
      img.alt = 'ProBuild High-Performance 3D Tech Stack & Architecture';
      if (badgeText) badgeText.innerText = 'HIGH-PERFORMANCE 3D ARCHITECTURE • +128% SPEED';
    } else {
      img.src = 'assets/images/probuild_macbook_hero.png';
      img.alt = 'ProBuild Digital Solutions Platform on MacBook Pro';
      if (badgeText) badgeText.innerText = 'PROBUILD DIGITAL SOLUTIONS • LIVE PRODUCTION';
    }
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 180);
};

/* ==========================================================================
   14. GOOGLE ANALYTICS 4 (GA4) INTERACTION & EVENT TRACKING
   ========================================================================== */
function initAnalyticsTracking() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || typeof window.gtag !== 'function') return;

    const href = (link.getAttribute('href') || '').trim();
    if (!href) return;

    // Detect triggering section / component for clean attribution
    const section = link.closest('section')?.id ||
                    link.closest('header')?.id ||
                    link.closest('footer')?.className ||
                    link.closest('.mobile-drawer')?.id ||
                    link.closest('.modal-dialog')?.className ||
                    'page_body';

    // 1. Track WhatsApp Clicks (Zero PII)
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      const buttonLabel = (link.getAttribute('aria-label') ||
                           link.getAttribute('title') ||
                           link.innerText ||
                           'WhatsApp CTA').trim().replace(/\s+/g, ' ');

      window.gtag('event', 'whatsapp_click', {
        event_category: 'Direct Communication',
        event_label: buttonLabel.slice(0, 60),
        link_location: section
      });
    }
    // 2. Track Phone Call Clicks (Zero PII)
    else if (href.startsWith('tel:')) {
      const targetPhone = href.replace('tel:', '').replace(/[^0-9]/g, '');
      let contactPerson = 'Direct Line';
      if (targetPhone.includes('9284248444')) contactPerson = 'Aditya Ubale (Founder)';
      else if (targetPhone.includes('9021321877')) contactPerson = 'Shubham Torkad (Founder)';
      else if (targetPhone.includes('9322151641')) contactPerson = 'Aryan Date (Founder)';

      window.gtag('event', 'phone_click', {
        event_category: 'Direct Communication',
        event_label: contactPerson,
        link_location: section
      });
    }
    // 3. Track Email Clicks (Zero PII)
    else if (href.startsWith('mailto:')) {
      window.gtag('event', 'email_click', {
        event_category: 'Direct Communication',
        event_label: 'Official Agency Email',
        link_location: section
      });
    }
  }, { passive: true });
}
