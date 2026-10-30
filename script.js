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
  initPricingToggle();
  initFaqAccordion();
  initBeforeAfterSlider();
  initCostCalculator();
  initSocialProofToast();
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
   7. PRICING TOGGLE (MONTHLY RETAINER VS ONE-TIME BUILD)
   ========================================================================== */
window.switchPricingTab = function(mode) {
  const metaGrid = document.getElementById('meta-packages-grid');
  const mainGrid = document.getElementById('main-packages-grid');
  const standardGrid = document.getElementById('standard-packages-grid');
  const activeMainGrid = mainGrid || standardGrid;
  const metaBanner = document.getElementById('meta-section-banner');
  const mainBanner = document.getElementById('main-section-banner');
  const btnMain = document.getElementById('tab-btn-main');
  const btnMeta = document.getElementById('tab-btn-meta');
  const btnMonthly = document.getElementById('tab-btn-monthly');
  const btnOnetime = document.getElementById('tab-btn-onetime');

  // Reset tab buttons
  [btnMain, btnMeta, btnMonthly, btnOnetime].forEach(btn => {
    if (btn) btn.classList.remove('active');
  });

  if (mode === 'meta') {
    if (btnMeta) btnMeta.classList.add('active');
    if (metaGrid) metaGrid.style.display = 'grid';
    if (metaBanner) metaBanner.style.display = 'block';
    if (activeMainGrid) activeMainGrid.style.display = 'none';
    if (mainBanner) mainBanner.style.display = 'none';
  } else {
    // Default to All-in-One Main Business Plans
    if (btnMain) btnMain.classList.add('active');
    else if (btnMonthly) btnMonthly.classList.add('active');
    if (metaGrid) metaGrid.style.display = 'none';
    if (metaBanner) metaBanner.style.display = 'none';
    if (activeMainGrid) activeMainGrid.style.display = 'grid';
    if (mainBanner) mainBanner.style.display = 'block';
  }
};

function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelOneTime = document.getElementById('label-onetime');
  const priceElements = document.querySelectorAll('#standard-packages-grid .price-amount');
  const periodElements = document.querySelectorAll('#standard-packages-grid .price-period');

  if (toggle) {
    function handleToggle() {
      const isOneTime = toggle.checked;
      if (isOneTime) {
        window.switchPricingTab('onetime');
      } else {
        window.switchPricingTab('monthly');
      }
    }

    toggle.addEventListener('change', handleToggle);
    if (labelMonthly) {
      labelMonthly.addEventListener('click', () => {
        toggle.checked = false;
        handleToggle();
      });
    }
    if (labelOneTime) {
      labelOneTime.addEventListener('click', () => {
        toggle.checked = true;
        handleToggle();
      });
    }
  }
}

