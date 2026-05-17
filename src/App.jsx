import React from 'react'
import { LanguageProvider } from './i18n/LanguageContext'
import ArcaNav from './components/arcawave/ArcaNav'
import ArcaHero from './components/arcawave/ArcaHero'
import ArcaPhilosophy from './components/arcawave/ArcaPhilosophy'
import ArcaNews from './components/arcawave/ArcaNews'
import ArcaTeam from './components/arcawave/ArcaTeam'
import ArcaContact from './components/arcawave/ArcaContact'
import ArcaFooter from './components/arcawave/ArcaFooter'

function App() {
  return (
    <LanguageProvider>
      <main className="relative min-h-screen bg-background overflow-x-hidden">
        <ArcaNav />
        <ArcaHero />
        <ArcaPhilosophy />
        <ArcaNews />
        <ArcaTeam />
        <ArcaContact />
        <ArcaFooter />
      </main>
    </LanguageProvider>
  )
}

export default App
