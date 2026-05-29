import { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from './admin/Dashboard'
import SubastasPage from './admin/SubastasPage'
import GanaderosPage from './admin/GanaderosPage'
import CompradoresPage from './admin/CompradoresPage'
import EquipoCampoPage from './admin/EquipoCampoPage'
import FinanzasPage from './admin/FinanzasPage'

const SECTIONS = {
  dashboard: Dashboard,
  subastas: SubastasPage,
  ganaderos: GanaderosPage,
  compradores: CompradoresPage,
  equipo: EquipoCampoPage,
  finanzas: FinanzasPage,
}

export default function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const Page = SECTIONS[activeSection] ?? Dashboard

  return (
    <AdminLayout activeSection={activeSection} onNavigate={setActiveSection}>
      <Page />
    </AdminLayout>
  )
}
