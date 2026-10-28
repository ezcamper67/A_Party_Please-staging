// A Party Please — home page behavior
(function () {
  const nav = document.getElementById('main-nav');
  const cake = document.getElementById('cake-toggle');
  const mobile = window.matchMedia('(max-width: 960px)');

  // Cake menu (mobile)
  function setNav(open) {
    cake.setAttribute('aria-expanded', String(open));
    cake.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.hidden = mobile.matches && !open;
  }
  cake.addEventListener('click', () => setNav(cake.getAttribute('aria-expanded') !== 'true'));
  mobile.addEventListener('change', () => setNav(false));
  setNav(false);

  // Dropdowns (click/tap + keyboard)
  const triggers = document.querySelectorAll('.menu-trigger');
  function closeMenus(except) {
    triggers.forEach(t => {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      t.parentElement.classList.remove('open');
    });
  }
  triggers.forEach(t => {
    t.addEventListener('click', e => {
      e.stopPropagation();
      const open = t.getAttribute('aria-expanded') !== 'true';
      closeMenus(t);
      t.setAttribute('aria-expanded', String(open));
      t.parentElement.classList.toggle('open', open);
    });
  });
  document.addEventListener('click', () => closeMenus());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenus(); if (mobile.matches) setNav(false); } });

  // Close the mobile menu after choosing a link
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) { closeMenus(); if (mobile.matches) setNav(false); }
  });

  // Pre-fill the quote form from service, event and bundle links
  const eventSelect = document.getElementById('f-event');
  const charRow = document.getElementById('row-character');
  const charBox = document.getElementById('s-characters');
  const notes = document.getElementById('f-notes');

  function syncCharacter() { charRow.hidden = !charBox.checked; }
  charBox.addEventListener('change', syncCharacter);

  document.querySelectorAll('[data-service]').forEach(a => a.addEventListener('click', () => {
    const box = document.getElementById('s-' + a.dataset.service);
    if (box) box.checked = true;
    syncCharacter();
  }));
  document.querySelectorAll('[data-event]').forEach(a => a.addEventListener('click', () => {
    eventSelect.value = a.dataset.event;
    if (a.dataset.event === 'kids' || a.dataset.event === 'holiday') { charBox.checked = true; syncCharacter(); }
  }));
  document.querySelectorAll('[data-bundle="princess"]').forEach(a => a.addEventListener('click', () => {
    eventSelect.value = 'kids';
    ['characters', 'decor', 'cakes', 'photography'].forEach(s => { document.getElementById('s-' + s).checked = true; });
    syncCharacter();
    if (!notes.value) notes.value = 'Interested in the Pretty as a Princess bundle.';
  }));

  // Earliest selectable date = today
  const date = document.getElementById('f-date');
  date.min = new Date().toISOString().slice(0, 10);

  document.getElementById('year').textContent = new Date().getFullYear();
})();
