import { Link } from 'react-router-dom'
import { BarChart2, MapPin, MessageCircle } from 'lucide-react'

const cards = [
  {
    title: 'Panel Administrador',
    icon: BarChart2,
    description: 'Dashboard, subastas, ganaderos, finanzas',
    to: '/admin',
  },
  {
    title: 'App de Campo',
    icon: MapPin,
    description: 'Verificación en finca, fichas técnicas',
    to: '/campo',
  },
  {
    title: 'Canal WhatsApp',
    icon: MessageCircle,
    description: 'Compradores pujan y subastas en tiempo real',
    to: '/whatsapp',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-background tracking-wide mb-4">
            AGROCONECTA CARTAMA
          </h1>
          <p className="text-accent text-lg md:text-xl italic">
            Tradición ganadera, conexión moderna
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {cards.map(({ title, icon: Icon, description, to }) => (
            <div
              key={to}
              className="bg-background rounded-2xl shadow-lg p-6 flex flex-col items-center text-center"
            >
              <Icon className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-xl font-semibold text-primary mb-2">{title}</h2>
              <p className="text-gray-600 mb-6 flex-1">{description}</p>
              <Link
                to={to}
                className="inline-block bg-primary hover:bg-primary-light text-background font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Entrar →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <p className="text-background/60 text-sm mt-12">
        Innovación Social · Universidad EIA · Mayo 2026
      </p>
    </div>
  )
}
