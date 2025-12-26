import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, FileText, Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

// Stars Background
function Stars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    // Draw stars
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });
    };
    draw();

    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}

// Floating Clouds
function Clouds() {
  return (
    <div className="clouds">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
    </div>
  );
}

// Floating Shapes (satellites/decorations)
function FloatingShapes() {
  return (
    <div className="floating-shapes">
      <div className="shape shape-1" />
      <div className="shape shape-2" />
    </div>
  );
}

// Navigation
function Navbar({ theme, toggleTheme }) {
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
        <div className="nav-actions">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-btn">
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}

// Rotating text animation
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
      color: 'green',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      description: "Helping run Hawaii's top tech accelerator.",
      link: 'https://bluestartups.com',
      color: 'blue',
    },
    {
      company: 'NASA',
      role: 'Research Intern (SEES)',
      description: 'Research at UT Austin Center for Space Research. Presented at AGU Conference.',
      link: 'https://nasa.gov',
      color: 'red',
    },
    {
      company: 'Stanford AIMI',
      role: 'Health AI Bootcamp',
      description: 'AI in Healthcare specialization including ML fundamentals and health equity.',
      link: 'https://aimi.stanford.edu',
      color: 'purple',
    },
    {
      company: 'Hohonu',
      role: 'Data Science Intern',
      description: 'First startup experience. Tides, data science, and machine learning.',
      link: 'https://hohonu.io',
      color: 'cyan',
    },
    {
      company: 'UH Mānoa',
      role: 'CS Research Intern',
      description: 'NLP app for patient-physician conversation transcription.',
      color: 'green',
    },
  ];

  return (
    <section id="research" className="section">
      <h2 className="section-title">My Work Experiences</h2>
      <div className="cards-grid">
        {experiences.map((exp, index) => (
          <div key={index} className={`card card-${exp.color}`}>
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
      color: 'yellow',
    },
    {
      title: 'Synth - AI Contract Review',
      description: 'Contract review & financial analysis AI chatbot. 2nd at Hawaii DECA.',
      color: 'pink',
    },
    {
      title: 'NLP Medical Transcription',
      description: 'Transcribes patient-physician conversations to structured JSON using GPT-4.',
      color: 'cyan',
    },
    {
      title: 'NASA GRACE-FO Research',
      description: 'Analyzed gravitational and sea level changes from ice sheet melting.',
      color: 'blue',
    },
    {
      title: 'AI Cancer Research',
      description: '2nd place at Ellison Medical Institute Medical Sciences Challenge.',
      color: 'purple',
    },
  ];

  return (
    <section id="projects" className="section">
      <h2 className="section-title">My Projects</h2>
      <div className="cards-grid">
        {projects.map((project, index) => (
          <div key={index} className={`card card-${project.color}`}>
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
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app">
      <Stars />
      <Clouds />
      <FloatingShapes />
      <div className="content">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
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
