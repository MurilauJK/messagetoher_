import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Fotos from './pages/Fotos'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fotos" element={<Fotos />} />
    </Routes>
  )
}
