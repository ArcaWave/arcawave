import React from 'react'
import Nav from './components/landing/Nav'
import Hero from './components/landing/Hero'
import Core from './components/landing/Core'
import Build from './components/landing/Build'
import Vision from './components/landing/Vision'

/**
 * Four scrolls to understand the company:
 * 01 Hero — a space that notices a person
 * 02 Core — See. Understand. Respond.
 * 03 Build — Experience | Intelligence
 * 04 Vision — one sentence, then another
 */
function App() {
  return (
    <main className="relative bg-paper text-ink">
      <Nav />
      <Hero />
      <Core />
      <Build />
      <Vision />
    </main>
  )
}

export default App
