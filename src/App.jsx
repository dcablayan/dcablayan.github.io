import { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

// Utility: Linear interpolation for smooth animations
const lerp = (start, end, factor) => start + (end - start) * factor;

// Utility: Check if mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 'ontouchstart' in window;
};

// Layer 1: Starfield with slow parallax (0.2x speed) + twinkling
function Starfield() {
  const canvasRef = useRef(null);
  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const animationRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const mobile = isMobile();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight * 2
      );
      generateStars();
    };

    const generateStars = () => {
      starsRef.current = [];
      const starCount = mobile ? 100 : 250;
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          baseOpacity: Math.random() * 0.6 + 0.3,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth scroll interpolation (lerp)
      if (!mobile) {
        scrollRef.current = lerp(scrollRef.current, targetScrollRef.current, 0.1);
      }

      starsRef.current.forEach((star) => {
        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity + twinkle * 0.2;

        // Parallax offset (0.2x scroll speed)
        const parallaxY = mobile ? 0 : scrollRef.current * 0.2;

        ctx.beginPath();
        ctx.arc(star.x, star.y - parallaxY, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, opacity))})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleScroll = () => {
      targetScrollRef.current = window.scrollY;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield-canvas" />;
}

// Layer 2: Floating Geometric Assets with mid-ground parallax + mouse follow
function FloatingAssets() {
  const containerRef = useRef(null);
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
      // Lerp for smooth transitions
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.05);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.05);
      currentRef.current.scrollY = lerp(currentRef.current.scrollY, targetRef.current.scrollY, 0.08);

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

  // Asset configurations with different parallax speeds and mouse sensitivity
  const assets = [
    { id: 1, className: 'asset asset-diamond-1', parallaxSpeed: 0.3, mouseMultiplier: 15, rotation: 45 },
    { id: 2, className: 'asset asset-diamond-2', parallaxSpeed: 0.5, mouseMultiplier: 25, rotation: -30 },
    { id: 3, className: 'asset asset-circle-1', parallaxSpeed: 0.4, mouseMultiplier: 20, rotation: 0 },
    { id: 4, className: 'asset asset-triangle-1', parallaxSpeed: 0.35, mouseMultiplier: 18, rotation: 15 },
  ];

  return (
    <div ref={containerRef} className="floating-assets">
      {assets.map((asset) => {
        const translateY = mobile ? 0 : -transform.scrollY * asset.parallaxSpeed;
        const mouseX = mobile ? 0 : transform.x * asset.mouseMultiplier;
        const mouseY = mobile ? 0 : transform.y * asset.mouseMultiplier;
        const rotate = asset.rotation + (mobile ? 0 : transform.x * 5);

        return (
          <div
            key={asset.id}
            className={asset.className}
            style={{
              transform: `translate3d(${mouseX}px, ${translateY + mouseY}px, 0) rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

// Floating Clouds with parallax
function Clouds() {
  const [scrollY, setScrollY] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const mobile = isMobile();
    if (mobile) return;

    const handleScroll = () => {
      targetRef.current = window.scrollY;
    };

    const animate = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.06);
      setScrollY(currentRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const mobile = isMobile();

  return (
    <div className="clouds">
      <div
        className="cloud cloud-1"
        style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.15}px, 0)` }}
      />
      <div
        className="cloud cloud-2"
        style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.25}px, 0)` }}
      />
      <div
        className="cloud cloud-3"
        style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.1}px, 0)` }}
      />
      <div
        className="cloud cloud-4"
        style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.2}px, 0)` }}
      />
    </div>
  );
}

// Navigation
function Navbar() {
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Research', href: '#research' },
    { name: 'Project', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

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
        <a href="https://drive.google.com/file/d/1bvjtaNJXKyeXRoWOk1HszDoAtFgOW_74/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="resume-btn">
          Resume
        </a>
      </div>
    </nav>
  );
}

// Rotating text animation with typewriter effect
function RotatingText() {
  const roles = [
    'student',
    'researcher',
    'developer',
    'startup intern',
    'AI enthusiast',
  ];
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
      <h1 className="hero-title">
        Hi, I'm Dylan Cablayan 👋
      </h1>
      <p className="hero-subtitle">
        I am a <RotatingText />
      </p>
    </section>
  );
}

// About Section
function About() {
  return (
    <section id="about" className="section">
      <h2 className="section-title">About Me</h2>
      <div className="about-content">
        <p>
          I'm studying Computer Science at <span className="highlight">UH Mānoa</span>.
        </p>
        <p>
          I love working with AI/ML and building products that make an impact.
        </p>
      </div>
    </section>
  );
}

// Skills Section
function Skills() {
  const skillCategories = [
    {
      name: 'Programming Languages:',
      skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL'],
    },
    {
      name: 'Frameworks:',
      skills: ['React', 'Next.js', 'Node.js', 'TailwindCSS', 'Flask'],
    },
    {
      name: 'Libraries:',
      skills: ['PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'],
    },
    {
      name: 'Tools:',
      skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Jupyter'],
    },
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

// Research/Experience Section with Cards
function Research() {
  const experiences = [
    {
      company: 'OpenAI',
      role: 'ChatGPT Lab Member',
      description: '1 of 28 students selected (Cohort 3) to develop student-facing ChatGPT features.',
      link: 'https://openai.com',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      description: "Helping run Hawaii's top tech accelerator.",
      link: 'https://bluestartups.com',
    },
    {
      company: 'NASA',
      role: 'Research Intern (SEES)',
      description: 'Research at UT Austin Center for Space Research. Presented at AGU Conference.',
      link: 'https://nasa.gov',
    },
    {
      company: 'Stanford AIMI',
      role: 'Health AI Bootcamp',
      description: 'AI in Healthcare specialization including ML fundamentals and health equity.',
      link: 'https://aimi.stanford.edu',
    },
    {
      company: 'Hohonu',
      role: 'Data Science Intern',
      description: 'First startup experience. Tides, data science, and machine learning.',
      link: 'https://hohonu.io',
    },
    {
      company: 'UH Mānoa',
      role: 'CS Research Intern',
      description: 'NLP app for patient-physician conversation transcription.',
    },
  ];

  return (
    <section id="research" className="section">
      <h2 className="section-title">My Work Experiences</h2>
      <div className="cards-grid">
        {experiences.map((exp, index) => (
          <div key={index} className="card card-yellow">
            <div className="card-content">
              <h3 className="card-title">{exp.company}</h3>
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

// Projects Section with Cards
function Projects() {
  const projects = [
    {
      title: 'Filipino Curriculum',
      description: 'Created Filipino history and culture course for Hawaii DOE, taught at 7 schools.',
    },
    {
      title: 'Synth - AI Contract Review',
      description: 'Contract review & financial analysis AI chatbot. 2nd at Hawaii DECA.',
    },
    {
      title: 'NLP Medical Transcription',
      description: 'Transcribes patient-physician conversations to structured JSON using GPT-4.',
    },
    {
      title: 'NASA GRACE-FO Research',
      description: 'Analyzed gravitational and sea level changes from ice sheet melting.',
    },
    {
      title: 'AI Cancer Research',
      description: '2nd place at Ellison Medical Institute Medical Sciences Challenge.',
    },
  ];

  return (
    <section id="projects" className="section">
      <h2 className="section-title">My Projects</h2>
      <div className="cards-grid">
        {projects.map((project, index) => (
          <div key={index} className="card card-yellow">
            <div className="card-content">
              <h3 className="card-title">{project.title}</h3>
              <p className="card-description">{project.description}</p>
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
  ];

  return (
    <section id="contact" className="section">
      <h2 className="section-title">Contact</h2>
      <p className="contact-text">
        Feel free to reach out if you want to chat about AI, startups, or anything else!
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

// Main App
function App() {
  return (
    <div className="app">
      <Starfield />
      <Clouds />
      <FloatingAssets />
      <div className="content">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Research />
          <Projects />
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
