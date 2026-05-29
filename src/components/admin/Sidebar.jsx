import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Gavel,
  Users,
  ShoppingBag,
  MapPin,
  TrendingUp,
  X,
} from 'lucide-react'
import Logo from '../layout/Logo'

export const ADMIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subastas', label: 'Subastas', icon: Gavel },
  { id: 'ganaderos', label: 'Ganaderos', icon: Users },
  { id: 'compradores', label: 'Compradores', icon: ShoppingBag },
  { id: 'equipo', label: 'Equipo de Campo', icon: MapPin },
  { id: 'finanzas', label: 'Finanzas', icon: TrendingUp },
]

const MODULE_LINKS = [
  { to: '/campo', label: 'App Campo' },
  { to: '/whatsapp', label: 'Canal WhatsApp' },
  { to: '/', label: 'Inicio' },
]

export function getAdminNavLabel(sectionId) {
  return ADMIN_NAV_ITEMS.find((item) => item.id === sectionId)?.label ?? 'Dashboard'
}

function NavButtons({ activeSection, onNavigate }) {
  return ADMIN_NAV_ITEMS.map(({ id, label, icon: Icon }) => {
    const isActive = activeSection === id
    return (
      <button
        key={id}
        type="button"
        onClick={() => onNavigate(id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
          isActive
            ? 'bg-primary-light text-background'
            : 'text-background/80 hover:bg-white/10 hover:text-background'
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {label}
      </button>
    )
  })
}

function SidebarContent({ activeSection, onNavigate, onClose }) {
  return (
    <>
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between gap-3">
        <Logo variant="sidebar" />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden text-background/80 hover:text-background p-1 shrink-0"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <NavButtons activeSection={activeSection} onNavigate={onNavigate} />
      </nav>

      <div className="md:hidden px-3 py-3 border-t border-white/10 space-y-1">
        <p className="text-background/50 text-xs px-3 mb-1">Otros módulos</p>
        {MODULE_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className="block px-3 py-2 rounded-lg text-sm text-background/80 hover:bg-white/10 hover:text-background transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-background/50 text-xs">Panel Administrador</p>
      </div>
    </>
  )
}

export default function Sidebar({ activeSection, onNavigate, mobileOpen = false, onMobileClose }) {
  return (
    <>
      <aside className="sidebar-below-nav hidden md:flex fixed left-0 w-60 bg-primary flex-col z-10">
        <SidebarContent activeSection={activeSection} onNavigate={onNavigate} />
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-label="Cerrar menú"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[min(18rem,85vw)] bg-primary flex flex-col md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <SidebarContent
          activeSection={activeSection}
          onNavigate={onNavigate}
          onClose={onMobileClose}
        />
      </aside>
    </>
  )
}
