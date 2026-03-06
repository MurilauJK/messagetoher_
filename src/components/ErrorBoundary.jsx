import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <p style={{ color: '#e91e8c', fontWeight: 700 }}>Algo deu errado ao carregar o jogo.</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>(F12) para mais detalhes.</p>
          <button
            type="button"
            className="btn btn-sim"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Tentar de novo
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
