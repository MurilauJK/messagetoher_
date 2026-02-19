(function () {
  const modal = document.getElementById('modal');
  const btnSim = document.getElementById('btn-sim');
  const btnNao = document.getElementById('btn-nao');
  const btnPensar = document.getElementById('btn-pensar');
  const opcoesIniciais = document.getElementById('opcoes-iniciais');
  const opcoesCelebracao = document.getElementById('opcoes-celebracao');
  const confettiContainer = document.getElementById('confetti-container');
  const heartsContainer = document.getElementById('hearts-container');
  const flashOverlay = document.getElementById('flash-overlay');
  const modalContent = document.getElementById('modal-content');
  const sparklesContainer = document.getElementById('sparkles-container');
  const burstContainer = document.getElementById('burst-container');

  let posX = 0;
  let posY = 0;
  let centralizado = true;

  function centralizarModal() {
    if (!modal) return;
    const rect = modal.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    posX = (vw - rect.width) / 2;
    posY = (vh - rect.height) / 2;
    modal.style.left = posX + 'px';
    modal.style.top = posY + 'px';
    modal.style.transform = 'none';
    centralizado = true;
  }

  function moverModal() {
    if (!modal) return;
    const rect = modal.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 20;
    let newX = Math.random() * (vw - rect.width - margin * 2) + margin;
    let newY = Math.random() * (vh - rect.height - margin * 2) + margin;
    newX = Math.max(margin, Math.min(newX, vw - rect.width - margin));
    newY = Math.max(margin, Math.min(newY, vh - rect.height - margin));
    modal.style.left = newX + 'px';
    modal.style.top = newY + 'px';
    modal.style.transform = 'none';
    centralizado = false;
  }

  function initPosicao() {
    modal.style.position = 'fixed';
    centralizarModal();
  }

  btnNao.addEventListener('mouseenter', function () {
    moverModal();
  });

  btnPensar.addEventListener('mouseenter', function () {
    moverModal();
  });

  btnSim.addEventListener('click', function () {
    if (flashOverlay) {
      flashOverlay.classList.add('ativo');
      setTimeout(function () { flashOverlay.classList.remove('ativo'); }, 900);
    }
    if (modalContent) modalContent.classList.add('celebrate');
    setTimeout(function () {
      if (modalContent) modalContent.classList.remove('celebrate');
    }, 700);

    opcoesIniciais.classList.add('invisible');
    opcoesCelebracao.classList.remove('hidden');
    if (!centralizado) centralizarModal();

    criarBurst();
    criarSparkles();
    criarConfetti();
    criarCoracoes();
  });

  function criarBurst() {
    const emojis = ['💕', '💖', '💗', '❤️', '🌸', '✨', '💘'];
    const qtd = 24;
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    for (let i = 0; i < qtd; i++) {
      const ang = (i / qtd) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 120 + Math.random() * 80;
      const bx = Math.cos(ang) * dist;
      const by = Math.sin(ang) * dist;
      const el = document.createElement('span');
      el.className = 'burst-item' + (Math.random() > 0.6 ? ' heart-grande' : '');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.setProperty('--bx', bx + 'px');
      el.style.setProperty('--by', by + 'px');
      el.style.left = centroX + 'px';
      el.style.top = centroY + 'px';
      el.style.animationDelay = Math.random() * 0.15 + 's';
      burstContainer.appendChild(el);
      setTimeout(function () { el.remove(); }, 1300);
    }
  }

  function criarSparkles() {
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    const raio = 180;
    for (let i = 0; i < 20; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = raio * (0.5 + Math.random() * 0.5);
      const x = centroX + Math.cos(ang) * r;
      const y = centroY + Math.sin(ang) * r;
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.animationDelay = Math.random() * 0.3 + 's';
      sparklesContainer.appendChild(s);
      setTimeout(function () { s.remove(); }, 1300);
    }
  }

  function criarConfetti() {
    const cores = ['#ff85c1', '#e91e8c', '#b388ff', '#7c4dff', '#ffb3d9', '#ffeb3b', '#fff'];
    const qtd = 120;
    for (let i = 0; i < qtd; i++) {
      const c = document.createElement('div');
      let cls = 'confetti';
      if (Math.random() > 0.7) cls += ' confetti-grande';
      if (Math.random() > 0.6) cls += ' confetti-redondo';
      c.className = cls;
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top = '-20px';
      c.style.background = cores[Math.floor(Math.random() * cores.length)];
      c.style.animationDuration = 2.2 + Math.random() * 2.5 + 's';
      c.style.animationDelay = Math.random() * 0.8 + 's';
      confettiContainer.appendChild(c);
      setTimeout(function () { c.remove(); }, 5500);
    }
  }

  function criarCoracoes() {
    const emojis = ['💕', '💖', '💗', '❤️', '🌸', '💘', '✨'];
    const qtd = 45;
    for (let i = 0; i < qtd; i++) {
      const h = document.createElement('span');
      h.className = 'heart' + (Math.random() > 0.7 ? ' heart-grande' : '');
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left = Math.random() * 100 + 'vw';
      h.style.bottom = '-30px';
      h.style.animationDuration = 2.2 + Math.random() * 2.2 + 's';
      h.style.animationDelay = Math.random() * 1.2 + 's';
      heartsContainer.appendChild(h);
      setTimeout(function () { h.remove(); }, 5500);
    }
  }

  window.addEventListener('resize', function () {
    if (centralizado) centralizarModal();
  });

  initPosicao();
})();
