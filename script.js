// riferimenti DOM: bottone/contenitore del menu mobile, tab e pannelli della sezione Persone,
// e tutte le sezioni (.hero, .section) da animare quando entrano nel viewport
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const sections = document.querySelectorAll('.hero, .section');

// apre/chiude il menu mobile al click sull'hamburger
menuBtn?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// sistema a tab: click su una tab e le disattiva tutte, attiva quella cliccata
// e il pannello collegato 
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    panels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
  });
});

// link del menu: chiude il menu mobile e, se puntano a un'ancora della
// pagina, fanno uno scroll animato invece del salto secco del browser
const navLinks = document.querySelectorAll('.nav a');
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    navMenu.classList.remove('open');
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }
  });
});

// animazione di entrata delle sezioni allo scroll: revealSection() mostra
// la sezione (con o senza animazione) e riempie le sue barre se ne ha
// l'observer tiene d'occhio le sezioni non ancora viste e le rivela
// quando l'utente ci scrolla sopra, mentre quelle già in vista al
// caricamento vengono mostrate subito senza animarle
function revealSection(section, animate) {
  if (!animate) section.classList.add('no-anim');
  section.classList.add('visible');
  const barsContainer = section.querySelector('.bars');
  if (barsContainer) {
    barsContainer.querySelectorAll('.bar-fill').forEach((bar) => {
      bar.style.width = `${bar.dataset.pct}%`;
    });
  }
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      revealSection(entry.target, true);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -15% 0px' });

sections.forEach((section) => {
  const rect = section.getBoundingClientRect();
  const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (alreadyVisible) {
    revealSection(section, false);
  } else {
    observer.observe(section);
  }
});
