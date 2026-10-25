import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import SelectedWork from './components/SelectedWork.jsx'
import Experience from './components/Experience.jsx'
import Skills from './components/Skills.jsx'
import Certificates from './components/Certificates.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import CursorLight from './components/CursorLight.jsx'

export default function App() {
  return (
    // reducedMotion="user" makes Framer Motion honour the OS setting.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ember focus:px-4 focus:py-2 focus:text-onember"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <CursorLight />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main id="main" className="relative">
        <Hero />
        <About />
        <SelectedWork />
        <Experience />
        <Certificates />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