/* ==========================================================================
   8. FAQ ACCORDION LOGIC
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
  'neon-streetwear': {
    title: 'Neon Streetwear D2C E-Commerce Platform',
    client: 'Urban Velocity Apparel (D2C Brand)',
    image: 'assets/images/ecommerce-showcase.jpg',
    category: 'E-Commerce Platform & High-ROAS Meta Ads',
    overview: 'Urban Velocity was a local streetwear label with a physical storefront that wanted to scale pan-India. Their previous WordPress WooCommerce store took 4.2 seconds to load and had high checkout dropoffs.',
    solution: 'ProBuild engineered a headless, custom Next.js e-commerce storefront with a sub-second load speed (0.6s), 1-click Razorpay UPI checkout, and automated WhatsApp abandoned cart recovery loops.',
    metrics: [
      { label: 'Monthly Revenue', value: '₹42,00,000+' },
      { label: 'Blended Meta ROAS', value: '4.9x' },
      { label: 'Page Load Speed', value: '0.6s' },
      { label: 'Recovered Carts', value: '38.4%' }
    ],
    techStack: ['Next.js 15', 'Shopify Storefront API', 'Razorpay UPI', 'Meta CAPI', 'WhatsApp Cloud API']
  },
  'nexus-ads': {
    title: 'Nexus Omnichannel Ads Scaling (Meta + Google)',
    client: 'Nexus Media & Multi-Location Retail',
    image: 'assets/images/ads-showcase.jpg',
    category: 'Performance Marketing (Google P-Max & Meta Ads)',
    overview: 'Nexus was spending $40,000+ monthly on ads with stagnant returns (1.8x ROAS). Ad fatigue was rampant and conversion tracking had severe gaps post-iOS14.',
    solution: 'ProBuild rebuilt their entire tracking architecture using Server-Side Conversions API (CAPI), launched dynamic multi-angle video creatives, and structured Google Search & Performance Max campaigns with negative keyword safeguards.',
    metrics: [
      { label: 'Total Sales Generated', value: '$511,732' },
      { label: 'Aggregated ROAS', value: '5.2x' },
      { label: 'Total Conversions', value: '4,575' },
      { label: 'Average CPA', value: '$21.50' }
    ],
    techStack: ['Google Ads (P-Max & Search)', 'Meta Ads Manager', 'Server CAPI', 'Google Tag Manager', 'Google Analytics 4']
  },
  'aether-platform': {
    title: 'Aether Business Operations & Customer Portal',
    client: 'Aether Analytics (B2B SaaS / Services)',
    image: 'assets/images/platform-showcase.jpg',
    category: 'Custom Web Application & Operations Platform',
    overview: 'Managing over 15,000 active business users through manual sheets was creating operational bottlenecks, billing errors, and customer churn.',
    solution: 'ProBuild designed and deployed a bespoke real-time client management portal with automated subscription billing, role-based admin controls, and interactive client dashboards.',
    metrics: [
      { label: 'Annual ARR Managed', value: '$4.8M+' },
      { label: 'Active Users', value: '15,400+' },
      { label: 'Platform Uptime', value: '99.98%' },
      { label: 'Customer Churn', value: '2.1%' }
    ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe Billing', 'AWS Cloud Infrastructure']
  },
  'boutique-luxe': {
    title: 'Boutique Luxe Fashion Shop Digital Migration',
    client: 'Boutique Luxe (Retail Clothing Shop)',
    image: 'assets/images/shop-ecommerce.jpg',
    category: 'Local Shop E-Commerce & WhatsApp Commerce',
    overview: 'A premium local boutique in a Tier-1 city wanted to tap into nationwide demand without paying high marketplace commissions (Amazon/Myntra).',
    solution: 'ProBuild launched their complete mobile-friendly web store in just 10 days, integrated direct WhatsApp catalog browsing, and executed hyper-targeted Instagram lookalike ads.',
    metrics: [
      { label: '1st Month Online GMV', value: '₹18,50,000' },
      { label: 'Blended Ad ROAS', value: '5.8x' },
      { label: 'Direct WhatsApp Orders', value: '45%' },
      { label: 'Delivery Turnaround', value: '10 Days' }
    ],
    techStack: ['Shopify Plus', 'Razorpay Payment Gateway', 'WhatsApp Business API', 'Instagram Ads Manager']
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

/* ==========================================================================
   9b. META ADS PACKAGES MODAL CONTROLLER
   ========================================================================== */
