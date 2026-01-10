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
// Trapezoidal bus with solar panel and long instrument boom
function SatelliteSchematic({ style }) {
  return (
    <svg viewBox="0 0 320 220" className="schematic satellite-schematic" style={style}>
      {/* === TOP VIEW (upper area) === */}
      {/* Trapezoidal bus - top view (wider at back, narrower at front) */}
      <polygon points="25,18 95,18 85,58 35,58" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Solar panel with grid */}
      <rect x="95" y="8" width="70" height="60" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Panel grid lines */}
      <line x1="112" y1="8" x2="112" y2="68" stroke="currentColor" strokeWidth="0.3" />
      <line x1="129" y1="8" x2="129" y2="68" stroke="currentColor" strokeWidth="0.3" />
      <line x1="146" y1="8" x2="146" y2="68" stroke="currentColor" strokeWidth="0.3" />
      <line x1="95" y1="23" x2="165" y2="23" stroke="currentColor" strokeWidth="0.3" />
      <line x1="95" y1="38" x2="165" y2="38" stroke="currentColor" strokeWidth="0.3" />
      <line x1="95" y1="53" x2="165" y2="53" stroke="currentColor" strokeWidth="0.3" />
      {/* Hinge block */}
      <rect x="95" y="33" width="6" height="12" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna masts - top view */}
      <rect x="40" y="22" width="3" height="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <rect x="75" y="22" width="3" height="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {/* Top dimension - total width */}
      <line x1="25" y1="3" x2="165" y2="3" stroke="currentColor" strokeWidth="0.3" />
      <line x1="25" y1="0" x2="25" y2="6" stroke="currentColor" strokeWidth="0.3" />
      <line x1="165" y1="0" x2="165" y2="6" stroke="currentColor" strokeWidth="0.3" />
      <text x="95" y="0" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">460</text>
      {/* Bus width dimension */}
      <line x1="25" y1="65" x2="95" y2="65" stroke="currentColor" strokeWidth="0.3" />
      <line x1="25" y1="62" x2="25" y2="68" stroke="currentColor" strokeWidth="0.3" />
      <line x1="95" y1="62" x2="95" y2="68" stroke="currentColor" strokeWidth="0.3" />
      <text x="60" y="73" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">160</text>
      {/* Label */}
      <text x="130" y="42" fontSize="4" fill="currentColor" opacity="0.5">Spacecraft bus</text>
      <line x1="95" y1="38" x2="115" y2="42" stroke="currentColor" strokeWidth="0.2" />

      {/* === SIDE VIEW (middle area) === */}
      {/* Trapezoidal bus - side view */}
      <polygon points="25,95 95,95 95,135 25,145" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Long instrument boom extending from front */}
      <line x1="95" y1="112" x2="180" y2="112" stroke="currentColor" strokeWidth="0.8" />
      <line x1="95" y1="118" x2="180" y2="118" stroke="currentColor" strokeWidth="0.8" />
      {/* Instrument housing at end of boom */}
      <rect x="180" y="108" width="15" height="14" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Solar panel edge (thin line) */}
      <rect x="25" y="88" width="70" height="3" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna masts on top */}
      <rect x="40" y="82" width="2" height="13" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <rect x="75" y="82" width="2" height="13" stroke="currentColor" strokeWidth="0.5" fill="none" />
      {/* Side height dimension */}
      <line x1="15" y1="95" x2="15" y2="145" stroke="currentColor" strokeWidth="0.3" />
      <line x1="12" y1="95" x2="18" y2="95" stroke="currentColor" strokeWidth="0.3" />
      <line x1="12" y1="145" x2="18" y2="145" stroke="currentColor" strokeWidth="0.3" />
      <text x="8" y="122" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6" transform="rotate(-90,8,122)">160</text>
      {/* Side length dimension */}
      <line x1="25" y1="152" x2="95" y2="152" stroke="currentColor" strokeWidth="0.3" />
      <line x1="25" y1="149" x2="25" y2="155" stroke="currentColor" strokeWidth="0.3" />
      <line x1="95" y1="149" x2="95" y2="155" stroke="currentColor" strokeWidth="0.3" />
      <text x="60" y="160" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">120</text>
      {/* Boom label */}
      <text x="140" y="105" fontSize="4" fill="currentColor" opacity="0.5">Instrument housing (front)</text>
      <line x1="140" y1="107" x2="140" y2="112" stroke="currentColor" strokeWidth="0.2" />
      {/* Antenna label */}
      <text x="58" y="80" fontSize="4" fill="currentColor" opacity="0.5">Antenna mast</text>

      {/* === FRONT VIEW (right side) === */}
      {/* Trapezoidal bus - front view (wider at top) */}
      <polygon points="230,95 280,95 290,140 220,140" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Solar panel edge on side */}
      <rect x="280" y="100" width="3" height="35" fill="none" stroke="currentColor" strokeWidth="0.6" />
      {/* Antenna masts */}
      <rect x="242" y="82" width="2" height="13" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <rect x="266" y="82" width="2" height="13" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {/* Internal detail lines */}
      <line x1="235" y1="105" x2="275" y2="105" stroke="currentColor" strokeWidth="0.3" />
      <line x1="232" y1="115" x2="278" y2="115" stroke="currentColor" strokeWidth="0.3" />
      <rect x="245" y="118" width="20" height="15" fill="none" stroke="currentColor" strokeWidth="0.4" />
      {/* Front width dimension */}
      <line x1="220" y1="148" x2="290" y2="148" stroke="currentColor" strokeWidth="0.3" />
      <line x1="220" y1="145" x2="220" y2="151" stroke="currentColor" strokeWidth="0.3" />
      <line x1="290" y1="145" x2="290" y2="151" stroke="currentColor" strokeWidth="0.3" />
      <text x="255" y="156" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">350</text>
      {/* Front height dimension */}
      <line x1="298" y1="95" x2="298" y2="140" stroke="currentColor" strokeWidth="0.3" />
      <line x1="295" y1="95" x2="301" y2="95" stroke="currentColor" strokeWidth="0.3" />
      <line x1="295" y1="140" x2="301" y2="140" stroke="currentColor" strokeWidth="0.3" />
      <text x="308" y="120" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.6">100</text>

      {/* === SMALL ISOMETRIC (bottom left) === */}
      <g transform="translate(40, 175) scale(0.35)">
        {/* Isometric trapezoidal bus */}
        <polygon points="0,20 80,0 120,20 40,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="0,20 0,60 40,80 40,40" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="40,40 40,80 120,60 120,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="80,0 80,40 120,60 120,20" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Solar panel */}
        <polygon points="80,0 80,-30 160,-10 160,20" fill="none" stroke="currentColor" strokeWidth="1" />
        {/* Antenna */}
        <line x1="30" y1="10" x2="30" y2="-10" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* === TITLE BLOCK === */}
      <rect x="200" y="170" width="115" height="45" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <line x1="200" y1="185" x2="315" y2="185" stroke="currentColor" strokeWidth="0.4" />
      <line x1="200" y1="198" x2="315" y2="198" stroke="currentColor" strokeWidth="0.4" />
      <text x="257" y="181" textAnchor="middle" fontSize="8" fill="currentColor"><tspan fontWeight="bold">GRACE-FO</tspan> Satellite</text>
      <text x="257" y="194" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.7">Orthographic Blueprint</text>
      <text x="230" y="208" textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.6">Scale: 1:100</text>
      <line x1="255" y1="202" x2="255" y2="212" stroke="currentColor" strokeWidth="0.3" />
      <text x="285" y="208" textAnchor="middle" fontSize="4" fill="currentColor" opacity="0.6">Date: 2024</text>
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
