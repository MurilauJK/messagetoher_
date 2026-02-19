import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './fotos.css'

const CORES = ['#ff85c1', '#e91e8c', '#b388ff', '#7c4dff', '#ffb3d9', '#ffeb3b', '#fff']
const EMOJIS = ['💕', '💖', '💗', '❤️', '🌸', '💘', '✨']

const GALERIA = [
  { src: '/assets/goat.jpeg', alt: 'Nós dois' },
  { src: '/assets/nois.jpeg', alt: 'Nós' },
  { src: '/assets/nois_dnv.jpeg', alt: 'Nós de novo' },
  { src: '/assets/nois_dnv_dnv.jpeg', alt: 'Nós de novo de novo' },
]

const Umbrella = () => <span className="umbrella">☂</span>

export default function Fotos() {
  const confettiRef = useRef(null)
  const heartsRef = useRef(null)

  useEffect(() => {
    const confettiContainer = confettiRef.current
    const heartsContainer = heartsRef.current
    if (!confettiContainer || !heartsContainer) return

    const criarConfetti = () => {
      const c = document.createElement('div')
      let cls = 'confetti'
      if (Math.random() > 0.7) cls += ' confetti-grande'
      if (Math.random() > 0.6) cls += ' confetti-redondo'
      c.className = cls
      c.style.left = Math.random() * 100 + 'vw'
      c.style.top = '-20px'
      c.style.background = CORES[Math.floor(Math.random() * CORES.length)]
      c.style.animationDuration = 2.5 + Math.random() * 2.5 + 's'
      c.style.animationDelay = Math.random() * 0.3 + 's'
      confettiContainer.appendChild(c)
      setTimeout(() => c.remove(), 5500)
    }

    const criarCoracao = () => {
      const h = document.createElement('span')
      h.className = 'heart' + (Math.random() > 0.7 ? ' heart-grande' : '')
      h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      h.style.left = Math.random() * 100 + 'vw'
      h.style.bottom = '-30px'
      h.style.animationDuration = 2.2 + Math.random() * 2.2 + 's'
      h.style.animationDelay = Math.random() * 0.2 + 's'
      heartsContainer.appendChild(h)
      setTimeout(() => h.remove(), 5500)
    }

    const chuva = () => {
      criarConfetti()
      criarConfetti()
      criarConfetti()
      criarCoracao()
      criarCoracao()
    }

    chuva()
    const id = setInterval(chuva, 400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="pagina-fotos">
      <div className="bg-pattern" />
      <header className="header-fotos">
        <Link to="/" className="voltar-link">← Voltar</Link>
        <div className="moldura-ilustracao">
          <div className="moldura-umbrellas moldura-top" aria-hidden="true">
            {[...Array(8)].map((_, i) => <Umbrella key={i} />)}
          </div>
          <div className="moldura-umbrellas moldura-bottom" aria-hidden="true">
            {[...Array(8)].map((_, i) => <Umbrella key={i} />)}
          </div>
          <div className="moldura-umbrellas moldura-left" aria-hidden="true">
            {[...Array(5)].map((_, i) => <Umbrella key={i} />)}
          </div>
          <div className="moldura-umbrellas moldura-right" aria-hidden="true">
            {[...Array(5)].map((_, i) => <Umbrella key={i} />)}
          </div>
          <img src="/assets/raaain.png" alt="Nós dois sob o guarda-chuva na chuva" className="ilustracao-header" />
        </div>
        <h1 className="titulo-fotos">Pra te ajudar a pensar melhor 💕</h1>
        <div className="letra-musica">
          She always takes it with a heart of stone<br />
          'Cause all she does is throws it back to me<br />
          I've spent a lifetime looking for someone<br />
          Don't try to understand me<br />
          Just simply do the things I say<br />
          Love is a feeling<br />
          Give it when I want it<br />
          'Cause I'm on fire<br />
          Quench my desire<br />
          Give it when I want it<br />
          Talk to me, woman<br />
          Give in to me, give in to me
        </div>
      </header>

      <div className="guarda-chuvas-wrapper">
        <div className="guarda-chuvas-faixa guarda-chuvas-top" aria-hidden="true">
          {[...Array(12)].map((_, i) => <Umbrella key={i} />)}
        </div>
        <div className="guarda-chuvas-faixa guarda-chuvas-bottom" aria-hidden="true">
          {[...Array(12)].map((_, i) => <Umbrella key={i} />)}
        </div>
        <div className="guarda-chuvas-faixa guarda-chuvas-left" aria-hidden="true">
          {[...Array(6)].map((_, i) => <Umbrella key={i} />)}
        </div>
        <div className="guarda-chuvas-faixa guarda-chuvas-right" aria-hidden="true">
          {[...Array(6)].map((_, i) => <Umbrella key={i} />)}
        </div>

        <section className="galeria-fotos">
          {GALERIA.map((item, i) => (
            <div key={i} className="foto-item">
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </section>
      </div>

      <div ref={confettiRef} className="confetti-container confetti-fotos" aria-hidden="true" />
      <div ref={heartsRef} className="hearts-container hearts-fotos" aria-hidden="true" />
    </div>
  )
}
