import { useState, useEffect } from 'react';
import { Sun, Moon, FileText, Mail, Linkedin, Github, ExternalLink, ArrowUpRight } from 'lucide-react';

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
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)] border-b border-[var(--border)]">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-btn">
            <FileText size={16} />
            Resume
          </a>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="section pt-16">
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Hi, I'm Dylan Cablayan!
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          CS + Data Science @ UH Mānoa • OpenAI ChatGPT Lab Member • Former NASA SEES Intern • VC Analyst @ Energy Innovation Capital
        </p>
      </div>
    </section>
  );
}

// About Section
function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <h2 className="section-title">About</h2>
        <div className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
          <p>
            I'm a Computer Science and Data Science student at the University of Hawai'i at Mānoa, passionate about
            artificial intelligence, machine learning, and their applications to real-world problems.
          </p>
          <p>
            Currently, I'm a member of the <a href="https://openai.com" target="_blank" rel="noopener noreferrer">OpenAI ChatGPT Lab</a>,
            one of 28 students selected across the U.S. & Canada to help develop student-facing AI features. I also work as a
            deal sourcing analyst at <a href="#" target="_blank" rel="noopener noreferrer">Energy Innovation Capital</a>,
            evaluating early-stage clean energy startups.
          </p>
          <p>
            Previously, I interned at <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer">NASA</a> through their
            SEES program, contributing to GRACE-FO research on ice sheet melting and sea level changes. I've also worked at
            Blue Startups managing portfolio tracking for 160+ companies.
          </p>
        </div>
      </div>
    </section>
  );
}

// Skills Section
function Skills() {
  const skillCategories = [
    {
      name: 'Languages',
      skills: [
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      ],
    },
    {
      name: 'AI/ML',
      skills: [
        { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
        { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
        { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
        { name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
      ],
    },
    {
      name: 'Web',
      skills: [
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      ],
    },
    {
      name: 'Tools',
      skills: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
        { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
      ],
    },
  ];

  return (
    <section id="skills" className="section">
      <div className="container">
        <h2 className="section-title">Skills</h2>
        <div className="space-y-6">
          {skillCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <img src={skill.icon} alt={skill.name} loading="lazy" />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Research/Experience Section
function Research() {
  const experiences = [
    {
      company: 'OpenAI',
      role: 'ChatGPT Lab Member',
      period: 'Oct 2025 - Present',
      description: 'Selected as 1 of 28 students across the U.S. & Canada to help develop and test student-facing ChatGPT features under active NDA.',
      logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
      link: 'https://openai.com',
    },
    {
      company: 'Energy Innovation Capital',
      role: 'VC Deal Sourcing Analyst',
      period: 'Oct 2025 - Present',
      description: 'Sourcing and evaluating 20+ high-potential clean energy startup investments per quarter. Completed due diligence on 12 portfolio candidates.',
      logo: '/eic-logo.png',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      period: 'Aug 2025 - Present',
      description: 'Managing portfolio tracking and CRM workflows for 160+ companies. Reconciled $75M+ in expenditures and coordinated 30+ program workshops.',
      logo: '/blue-startups-logo.png',
      link: 'https://bluestartups.com',
    },
    {
      company: 'Hohonu.io',
      role: 'Data Science Intern',
      period: 'Jun - Aug 2025',
      description: 'Optimized tide-gauge forecasting algorithms with 43% accuracy improvement. Developed Mercator visualizations for 100+ sensors.',
      logo: '/hohonu-logo.png',
      link: 'https://hohonu.io',
    },
    {
      company: 'NASA SEES',
      role: 'Research Intern',
      period: 'May - Jul 2024',
      description: 'GRACE-FO research team analyzing ice sheet melting and sea level changes. Published at SEES symposium, presented at AGU Conference.',
      logo: 'https://cdn.worldvectorlogo.com/logos/nasa-6.svg',
      link: 'https://nasa.gov',
    },
    {
      company: 'Stanford AIMI',
      role: 'AI Bootcamp Participant',
      period: 'Jun 2024',
      description: 'Selected as 1 of 36 students (~2% acceptance) for inaugural AI in healthcare bootcamp with Stanford medical faculty.',
      logo: '/stanford-logo.png',
      link: 'https://aimi.stanford.edu',
    },
    {
      company: 'UH Laboratory of Analytics',
      role: 'CS Intern',
      period: 'Sep 2023 - Jul 2024',
      description: 'Developed NLP application transcribing patient-physician conversations to JSON using Python and GPT-4.',
      logo: '/sail-logo.png',
    },
  ];

  return (
    <section id="research" className="section">
      <div className="container">
        <h2 className="section-title">Research & Experience</h2>
        <div>
          {experiences.map((exp, index) => (
            <div key={index} className="experience-card">
              <img src={exp.logo} alt={exp.company} className="experience-logo" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {exp.company}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {exp.role}
                    </p>
                  </div>
                  <span className="text-sm whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {exp.description}
                </p>
                {exp.link && (
                  <a href={exp.link} target="_blank" rel="noopener noreferrer" className="link-arrow mt-2 inline-flex">
                    Visit <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Projects Section
function Projects() {
  const projects = [
    {
      title: 'GRACE-FO Ice Sheet Analysis',
      description: 'Analyzed gravitational and sea level changes from NASA satellite data. Published at SEES symposium and presented at AGU Conference in Washington D.C.',
      tags: ['Python', 'Data Science', 'Research'],
      links: { paper: '#' },
    },
    {
      title: 'Patient-Physician NLP Transcriber',
      description: 'NLP application that transcribes medical conversations into structured JSON objects using GPT-4 integration.',
      tags: ['Python', 'NLP', 'GPT-4'],
      links: { github: '#' },
    },
    {
      title: 'Tide Gauge Forecasting',
      description: 'Optimized forecasting algorithms achieving 43% accuracy improvement. Built visualizations for 100+ sensor data points.',
      tags: ['Python', 'ML', 'Data Viz'],
      links: { demo: '#' },
    },
    {
      title: 'Portfolio Website',
      description: 'Clean, responsive portfolio built with React and TailwindCSS featuring dark/light mode.',
      tags: ['React', 'TailwindCSS'],
      links: { github: 'https://github.com/dcablayan/dcablayan.github.io' },
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.links.github && (
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      Code <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.links.demo && (
                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      Demo <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.links.paper && (
                    <a href={project.links.paper} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      Paper <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Contact Section
function Contact() {
  const links = [
    { name: 'Email', href: 'mailto:dylancablayan07@gmail.com', icon: Mail, label: 'dylancablayan07@gmail.com' },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/dylancablayan', icon: Linkedin, label: '/in/dylancablayan' },
    { name: 'GitHub', href: 'https://github.com/dcablayan', icon: Github, label: '@dcablayan' },
  ];

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">Contact</h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
          I'm always open to discussing new opportunities, research collaborations, or just chatting about AI and tech.
        </p>
        <div className="flex flex-wrap gap-6">
          {links.map((link) => (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="social-link">
              <link.icon />
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="py-8 border-t border-[var(--border)]">
      <div className="container">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Dylan Cablayan. Built with React.
        </p>
      </div>
    </footer>
  );
}

// Main App
function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Research />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
