import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, ExternalLink, Twitter, BookOpen, Menu, X, ChevronUp, Code2, Calendar } from 'lucide-react';

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

// SVG Schematic: GRACE-FO Satellite (clean isometric view)
function SatelliteSchematic({ style }) {
  return (
    <svg viewBox="0 0 200 140" className="schematic satellite-schematic" style={style}>
      {/* Main body - trapezoidal (wider at top, narrower at bottom) */}
      {/* Top face */}
      <polygon points="35,30 165,30 145,50 55,50" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Front face (left side visible) */}
      <polygon points="35,30 55,50 55,90 35,105" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Right face */}
      <polygon points="55,50 145,50 145,90 55,90" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Back face (right side visible) */}
      <polygon points="145,50 165,30 165,70 145,90" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* Bottom face edge */}
      <line x1="35" y1="105" x2="55" y2="90" stroke="currentColor" strokeWidth="1.2" />
      <line x1="145" y1="90" x2="165" y2="70" stroke="currentColor" strokeWidth="1.2" />

      {/* Solar panel extending from left */}
      <polygon points="35,30 35,105 5,115 5,40" fill="none" stroke="currentColor" strokeWidth="1" />
      {/* Panel frame inner */}
      <polygon points="33,35 33,100 8,108 8,43" fill="none" stroke="currentColor" strokeWidth="0.4" />
      {/* Panel horizontal grid lines */}
      <line x1="5" y1="55" x2="35" y2="47" stroke="currentColor" strokeWidth="0.4" />
      <line x1="5" y1="70" x2="35" y2="62" stroke="currentColor" strokeWidth="0.4" />
      <line x1="5" y1="85" x2="35" y2="77" stroke="currentColor" strokeWidth="0.4" />
      <line x1="5" y1="100" x2="35" y2="92" stroke="currentColor" strokeWidth="0.4" />
      {/* Panel vertical grid lines */}
      <line x1="15" y1="42" x2="15" y2="112" stroke="currentColor" strokeWidth="0.4" />
      <line x1="25" y1="38" x2="25" y2="108" stroke="currentColor" strokeWidth="0.4" />

      {/* Antenna mast on top */}
      <line x1="100" y1="40" x2="100" y2="12" stroke="currentColor" strokeWidth="1" />
      <rect x="96" y="8" width="8" height="6" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <line x1="98" y1="14" x2="98" y2="40" stroke="currentColor" strokeWidth="0.4" />
      <line x1="102" y1="14" x2="102" y2="40" stroke="currentColor" strokeWidth="0.4" />

      {/* Internal detail lines on top face */}
      <line x1="55" y1="50" x2="75" y2="35" stroke="currentColor" strokeWidth="0.4" />
      <line x1="125" y1="35" x2="145" y2="50" stroke="currentColor" strokeWidth="0.4" />
      <rect x="70" y="35" width="60" height="12" fill="none" stroke="currentColor" strokeWidth="0.4" />

      {/* Internal detail on front face */}
      <line x1="40" y1="50" x2="50" y2="85" stroke="currentColor" strokeWidth="0.4" />
      <rect x="40" y="60" width="10" height="20" fill="none" stroke="currentColor" strokeWidth="0.4" />

      {/* Internal detail on right face */}
      <line x1="70" y1="55" x2="70" y2="85" stroke="currentColor" strokeWidth="0.4" />
      <line x1="100" y1="55" x2="100" y2="85" stroke="currentColor" strokeWidth="0.4" />
      <line x1="130" y1="55" x2="130" y2="85" stroke="currentColor" strokeWidth="0.4" />
      <line x1="60" y1="65" x2="140" y2="65" stroke="currentColor" strokeWidth="0.4" />
      <line x1="60" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="0.4" />
      <rect x="85" y="58" width="30" height="28" fill="none" stroke="currentColor" strokeWidth="0.5" />

      {/* Label */}
      <text x="100" y="130" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">GRACE-FO</text>
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

