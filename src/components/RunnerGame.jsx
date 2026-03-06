import { useState, useRef, useEffect, useCallback } from 'react'
import './RunnerGame.css'

const ASSETS = '/assets'
const RUN_FRAMES = ['run2.png', 'run3.png']
const JUMP_IMAGE = 'jump.png'
const HIT_IMAGE = 'hit.png'
const CHEGADA_FASE1 = 'nanis_chegada.png'
const CHEGADA_FASE2 = 'fase2_chegada.png'
const PERSONAGEM_FASE2 = 'personagem_fase2.png'
const PERSONAGEM_FASE2_MOVIMENTO = 'personagem_fase2_movimento.png'
const RUN_FRAMES_2 = [PERSONAGEM_FASE2, PERSONAGEM_FASE2_MOVIMENTO]
const JUMP_IMAGE_2 = PERSONAGEM_FASE2
const HIT_IMAGE_2 = 'hi2.png'
const PERSONAGEM_FASE3 = 'personagem_fase3.png'
const PERSONAGEM_FASE3_MOVIMENTO = 'personagem_fase_3_movimento.png'
const RUN_FRAMES_3 = [PERSONAGEM_FASE3, PERSONAGEM_FASE3_MOVIMENTO]
const JUMP_IMAGE_3 = PERSONAGEM_FASE3
const HIT_IMAGE_3 = PERSONAGEM_FASE3
const RUN_FRAME_INTERVAL_MS = 120
const JUMP_THRESHOLD = -2

const GRAVITY = 1.35
const JUMP_STRENGTH = -16
const GROUND_Y = 0
const OBSTACLE_SPEED = 11
const SPAWN_MIN_MS = 500
const SPAWN_MAX_MS = 1400
const OBSTACLE_WIDTH = 42
const OBSTACLE_HEIGHT = 52
const OBSTACLE_WIDTH_FASE1 = 180
const OBSTACLE_HEIGHT_FASE1 = 160
const OBSTACLE_HITBOX_WIDTH_FASE1 = 65
const OBSTACLE_HITBOX_HEIGHT_FASE1 = 55
const CHAR_WIDTH = 116
const CHAR_WIDTH_FASE2 = 260 /* casal no carro é mais largo */
const CHAR_WIDTH_FASE3 = 130 /* personagem corrida com efeito velocidade */
const GROUND_BOTTOM = 72
const OBSTACLES_TO_WIN = 14
const POINTS_PER_OBSTACLE = 100
const PRATO_POWER = 'prato.png'
const POWERUP_DURATION_MS = 4000
const POWERUP_SPEED_MULT = 1.8
const POWERUP_SIZE = 80
const NEXT_POWERUP_FIRST_MS = 8000
const NEXT_POWERUP_INTERVAL_MS = 14000

