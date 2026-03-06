import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import RunnerGame from '../components/RunnerGame'

const ASSETS = '/assets'
const CORES = ['#ff85c1', '#e91e8c', '#b388ff', '#7c4dff', '#ffb3d9', '#ffeb3b', '#fff']
const EMOJIS = ['💕', '💖', '💗', '❤️', '🌸', '💘', '✨']

export default function Home() {
  const [showGame, setShowGame] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(1)
  const [showCelebration, setShowCelebration] = useState(false)
  const [flashActive, setFlashActive] = useState(false)
  const [celebrateClass, setCelebrateClass] = useState(false)
  const [unlockedCards, setUnlockedCards] = useState(0)
  const [showCardsPanel, setShowCardsPanel] = useState(false)
  const [cardsPanelClosing, setCardsPanelClosing] = useState(false)
  const [showParquePanel, setShowParquePanel] = useState(false)
  const [parquePanelClosing, setParquePanelClosing] = useState(false)
  const [duelStage, setDuelStage] = useState('idle') // 'idle' | 'intro' | 'hit'
  const modalRef = useRef(null)
  const confettiRef = useRef(null)
  const heartsRef = useRef(null)
  const sparklesRef = useRef(null)
  const burstRef = useRef(null)
  const centralizadoRef = useRef(true)
  const musicFase1Ref = useRef(null)
  const musicFase2Ref = useRef(null)
  const somCelebracaoRef = useRef(null)
  const somPuloDuelRef = useRef(null)
  const somSocoRef = useRef(null)

  const centralizarModal = () => {
    const modal = modalRef.current
    if (!modal) return
    const rect = modal.getBoundingClientRect()
    modal.style.left = (window.innerWidth - rect.width) / 2 + 'px'
    modal.style.top = (window.innerHeight - rect.height) / 2 + 'px'
    modal.style.transform = 'none'
    centralizadoRef.current = true
  }

  const moverModal = () => {
    const modal = modalRef.current
    if (!modal) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const rect = modal.getBoundingClientRect()
    const margin = 20
    let newX = Math.random() * (vw - rect.width - margin * 2) + margin
    let newY = Math.random() * (vh - rect.height - margin * 2) + margin
    newX = Math.max(margin, Math.min(newX, vw - rect.width - margin))
    newY = Math.max(margin, Math.min(newY, vh - rect.height - margin))
    modal.style.left = newX + 'px'
    modal.style.top = newY + 'px'
    modal.style.transform = 'none'
    centralizadoRef.current = false
  }

  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return
    modal.style.position = 'fixed'
    centralizarModal()
  }, [])

  useEffect(() => {
    if (!centralizadoRef.current) return
    const onResize = () => centralizarModal()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!showGame) return
    requestAnimationFrame(() => requestAnimationFrame(centralizarModal))
  }, [showGame])

  useEffect(() => {
    if (!showCelebration) return
    requestAnimationFrame(() => requestAnimationFrame(centralizarModal))
  }, [showCelebration])

  // Centralizar modal quando o jogo abrir (após clicar em Sim)
  useEffect(() => {
    if (!showGame) return
    requestAnimationFrame(() => requestAnimationFrame(centralizarModal))
  }, [showGame])

  /* Música da fase 1: toca só quando o jogo está aberto e é a fase 1 */
  useEffect(() => {
    const audio = musicFase1Ref.current
    if (!audio) return
    if (showGame && currentPhase === 1) {
      audio.volume = 0.4
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [showGame, currentPhase])

  /* Música da fase 2: toca só quando o jogo está aberto e é a fase 2, volume 40% */
  useEffect(() => {
    const audio = musicFase2Ref.current
    if (!audio) return
    if (showGame && (currentPhase === 2 || currentPhase === 3)) {
      audio.volume = 0.4
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [showGame, currentPhase])

  /* Som da tela de celebração: toca quando a comemoração é exibida */
  useEffect(() => {
    const audio = somCelebracaoRef.current
    if (!audio || !showCelebration) return
    audio.volume = 0.5
    audio.currentTime = 0
    audio.play().catch(() => {})
  }, [showCelebration])

  const criarBurst = () => {
    const container = burstRef.current
    if (!container) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2 + Math.random() * 0.5
      const dist = 120 + Math.random() * 80
      const el = document.createElement('span')
      el.className = 'burst-item' + (Math.random() > 0.6 ? ' heart-grande' : '')
      el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      el.style.setProperty('--bx', Math.cos(ang) * dist + 'px')
      el.style.setProperty('--by', Math.sin(ang) * dist + 'px')
      el.style.left = cx + 'px'
      el.style.top = cy + 'px'
      el.style.animationDelay = Math.random() * 0.15 + 's'
      container.appendChild(el)
      setTimeout(() => el.remove(), 1300)
    }
  }

  const criarSparkles = () => {
    const container = sparklesRef.current
    if (!container) return
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const raio = 180
    for (let i = 0; i < 20; i++) {
      const ang = Math.random() * Math.PI * 2
      const r = raio * (0.5 + Math.random() * 0.5)
      const el = document.createElement('div')
      el.className = 'sparkle'
      el.style.left = cx + Math.cos(ang) * r + 'px'
      el.style.top = cy + Math.sin(ang) * r + 'px'
      el.style.animationDelay = Math.random() * 0.3 + 's'
      container.appendChild(el)
      setTimeout(() => el.remove(), 1300)
    }
  }

  const criarConfetti = () => {
    const container = confettiRef.current
    if (!container) return
    for (let i = 0; i < 120; i++) {
      const c = document.createElement('div')
      c.className = 'confetti' + (Math.random() > 0.7 ? ' confetti-grande' : '') + (Math.random() > 0.6 ? ' confetti-redondo' : '')
      c.style.left = Math.random() * 100 + 'vw'
      c.style.top = '-20px'
      c.style.background = CORES[Math.floor(Math.random() * CORES.length)]
      c.style.animationDuration = 2.2 + Math.random() * 2.5 + 's'
      c.style.animationDelay = Math.random() * 0.8 + 's'
      container.appendChild(c)
      setTimeout(() => c.remove(), 5500)
    }
  }

  const criarCoracoes = () => {
    const container = heartsRef.current
    if (!container) return
    for (let i = 0; i < 45; i++) {
      const h = document.createElement('span')
      h.className = 'heart' + (Math.random() > 0.7 ? ' heart-grande' : '')
      h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      h.style.left = Math.random() * 100 + 'vw'
      h.style.bottom = '-30px'
      h.style.animationDuration = 2.2 + Math.random() * 2.2 + 's'
      h.style.animationDelay = Math.random() * 1.2 + 's'
      container.appendChild(h)
      setTimeout(() => h.remove(), 5500)
    }
  }

  const onSimClick = () => {
    if (duelStage !== 'idle' || showGame) return
    setFlashActive(true)
    setTimeout(() => setFlashActive(false), 400)
    if (!centralizadoRef.current) centralizarModal()

    // Inicia o mini-duelo: seu avatar entra e joga o Castiel para longe
    setDuelStage('intro')

    // Som de impacto (soco) ~0,5s antes do visual do hit (meio termo)
    setTimeout(() => {
      const audioSoco = somSocoRef.current
      if (audioSoco) {
        audioSoco.volume = 0.5
        audioSoco.currentTime = 0
        audioSoco.play().catch(() => {})
      }
    }, 500)

    // Castiel sendo arremessado (depois do seu avatar encostar)
    setTimeout(() => setDuelStage('hit'), 1000)

    // Depois da animação, inicia o jogo normalmente
    setTimeout(() => {
      setDuelStage('idle')
      setCurrentPhase(1)
      setShowGame(true)
    }, 2000)
  }

  const onGameWin = (phase) => {
    if (phase === 1) {
      setUnlockedCards((prev) => (prev < 1 ? 1 : prev))
      setCurrentPhase(2)
    } else if (phase === 2) {
      setUnlockedCards((prev) => (prev < 2 ? 2 : prev))
      setCurrentPhase(3)
    } else {
      /* Fase 3 concluída: mostrar celebração */
      setShowGame(false)
      setCelebrateClass(true)
      setTimeout(() => setCelebrateClass(false), 700)
      setShowCelebration(true)
      // Mantém apenas cartas 1 e 2 desbloqueadas; carta 3 é sempre misteriosa
      setUnlockedCards((prev) => (prev < 2 ? 2 : prev))
      criarBurst()
      criarSparkles()
      criarConfetti()
      criarCoracoes()
    }
  }

  /* 7 opções da aba (imagens e informações a definir depois) */
  const opcoesAba = [
    { id: 1, titulo: 'Opção 1', descricao: 'Em breve', imagem: null },
    { id: 2, titulo: 'Opção 2', descricao: 'Em breve', imagem: null },
    { id: 3, titulo: 'Opção 3', descricao: 'Em breve', imagem: null },
    { id: 4, titulo: 'Opção 4', descricao: 'Em breve', imagem: null },
    { id: 5, titulo: 'SAMURAI TURBO AT', descricao: 'Em breve', imagem: `${ASSETS}/opcao5_samurai.png` },
    { id: 6, titulo: 'SAMURAI TURBO MT', descricao: 'Em breve', imagem: `${ASSETS}/opcao6_samurai.png` },
    { id: 7, titulo: 'SAMURAI MT', descricao: 'Em breve', imagem: `${ASSETS}/opcao7_samurai.png` },
  ]

  const cartasColecao = [
    { id: 1, titulo: 'Carta 1 - O Mago', imagem: `${ASSETS}/mago.jpg` },
    { id: 2, titulo: 'Carta 2 - The Lovers', imagem: `${ASSETS}/lovers.jpg` },
    { id: 3, titulo: 'Carta 3', imagem: null },
  ]

  return (
    <>
      <div className={`bg-pattern${showCelebration ? ' bg-pattern--celebration' : ''}`} />
      {/* Aba visível só ao passar o mouse */}
      <aside className="aba-hover" aria-label="Opções extras">
        <div className="aba-hover-trigger">Opções</div>
        <div className="aba-hover-panel">
          <p className="aba-hover-titulo">Opções</p>
          <ul className="aba-hover-lista">
            {opcoesAba.map((op) => (
              <li key={op.id} className="aba-hover-item">
                <div className="aba-hover-item-img">
                  {op.imagem ? (
                    <img src={op.imagem} alt="" />
                  ) : (
                    <span className="aba-hover-placeholder" aria-hidden="true">?</span>
                  )}
                </div>
                <span className="aba-hover-item-label">{op.titulo}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <main className="container">
        <div ref={modalRef} className="modal">
          <div className={`modal-content${celebrateClass ? ' celebrate' : ''}${showGame ? ' modal-content--game' : ''}${showCelebration ? ' modal-content--celebracao' : ''}`}>
            {/* Tela inicial: pergunta + botões ou celebração */}
            <div className="modal-view-inicial" style={{ display: showGame ? 'none' : 'block' }}>
              {!showCelebration && (
                <div className={`modal-avatar-wrapper${duelStage === 'hit' ? ' modal-avatar-wrapper--hit' : ''}`}>
                  <img
                    src={`${ASSETS}/castiel.png`}
                    alt="Castiel te observando"
                    className="modal-avatar-img"
                  />
                </div>
              )}
              {!showCelebration && duelStage !== 'idle' && !showGame && (
                <div className={`modal-avatar-player${duelStage === 'hit' ? ' modal-avatar-player--pose' : ''}`}>
                  <img
                    src={`${ASSETS}/eu2.png`}
                    alt="Seu avatar heroico"
                    className="modal-avatar-img"
                  />
                </div>
              )}
              <h1 className="pergunta">NaNA você quer sair comigo?</h1>
              {!showCelebration ? (
                <div className="opcoes">
                  <button type="button" className="btn btn-sim" onClick={onSimClick}>Sim</button>
                  <button type="button" className="btn btn-nao" onMouseEnter={moverModal}>Não</button>
                  <button type="button" className="btn btn-pensar" onMouseEnter={moverModal}>Preciso Pensar</button>
                </div>
              ) : (
                <div className="opcoes-celebracao">
                  <p className="mensagem-celebracao mensagem-celebracao-fase">Todas as fases concluídas! 🎉</p>
                  <p className="mensagem-celebracao">Você passou de todas as fases e chegou nela! Cartas desbloqueadas!</p>
                  <div className="celebracao-casal-wrapper">
                    <img src={`${ASSETS}/celebracao_casal.png`} alt="Nós dois comemorando" className="celebracao-casal-img" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Jogo renderizado em portal (fora do modal) para garantir que apareça ao clicar em Sim */}
      {showGame &&
        createPortal(
          <div className="game-portal-wrapper">
            <button
              type="button"
              className="game-close-btn"
              onClick={() => { setShowGame(false); setCurrentPhase(1) }}
              aria-label="Fechar jogo"
            >
              ×
            </button>
            <div className="runner-game-wrapper">
              <RunnerGame key={`runner-phase-${currentPhase}`} phase={currentPhase} onWin={onGameWin} />
            </div>
          </div>,
          document.getElementById('game-root')
        )}
      <audio ref={musicFase1Ref} src={`${ASSETS}/musica_fase1.mp3`} loop aria-label="Música da fase 1" />
      <audio ref={musicFase2Ref} src={`${ASSETS}/musica_fase2.mp3`} loop aria-label="Música da fase 2" />
      <audio ref={somCelebracaoRef} src={`${ASSETS}/som_celebracao.mp3`} aria-label="Som da celebração" />
      <audio ref={somPuloDuelRef} src={`${ASSETS}/som_pulo.mp3`} aria-label="Som de pulo do duelo" />
      <audio ref={somSocoRef} src={`${ASSETS}/soco.mp3`} aria-label="Som de impacto no duelo" />
      {flashActive && <div className="flash-overlay ativo" aria-hidden="true" />}
      <div ref={confettiRef} className="confetti-container" />
      <div ref={heartsRef} className="hearts-container" />
      <div ref={sparklesRef} className="sparkles-container" />
      <div ref={burstRef} className="burst-container" />
      <aside className="cantinho-local" aria-label="Local e ajuda">
        <div className="local-item">
          <button
            type="button"
            className="local-icone"
            onClick={() => setShowParquePanel(true)}
            aria-label="Ver Parque Villa-Lobos"
          >
            📍
          </button>
          <span className="balao balao-local">Parque Villa-Lobos</span>
        </div>
        <div className="local-item ajuda-link" aria-label="Ver nossas fotos (em breve)">
          <span className="local-icone local-icone-ajuda" aria-hidden="true">?</span>
          <span className="balao balao-ajuda">Para pensar melhor 💕</span>
        </div>
        <div className="local-item cartas-local-item">
          <button
            type="button"
            className={`local-icone local-icone-cartas${unlockedCards >= 1 ? ' local-icone-cartas--unlocked' : ''}`}
            onClick={() => {
              if (showCardsPanel) {
                setCardsPanelClosing(true)
                setTimeout(() => {
                  setShowCardsPanel(false)
                  setCardsPanelClosing(false)
                }, 260)
              } else {
                setCardsPanelClosing(false)
                setShowCardsPanel(true)
              }
            }}
            aria-label={unlockedCards >= 1 ? 'Ver cartas desbloqueadas' : 'Cartas bloqueadas'}
          >
            🃏
          </button>
          <span className="balao balao-cartas">
            {unlockedCards >= 2
              ? 'Cartas 1 e 2 desbloqueadas! 💌'
              : unlockedCards >= 1
                ? 'Carta 1 desbloqueada! Continue jogando para liberar a próxima.'
                : 'Finalize as fases do minigame para desbloquear as cartas e ter sua previsão!'}
          </span>
        </div>
      </aside>
      <aside className="cantinho-gatos" aria-label="Gatinhos">
        <div className="gato-item">
          <img src={`${ASSETS}/bart.png`} alt="Bart" className="gato-img" />
          <span className="balao balao-bart">O QUE TO FAZENDO AQUI DE NOVO🐱 💕</span>
        </div>
        <div className="gato-item">
          <img src={`${ASSETS}/ro.png`} alt="Ro" className="gato-img" />
          <span className="balao balao-ro">Sendo mais um pra fazer carinho em mim, to aceitando! 😺</span>
        </div>
        <div className="gato-item">
          <img src={`${ASSETS}/mia.png`} alt="Mia" className="gato-img" />
          <span className="balao balao-mia">Miau?!💖</span>
        </div>
      </aside>
      {showParquePanel && (
        <div className={`parque-panel parque-panel--${parquePanelClosing ? 'closing' : 'open'}`} aria-label="Parque Villa-Lobos">
          <button
            type="button"
            className="parque-fechar-btn"
            onClick={() => {
              setParquePanelClosing(true)
              setTimeout(() => {
                setShowParquePanel(false)
                setParquePanelClosing(false)
              }, 260)
            }}
            aria-label="Fechar"
          >
            ×
          </button>
          <p className="parque-titulo">Parque Villa-Lobos</p>
          <div className="parque-img-wrapper">
            <img src={`${ASSETS}/parque.png`} alt="Parque Villa-Lobos" className="parque-img" />
          </div>
        </div>
      )}
      {showCardsPanel && (
        <div
          className={`cartas-panel cartas-panel--${cardsPanelClosing ? 'closing' : 'open'}${
            unlockedCards >= 1 ? ' cartas-panel--unlocked' : ' cartas-panel--locked'
          }`}
          aria-label="Cartas especiais"
        >
          <button
            type="button"
            className="cartas-fechar-btn"
            onClick={() => {
              setCardsPanelClosing(true)
              setTimeout(() => {
                setShowCardsPanel(false)
                setCardsPanelClosing(false)
              }, 260)
            }}
            aria-label="Fechar cartas"
          >
            ×
          </button>
          <p className="cartas-titulo">{unlockedCards >= 1 ? 'Cartas desbloqueadas:' : 'Cartas bloqueadas'}</p>
          <div className="cartas-grid">
            {cartasColecao.map((carta) => (
              <div
                key={carta.id}
                className={`carta${carta.id !== 3 && unlockedCards >= carta.id ? '' : ' carta--locked'}`}
              >
                <div className="carta-inner">
                  {carta.id !== 3 && unlockedCards >= carta.id && carta.imagem && (
                    <div className="carta-img-wrapper">
                      <img src={carta.imagem} alt={carta.titulo} className="carta-img" />
                    </div>
                  )}
                  <span className="carta-label">
                    {carta.id !== 3 && unlockedCards >= carta.id ? carta.titulo : '???'}
                  </span>
                  {(carta.id === 3 || unlockedCards < carta.id) && (
                    <span className="carta-lock" aria-hidden="true">🔒</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {unlockedCards < 2 && (
            <p className="cartas-hint">Complete as fases do game para desbloquear as cartas 1 e 2.</p>
          )}
        </div>
      )}
    </>
  )
}
