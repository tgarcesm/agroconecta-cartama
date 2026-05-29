import { useState } from 'react'
import CampoLayout from '../components/campo/CampoLayout'
import CampoHome from './campo/CampoHome'
import VerificationFlow from './campo/VerificationFlow'
import MisVerificaciones from './campo/MisVerificaciones'
import Historial from './campo/Historial'

const SECTIONS = {
  inicio: 'home',
  verificaciones: 'verificaciones',
  historial: 'historial',
}

export default function Campo() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [screen, setScreen] = useState('home')
  const [selectedSubasta, setSelectedSubasta] = useState(null)

  function handleNavigate(section) {
    setActiveSection(section)
    setScreen(SECTIONS[section] ?? 'home')
    setSelectedSubasta(null)
  }

  function handleStartVerification(subasta) {
    setSelectedSubasta(subasta)
    setScreen('verification')
  }

  function handleBack() {
    setScreen(activeSection === 'inicio' ? 'home' : SECTIONS[activeSection])
    setSelectedSubasta(null)
  }

  function handleComplete() {
    setScreen('home')
    setSelectedSubasta(null)
    setActiveSection('inicio')
  }

  function renderContent() {
    if (screen === 'verification' && selectedSubasta) {
      return (
        <VerificationFlow
          subasta={selectedSubasta}
          onComplete={handleComplete}
        />
      )
    }
    if (screen === 'verificaciones') return <MisVerificaciones />
    if (screen === 'historial') return <Historial />
    return <CampoHome onStartVerification={handleStartVerification} />
  }

  return (
    <CampoLayout
      activeSection={activeSection}
      onNavigate={handleNavigate}
      showBack={screen === 'verification'}
      onBack={handleBack}
    >
      {renderContent()}
    </CampoLayout>
  )
}
