/* ============================================================
   THE WHITE COAT JOURNAL — ENHANCED INTERACTIONS
   Custom Cursor · Page Loader · Particles · Magnetic ·
   Text Reveal · AI Chat Widget
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     1. PAGE LOADER
  ══════════════════════════════════════════════════════ */
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('loaded');
      setTimeout(() => loader.remove(), 700);
    }, 1500);
  }

  /* ══════════════════════════════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════════════════════════════ */
  function initCursor() {
    if (window.innerWidth < 900) return; // skip on mobile

    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100;  // mouse pos
    let rx = -100, ry = -100;  // ring pos (lagged)

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
    });

    // Laggy ring
    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    const hoverEls = 'a, button, .btn, .comp-card, .purpose-card, .aspiration-card, .story-item, .photo-strip__item';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup',   () => ring.classList.remove('click'));

    // Hide when leaving window
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ══════════════════════════════════════════════════════
     3. CANVAS PARTICLE BACKGROUND (Hero)
  ══════════════════════════════════════════════════════ */
  function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['rgba(216,167,160,', 'rgba(243,225,220,', 'rgba(246,213,207,', 'rgba(232,207,203,'];

    function Particle() {
      this.reset = function () {
        this.x    = Math.random() * W;
        this.y    = Math.random() * H;
        this.r    = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.vx   = (Math.random() - 0.5) * 0.35;
        this.vy   = (Math.random() - 0.5) * 0.35 - 0.15;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      };
      this.reset();
      this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.fill();
      };
      this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.0008;
        if (this.y < -this.r || this.alpha <= 0) this.reset();
      };
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.y = Math.random() * H; // initial spread
      particles.push(p);
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ══════════════════════════════════════════════════════
     4. MAGNETIC BUTTONS
  ══════════════════════════════════════════════════════ */
  function initMagnetic() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     5. TEXT REVEAL (clip-based)
  ══════════════════════════════════════════════════════ */
  function initTextReveals() {
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.text-reveal').forEach(el => revObs.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     6. HERO NAME CHARACTER SPLIT
  ══════════════════════════════════════════════════════ */
  function initHeroName() {
    document.querySelectorAll('.hero__name-line').forEach((line, li) => {
      const text = line.textContent;
      line.innerHTML = '';
      text.split('').forEach((ch, ci) => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(50px) skewY(6deg);
          transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
          transition-delay: ${(li * 8 + ci) * 0.04}s;
        `;
        line.appendChild(s);
      });
    });

    // Trigger on load
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.hero__name-line .char').forEach(ch => {
          ch.style.opacity = '1';
          ch.style.transform = 'none';
        });
      }, 800); // after loader
    });
  }

  /* ══════════════════════════════════════════════════════
     7. SCROLL-LINKED DEPTH PARALLAX (depth-text)
  ══════════════════════════════════════════════════════ */
  function initDepthParallax() {
    window.addEventListener('scroll', () => {
      document.querySelectorAll('.depth-text').forEach(el => {
        const rect = el.parentElement?.getBoundingClientRect();
        if (!rect) return;
        const prog = 1 - (rect.bottom / (rect.height + window.innerHeight));
        el.style.transform = `translate(-50%, calc(-50% + ${prog * 80}px))`;
      });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════
     8. AI CHAT WIDGET
  ══════════════════════════════════════════════════════ */
  function initAIChat() {
    const widget = document.getElementById('ai-chat-widget');
    if (!widget) return;

    const bubble   = widget.querySelector('.ai-chat__bubble');
    const panel    = widget.querySelector('.ai-chat__panel');
    const messages = widget.querySelector('.ai-chat__messages');
    const input    = widget.querySelector('.ai-chat__input');
    const send     = widget.querySelector('.ai-chat__send');
    const close    = widget.querySelector('.ai-chat__close');

    let open = false;

    bubble?.addEventListener('click', () => {
      open = !open;
      panel?.classList.toggle('open', open);
      if (open && messages.children.length === 0) {
        typeMessage('bot', "Hi! I'm Kashish's portfolio assistant 👩‍⚕️ Ask me about her experience, competencies, or education!", true);
      }
    });

    close?.addEventListener('click', () => {
      open = false;
      panel?.classList.remove('open');
    });

    function sendMsg() {
      const text = input.value.trim();
      if (!text) return;
      addMessage('user', text);
      input.value = '';
      setTimeout(() => {
        const reply = getReply(text.toLowerCase());
        typeMessage('bot', reply);
      }, 500);
    }

    send?.addEventListener('click', sendMsg);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

    function addMessage(role, text) {
      const div = document.createElement('div');
      div.className = `ai-msg ai-msg--${role}`;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function typeMessage(role, text, fast = false) {
      const div = document.createElement('div');
      div.className = `ai-msg ai-msg--${role}`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      let i = 0;
      const speed = fast ? 15 : 22;
      const timer = setInterval(() => {
        div.textContent += text[i++];
        messages.scrollTop = messages.scrollHeight;
        if (i >= text.length) clearInterval(timer);
      }, speed);
    }

    function getReply(q) {
      if (/competen|skill|ability/.test(q))
        return "Kashish has mastered all 9 CanMEDS competencies including Medical Expert, Communicator, Collaborator, Professionalism, and Evidence-Based Practitioner — developed through her GMU curriculum and clinical observerships.";
      if (/experience|observ|hospital|ward|icu|surg/.test(q))
        return "She completed a structured clinical observership at Gulf Medical University Hospital — participating in ward rounds, ICU monitoring, and observing 4+ surgical procedures. A truly immersive clinical foundation! 🏥";
      if (/certif|cpr|aed|bls/.test(q))
        return "Kashish holds a CPR/AED certification — demonstrating her commitment to emergency preparedness and patient safety beyond the classroom. You can view the certificate on the Journey page!";
      if (/gmu|gulf|univer|school/.test(q))
        return "Kashish studies Graduate Entry Medicine at Gulf Medical University in Ajman, UAE — one of the leading medical universities in the region, known for its rigorous clinical training programme.";
      if (/aspir|goal|future|dream|specialist/.test(q))
        return "Kashish aspires to specialise in internal medicine, conduct impactful clinical research, and grow into a healthcare leader who combines empathy with evidence-based excellence. 🌟";
      if (/contact|email|linkedin|reach/.test(q))
        return "You can reach Kashish at kashishdevnani@gmail.com or connect on LinkedIn: linkedin.com/in/kashish-devnani-49a4501b6. She'd love to hear from you!";
      if (/cv|resume|download/.test(q))
        return "You can download Kashish's full CV via the 'Download CV' button in the top navigation or the Contact section. It includes her full academic and clinical profile!";
      if (/who|about|kashish|you/.test(q))
        return "Kashish Devnani is a dedicated medical student at Gulf Medical University pursuing Graduate Entry Medicine. She's passionate about clinical excellence, evidence-based practice, and lifelong learning as a future physician.";
      if (/hi|hello|hey|greet/.test(q))
        return "Hello! 👋 I'm Kashish's portfolio assistant. Ask me anything about her education, clinical experience, certifications, or aspirations!";
      return "Great question! Kashish's portfolio covers her clinical experience, 9 competencies, academic journey, CPR certification, and future aspirations. Try asking about any of those topics! 😊";
    }
  }

  /* ══════════════════════════════════════════════════════
     9. STAGGER CHILDREN OBSERVER (for new sections)
  ══════════════════════════════════════════════════════ */
  function initStaggerNew() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.photo-strip__item, .stats-row__item, .marquee-wrap').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.08}s`;
            el.classList.add('animate');
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.photo-strip, .stats-row').forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     INIT ALL
  ══════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initMagnetic();
    initTextReveals();
    initHeroName();
    initDepthParallax();
    initAIChat();
    initStaggerNew();
  });

})();
