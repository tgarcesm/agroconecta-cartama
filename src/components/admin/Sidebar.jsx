import {
  LayoutDashboard,
  Gavel,
  Users,
  ShoppingBag,
  MapPin,
  TrendingUp,
} from 'lucide-react'
import Logo from '../layout/Logo'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'subastas', label: 'Subastas', icon: Gavel },
  { id: 'ganaderos', label: 'Ganaderos', icon: Users },
  { id: 'compradores', label: 'Compradores', icon: ShoppingBag },
  { id: 'equipo', label: 'Equipo de Campo', icon: MapPin },
  { id: 'finanzas', label: 'Finanzas', icon: TrendingUp },
]

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="sidebar-below-nav fixed left-0 w-60 bg-primary flex flex-col z-10">
      <div className="px-4 py-5 border-b border-white/10 flex justify-center">
        <Logo variant="sidebar" />
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
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
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-background/50 text-xs">Panel Administrador</p>
      </div>
    </aside>
  )
}
