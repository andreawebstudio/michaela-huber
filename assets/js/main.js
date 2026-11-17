/* Michaela Huber — interazioni del sito (vanilla JS, nessuna libreria) */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     MODULO CONTATTI
     Inserire l'endpoint di un servizio di invio (es. Formspree:
     "https://formspree.io/f/XXXXXXX"). Finché resta vuoto il modulo non
     simula l'invio: apre il programma di posta con il messaggio compilato.
  ------------------------------------------------------------------ */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'michaelaannahuber@gmail.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  if (!hasIO) document.documentElement.classList.add('no-io');

  /* ---------- Header ---------- */
  var header = document.getElementById('site-header');
  function onScrollHeader() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    menu.hidden = !open;
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (toggle.getAttribute('aria-expanded') === 'true' && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });

  /* ---------- Voce di menu attiva ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a'));
  if (hasIO) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Animazioni d'ingresso ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Come funziona: percorso che si riempie allo scroll ---------- */
  var journey = document.getElementById('journey');
  if (journey) {
    var steps = Array.prototype.slice.call(journey.querySelectorAll('.jstep'));
    var desktopMQ = window.matchMedia('(min-width: 900px)');
    var ticking = false;

    function updateJourney() {
      ticking = false;
      if (reduceMotion || !hasIO) {
        journey.style.setProperty('--p', 1);
        steps.forEach(function (s) { s.classList.add('is-active'); });
        return;
      }
      var r = journey.getBoundingClientRect();
      var vh = window.innerHeight;
      // da quando il percorso entra al 80% della viewport fino a quando la sua fine è al 55%
      var start = vh * 0.8;
      var end = vh * 0.55;
      var p = (start - r.top) / (r.height + start - end);
      p = Math.max(0, Math.min(1, p));
      journey.style.setProperty('--p', p.toFixed(3));
      steps.forEach(function (s, i) {
        var threshold = desktopMQ.matches ? i / (steps.length - 1) : i / steps.length;
        s.classList.toggle('is-active', p >= threshold - 0.001 && p > 0);
      });
    }
    function requestJourney() { if (!ticking) { ticking = true; window.requestAnimationFrame(updateJourney); } }
    updateJourney();
    window.addEventListener('scroll', requestJourney, { passive: true });
    window.addEventListener('resize', requestJourney);
  }

  /* ---------- FAQ (tutte chiuse all'avvio) ---------- */
  document.querySelectorAll('.faq-q button').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    function setFocusable(open) { panel.querySelectorAll('a, button, input').forEach(function (el) { el.tabIndex = open ? 0 : -1; }); }
    panel.setAttribute('aria-hidden', 'true');
    setFocusable(false);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', String(!open));
      setFocusable(open);
    });
  });

  /* ---------- Laboratori: modale con calendario ---------- */
  var labOpen = document.getElementById('lab-open');
  var labDialog = document.getElementById('lab-dialog');
  if (labOpen && labDialog) {
    var supportsDialog = typeof labDialog.showModal === 'function';
    function openLab() {
      if (supportsDialog) labDialog.showModal(); else labDialog.setAttribute('open', '');
      document.body.style.overflow = 'hidden';
    }
    function closeLab() {
      if (supportsDialog) labDialog.close(); else { labDialog.removeAttribute('open'); onLabClosed(); }
    }
    function onLabClosed() { document.body.style.overflow = ''; }
    labOpen.addEventListener('click', openLab);
    labDialog.addEventListener('close', function () { onLabClosed(); labOpen.focus(); });
    labDialog.addEventListener('click', function (e) {
      if (e.target === labDialog) closeLab(); // clic sullo sfondo
      if (e.target.closest('[data-close]')) closeLab();
      var book = e.target.closest('[data-book]');
      if (book) {
        closeLab();
        prefillBooking(book.getAttribute('data-book'));
      }
    });
  }

  /* ---------- Anno nel footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Modulo contatti ---------- */
  var form = document.getElementById('contact-form');

  function prefillBooking(labLabel) {
    if (!form) return;
    form.elements.motivo.value = 'Laboratori per bambini';
    var msg = form.elements.messaggio;
    if (!msg.value.trim()) {
      msg.value = 'Vorrei prenotare il laboratorio "' + labLabel + '".\nNome e età del bambino/a: \n';
    }
    document.getElementById('contatti').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.setTimeout(function () { form.elements.nome.focus({ preventScroll: true }); }, reduceMotion ? 0 : 600);
  }

  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('.btn-submit');
  var useEndpoint = /^https:\/\//.test(FORM_ENDPOINT);

  var rules = {
    nome: function (v) { return v.trim().length >= 2 ? '' : 'Inserisci il tuo nome.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Inserisci un indirizzo email valido.'; },
    motivo: function (v) { return v ? '' : 'Seleziona il motivo del contatto.'; },
    messaggio: function (v) { return v.trim().length >= 10 ? '' : 'Scrivi un breve messaggio (almeno 10 caratteri).'; },
    privacy: function (_, el) { return el.checked ? '' : 'Per inviare il messaggio è necessario il consenso privacy.'; }
  };
  var errIds = { nome: 'f-nome-err', email: 'f-email-err', motivo: 'f-motivo-err', messaggio: 'f-messaggio-err', privacy: 'f-privacy-err' };

  function validateField(name) {
    var el = form.elements[name];
    var msg = rules[name](el.value, el);
    document.getElementById(errIds[name]).textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    var described = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    described.push(errIds[name]);
    el.setAttribute('aria-describedby', described.join(' '));
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur', function () {
      if (el.getAttribute('aria-invalid') === 'true' || el.value) validateField(name);
    });
  });

  function setStatus(type, html) { statusEl.className = 'form-status is-' + type; statusEl.innerHTML = html; }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) { if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name]; });
    if (firstInvalid) { firstInvalid.focus(); return; }
    if (form.elements._gotcha.value) return;

    var data = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      motivo: form.elements.motivo.value,
      messaggio: form.elements.messaggio.value.trim()
    };

    if (useEndpoint) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso…';
      var fd = new FormData(form);
      fd.append('_subject', 'Richiesta dal sito – ' + data.motivo);
      fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          setStatus('success', 'Grazie, il tuo messaggio è stato inviato. Ti risponderò il prima possibile.');
        })
        .catch(function () {
          setStatus('error', 'Non è stato possibile inviare il messaggio. Puoi riprovare oppure scrivermi a <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.');
        })
        .finally(function () { submitBtn.disabled = false; submitBtn.textContent = 'Invia il messaggio'; });
      return;
    }

    // Nessun backend configurato: composizione email, nessun invio simulato
    var body = 'Nome: ' + data.nome + '\nEmail: ' + data.email + '\n' +
      (data.telefono ? 'Telefono: ' + data.telefono + '\n' : '') +
      'Motivo del contatto: ' + data.motivo + '\n\n' + data.messaggio + '\n';
    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent('Richiesta dal sito – ' + data.motivo) +
      '&body=' + encodeURIComponent(body);
    setStatus('info', 'Si sta aprendo il tuo programma di posta con il messaggio pronto: <strong>ricordati di premere “Invia”</strong>. Se non si apre nulla, scrivimi a <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.');
  });
})();
