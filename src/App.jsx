import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, ExternalLink, Twitter, BookOpen, Menu, X, ChevronUp, Code2 } from 'lucide-react';

// Utility: Linear interpolation for smooth animations
const lerp = (start, end, factor) => start + (end - start) * factor;

// Utility: Check if mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 'ontouchstart' in window;
};

// Blueprint Grid Background
function BlueprintGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight * 3
      );
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid settings
      const gridSize = 40;
      const smallGridSize = 10;

      // Draw small grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += smallGridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += smallGridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Draw main grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="blueprint-grid" />;
}

// SVG Schematic: GRACE-FO Satellite (orthographic blueprint)
// Scale: 1 unit = 0.4px for fitting in viewBox
// Main body: 200×120×100, Solar panel: 260×6×120, Hinge: 20×20×20
// Front instrument: 40×40×20, Antenna: 10×10×25, Side instrument: 30×25×20
function SatelliteSchematic({ style }) {
  return (
    <svg viewBox="0 0 320 220" className="schematic satellite-schematic" style={style}>
      {/* === TOP VIEW (upper left) - Looking down, shows X-Y plane === */}
      {/* Main body: 200×120 → 80×48 scaled */}
      <rect x="20" y="22" width="80" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Solar panel hinge: 20×20 → 8×8, on -Y side (bottom of bus in top view) */}
      <rect x="56" y="70" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Solar panel: 260×6 → 104×2.4, extends from hinge along -Y */}
      <rect x="8" y="78" width="104" height="48" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Panel cell grid lines */}
      <line x1="8" y1="90" x2="112" y2="90" stroke="currentColor" strokeWidth="0.3" />
      <line x1="8" y1="102" x2="112" y2="102" stroke="currentColor" strokeWidth="0.3" />
      <line x1="8" y1="114" x2="112" y2="114" stroke="currentColor" strokeWidth="0.3" />
      <line x1="34" y1="78" x2="34" y2="126" stroke="currentColor" strokeWidth="0.3" />
      <line x1="60" y1="78" x2="60" y2="126" stroke="currentColor" strokeWidth="0.3" />
      <line x1="86" y1="78" x2="86" y2="126" stroke="currentColor" strokeWidth="0.3" />
      {/* Front instrument: 40×40 → 16×16, on +X face (right side) */}
      <rect x="100" y="38" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna mast: 10×10 → 4×4, on top near front */}
      <rect x="88" y="32" width="4" height="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Side instrument: 30×25 → 12×10, on +Y face (top of bus in top view) */}
      <rect x="50" y="12" width="12" height="10" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Top view label */}
      <text x="60" y="8" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.6">TOP</text>

      {/* === SIDE VIEW (right side) - Looking from +Y, shows X-Z plane === */}
      {/* Main body: 200×100 → 80×40 scaled */}
      <rect x="170" y="20" width="80" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Solar panel edge (thin): 260×6 → 104×2.4, below bus */}
      <rect x="158" y="60" width="104" height="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Hinge connecting bus to panel */}
      <rect x="206" y="60" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna mast: 10×25 → 4×10, on top */}
      <rect x="238" y="10" width="4" height="10" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Front instrument: 40×20 → 16×8, on right face */}
      <rect x="250" y="32" width="8" height="16" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Side view dimension - length */}
      <line x1="170" y1="72" x2="250" y2="72" stroke="currentColor" strokeWidth="0.3" />
      <line x1="170" y1="68" x2="170" y2="76" stroke="currentColor" strokeWidth="0.3" />
      <line x1="250" y1="68" x2="250" y2="76" stroke="currentColor" strokeWidth="0.3" />
      <text x="210" y="80" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">200</text>
      {/* Side view dimension - height */}
      <line x1="162" y1="20" x2="162" y2="60" stroke="currentColor" strokeWidth="0.3" />
      <line x1="158" y1="20" x2="166" y2="20" stroke="currentColor" strokeWidth="0.3" />
      <line x1="158" y1="60" x2="166" y2="60" stroke="currentColor" strokeWidth="0.3" />
      <text x="156" y="43" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6" transform="rotate(-90,156,43)">100</text>
      {/* Side view label */}
      <text x="210" y="8" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.6">SIDE</text>

      {/* === FRONT VIEW (bottom right) - Looking from -X, shows Y-Z plane === */}
      {/* Main body: 120×100 → 48×40 scaled */}
      <rect x="185" y="105" width="48" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Solar panel: 120×6 → 48×2.4, on -Y side (left) */}
      <rect x="130" y="105" width="48" height="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Hinge */}
      <rect x="178" y="118" width="7" height="8" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Side instrument: on +Y side (right) */}
      <rect x="233" y="118" width="10" height="8" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna mast on top */}
      <rect x="207" y="95" width="4" height="10" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Front instrument (center, shown as inner rectangle) */}
      <rect x="201" y="117" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Front view dimension - width */}
      <line x1="185" y1="152" x2="233" y2="152" stroke="currentColor" strokeWidth="0.3" />
      <line x1="185" y1="148" x2="185" y2="156" stroke="currentColor" strokeWidth="0.3" />
      <line x1="233" y1="148" x2="233" y2="156" stroke="currentColor" strokeWidth="0.3" />
      <text x="209" y="162" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">120</text>
      {/* Front view label */}
      <text x="209" y="92" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.6">FRONT</text>

      {/* === TITLE BLOCK === */}
      <rect x="5" y="175" width="115" height="40" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <line x1="5" y1="188" x2="120" y2="188" stroke="currentColor" strokeWidth="0.3" />
      <text x="62" y="185" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">GRACE-FO</text>
      <text x="62" y="198" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">Gravity Recovery & Climate Experiment</text>
      <text x="62" y="210" textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.5">Scale 1:100 | Dims in units</text>

      {/* === COMPONENT CALLOUTS === */}
      {/* Solar array callout */}
      <line x1="60" y1="126" x2="60" y2="140" stroke="currentColor" strokeWidth="0.3" />
      <text x="60" y="148" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">SOLAR ARRAY</text>
      {/* Bus callout */}
      <line x1="60" y1="46" x2="60" y2="58" stroke="currentColor" strokeWidth="0.3" />
      <text x="60" y="66" textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.6">BUS</text>
    </svg>
  );
}

