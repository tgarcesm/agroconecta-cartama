import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const MODULES = [
  { path: '/admin', label: 'Panel Admin', key: 'admin' },
  { path: '/campo', label: 'App Campo', key: 'campo' },
  { path: '/whatsapp', label: 'Canal WhatsApp', key: 'whatsapp' },
]

export default function GlobalNav({ active }) {
  const location = useLocation()

  function isActive(key) {
    if (active) return active === key
    if (key === 'admin') return location.pathname.startsWith('/admin')
    if (key === 'campo') return location.pathname.startsWith('/campo')
    if (key === 'whatsapp') return location.pathname.startsWith('/whatsapp') || location.pathname.startsWith('/comprador')
    return false
  }

  return (
    <header className="global-nav bg-white border-b border-gray-200 flex items-center px-4 md:px-6">
      <Logo variant="nav" linkTo="/" className="shrink-0 mr-4 md:mr-8" />

      <nav className="flex-1 flex items-center justify-center gap-0.5 md:gap-1 overflow-x-auto">
        {MODULES.map(({ path, label, key }) => {
          const activeLink = isActive(key)
          return (
            <Link
              key={key}
              to={path}
              className={`px-2.5 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                activeLink
                  ? 'bg-primary text-background'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="w-24 md:w-32 shrink-0 hidden lg:block" />
    </header>
  )
}