// Resume Selector Modal
function ResumeSelector({ isOpen, onClose }) {
  const resumes = {
    technical: 'https://drive.google.com/file/d/1bvjtaNJXKyeXRoWOk1HszDoAtFgOW_74/view?usp=sharing',
    nonTechnical: 'https://drive.google.com/file/d/1bvjtaNJXKyeXRoWOk1HszDoAtFgOW_74/view?usp=sharing',
  };

  const handleSelect = (type) => {
    window.open(resumes[type], '_blank', 'noopener,noreferrer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="password-modal-overlay" onClick={onClose}>
      <div className="password-modal" onClick={(e) => e.stopPropagation()}>
        <button className="password-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <h3 className="password-modal-title">View My Resume</h3>
        <p className="password-modal-text">What best describes your background?</p>
        <div className="resume-options">
          <button
            className="resume-option"
            onClick={() => handleSelect('technical')}
          >
            <span className="resume-option-title">Technical</span>
            <span className="resume-option-desc">Engineering, software, research roles</span>
          </button>
          <button
            className="resume-option"
            onClick={() => handleSelect('nonTechnical')}
          >
            <span className="resume-option-title">Non-Technical</span>
            <span className="resume-option-desc">Business, operations, general roles</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Navigation with Mobile Menu
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const navLinks = [
    { name: 'Now', href: '#now' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
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
            <button onClick={() => setShowResumeModal(true)} className="resume-btn">
              Resume
            </button>

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

      <ResumeSelector
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </>
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
      <h1 className="hero-title">Hi, I'm Dylan Cablayan</h1>
      <p className="hero-subtitle">I am a <RotatingText /></p>
    </section>
  );
}

// Now Section - Current Focus
function Now() {
  return (
    <section id="now" className="section now-section">
      <h2 className="section-title">What I'm Working On</h2>
      <div className="now-content">
        <p>
          I'm currently focused on building and researching AI systems at the intersection of machine learning, startups, and civic impact—gaining
          hands-on experience through research labs, <span className="highlight">OpenAI's ChatGPT Lab</span>, and early-stage startups.
        </p>
      </div>
    </section>
  );
}

// About Section - Background & Interests
function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <p>
          I'm a Computer Science student at the <span className="highlight">University of Hawaiʻi at Mānoa</span> through the Kaʻieʻie Transfer Program,
          taking classes at both UH Mānoa and Kapiʻolani Community College. I'm a member of the <span className="highlight">OpenAI ChatGPT Lab</span> and
          an intern at <span className="highlight">Blue Startups</span>, Hawaiʻi's top tech accelerator.
        </p>
        <p>
          My research experience includes the NASA SEES program at UT Austin's Center for Space Research and the UH Mānoa SAIL Lab,
          where I worked on healthcare NLP applications.
        </p>
        <p>
          Beyond tech, I care about civic advocacy—I've helped pass legislation for work-based learning and co-developed Hawaiʻi's first
          Filipino culture curriculum, now taught in seven schools.
        </p>
        <p>
          Outside of work, I'm into AI research, mentoring students, building real-world projects, solo travel, and archery.
        </p>
      </div>
    </section>
  );
}

// Skills Section - Compressed Tags
function Skills() {
  const skills = [
    { category: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL'] },
    { category: 'AI/ML', items: ['PyTorch', 'TensorFlow', 'LangChain', 'Pandas', 'NumPy'] },
    { category: 'Web', items: ['React', 'Next.js', 'Node.js', 'TailwindCSS'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Linux'] },
  ];

  return (
    <section id="skills" className="section skills-section">
      <h2 className="section-title">Skills</h2>
      <div className="skills-grid">
        {skills.map((group) => (
          <div key={group.category} className="skill-group">
            <span className="skill-category-label">{group.category}</span>
            <div className="skill-tags">
              {group.items.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Experience Section - Compact
function Experience() {
  const experiences = [
    {
      company: 'OpenAI',
      role: 'ChatGPT Lab Member',
      date: 'Oct 2025 - Present',
      description: 'Testing and developing student-facing ChatGPT features. 1 of 28 selected for Cohort 3.',
      link: 'https://openai.com',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      date: 'Aug 2025 - Present',
      description: "Supporting Hawaiʻi's top tech accelerator with cohort operations and startup evaluation.",
      link: 'https://bluestartups.com',
    },
    {
      company: 'Energy Innovation Capital',
      role: 'VC Deal Sourcing',
      date: 'Oct 2025 - Present',
      description: 'Deal sourcing and startup analysis for clean energy investments.',
    },
    {
      company: 'NASA',
      role: 'Research Intern (SEES)',
      date: 'May - Aug 2024',
      description: 'GRACE-FO satellite research at UT Austin. Presented at AGU Conference.',
      link: 'https://www.nasa.gov/learning-resources/nasa-stem-engagement/',
    },
    {
      company: 'Stanford AIMI',
      role: 'Health AI Bootcamp',
      date: 'Jun 2024',
      description: 'AI in Healthcare specialization: ML fundamentals and clinical AI evaluation.',
      link: 'https://aimi.stanford.edu',
    },
    {
      company: 'Hohonu',
      role: 'Data Science Intern',
      date: 'Jun - Jul 2024',
      description: 'Built tidal prediction models and ML pipelines for ocean monitoring.',
      link: 'https://hohonu.io',
    },
    {
      company: 'UH Mānoa SAIL Lab',
      role: 'CS Research Intern',
      date: 'Aug 2023 - Jun 2024',
      description: 'NLP application for patient-physician transcription using GPT-4.',
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

// Projects Section with Cards - Featured Projects First
function Projects() {
  const featuredProjects = [
    {
      title: 'NASA GRACE-FO Research',
      problem: 'Understanding ice sheet melting and sea level rise using satellite gravity data.',
      contribution: 'Analyzed GRACE-FO satellite data at UT Austin\'s Center for Space Research as part of the NASA SEES program and helped present findings at AGU.',
      tags: ['Python', 'Data Analysis', 'Climate Datasets'],
      date: 'May - Aug 2024',
      link: 'https://www.researchgate.net/publication/385278069_GRACE-FO_Weighing_Where_the_Water_Goes',
      featured: true,
    },
    {
      title: 'Synth - AI Contract Review',
      problem: 'AI-powered contract review and financial analysis to help users extract insights from legal/financial documents.',
      contribution: 'Solo-built prototype and demo. Designed concept, implemented chatbot, and core AI logic. Won 2nd place at Hawaii State DECA.',
      tags: ['Python', 'NLP', 'GPT', 'Fintech'],
      date: 'Jan 2024',
      github: 'https://github.com/dcablayan',
      featured: true,
    },
    {
      title: 'NLP Medical Transcription',
      problem: 'Transcribing patient-physician conversations into structured JSON for clinical documentation.',
      contribution: 'Built the NLP application and schema logic as a CS Research Intern at UH Mānoa SAIL Lab.',
      tags: ['Python', 'GPT-4', 'NLP', 'Healthcare'],
      date: '2023 - 2024',
      featured: true,
    },
  ];

  const otherProjects = [
    {
      title: 'Filipino Curriculum Project',
      description: 'Developed Hawaiʻi\'s first Filipino history and culture curriculum for the DOE. Now taught at 7 schools statewide.',
      tags: ['Education', 'Curriculum Design'],
      date: 'Jan 2023 - Aug 2024',
      link: 'https://sites.google.com/view/filipinocurriculum/home',
    },
    {
      title: 'AI Cancer Research',
      description: 'Research on NLP systems in clinical oncology. Won 2nd place at Ellison Medical Institute Challenge at UCLA.',
      tags: ['AI', 'Healthcare', 'Research'],
      date: 'Aug 2024',
    },
  ];

  return (
    <section id="projects" className="section">
      <h2 className="section-title">Featured Projects</h2>
      <div className="cards-grid">
        {featuredProjects.map((project, index) => (
          <div key={index} className="card card-yellow featured-project">
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">{project.title}</h3>
                <span className="card-date">{project.date}</span>
              </div>
              <div className="project-detail">
                <span className="project-label">Problem:</span>
                <p>{project.problem}</p>
              </div>
              <div className="project-detail">
                <span className="project-label">My Contribution:</span>
                <p>{project.contribution}</p>
              </div>
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

      <h3 className="subsection-title">Other Projects</h3>
      <div className="cards-grid">
        {otherProjects.map((project, index) => (
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
      <h2 className="section-title">Get in Touch</h2>
      <p className="contact-text">
        I'm always open to discussing research, startups, or new opportunities.
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
// Interactive Water/Fluid Simulation
function FluidSimulation() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: 0 });
  const wavePointsRef = useRef([]);
  const animationRef = useRef(null);
  const lastInteractionRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // Initialize wave points
      wavePointsRef.current = [];
      for (let i = 0; i <= width; i += 4) {
        wavePointsRef.current.push({ x: i, y: height / 2, vy: 0 });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const points = wavePointsRef.current;
      const mouseX = mouseRef.current.x;
      const time = Date.now() * 0.001;
      const now = Date.now();
      const timeSinceInteraction = now - lastInteractionRef.current;
      const shouldSnapBack = timeSinceInteraction > 1000;

      // Update wave points - multiple passes for better propagation
      // First pass: mouse influence
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const distToMouse = Math.abs(p.x - mouseX);
        if (distToMouse < 60) {
          const influence = (1 - distToMouse / 60) * 8;
          p.vy -= influence * 0.2;
        }
      }

      // Second pass: wave propagation (left to right)
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const left = points[i - 1];
        p.vy += (left.y - p.y) * 0.15;
      }

      // Third pass: wave propagation (right to left)
      for (let i = points.length - 2; i >= 0; i--) {
        const p = points[i];
        const right = points[i + 1];
        p.vy += (right.y - p.y) * 0.15;
      }

      // Fourth pass: physics and damping
      const margin = 10;
      const minY = margin;
      const maxY = height - margin;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const targetY = height / 2;

        // Spring back to center (stronger if snapping back)
        const dy = targetY - p.y;
        const springStrength = shouldSnapBack ? 0.15 : 0.02;
        p.vy += dy * springStrength;

        // Damping (stronger if snapping back)
        const dampingFactor = shouldSnapBack ? 0.85 : 0.96;
        p.vy *= dampingFactor;
        p.y += p.vy;

        // Clamp to stay within bounds
        p.y = Math.max(minY, Math.min(maxY, p.y));

        // Subtle ambient wave (only when not snapping back)
        if (!shouldSnapBack) {
          p.y += Math.sin(time * 1.5 + i * 0.03) * 0.15;
        }
      }

      // Draw wave line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();

      // Draw subtle reflection/glow
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.lineWidth = 4;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      lastInteractionRef.current = Date.now();
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current.x = touch.clientX - rect.left;
      lastInteractionRef.current = Date.now();
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-simulation" />;
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <FluidSimulation />
      <div className="footer-content">
        <a
          href="https://calendly.com/dylancablayan/15-minute-quickchat"
          target="_blank"
          rel="noopener noreferrer"
          className="calendly-link"
        >
          <Calendar size={16} />
          <span>Schedule a 15-min chat</span>
        </a>
        <p>© {currentYear} Dylan Cablayan. Built with React.</p>
        <p className="footer-tagline">Making an impact through technology</p>
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
          <Now />
          <Projects />
          <Experience />
          <About />
          <Skills />
          <Contact />
        </main>
        <Footer />
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;