// SVG Schematic: Stock Chart
function StockSchematic({ style }) {
  return (
    <svg viewBox="0 0 180 140" className="schematic stock-schematic" style={style}>
      {/* Chart frame */}
      <rect x="20" y="15" width="140" height="100" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {/* Axes */}
      <line x1="35" y1="25" x2="35" y2="105" stroke="currentColor" strokeWidth="1" />
      <line x1="35" y1="105" x2="150" y2="105" stroke="currentColor" strokeWidth="1" />
      {/* Grid lines */}
      <line x1="35" y1="45" x2="150" y2="45" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3,3" />
      <line x1="35" y1="65" x2="150" y2="65" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3,3" />
      <line x1="35" y1="85" x2="150" y2="85" stroke="currentColor" strokeWidth="0.3" strokeDasharray="3,3" />
      {/* Candlesticks */}
      <line x1="50" y1="40" x2="50" y2="70" stroke="currentColor" strokeWidth="1" />
      <rect x="46" y="45" width="8" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="70" y1="35" x2="70" y2="60" stroke="currentColor" strokeWidth="1" />
      <rect x="66" y="40" width="8" height="12" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="90" y1="50" x2="90" y2="80" stroke="currentColor" strokeWidth="1" />
      <rect x="86" y="55" width="8" height="18" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="110" y1="30" x2="110" y2="55" stroke="currentColor" strokeWidth="1" />
      <rect x="106" y="35" width="8" height="12" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
      <line x1="130" y1="25" x2="130" y2="50" stroke="currentColor" strokeWidth="1" />
      <rect x="126" y="30" width="8" height="14" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
      {/* Trend line */}
      <path d="M 45 65 Q 80 55, 100 60 T 140 35" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
      {/* Labels */}
      <text x="90" y="128" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.7">MARKET DATA</text>
    </svg>
  );
}

