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
  initArticleModal();
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
  const closeBtn = document.getElementById('nav-close');

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  const closeNav = () => {
    nav.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  closeBtn.addEventListener('click', closeNav);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
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

  // Update form input placeholders
  document.querySelectorAll('[data-placeholder-tr][data-placeholder-en]').forEach(el => {
    const placeholder = lang === 'tr' ? el.getAttribute('data-placeholder-tr') : el.getAttribute('data-placeholder-en');
    el.setAttribute('placeholder', placeholder);
  });
}

/* ---------- Article Modal ---------- */
const articles = {
  'tick-borne': {
    tr: {
      title: 'Fransa\'da Köpeklerde Kene Kaynaklı Kan Patojenleri Tespit Edildi: Erken Tanının Önemi',
      date: '17 Haziran 2026',
      content: `
        <p>Haziran 2026\'da One Health dergisinde yayımlanan bilimsel bir araştırma, Fransa\'daki köpeklerde kene kaynaklı enfeksiyöz etkenlerin varlığını ve moleküler tanının önemini ortaya koydu.</p>

        <p>Fransa\'nın 34 farklı bölgesindeki 41 veteriner kliniğinin katılımıyla yürütülen araştırmada, 82 köpek ve bu hayvanlardan toplanan 165 kene incelendi.</p>

        <p>Araştırma sonucunda 13 köpekte (%16) en az bir kene kaynaklı patojene ilişkin pozitif bulgu elde edildi.</p>

        <h3>Hangi Patojenler Tespit Edildi?</h3>

        <p>Araştırmada köpeklerde:</p>
        <ul>
          <li>Babesia canis canis: 5 köpekte</li>
          <li>Borrelia garinii: 5 köpekte</li>
          <li>Anaplasma spp.: 3 köpekte antikor pozitifliği</li>
          <li>Ehrlichia spp.: 1 köpekte antikor pozitifliği tespit edildi.</li>
        </ul>

        <p>Dikkat çekici bulgulardan biri, pozitif sonuç elde edilen bazı köpeklerde belirgin klinik belirtilerin bulunmamasıydı. Bu durum, enfeksiyöz etkenlerin araştırılmasında laboratuvar tanısının önemini vurgulamaktadır.</p>

        <h3>Moleküler Tanı Neden Önemli?</h3>

        <p>Kene kaynaklı enfeksiyonlar köpeklerde ateş, halsizlik, iştahsızlık, anemi ve bazı durumlarda ciddi sağlık sorunlarına neden olabilir.</p>

        <p>Real-Time PCR gibi moleküler tanı yöntemleri, patojenlerin genetik materyalini doğrudan tespit ederek hızlı, yüksek duyarlılığa ve özgüllüğe sahip analizler yapılmasını sağlar.</p>

        <p>Uygun şekilde valide edilmiş moleküler testler, düşük miktardaki hedef genetik materyalin belirlenmesine ve birden fazla enfeksiyöz etkenin araştırılmasına olanak tanır.</p>

        <h3>Erken Tanı, Hayvan Sağlığında Önemli Bir Adım</h3>

        <p>Avrupa\'da gerçekleştirilen bu araştırma, kene kaynaklı patojenlerin izlenmesinde ve doğru tanısal değerlendirmede moleküler yöntemlerin önemini bir kez daha göstermektedir.</p>

        <p>Integrity Bioscience, veteriner moleküler tanı alanında geliştirdiği yenilikçi çözümlerle hızlı, güvenilir ve bilimsel temelli tanı süreçlerini desteklemeyi hedeflemektedir.</p>

        <h3>Bilimsel Kaynak</h3>

        <p>Tahir, D. ve ark. (2026). Tick-borne pathogens in dogs and their ticks in France: Molecular and serological evidence from a multicenter participatory study. One Health, 23, 101487. Yayın tarihi: 17 Haziran 2026.</p>
        <p><a href="https://doi.org/10.1016/j.onehlt.2026.101487" target="_blank">https://doi.org/10.1016/j.onehlt.2026.101487</a></p>

        <p><strong>Not:</strong> Araştırma, 2022–2023 döneminde toplanan örneklere dayanmaktadır. Bulgular Fransa genelindeki hastalık yaygınlığını temsil etmemektedir.</p>

        <p><em>Bu içerik bilgilendirme amaçlıdır ve veteriner hekim muayenesinin yerine geçmez.</em></p>
      `
    },
    en: {
      title: 'Tick-borne Blood Pathogens Detected in Dogs in France: The Importance of Early Diagnosis',
      date: 'June 17, 2026',
      content: `
        <p>A scientific study published in June 2026 in the One Health journal revealed the presence of tick-borne infectious agents in dogs in France and the importance of molecular diagnostics.</p>

        <p>Conducted with the participation of 41 veterinary clinics from 34 different regions in France, the research examined 82 dogs and 165 ticks collected from these animals.</p>

        <p>As a result of the research, positive findings were obtained for at least one tick-borne pathogen in 13 dogs (16%).</p>

        <h3>Which Pathogens Were Detected?</h3>

        <p>In the research, the following pathogens were found in dogs:</p>
        <ul>
          <li>Babesia canis canis: in 5 dogs</li>
          <li>Borrelia garinii: in 5 dogs</li>
          <li>Anaplasma spp.: antibody positivity in 3 dogs</li>
          <li>Ehrlichia spp.: antibody positivity detected in 1 dog</li>
        </ul>

        <p>One remarkable finding was the absence of clear clinical signs in some dogs with positive results. This emphasizes the importance of laboratory diagnostics in the investigation of infectious agents.</p>

        <h3>Why is Molecular Diagnostics Important?</h3>

        <p>Tick-borne infections in dogs can cause fever, lethargy, loss of appetite, anemia, and in some cases serious health problems.</p>

        <p>Molecular diagnostic methods such as Real-Time PCR directly detect the genetic material of pathogens, providing rapid analyses with high sensitivity and specificity.</p>

        <p>Properly validated molecular tests allow detection of target genetic material in low quantities and investigation of multiple infectious agents.</p>

        <h3>Early Diagnosis: An Important Step in Animal Health</h3>

        <p>This research conducted in Europe once again demonstrates the importance of molecular methods in monitoring tick-borne pathogens and proper diagnostic assessment.</p>

        <p>Integrity Bioscience aims to support fast, reliable, and scientifically-based diagnostic processes through innovative solutions it has developed in the field of veterinary molecular diagnostics.</p>

        <h3>Scientific Source</h3>

        <p>Tahir, D. et al. (2026). Tick-borne pathogens in dogs and their ticks in France: Molecular and serological evidence from a multicenter participatory study. One Health, 23, 101487. Published: June 17, 2026.</p>
        <p><a href="https://doi.org/10.1016/j.onehlt.2026.101487" target="_blank">https://doi.org/10.1016/j.onehlt.2026.101487</a></p>

        <p><strong>Note:</strong> The research is based on samples collected during 2022–2023. The findings do not represent disease prevalence across France.</p>

        <p><em>This content is for informational purposes only and is not a substitute for veterinary examination.</em></p>
      `
    }
  }
};

function initArticleModal() {
  const modal = document.getElementById('articleModal');
  const modalClose = document.getElementById('modalClose');
  const newsCards = document.querySelectorAll('.news-card[data-article-id]');

  newsCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      const currentLang = localStorage.getItem('language') || 'tr';
      const article = articles[articleId]?.[currentLang];

      if (article) {
        const modalArticle = document.getElementById('modalArticle');
        modalArticle.innerHTML = `
          <span class="article-date">${article.date}</span>
          <h2>${article.title}</h2>
          ${article.content}
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
