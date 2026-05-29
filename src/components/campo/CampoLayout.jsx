import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import GlobalNav from '../layout/GlobalNav'
import Logo from '../layout/Logo'
import CampoSidebar from './CampoSidebar'

function formatToday() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function CampoLayout({
  activeSection,
  onNavigate,
  showBack = false,
  onBack,
  children,
}) {
  return (
    <div className="min-h-screen bg-gray-300/60 md:bg-background">
      <div className="hidden md:block">
        <GlobalNav active="campo" />
        <CampoSidebar activeSection={activeSection} onNavigate={onNavigate} />
      </div>

      <div className="layout-with-nav-mobile-off md:md-layout-with-nav md:ml-60 min-h-screen flex justify-center md:block">
        <div className="w-full max-w-[430px] md:max-w-none min-h-screen md:min-h-[calc(100vh-3.5rem)] bg-background shadow-2xl md:shadow-none flex flex-col">
          {/* Mobile header */}
          <header className="md:hidden bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              {showBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-background/80 hover:text-background p-1 -ml-1"
                  aria-label="Volver"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <Link to="/" className="text-background/80 hover:text-background p-1 -ml-1">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              )}
              <Logo variant="icon" linkTo="/" framed />
            </div>
            <span className="text-background/70 text-xs font-medium">App de Campo</span>
          </header>

          {/* Desktop header bar */}
          <div className="hidden md:flex border-b border-gray-200 bg-white px-8 py-4 items-center justify-between shrink-0">
            <h1 className="text-xl font-semibold text-primary">App de Campo</h1>
            <p className="text-gray-500 text-sm capitalize">{formatToday()}</p>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
