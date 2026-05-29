import GlobalNav from '../layout/GlobalNav'
import Sidebar from './Sidebar'

export default function AdminLayout({ activeSection, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav active="admin" />
      <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
      <main className="layout-with-nav ml-60 min-h-screen px-6 pb-6 lg:px-8 lg:pb-8">{children}</main>
    </div>
  )
}
