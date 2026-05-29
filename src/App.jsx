import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import Campo from './pages/Campo'
import WhatsApp from './pages/WhatsApp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/campo" element={<Campo />} />
        <Route path="/comprador" element={<Navigate to="/whatsapp" replace />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
