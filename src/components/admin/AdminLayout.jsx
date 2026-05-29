import { useState } from 'react'
import { Menu } from 'lucide-react'
import GlobalNav from '../layout/GlobalNav'
import Logo from '../layout/Logo'
import Sidebar, { getAdminNavLabel } from './Sidebar'

export default function AdminLayout({ activeSection, onNavigate, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function handleNavigate(id) {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <GlobalNav active="admin" />
      </div>

      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-primary flex items-center gap-3 px-4 shadow-md">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="text-background p-1 -ml-1 shrink-0"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Logo variant="icon" linkTo="/" framed />
        <span className="text-background font-medium text-sm truncate flex-1">
          {getAdminNavLabel(activeSection)}
        </span>
      </header>

      <main className="pt-14 md:pt-0 layout-with-nav-mobile-off md:md-layout-with-nav md:ml-60 min-h-screen px-4 py-4 md:px-6 md:pb-6 lg:px-8 lg:pb-8">
        {children}
      </main>
    </div>
  )
}