// SVG Schematic: Neural Network
function NeuralNetworkSchematic({ style }) {
  return (
    <svg viewBox="0 0 220 160" className="schematic neural-schematic" style={style}>
      {/* Input layer */}
      <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="90" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="30" cy="120" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Hidden layer 1 */}
      <circle cx="80" cy="35" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="65" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="95" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="80" cy="125" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Hidden layer 2 */}
      <circle cx="130" cy="45" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="130" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="130" cy="115" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Output layer */}
      <circle cx="180" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="100" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />

      {/* Connections - Input to Hidden 1 */}
      <line x1="40" y1="30" x2="70" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="30" x2="70" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="60" x2="70" y2="35" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="60" x2="70" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="60" x2="70" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="90" x2="70" y2="65" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="90" x2="70" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="90" x2="70" y2="125" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="120" x2="70" y2="95" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="40" y1="120" x2="70" y2="125" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

      {/* Connections - Hidden 1 to Hidden 2 */}
      <line x1="90" y1="35" x2="120" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="35" x2="120" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="65" x2="120" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="65" x2="120" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="95" x2="120" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="95" x2="120" y2="115" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="125" x2="120" y2="80" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="90" y1="125" x2="120" y2="115" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

      {/* Connections - Hidden 2 to Output */}
      <line x1="140" y1="45" x2="170" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="45" x2="170" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="80" x2="170" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="80" x2="170" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="115" x2="170" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      <line x1="140" y1="115" x2="170" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />

      {/* Labels */}
      <text x="30" y="148" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">INPUT</text>
      <text x="105" y="148" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">HIDDEN LAYERS</text>
      <text x="180" y="148" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.7">OUTPUT</text>
    </svg>
  );
}

// Blueprint Schematics Container with parallax
function BlueprintSchematics() {
  const [transform, setTransform] = useState({ x: 0, y: 0, scrollY: 0 });
  const targetRef = useRef({ x: 0, y: 0, scrollY: 0 });
  const currentRef = useRef({ x: 0, y: 0, scrollY: 0 });
  const animationRef = useRef(null);

  useEffect(() => {
    const mobile = isMobile();
    if (mobile) return;

    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetRef.current.x = (e.clientX - centerX) / centerX;
      targetRef.current.y = (e.clientY - centerY) / centerY;
    };

    const handleScroll = () => {
      targetRef.current.scrollY = window.scrollY;
    };

    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.03);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.03);
      currentRef.current.scrollY = lerp(currentRef.current.scrollY, targetRef.current.scrollY, 0.05);

      setTransform({
        x: currentRef.current.x,
        y: currentRef.current.y,
        scrollY: currentRef.current.scrollY,
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const mobile = isMobile();

  const getStyle = (parallaxSpeed, mouseMultiplier, baseTop, baseLeft) => {
    if (mobile) {
      return { top: baseTop, left: baseLeft };
    }
    const translateY = -transform.scrollY * parallaxSpeed;
    const mouseX = transform.x * mouseMultiplier;
    const mouseY = transform.y * mouseMultiplier;
    return {
      top: baseTop,
      left: baseLeft,
      transform: `translate3d(${mouseX}px, ${translateY + mouseY}px, 0)`,
    };
  };

  return (
    <div className="blueprint-schematics">
      {/* Top row - corners */}
      <SatelliteSchematic style={getStyle(0.12, 25, '5%', '5%')} />
      <NeuralNetworkSchematic style={getStyle(0.14, 20, '8%', '75%')} />

      {/* Upper center */}
      <StockSchematic style={getStyle(0.13, 18, '18%', '38%')} />

      {/* Middle row */}
      <StockSchematic style={getStyle(0.18, 22, '40%', '2%')} />
      <SatelliteSchematic style={getStyle(0.17, 20, '35%', '42%')} />
      <SatelliteSchematic style={getStyle(0.15, 16, '45%', '78%')} />

      {/* Lower center */}
      <NeuralNetworkSchematic style={getStyle(0.19, 15, '58%', '35%')} />

      {/* Bottom row */}
      <NeuralNetworkSchematic style={getStyle(0.16, 18, '75%', '8%')} />
      <StockSchematic style={getStyle(0.2, 18, '72%', '72%')} />
    </div>
  );
}

// Scroll to Top Button
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}

// Navigation with Mobile Menu
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>

        <div className="nav-right">
          <a href="https://drive.google.com/file/d/1bvjtaNJXKyeXRoWOk1HszDoAtFgOW_74/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="resume-btn">
            Resume
          </a>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.name} href={link.href} className="mobile-nav-link" onClick={handleLinkClick}>
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

