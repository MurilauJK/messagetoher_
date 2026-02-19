(function () {
  const confettiContainer = document.getElementById('confetti-container');
  const heartsContainer = document.getElementById('hearts-container');

  if (!confettiContainer || !heartsContainer) return;

  const cores = ['#ff85c1', '#e91e8c', '#b388ff', '#7c4dff', '#ffb3d9', '#ffeb3b', '#fff'];
  const emojis = ['💕', '💖', '💗', '❤️', '🌸', '💘', '✨'];

  function criarConfetti() {
    const c = document.createElement('div');
    let cls = 'confetti';
    if (Math.random() > 0.7) cls += ' confetti-grande';
    if (Math.random() > 0.6) cls += ' confetti-redondo';
    c.className = cls;
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-20px';
    c.style.background = cores[Math.floor(Math.random() * cores.length)];
    c.style.animationDuration = 2.5 + Math.random() * 2.5 + 's';
    c.style.animationDelay = Math.random() * 0.3 + 's';
    confettiContainer.appendChild(c);
    const duration = (2.5 + Math.random() * 2.5 + 0.5) * 1000;
    setTimeout(function () {
      if (c.parentNode) c.remove();
    }, duration);
  }

  function criarCoracao() {
    const h = document.createElement('span');
    h.className = 'heart' + (Math.random() > 0.7 ? ' heart-grande' : '');
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + 'vw';
    h.style.bottom = '-30px';
    h.style.animationDuration = 2.2 + Math.random() * 2.2 + 's';
    h.style.animationDelay = Math.random() * 0.2 + 's';
    heartsContainer.appendChild(h);
    const duration = (2.2 + Math.random() * 2.2 + 0.5) * 1000;
    setTimeout(function () {
      if (h.parentNode) h.remove();
    }, duration);
  }

  function chuva() {
    criarConfetti();
    criarConfetti();
    criarConfetti();
    criarCoracao();
    criarCoracao();
  }

  chuva();
  setInterval(chuva, 400);
})();
