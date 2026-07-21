/* 
 * Professional Female Counsellor Website Main Script
 * Counselor: Mrs. Preeti Pareek
 * Technology: Vanilla JavaScript
 */

// --------------------------------------------------------------------------
// Counsellor Details Configuration (Easily Editable Placeholder Variables)
// --------------------------------------------------------------------------
const COUNSELLOR_CONFIG = {
  name: "Mrs. Preeti Pareek",
  phone: "+91 94143 41096",       // e.g. "+91 98765 43210"
  whatsapp: "919414341096", // e.g. "919876543210" (digits only for wa.me)
  email: "[Email Address]",       // e.g. "preeti.pareek@example.com"
  address: "[Counselling Office Address]"
};

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 0. Dynamic Placeholder Replacements
  // --------------------------------------------------------------------------
  const replacePlaceholderTexts = () => {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.nodeValue.includes('[Phone Number]')) {
          node.nodeValue = node.nodeValue.replaceAll('[Phone Number]', COUNSELLOR_CONFIG.phone);
        }
        if (node.nodeValue.includes('[WhatsApp Number]')) {
          node.nodeValue = node.nodeValue.replaceAll('[WhatsApp Number]', COUNSELLOR_CONFIG.phone);
        }
      } else {
        node.childNodes.forEach(walk);
      }
    };
    walk(document.body);
  };
  replacePlaceholderTexts();

  // --------------------------------------------------------------------------
  // 1. Sticky Navigation Bar State & Back To Top Button visibility
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollPos = window.scrollY;

    // Sticky Nav shadow & background blur transition
    if (navbar) {
      if (scrollPos > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollPos > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger immediately to check initial state

  // Smooth scroll back to top when back-to-top clicked
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 2. Active Navigation Highlighting on Scroll (Scroll-Spy) & Page-Aware
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const activeScrollSpy = () => {
    // Get the current page filename
    const pathArray = window.location.pathname.split('/');
    const currentFile = pathArray[pathArray.length - 1] || 'index.html';
    const isIndexPage = currentFile === 'index.html' || currentFile === '';

    if (isIndexPage && sections.length > 0) {
      const scrollPos = window.scrollY + 150; // offset for nav height
      let activeSectionId = '';

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          activeSectionId = id;
        }
      });

      if (activeSectionId) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href === `#${activeSectionId}` || href === `index.html#${activeSectionId}`) {
            link.classList.add('active');
          }
        });
      } else {
        // Default to Home if at the very top of index.html
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === 'index.html' || href === '#home' || href === 'index.html#home') {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    } else {
      // Highlight based on exact filename for inner pages
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentFile) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  };

  window.addEventListener('scroll', activeScrollSpy);
  activeScrollSpy(); // Run initially

  // --------------------------------------------------------------------------
  // 3. Mobile Hamburger Menu Toggle & Scroll Locking
  // --------------------------------------------------------------------------
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    const toggleMenu = () => {
      const isOpen = navToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      document.body.classList.toggle('menu-open', isOpen);
    };

    const closeMenu = () => {
      navToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    navToggle.addEventListener('click', toggleMenu);

    // Close menu when a navigation link is clicked
    const links = navLinksContainer.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside of the side nav
    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !navToggle.contains(e.target) && navLinksContainer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. FAQ Accordion Logic with smooth max-height transitions
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs (strictly only one remains open)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) {
              otherContent.style.maxHeight = '0px';
            }
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            if (otherTrigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current FAQ
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = '0px';
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          // Set max-height to scrollHeight dynamically for smooth transition
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 5. Scroll Reveal Animations (Subtle Entrance effects)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 120; // Pixels offset before revealing

      if (elementTop < windowHeight - revealPoint) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger reveal check immediately on load

  // --------------------------------------------------------------------------
  // 6. Statistics Counter Animation on entering view
  // --------------------------------------------------------------------------
  const statsSection = document.querySelector('.about-stats');
  const statNums = document.querySelectorAll('.stat-num');
  let animatedStats = false;

  const animateCounters = () => {
    if (!statsSection || animatedStats) return;

    const rect = statsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      animatedStats = true;
      statNums.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        const duration = 2000; // Animation duration in ms
        const stepTime = 30; // Step refresh time
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let currentNum = 0;

        const timer = setInterval(() => {
          currentNum += increment;
          if (currentNum >= target) {
            stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
          } else {
            stat.textContent = Math.floor(currentNum) + (stat.textContent.includes('+') ? '+' : '');
          }
        }, stepTime);
      });
    }
  };

  window.addEventListener('scroll', animateCounters);
  animateCounters(); // Initial check

  // --------------------------------------------------------------------------
  // 7. WhatsApp and Calling Pre-filled Actions
  // --------------------------------------------------------------------------
  const setupFloatingActions = () => {
    const waBtns = document.querySelectorAll('.whatsapp-action');
    const callBtns = document.querySelectorAll('.call-action');
    
    // Setup WhatsApp Action Links
    waBtns.forEach(btn => {
      const message = encodeURIComponent("Hello, I would like to book a counselling session. Please share the available timings.");
      btn.setAttribute('href', `https://wa.me/${COUNSELLOR_CONFIG.whatsapp}?text=${message}`);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener noreferrer');
    });

    // Setup Call Action Links
    callBtns.forEach(btn => {
      btn.setAttribute('href', `tel:${COUNSELLOR_CONFIG.phone}`);
    });
  };

  setupFloatingActions();

  // --------------------------------------------------------------------------
  // 8. Timed Appointment / Exit Intent Prompt (20 seconds timer)
  // --------------------------------------------------------------------------
  const timedPrompt = document.getElementById('timedPrompt');
  const closePromptBtn = document.getElementById('closePromptBtn');

  if (timedPrompt) {
    const isDismissed = sessionStorage.getItem('timed_prompt_dismissed') === 'true';
    const isMobile = window.innerWidth <= 768;

    // Only set timer if not dismissed and NOT immediately on mobile
    if (!isDismissed && !isMobile) {
      setTimeout(() => {
        timedPrompt.classList.add('active');
      }, 20000); // 20 Seconds
    }

    if (closePromptBtn) {
      closePromptBtn.addEventListener('click', () => {
        timedPrompt.classList.remove('active');
        sessionStorage.setItem('timed_prompt_dismissed', 'true');
      });
    }
  }

  // --------------------------------------------------------------------------
  // 9. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear().toString();
  }

  // --------------------------------------------------------------------------
  // 10. Lazy Loading of Counselor Portrait images
  // --------------------------------------------------------------------------
  const lazyImages = [].slice.call(document.querySelectorAll("img[loading='lazy']"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
          }
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach((lazyImage) => {
      lazyImageObserver.observe(lazyImage);
    });
  }

  // --------------------------------------------------------------------------
  // 11. Interactive Constellation Canvas Background
  // --------------------------------------------------------------------------
  const initInteractiveBg = () => {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const heroSection = document.getElementById('home');
    if (!heroSection) return;

    let particlesArray = [];
    const maxParticles = window.innerWidth < 768 ? 25 : 65; // Optimized particle count for performance

    // Mouse positional tracking
    const mouse = {
      x: null,
      y: null,
      radius: 120 // Interaction circle radius
    };

    // Track mouse position over the hero container
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Handle canvas resizing
    const resizeCanvas = () => {
      const rect = heroSection.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class definition
    class Particle {
      constructor() {
        this.reset();
        // Distribute initially throughout canvas
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 1; // 1px to 3px size for high density and crisp look
        // Extremely slow speed for a calm, serene ambient effect
        this.vx = (Math.random() - 0.5) * 0.3; 
        this.vy = (Math.random() - 0.5) * 0.3;
        
        // Luminous space-navy color palette
        const colors = [
          'rgba(92, 189, 242, 0.45)',  // Brighter Professional Blue
          'rgba(197, 168, 128, 0.45)',  // Radiant Accent Gold
          'rgba(255, 255, 255, 0.3)'    // Delicate crisp white
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Check bounds, reset or bounce
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }

        // Mouse repelling interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            // Apply a gentle pushing force away from the mouse cursor
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particle cluster
    const initParticles = () => {
      particlesArray = [];
      for (let i = 0; i < maxParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    initParticles();

    // Draw lines connecting nearby particles
    const connectParticles = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.hypot(dx, dy);

          if (distance < 110) {
            // Faint, delicate connect lines styled with soft blue
            const alpha = (110 - distance) / 110 * 0.15;
            ctx.strokeStyle = `rgba(92, 189, 242, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Check for reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach(particle => {
        if (!prefersReducedMotion) {
          particle.update();
        }
        particle.draw();
      });

      if (!prefersReducedMotion) {
        connectParticles();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  };

  initInteractiveBg();
});
