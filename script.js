// Riferimenti agli elementi del DOM usati nello script
const menuBtn = document.getElementById('menuBtn');            // pulsante "hamburger" per aprire/chiudere il menu mobile
const navMenu = document.getElementById('navMenu');            // contenitore del menu di navigazione
const tabs = document.querySelectorAll('.tab');                // tutti i pulsanti/etichette delle tab
const panels = document.querySelectorAll('.panel');            // tutti i pannelli di contenuto collegati alle tab
const sections = document.querySelectorAll('.hero, .section'); // sezioni della pagina da animare all'apparire (scroll)

// Al click sul pulsante menu, aggiunge/rimuove la classe 'open'
// che (via CSS) mostra o nasconde il menu di navigazione mobile
menuBtn?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

// Gestione del sistema a tab: al click su una tab,
// rimuove la classe 'active' da tutte le tab e i pannelli,
// poi la riattiva solo sulla tab cliccata e sul pannello corrispondente
// (associato tramite l'attributo data-tab / data-panel)
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.remove('active'));
    panels.forEach((panel) => panel.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
  });
});

// Gestione dei link del menu di navigazione:
// al click chiude il menu mobile e, se il link punta a un'ancora (#id)
// nella stessa pagina, esegue uno scroll animato ("smooth") fino
// alla sezione target invece del salto istantaneo del browser
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

// Rende visibile una sezione: aggiunge 'visible' (fa partire la transizione
// CSS di fade/slide-in) e, se la sezione contiene un contenitore '.bars',
// riempie solo le barre al suo interno in base alla percentuale in data-pct.
// Con animate=false la transizione viene disattivata (classe 'no-anim'),
// così la sezione compare istantaneamente invece di animarsi.
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

// IntersectionObserver: osserva quando una sezione entra nella viewport
// (per almeno il 20% della sua area, grazie a threshold: 0.2, e solo quando
// supera un margine interno del 15% dal basso, grazie a rootMargin, così
// da farla scattare quando l'utente vi scrolla davvero sopra).
// Quando succede, la rivela con l'animazione e smette di osservarla
// (non serve più: l'animazione va eseguita una sola volta).
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      revealSection(entry.target, true);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -15% 0px' });

// Per ogni sezione della pagina: se è già visibile nel viewport al
// caricamento (es. l'hero in cima alla pagina), la mostra subito senza
// animazione; altrimenti la affida all'observer, che la animerà solo
// quando l'utente ci scrolla sopra.
sections.forEach((section) => {
  const rect = section.getBoundingClientRect();
  const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
  if (alreadyVisible) {
    revealSection(section, false);
  } else {
    observer.observe(section);
  }
});
