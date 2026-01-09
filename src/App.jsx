import { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, ExternalLink, Twitter, BookOpen, Menu, X, ChevronUp } from 'lucide-react';

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

      if (!mobile) {
        scrollRef.current = lerp(scrollRef.current, targetScrollRef.current, 0.1);
      }

      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.baseOpacity + twinkle * 0.2;
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
      <div className="cloud cloud-1" style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.15}px, 0)` }} />
      <div className="cloud cloud-2" style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.25}px, 0)` }} />
      <div className="cloud cloud-3" style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.1}px, 0)` }} />
      <div className="cloud cloud-4" style={{ transform: mobile ? 'none' : `translate3d(0, ${-scrollY * 0.2}px, 0)` }} />
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
          I'm a Computer Science student at <span className="highlight">UH Mānoa</span> through the Ka'ie'ie Transfer Program,
          with a background in Natural Science and Information & Computer Science from Kapi'olani Community College where I graduated with a 4.0 GPA.
        </p>
        <p>
          Currently, I'm a member of the <span className="highlight">OpenAI ChatGPT Lab</span> (1 of 28 students selected for Cohort 3)
          and an intern at <span className="highlight">Blue Startups</span>, Hawaii's top tech accelerator. I also do venture capital
          deal sourcing at Energy Innovation Capital.
        </p>
        <p>
          My passion lies at the intersection of AI/ML, startups, and civic tech. I've advocated for legislation supporting
          work-based learning (SB 2975 & HB 1654) and helped create Hawaii's first Filipino culture curriculum, now taught at 7 schools.
        </p>
        <p>
          When I'm not coding, you'll find me exploring new AI research papers, mentoring students, or working on projects
          that make a positive impact in my community.
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
      date: 'Oct 2024 - Present',
      description: '1 of 28 students selected (Cohort 3) to develop and test student-facing ChatGPT features and provide feedback directly to OpenAI.',
      link: 'https://openai.com',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      date: 'Aug 2024 - Present',
      description: "Supporting Hawaii's top tech accelerator with cohort operations, startup evaluation, and community building for the local startup ecosystem.",
      link: 'https://bluestartups.com',
    },
    {
      company: 'Energy Innovation Capital',
      role: 'VC Deal Sourcing (via Extern)',
      date: 'Oct 2024 - Present',
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
      role: 'CS Research Intern - LAIA Lab',
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
      description: 'Led the creation of Hawaii\'s first Filipino history and culture curriculum for the DOE. Now actively taught at 7 schools across the state, reaching hundreds of students.',
      tags: ['Education', 'Curriculum Design', 'Cultural Advocacy'],
      date: 'Jan 2023 - Aug 2024',
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
      link: 'https://www.researchgate.net/profile/Dylan-Cablayan',
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
      <Starfield />
      <Clouds />
      <FloatingAssets />
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
