/* ============================================================
   THE WHITE COAT JOURNAL — MAIN JAVASCRIPT
   Scroll Animations · Parallax · Nav · Counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── SCROLL PROGRESS ──────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrollTop    = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }

  /* ── NAVIGATION ───────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  function updateNav() {
    nav?.classList.toggle('scrolled', window.scrollY > 50);
  }

  // Mobile toggle
  const toggleBtn = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  toggleBtn?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', String(open));
    // Animate bars
    const bars = toggleBtn.querySelectorAll('span');
    if (open) {
      bars[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
      bars[1].style.cssText = 'opacity: 0';
      bars[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
    } else {
      bars.forEach(b => b.style.cssText = '');
    }
  });

  // Close nav on link click (mobile)
  navLinks?.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggleBtn?.querySelectorAll('span').forEach(b => b.style.cssText = '');
    });
  });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── INTERSECTION OBSERVER (SCROLL ANIMATIONS) ────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in')
    .forEach(el => revealObserver.observe(el));

  // Stagger containers
  const staggerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.stagger').forEach(el => staggerObserver.observe(el));

  /* ── SCROLL STORYTELLING (EXPERIENCE PAGE) ────────────── */
  const storyItems = document.querySelectorAll('.story-item');
  if (storyItems.length) {
    const storyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('story-active', entry.isIntersecting);
        });
      },
      { threshold: 0.35, rootMargin: '-8% 0px -8% 0px' }
    );
    storyItems.forEach(item => storyObserver.observe(item));
  }

  /* ── COUNTER ANIMATION ────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const fps      = 60;
    const steps    = duration / (1000 / fps);
    let   current  = 0;
    const inc      = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 1000 / fps);
  }

  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── PARALLAX ─────────────────────────────────────────── */
  function updateParallax() {
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const section = el.closest('.parallax-section, .obs-hero');
      if (!section) return;
      const rect  = section.getBoundingClientRect();
      const speed = parseFloat(el.dataset.parallax) || 0.25;
      const mid   = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${mid * speed}px)`;
    });
  }

  /* ── CARD TILT (SUBTLE 3D) ────────────────────────────── */
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── SMOOTH SCROLL FOR HASH LINKS ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── SCROLL EVENT (RAF-THROTTLED) ─────────────────────── */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        updateNav();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ── INIT ─────────────────────────────────────────────── */
  updateNav();
  updateProgress();
  updateParallax();

});
