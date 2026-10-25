import { useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Intro from './components/Intro.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import SelectedWork from './components/SelectedWork.jsx'
import Experience from './components/Experience.jsx'
import Certificates from './components/Certificates.jsx'
import HelloWorld from './components/HelloWorld.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    // reducedMotion="user" makes Framer Motion honour the OS setting.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Intro onDone={() => setReady(true)} />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main" className="relative">
        <Hero ready={ready} />
        <About />
        <Skills />
        <SelectedWork />
        <Experience />
        <Certificates />
        <HelloWorld />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