window.openMetaAdsModal = function() {
  const modal = document.getElementById('meta-ads-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeMetaAdsModal = function() {
  const modal = document.getElementById('meta-ads-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.selectMetaPackage = function(packageName) {
  window.closeMetaAdsModal();
  window.preselectService(packageName);
  if (typeof showToast === 'function') {
    showToast(`Selected ${packageName}! Fill in your details below.`);
  }
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
  const metaModal = document.getElementById('meta-ads-modal');
  if (metaModal && e.target === metaModal) {
    window.closeMetaAdsModal();
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCaseModal();
    window.closeMetaAdsModal();
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

  // Smooth scroll to contact
  const contactSec = document.getElementById('contact');
  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
  }
};

window.selectPackage = function(packageName) {
  window.preselectService(packageName);
  showToast(`Selected ${packageName}! Let's customize your growth plan below.`);
};

window.openProposalModal = function() {
  const contactSec = document.getElementById('contact');
  if (contactSec) {
    contactSec.scrollIntoView({ behavior: 'smooth' });
    const nameInput = document.getElementById('client-name');
    if (nameInput) nameInput.focus();
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
  const waUrl = `https://wa.me/919021321877?text=${encodedMsg}`;

  // Save safety backup copy in browser localStorage
  try {
    const leads = JSON.parse(localStorage.getItem('probuild_leads') || '[]');
    leads.push({ name, phone, email, service, budget, message, time: new Date().toLocaleString() });
    localStorage.setItem('probuild_leads', JSON.stringify(leads));
  } catch (err) {
    /* ignore storage errors */
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
   12. INTERACTIVE PROJECT COST & ROI CALCULATOR
   ========================================================================== */
function initCostCalculator() {
  const servicePills = document.querySelectorAll('.calc-pill');
  const slider = document.getElementById('calc-tier-slider');
  const addonSeo = document.getElementById('addon-seo');
  const addonWa = document.getElementById('addon-wa');
  const ticks = document.querySelectorAll('.calc-ticks .tick-step');

  const priceDisplay = document.getElementById('calc-price-display');
  const periodDisplay = document.getElementById('calc-period-display');
  const planSummary = document.getElementById('calc-plan-summary');
  const tierActivePill = document.getElementById('calc-tier-active-pill');
  const timelineDisplay = document.getElementById('calc-timeline-display');
  const roiDisplay = document.getElementById('calc-roi-display');
  const deliverablesList = document.getElementById('calc-deliverables-list');
  const waBtn = document.getElementById('calc-wa-cta-btn');

  if (!priceDisplay || !slider) return;

  // Pricing matrix
  const calcData = {
    web: {
      name: 'Custom Web & App Development',
      period: '/one-time',
      tiers: [
        {
          label: 'STARTER TIER',
          name: 'High-Speed Landing Page',
          basePrice: 7499,
          timeline: '3 - 5 Days',
          roi: '+220% Leads',
          deliverables: [
            'Mobile-first responsive build (0.8s load time)',
            'Conversion lead forms with WhatsApp alert',
            'Razorpay, UPI & Payment gateway integration',
            'Basic Search Engine Optimization setup'
          ]
        },
        {
          label: 'GROWTH TIER (POPULAR)',
          name: 'Full Business Store / Web App',
          basePrice: 14999,
          timeline: '7 - 10 Days',
          roi: '+340% Conversions',
          deliverables: [
            'Up to 10 Custom pages & full product catalog',
            'Mobile-first checkout & WhatsApp direct order',
            'Admin dashboard for real-time inventory management',
            'Advanced conversion tracking & analytics sync'
          ]
        },
        {
          label: 'DOMINANCE TIER',
          name: 'Custom Platform & SaaS App',
          basePrice: 24999,
          timeline: '14 - 18 Days',
          roi: '+580% Sales Growth',
          deliverables: [
            'Headless React/Next.js architecture with instant CDN',
            'Multi-tier customer login & secure order portals',
            'Automated email, SMS & WhatsApp workflow engine',
            '60 Days Dedicated post-launch warranty & maintenance'
          ]
        }
      ]
    },
    ads: {
      name: 'Meta & Google Ads Engine',
      period: '/month',
      tiers: [
        {
          label: 'STARTER TIER',
          name: 'Meta Ads Starter',
          basePrice: 7999,
          timeline: '3 Days Setup',
          roi: '+3.2x ROAS',
          deliverables: [
            '1 High-intent Facebook & Instagram campaign',
            '2 Custom high-CTR ad creatives & copy',
            'Audience interest & demographic geo-targeting',
            'Weekly bid optimization & monthly transparent report'
          ]
        },
        {
          label: 'GROWTH TIER (POPULAR)',
          name: 'Meta Ads Growth Engine',
          basePrice: 14999,
          timeline: '2 Days Setup',
          roi: '+4.8x ROAS',
          deliverables: [
            'Up to 3 Campaigns (Awareness, Lead Gen & Retargeting)',
            '5 Custom video/carousel ad creatives designed to convert',
            'Dynamic product retargeting & lookalike audience funnels',
            'A/B split testing & weekly metric progress calls'
          ]
        },
        {
          label: 'DOMINANCE TIER',
          name: 'Meta Ads Dominance Scale',
          basePrice: 24999,
          timeline: '24h Priority Setup',
          roi: '+6.5x ROAS',
          deliverables: [
            'Up to 5 Omni-funnel campaigns for aggressive scaling',
            '8 High-retention video reels & graphic creatives',
            'Server-side Meta Conversion API (CAPI) pixel setup',
            'Priority 24/7 Slack/WhatsApp dedicated strategist channel'
          ]
        }
      ]
    },
    nfc: {
      name: 'Smart NFC Business Solutions',
      period: '/one-time',
      tiers: [
        {
          label: 'STARTER TIER',
          name: 'Smart NFC Executive Card',
          basePrice: 1499,
          timeline: '2 - 3 Days Dispatch',
          roi: '100% Contact Retention',
          deliverables: [
            '1 Premium matte black smart NFC contact card',
            'Instant 1-tap contact save to iPhone & Android',
            'Social links, WhatsApp, phone & catalog routing',
            'Zero app installation required & lifetime QR fallback'
          ]
        },
        {
          label: 'GROWTH TIER (POPULAR)',
          name: 'Google Review NFC Standee Pack (3 Standees)',
          basePrice: 3999,
          timeline: '3 - 4 Days Dispatch',
          roi: '5x Google Reviews',
          deliverables: [
            '3 Commercial acrylic NFC tap standees for physical counters',
            'Direct 1-tap 5-star Google review redirect',
            'Dynamic link update dashboard with real-time analytics',
            'Weatherproof UV-coated finish with counter branding'
          ]
        },
        {
          label: 'DOMINANCE TIER',
          name: 'Corporate Fleet (10 Custom Smart Cards)',
          basePrice: 9999,
          timeline: '5 - 7 Days Dispatch',
          roi: 'Team Enterprise Fleet',
          deliverables: [
            '10 Laser-engraved customized metal or matte NFC cards',
            'Centralized team management dashboard with role controls',
            'Real-time tap analytics and lead capture logging',
            'Custom branded landing URL on your company domain'
          ]
        }
      ]
    },
    college: {
      name: 'College Projects & Academic Kits',
      period: '/one-time',
      tiers: [
        {
          label: 'STARTER TIER',
          name: 'Mini Project Complete Kit',
          basePrice: 3499,
          timeline: '2 Days Delivery',
          roi: 'A+ Grade Guarantee',
          deliverables: [
            '100% Working frontend + backend source code',
            'Complete local setup & step-by-step execution guide',
            'Database schema, ER diagrams & system architecture',
            'Basic viva defence questions & cheat sheet'
          ]
        },
        {
          label: 'GROWTH TIER (POPULAR)',
          name: 'Major IEEE Project + Paper Ready',
          basePrice: 6999,
          timeline: '4 Days Delivery',
          roi: 'University A+ Approved',
          deliverables: [
            'Full IEEE/CS Major project with custom modifications',
            'Complete 80+ page project report (Word + PDF formatted)',
            'Professional PPT presentation with data flow diagrams',
            '1-on-1 Live Google Meet code walkthrough demo'
          ]
        },
        {
          label: 'DOMINANCE TIER',
          name: 'AI/ML Deep Tech Capstone Project',
          basePrice: 11999,
          timeline: '5 Days Delivery',
          roi: 'Research Defence Ready',
          deliverables: [
            'Cutting-edge AI / Deep Learning model training & API',
            'IEEE research paper format ready for journal publication',
            'Live viva mock rehearsal coaching with our senior engineers',
            'Unlimited code revisions until university viva approval'
          ]
        }
      ]
    }
  };

  let activeService = 'web';
  let activeTierIndex = 1; // 0: Starter, 1: Growth, 2: Dominance

  function updateCalculator() {
    const serviceInfo = calcData[activeService] || calcData.web;
    const tierInfo = serviceInfo.tiers[activeTierIndex] || serviceInfo.tiers[1];

    let total = tierInfo.basePrice;
    const addOnList = [];

    if (addonSeo && addonSeo.checked) {
      total += 2499;
      addOnList.push('Speed & SEO Optimization (+₹2,499)');
    }
    if (addonWa && addonWa.checked) {
      total += 1999;
      addOnList.push('WhatsApp CRM Auto-Bot (+₹1,999)');
    }

    // Update UI elements
    priceDisplay.textContent = total.toLocaleString('en-IN');
    periodDisplay.textContent = serviceInfo.period;
    planSummary.innerHTML = `<strong>${serviceInfo.name}</strong> &bull; ${tierInfo.name}`;
    tierActivePill.textContent = tierInfo.label;
    timelineDisplay.textContent = tierInfo.timeline;
    roiDisplay.textContent = tierInfo.roi;

    // Update ticks
    ticks.forEach((tick, i) => {
      tick.classList.toggle('active', i === activeTierIndex);
    });

    // Update deliverables list
    deliverablesList.innerHTML = '';
    tierInfo.deliverables.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${item}</span>`;
      deliverablesList.appendChild(li);
    });

    addOnList.forEach(addOn => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-plus text-emerald"></i> <span class="text-emerald"><strong>Add-on:</strong> ${addOn}</span>`;
      deliverablesList.appendChild(li);
    });

    // Update WhatsApp CTA URL
    const msg = encodeURIComponent(
      `Hi ProBuild, I used your Interactive Calculator!\n` +
      `📌 Service: ${serviceInfo.name}\n` +
      `📦 Package: ${tierInfo.name} (${tierInfo.label})\n` +
      `💰 Estimated Total: ₹${total.toLocaleString('en-IN')}${serviceInfo.period}\n` +
      `⚡ Timeline: ${tierInfo.timeline}\n` +
      `Can we get started?`
    );
    if (waBtn) {
      waBtn.href = `https://wa.me/919021321877?text=${msg}`;
    }
  }

  // Service pill click
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeService = pill.dataset.service;
      updateCalculator();
    });
  });

  // Slider change
  slider.addEventListener('input', (e) => {
    activeTierIndex = parseInt(e.target.value) - 1;
    updateCalculator();
  });

  // Addons change
  if (addonSeo) addonSeo.addEventListener('change', updateCalculator);
  if (addonWa) addonWa.addEventListener('change', updateCalculator);

  // Initial calculation
  updateCalculator();
}

