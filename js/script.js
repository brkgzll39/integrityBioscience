// ===================================================
// Integrity Bioscience — Site Script
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initNavToggle();
  initDnaHelix();
  initScrollReveal();
  initContactForm();
  initLanguageToggle();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- Sticky header background on scroll ---------- */
function initHeader() {
  const header = document.getElementById('header');
  const toggle = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function initNavToggle() {
  const btn = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Generate decorative DNA helix in hero ---------- */
function initDnaHelix() {
  const group = document.getElementById('dna-group');
  if (!group) return;

  const ns = 'http://www.w3.org/2000/svg';
  const steps = 22;
  const height = 800;
  const amplitude = 85;
  const centerX = 190;

  for (let i = 0; i <= steps; i++) {
    const y = (height / steps) * i;
    const angle = (i / steps) * Math.PI * 4;
    const x1 = centerX + Math.sin(angle) * amplitude;
    const x2 = centerX + Math.sin(angle + Math.PI) * amplitude;

    const rung = document.createElementNS(ns, 'line');
    rung.setAttribute('x1', x1.toFixed(1));
    rung.setAttribute('y1', y.toFixed(1));
    rung.setAttribute('x2', x2.toFixed(1));
    rung.setAttribute('y2', y.toFixed(1));
    rung.setAttribute('stroke', 'rgba(255,255,255,0.12)');
    rung.setAttribute('stroke-width', '1.4');
    group.appendChild(rung);

    [x1, x2].forEach((x, idx) => {
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', x.toFixed(1));
      dot.setAttribute('cy', y.toFixed(1));
      dot.setAttribute('r', idx === 0 ? '4.2' : '3.4');
      dot.setAttribute('fill', idx === 0 ? 'url(#strandA)' : 'rgba(110,232,218,0.55)');
      group.appendChild(dot);
    });
  }

  // strand paths
  const makeStrand = (phaseOffset, opacity) => {
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const y = (height / steps) * i;
      const angle = (i / steps) * Math.PI * 4 + phaseOffset;
      const x = centerX + Math.sin(angle) * amplitude;
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d.trim());
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#strandA)');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('opacity', opacity);
    group.insertBefore(path, group.firstChild);
  };

  makeStrand(0, '0.75');
  makeStrand(Math.PI, '0.35');
}

/* ---------- Scroll reveal for sections ---------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.about-copy, .about-visual, .focus-card, .service-row, .value-item, .partners-copy, .partners-points, .contact-info, .contact-form, .section-head'
  );

  targets.forEach((el) => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Contact form (front-end only placeholder) ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentLang = localStorage.getItem('language') || 'tr';
    if (!form.checkValidity()) {
      note.textContent = currentLang === 'tr' ? 'Lütfen zorunlu alanları doldurun.' : 'Please fill in all required fields.';
      note.style.color = '#e05d5d';
      return;
    }
    note.style.color = '';
    note.textContent = currentLang === 'tr' ? 'Mesajınız için teşekkürler! En kısa sürede size dönüş yapacağız.' : 'Thank you for your message! We will get back to you shortly.';
    form.reset();
  });
}

/* ---------- Language Toggle ---------- */
function initLanguageToggle() {
  const langButtons = document.querySelectorAll('.lang-btn');
  const savedLang = localStorage.getItem('language') || 'tr';

  // Set initial language
  setLanguage(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
      localStorage.setItem('language', lang);
    });
  });
}

function setLanguage(lang) {
  // Update buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
  });

  // Update all elements with data-tr and data-en
  document.querySelectorAll('[data-tr][data-en]').forEach(el => {
    const text = lang === 'tr' ? el.getAttribute('data-tr') : el.getAttribute('data-en');
    if (el.children.length === 0) {
      el.textContent = text;
    } else {
      el.firstChild?.nodeValue ? (el.firstChild.nodeValue = text) : null;
    }
  });
}