// Rotating text animation with typewriter effect
function RotatingText() {
  const roles = ['student', 'researcher', 'developer', 'startup intern', 'AI enthusiast'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex]);

  return (
    <span className="rotating-text">
      {displayText}<span className="cursor">|</span>
    </span>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">Hi, I'm Dylan Cablayan 👋</h1>
      <p className="hero-subtitle">I am a <RotatingText /></p>
    </section>
  );
}

// About Section - Expanded
function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <p>
          I'm a Computer Science student at the <span className="highlight">University of Hawaiʻi at Mānoa</span> through the Kaʻieʻie Transfer Program,
          concurrently taking classes at both UH Mānoa and Kapiʻolani Community College as I work toward completing degrees from both institutions.
          My academic background is in Natural Science and Information & Computer Science, and I currently maintain a 4.0 GPA.
        </p>
        <p>
          I'm a member of the <span className="highlight">OpenAI ChatGPT Lab</span> (1 of 28 students selected for Cohort 3)
          and an intern at <span className="highlight">Blue Startups</span>, Hawaiʻi's leading tech accelerator. I also support venture capital
          deal sourcing at Energy Innovation Capital.
        </p>
        <p>
          My interests sit at the intersection of AI/ML, startups, and civic tech. I've advocated for legislation supporting
          work-based learning (SB 2975 and HB 1654) and helped develop Hawaiʻi's first Filipino culture curriculum, now taught in seven schools statewide.
        </p>
        <p>
          Outside of class and work, I spend my time exploring new AI research, mentoring other students, building projects focused on real-world impact,
          and enjoying solo travel and archery.
        </p>
      </div>
    </section>
  );
}