const MENSAGENS_GAMEOVER = [
  'Opa! Tenta de novo! 😅',
  'Você consegue! Não desiste! 💪',
  'Quase lá! Mais uma tentativa! 🌟',
  'Ela acredita em você! Tenta de novo! 💕',
  'Um tropeço não é queda! Recomeça! ✨',
  'Você é capaz! De novo! 🎯',
  'Persistência é a chave! Vamos lá! 🔑',
  'Acredite: você consegue! 💖',
  'Levanta e corre de novo! 🏃',
  'Foi por pouco! Próxima você chega! 🌈',
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function RunnerGame({ phase = 1, onWin }) {
  const runFrames = phase === 1 ? RUN_FRAMES : (phase === 2 ? RUN_FRAMES_2 : RUN_FRAMES_3)
  const jumpImage = phase === 1 ? JUMP_IMAGE : (phase === 2 ? JUMP_IMAGE_2 : JUMP_IMAGE_3)
  const hitImage = phase === 1 ? HIT_IMAGE : (phase === 2 ? HIT_IMAGE_2 : HIT_IMAGE_3)
  const obstaclesTarget = phase === 2 ? 20 : OBSTACLES_TO_WIN
  const [gameState, setGameState] = useState('playing')
  const [gameOverMessage, setGameOverMessage] = useState('')
  const [obstacles, setObstacles] = useState([])
  const [powerUps, setPowerUps] = useState([])
  const [poweredUp, setPoweredUp] = useState(false)
  const [passedCount, setPassedCount] = useState(0)
  const [finalStats, setFinalStats] = useState(null)
  const charY = useRef(GROUND_Y)
  const charVelY = useRef(0)
  const charRef = useRef(null)
  const charImgRef = useRef(null)
  const runFrameIndexRef = useRef(0)
  const gameRef = useRef(null)
  const startTimeRef = useRef(null)
  const nextSpawn = useRef(Date.now() + 1000)
  const obstacleId = useRef(0)
  const powerUpId = useRef(0)
  const passedIds = useRef(new Set())
  const rafId = useRef(null)
  const isPlayingRef = useRef(true)
  const obstaclesRef = useRef([])
  const powerUpsRef = useRef([])
  const poweredUpUntilRef = useRef(0)
  const nextPowerUpSpawnRef = useRef(0)
  const powerUpTimeoutRef = useRef(null)
  const somPuloRef = useRef(null)
  const somColisaoRef = useRef(null)
  const somColetaRef = useRef(null)

  const spawnObstacle = useCallback(() => {
    const game = gameRef.current
    const w = game ? game.getBoundingClientRect().width : 400
    const isPhase1 = phase === 1
    const newObstacle = {
      id: ++obstacleId.current,
      left: w + 20 + Math.random() * 120,
      speed: 0.82 + Math.random() * 0.36,
      variant: isPhase1 ? (Math.random() < 0.5 ? 'obs2' : 'obs1') : undefined,
    }
    obstaclesRef.current = [...obstaclesRef.current, newObstacle]
    setObstacles([...obstaclesRef.current])
  }, [phase])

  useEffect(() => {
    RUN_FRAMES.forEach((f) => { const img = new Image(); img.src = `${ASSETS}/${f}` })
    RUN_FRAMES_2.forEach((f) => { const img = new Image(); img.src = `${ASSETS}/${f}` })
    RUN_FRAMES_3.forEach((f) => { const img = new Image(); img.src = `${ASSETS}/${f}` })
    const j = new Image(); j.src = `${ASSETS}/${JUMP_IMAGE}`
    const j2 = new Image(); j2.src = `${ASSETS}/${JUMP_IMAGE_2}`
    const j3 = new Image(); j3.src = `${ASSETS}/${JUMP_IMAGE_3}`
    const c1 = new Image(); c1.src = `${ASSETS}/${CHEGADA_FASE1}`
    const c2 = new Image(); c2.src = `${ASSETS}/${CHEGADA_FASE2}`
    const h = new Image(); h.src = `${ASSETS}/${HIT_IMAGE}`
    const h2 = new Image(); h2.src = `${ASSETS}/${HIT_IMAGE_2}`
    const h3 = new Image(); h3.src = `${ASSETS}/${HIT_IMAGE_3}`
    const prato = new Image(); prato.src = `${ASSETS}/${PRATO_POWER}`
    const obs1 = new Image(); obs1.src = `${ASSETS}/obs1.png`
    const obs2 = new Image(); obs2.src = `${ASSETS}/obs2.png`
  }, [])

  useEffect(() => {
    if (gameState === 'playing' && !startTimeRef.current) startTimeRef.current = Date.now()
  }, [gameState])

  useEffect(() => {
    isPlayingRef.current = gameState === 'playing'
    if (gameState !== 'playing') return
    const gameLoop = () => {
      if (!isPlayingRef.current) return
      const now = Date.now()
      const game = gameRef.current
      const char = charRef.current
      if (!game || !char) { rafId.current = requestAnimationFrame(gameLoop); return }
      charVelY.current += GRAVITY
      charY.current += charVelY.current
      if (charY.current > GROUND_Y) { charY.current = GROUND_Y; charVelY.current = 0 }
      char.style.transform = `translateY(${charY.current}px)`
      if (charImgRef.current) {
        if (charY.current < JUMP_THRESHOLD) charImgRef.current.src = `${ASSETS}/${jumpImage}`
        else charImgRef.current.src = `${ASSETS}/${runFrames[runFrameIndexRef.current]}`
      }
      const gameRect = game.getBoundingClientRect()
      const charRect = char.getBoundingClientRect()
      const charW = phase === 1 ? CHAR_WIDTH : (phase === 2 ? CHAR_WIDTH_FASE2 : CHAR_WIDTH_FASE3)
      const charInset = charW * 0.38
      const charLeft = charRect.left + charInset
      const charRight = charRect.right - charInset
      const charBottom = charRect.bottom - 22
      const charTop = charRect.top + 32
      const obstacleInset = phase === 1 ? (OBSTACLE_WIDTH_FASE1 - OBSTACLE_HITBOX_WIDTH_FASE1) / 2 : 8
      const obstacleW = phase === 1 ? OBSTACLE_HITBOX_WIDTH_FASE1 : OBSTACLE_WIDTH
      const obstacleH = phase === 1 ? OBSTACLE_HITBOX_HEIGHT_FASE1 : OBSTACLE_HEIGHT
      const obstacleVisualW = phase === 1 ? OBSTACLE_WIDTH_FASE1 : OBSTACLE_WIDTH
      const poweredUp = phase === 2 && now < poweredUpUntilRef.current
      const currentSpeed = (phase === 2 && poweredUp) ? OBSTACLE_SPEED * POWERUP_SPEED_MULT : OBSTACLE_SPEED
      const speedMult = (o) => (typeof o.speed === 'number' ? o.speed : 1)
      let obs = obstaclesRef.current.map((o) => ({ ...o, left: o.left - currentSpeed * speedMult(o) }))
      obs = obs.filter((o) => {
        const oLeft = gameRect.left + o.left + obstacleInset
        const oRight = gameRect.left + o.left + obstacleVisualW - obstacleInset
        const oTop = gameRect.bottom - GROUND_BOTTOM - obstacleH + 6
        const oBottom = gameRect.bottom - GROUND_BOTTOM - 4
        if (oRight < charLeft && !passedIds.current.has(o.id)) {
          passedIds.current.add(o.id)
          setPassedCount((c) => {
            const next = c + 1
            if (next >= obstaclesTarget) {
              isPlayingRef.current = false
              setFinalStats({ time: (Date.now() - startTimeRef.current) / 1000, score: next * POINTS_PER_OBSTACLE })
              setGameState('won')
            }
            return next
          })
        }
        const overlap = charRight > oLeft && charLeft < oRight && charBottom > oTop && charTop < oBottom
        if (overlap && !poweredUp) {
          isPlayingRef.current = false
          const scale = phase === 1 ? 1.12 : (phase === 2 ? 1 : 1.3)
          char.style.transform = `translateY(${charY.current}px) scale(${scale})`
          char.style.transformOrigin = 'center bottom'
          setGameOverMessage(MENSAGENS_GAMEOVER[Math.floor(Math.random() * MENSAGENS_GAMEOVER.length)])
          setGameState('gameover')
          const audio = somColisaoRef.current
          if (audio) {
            audio.volume = 0.4
            audio.currentTime = 0
            audio.play().catch(() => {})
          }
        }
        return o.left + obstacleVisualW > -50
      })
      obstaclesRef.current = obs
      setObstacles([...obs])
      let pUps = powerUpsRef.current
      if (phase === 2) {
        if (nextPowerUpSpawnRef.current === 0) nextPowerUpSpawnRef.current = now + NEXT_POWERUP_FIRST_MS
        if (now >= nextPowerUpSpawnRef.current) {
          const w = game.getBoundingClientRect().width
          const newP = { id: ++powerUpId.current, left: w + 30 + Math.random() * 80, speed: 1 }
          pUps = [...pUps, newP]
          nextPowerUpSpawnRef.current = now + NEXT_POWERUP_INTERVAL_MS
        }
        pUps = pUps.map((p) => ({ ...p, left: p.left - currentSpeed * (typeof p.speed === 'number' ? p.speed : 1) }))
        pUps = pUps.filter((p) => {
          const pLeft = gameRect.left + p.left
          const pRight = gameRect.left + p.left + POWERUP_SIZE
          const pTop = gameRect.bottom - GROUND_BOTTOM - POWERUP_SIZE - 4
          const pBottom = gameRect.bottom - GROUND_BOTTOM - 4
          const overlapP = charRight > pLeft && charLeft < pRight && charBottom > pTop && charTop < pBottom
          if (overlapP) {
            poweredUpUntilRef.current = now + POWERUP_DURATION_MS
            setPoweredUp(true)
            const audioColeta = somColetaRef.current
            if (audioColeta) {
              audioColeta.volume = 0.5
              audioColeta.currentTime = 0
              audioColeta.play().catch(() => {})
            }
            if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current)
            powerUpTimeoutRef.current = setTimeout(() => {
              setPoweredUp(false)
              powerUpTimeoutRef.current = null
            }, POWERUP_DURATION_MS)
            return false
          }
          return p.left + POWERUP_SIZE > -60
        })
        powerUpsRef.current = pUps
        setPowerUps([...pUps])
      }
      if (now >= nextSpawn.current) {
        nextSpawn.current = now + SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS)
        spawnObstacle()
      }
      rafId.current = requestAnimationFrame(gameLoop)
    }
    rafId.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(rafId.current)
  }, [gameState, spawnObstacle, runFrames, jumpImage, phase])

  useEffect(() => {
    if (gameState !== 'playing') return
    const id = setInterval(() => { runFrameIndexRef.current = (runFrameIndexRef.current + 1) % runFrames.length }, RUN_FRAME_INTERVAL_MS)
    return () => clearInterval(id)
  }, [gameState, runFrames.length])

  const jump = useCallback(() => {
    if (gameState !== 'playing') return
    if (charY.current >= GROUND_Y - 2) {
      charVelY.current = JUMP_STRENGTH
      const audio = somPuloRef.current
      if (audio) {
        audio.volume = 0.4
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    }
  }, [gameState])

  useEffect(() => {
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); jump() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  const handleRestart = () => {
    startTimeRef.current = null
    isPlayingRef.current = true
    charY.current = GROUND_Y
    charVelY.current = 0
    passedIds.current = new Set()
    nextSpawn.current = Date.now() + SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS) * 0.5
    obstaclesRef.current = []
    powerUpsRef.current = []
    poweredUpUntilRef.current = 0
    nextPowerUpSpawnRef.current = 0
    if (powerUpTimeoutRef.current) clearTimeout(powerUpTimeoutRef.current)
    powerUpTimeoutRef.current = null
    setPoweredUp(false)
    setObstacles([])
    setPowerUps([])
    setPassedCount(0)
    setFinalStats(null)
    setGameState('playing')
  }

  const handleContinuar = () => { if (onWin) onWin(phase) }

  return (
    <div
      className={`runner-game runner-game--phase-${phase}`}
      ref={gameRef}
      onClick={gameState === 'playing' ? jump : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.code === 'Space' && e.preventDefault()}
      aria-label="Pule com Espaço ou clique para chegar nela"
    >
      <audio ref={somPuloRef} src={`${ASSETS}/som_pulo.mp3`} aria-hidden="true" />
      <audio ref={somColisaoRef} src={`${ASSETS}/som_colisao.mp3`} aria-hidden="true" />
      <audio ref={somColetaRef} src={`${ASSETS}/coleta.mp3`} aria-hidden="true" />
      <div className="runner-game-inner">
        {phase === 1 && (
          <div className="runner-fase1-bg" aria-hidden="true">
            <div className="runner-fase1-bg-strip">
              <div className="runner-fase1-tile" />
              <div className="runner-fase1-tile" />
            </div>
          </div>
        )}
        <div className="runner-sky">
          {phase === 1 ? <div className="runner-sun" aria-hidden="true" /> : <div className="runner-moon" aria-hidden="true" />}
        </div>
        <p className="runner-instruction">Pule com ESPAÇO ou clique para chegar nela! 💕</p>
        <p className="runner-score">Fase {phase} · {passedCount} / {obstaclesTarget}</p>
        <div className="runner-ground" />
        <div className={`runner-track ${gameState === 'won' ? 'runner-track--won' : ''}`}>
          {(gameState === 'playing' || gameState === 'gameover') && (
            <div ref={charRef} className={`runner-character ${gameState === 'gameover' ? 'runner-character--hit' : ''} ${phase === 2 && poweredUp ? 'runner-character--powered' : ''}`}>
              <img
                ref={charImgRef}
                src={gameState === 'gameover' ? `${ASSETS}/${hitImage}` : `${ASSETS}/${runFrames[0]}`}
                alt={gameState === 'gameover' ? 'Personagem derrotado' : 'Correndo até ela'}
              />
            </div>
          )}
          {gameState === 'playing' && obstacles.map((o) => (
            <div
              key={o.id}
              className={`runner-obstacle${
                phase === 1
                  ? (o.variant === 'obs2' ? ' runner-obstacle--fase1-2' : ' runner-obstacle--fase1-1')
                  : ''
              }`}
              style={{ left: o.left }}
            />
          ))}
          {phase === 2 && gameState === 'playing' && powerUps.map((p) => (
            <div key={p.id} className="runner-powerup" style={{ left: p.left }}>
              <img src={`${ASSETS}/${PRATO_POWER}`} alt="Poder especial" />
            </div>
          ))}
          {gameState === 'won' && (
            <div className="runner-chegada" aria-hidden="true">
              <img
                src={`${ASSETS}/${phase === 1 ? CHEGADA_FASE1 : CHEGADA_FASE2}`}
                alt={phase === 1 ? 'Ela te esperando no fim da esteira' : 'Vocês dois no carro'}
              />
            </div>
          )}
        </div>
      </div>
      {gameState === 'gameover' && (
        <div className="runner-overlay">
          <p className="runner-overlay-title">{gameOverMessage}</p>
          <button type="button" className="btn btn-sim runner-btn" onClick={handleRestart}>Recomeçar</button>
        </div>
      )}
      {gameState === 'won' && (
        <div className="runner-overlay runner-won">
          <p className="runner-overlay-title">Fase {phase} concluída! 🎉</p>
          <p className="runner-overlay-title">Você chegou! Ela está te esperando! 💕</p>
          {finalStats && (
            <div className="runner-final-stats">
              <p className="runner-stat">Pontuação: <strong>{finalStats.score}</strong></p>
              <p className="runner-stat">Tempo: <strong>{formatTime(finalStats.time)}</strong></p>
            </div>
          )}
          <button type="button" className="btn btn-sim runner-btn" onClick={handleContinuar}>Continuar</button>
        </div>
      )}
    </div>
  )
}
