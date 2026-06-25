/* Maître Sékou — interactions partagées (menu mobile, révélation au scroll, remonter en haut, braises) */
(function () {
  document.documentElement.classList.add('js');

  // Menu mobile
  var burger = document.querySelector('[data-burger]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.getAttribute('data-open') === '1';
      menu.setAttribute('data-open', open ? '0' : '1');
      burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  // Formulaire de contact -> WhatsApp (message pré-rempli)
  var waForm = document.querySelector('[data-wa-form]');
  if (waForm) {
    waForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof waForm.checkValidity === 'function' && !waForm.checkValidity()) {
        if (typeof waForm.reportValidity === 'function') { waForm.reportValidity(); }
        return;
      }
      var num = waForm.getAttribute('data-wa-number') || '';
      var val = function (sel) { var f = waForm.querySelector(sel); return f ? f.value.trim() : ''; };
      var nom = val('[name="nom"]'), tel = val('[name="tel"]'), msg = val('[name="message"]');
      var texte = 'Bonjour Maître Sékou,';
      if (nom) { texte += ' je suis ' + nom + '.'; }
      if (msg) { texte += '\n\n' + msg; }
      if (tel) { texte += '\n\nMon numéro : ' + tel; }
      window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(texte), '_blank', 'noopener');
    });
  }

  // Bouton remonter en haut
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) {
    var onScroll = function () {
      if (window.pageYOffset > 500) { toTop.classList.add('show'); }
      else { toTop.classList.remove('show'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // FAQ en accordéon : une seule question ouverte à la fois
  [].slice.call(document.querySelectorAll('.faq')).forEach(function (faq) {
    var items = [].slice.call(faq.querySelectorAll('details'));
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) { return; }
        items.forEach(function (other) {
          if (other !== d && other.open) { other.open = false; }
        });
      });
    });
  });

  // Révélation au scroll (amélioration progressive)
  var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && els.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // Braises (embers) dans le héro
  var cv = document.querySelector('canvas[data-embers]');
  if (cv && cv.getContext && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, P = [];
    function seed() {
      var n = Math.max(28, Math.min(72, Math.round(w / 16)));
      P = Array.from({ length: n }, function () {
        return {
          x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.7 + 0.4,
          s: Math.random() * 0.45 + 0.12, a: Math.random() * 0.5 + 0.18,
          ph: Math.random() * 6.28, em: Math.random() < 0.22
        };
      });
    }
    function resize() {
      var rect = cv.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height; cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    }
    resize(); window.addEventListener('resize', resize);
    (function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.y -= p.s; p.x += Math.sin(p.y * 0.012 + p.ph) * 0.3; p.ph += 0.004;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        var col = p.em ? '196,80,46' : '201,154,75';
        var alpha = p.a * (0.55 + 0.45 * Math.sin(p.ph * 2.2));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(' + col + ',' + alpha.toFixed(3) + ')';
        ctx.shadowBlur = 7; ctx.shadowColor = 'rgba(' + col + ',0.55)'; ctx.fill();
      }
      requestAnimationFrame(tick);
    })();
  }
})();