// Skills Section
function Skills() {
  const skillCategories = [
    { name: 'Programming Languages:', skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL'] },
    { name: 'Frameworks:', skills: ['React', 'Next.js', 'Node.js', 'TailwindCSS', 'Flask'] },
    { name: 'AI/ML:', skills: ['PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'LangChain'] },
    { name: 'Tools:', skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Jupyter', 'AWS'] },
  ];

  return (
    <section id="skills" className="section">
      <h2 className="section-title">My Skills</h2>
      <div className="skills-container">
        {skillCategories.map((category) => (
          <div key={category.name} className="skill-category">
            <h3 className="skill-category-name">{category.name}</h3>
            <div className="skill-list">
              {category.skills.map((skill) => (
                <span key={skill} className="skill-item">● {skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Experience Section with Cards - Added Dates
function Experience() {
  const experiences = [
    {
      company: 'OpenAI',
      role: 'ChatGPT Lab Member',
      date: 'Oct 2025 - Present',
      description: '1 of 28 students selected (Cohort 3) to develop and test student-facing ChatGPT features and provide feedback directly to OpenAI.',
      link: 'https://openai.com',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      date: 'Aug 2025 - Present',
      description: "Supporting Hawaii's top tech accelerator with cohort operations, startup evaluation, and community building for the local startup ecosystem.",
      link: 'https://bluestartups.com',
    },
    {
      company: 'Energy Innovation Capital',
      role: 'VC Deal Sourcing (via Extern)',
      date: 'Oct 2025 - Present',
      description: 'Conducting venture capital deal sourcing and startup analysis for clean energy investments.',
    },
    {
      company: 'NASA',
      role: 'Research Intern (SEES Program)',
      date: 'May - Aug 2024',
      description: 'Conducted research at UT Austin Center for Space Research on GRACE-FO satellite data analyzing ice sheet melting. Presented findings at AGU Conference in Washington D.C.',
      link: 'https://www.nasa.gov/learning-resources/nasa-stem-engagement/',
    },
    {
      company: 'Stanford AIMI',
      role: 'Health AI Bootcamp',
      date: 'Jun 2024',
      description: 'Completed AI in Healthcare specialization covering ML fundamentals, clinical AI evaluations, and health equity considerations.',
      link: 'https://aimi.stanford.edu',
    },
    {
      company: 'Hohonu',
      role: 'Data Science Intern',
      date: 'Jun - Jul 2024',
      description: 'First startup experience working on tidal prediction models, data pipelines, and machine learning for ocean monitoring systems.',
      link: 'https://hohonu.io',
    },
    {
      company: 'UH Mānoa',
      role: 'CS Research Intern - SAIL Lab',
      date: 'Aug 2023 - Jun 2024',
      description: 'Developed NLP application for transcribing patient-physician conversations into structured JSON format using GPT-4 at the Laboratory of Applications in Informatics & Analytics.',
    },
  ];

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Work Experience</h2>
      <div className="cards-grid">
        {experiences.map((exp, index) => (
          <div key={index} className="card card-yellow">
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{exp.company}</h3>
                <span className="card-date">{exp.date}</span>
              </div>
              <p className="card-role">{exp.role}</p>
              <p className="card-description">{exp.description}</p>
              {exp.link && (
                <a href={exp.link} target="_blank" rel="noopener noreferrer" className="card-link">
                  <ExternalLink size={14} /> Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Projects Section with Cards - Added Links and Details
function Projects() {
  const projects = [
    {
      title: 'Filipino Curriculum Project',
      description: 'Worked alongside other high school students to develop Hawaiʻi\'s first Filipino history and culture curriculum for the DOE. Now actively taught at 7 schools across the state, reaching hundreds of students.',
      tags: ['Education', 'Curriculum Design', 'Cultural Advocacy'],
      date: 'Jan 2023 - Aug 2024',
      link: 'https://sites.google.com/view/filipinocurriculum/home',
    },
    {
      title: 'Synth - AI Contract Review',
      description: 'Built an AI-powered contract review and financial analysis chatbot with working demo. Won 2nd place at Hawaii State DECA Innovation Plan competition.',
      tags: ['AI/ML', 'NLP', 'Fintech'],
      date: 'Jan 2024',
      github: 'https://github.com/dcablayan',
    },
    {
      title: 'NLP Medical Transcription',
      description: 'Developed NLP application that transcribes patient-physician conversations into structured JSON format using GPT-4 for clinical documentation.',
      tags: ['Python', 'GPT-4', 'Healthcare AI'],
      date: '2023 - 2024',
    },
    {
      title: 'NASA GRACE-FO Research',
      description: 'Analyzed gravitational anomalies and sea level changes from ice sheet melting using GRACE-FO satellite data. Presented findings at AGU Conference.',
      tags: ['Data Science', 'Climate Research', 'Python'],
      date: 'May - Aug 2024',
      link: 'https://www.researchgate.net/publication/385278069_GRACE-FO_Weighing_Where_the_Water_Goes',
    },
    {
      title: 'AI Cancer Research',
      description: 'Research on NLP systems in clinical oncology settings. Won 2nd place at Ellison Medical Institute Medical Sciences Challenge at UCLA.',
      tags: ['AI', 'Healthcare', 'Research'],
      date: 'Aug 2024',
    },
  ];

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Projects</h2>
      <div className="cards-grid">
        {projects.map((project, index) => (
          <div key={index} className="card card-yellow">
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{project.title}</h3>
                <span className="card-date">{project.date}</span>
              </div>
              <p className="card-description">{project.description}</p>
              <div className="card-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="card-links">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-link">
                    <ExternalLink size={14} /> View
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
  const links = [
    { name: 'Email', href: 'mailto:dylancablayan07@gmail.com', icon: Mail },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/dylancablayan', icon: Linkedin },
    { name: 'GitHub', href: 'https://github.com/dcablayan', icon: Github },
    { name: 'LeetCode', href: 'https://leetcode.com/u/dcablayan/', icon: Code2 },
    { name: 'X', href: 'https://x.com/dylancablayan', icon: Twitter },
    { name: 'ResearchGate', href: 'https://www.researchgate.net/profile/Dylan-Cablayan', icon: BookOpen },
  ];

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Get In Touch</h2>
      <p className="contact-text">
        I'm always open to discussing new opportunities, research collaborations, or just chatting about AI and startups.
        Feel free to reach out!
      </p>
      <div className="contact-links">
        {links.map((link) => (
          <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="contact-link">
            <link.icon size={20} />
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {currentYear} Dylan Cablayan. Built with React.</p>
        <p className="footer-tagline">Making an impact through technology 🚀</p>
      </div>
    </footer>
  );
}

// Main App
function App() {
  return (
    <div className="app">
      <BlueprintGrid />
      <BlueprintSchematics />
      <div className="content">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;
