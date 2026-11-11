// Гузариши саҳифаҳо дар навигатсияи поёнӣ
function switchTab(tabName) {
  // 1. Пӯшондани ҳама саҳифаҳо
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));

  // 2. Бардоштани холати фаъол аз тугмаҳо
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));

  // 3. Нишон додани саҳифаи интихобшуда
  const activePage = document.getElementById(`page-${tabName}`);
  if (activePage) {
    activePage.classList.add('active');
  }

  // 4. Фаъол кардани тугмаи мувофиқ
  const indexMap = { 'home': 0, 'stores': 1, 'profile': 2, 'settings': 3 };
  if (navBtns[indexMap[tabName]]) {
    navBtns[indexMap[tabName]].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Регистратсияи Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker фаъол шуд:', reg.scope))
      .catch(err => console.log('Хатогӣ дар Service Worker:', err));
  });
}