/* ==========================================================================
   13. DYNAMIC SOCIAL PROOF TRUST NOTIFICATION TOASTS
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
      action: 'Dr. Rohan from Mumbai launched their Clinic Platform',
      time: '3 mins ago',
      icon: 'fa-solid fa-laptop-code'
    },
    {
      title: 'Meta Ads ROAS Jump',
      action: 'Urban Luxe achieved 4.9x ROAS with ₹42L revenue',
      time: '9 mins ago',
      icon: 'fa-brands fa-meta'
    },
    {
      title: 'NFC Dispatch',
      action: '15 Smart NFC Executive Cards shipped to Bangalore',
      time: '18 mins ago',
      icon: 'fa-solid fa-wifi'
    },
    {
      title: 'Project Delivered',
      action: 'Final Year IEEE AI Project delivered to MIT Pune',
      time: '24 mins ago',
      icon: 'fa-solid fa-graduation-cap'
    },
    {
      title: 'Audit Requested',
      action: 'Aditya from Delhi requested a Custom Web App audit',
      time: '38 mins ago',
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
      img.src = 'assets/probuild_tech_stack_showcase.jpg';
      img.alt = 'ProBuild High-Performance 3D Tech Stack & Architecture';
      if (badgeText) badgeText.innerText = 'HIGH-PERFORMANCE 3D ARCHITECTURE • +128% SPEED';
    } else {
      img.src = 'assets/probuild_macbook_hero.png';
      img.alt = 'ProBuild Digital Solutions Platform on MacBook Pro';
      if (badgeText) badgeText.innerText = 'PROBUILD DIGITAL SOLUTIONS • LIVE PRODUCTION';
    }
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 180);
};
