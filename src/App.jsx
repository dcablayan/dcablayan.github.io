import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Stars from './components/Stars';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-slate-50'
    }`}>
      {/* Stars Background - only visible in dark mode */}
      {theme === 'dark' && <Stars />}

      {/* Static Stars (CSS-based) as fallback */}
      {theme === 'dark' && <div className="stars-bg" />}

      {/* Navigation */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Animated gradient orbs - adjusted for theme */}
      <div className={`fixed top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none ${
        theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-500/10'
      }`} />
      <div
        className={`fixed bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-pulse pointer-events-none ${
          theme === 'dark' ? 'bg-cyan-400/20' : 'bg-cyan-400/10'
        }`}
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}

export default App;
