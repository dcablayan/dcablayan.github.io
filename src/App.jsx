import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, FileText, Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

// Gradient Background with scroll parallax
function GradientBackground() {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / maxScroll;

      // Move gradients based on scroll
      const x1 = 20 + scrollPercent * 30;
      const y1 = 20 + scrollPercent * 40;
      const x2 = 80 - scrollPercent * 30;
      const y2 = 80 - scrollPercent * 40;

      bgRef.current.style.setProperty('--mouse-x', `${x1}%`);
      bgRef.current.style.setProperty('--mouse-y', `${y1}%`);
      bgRef.current.style.setProperty('--mouse-x2', `${x2}%`);
      bgRef.current.style.setProperty('--mouse-y2', `${y2}%`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div ref={bgRef} className="gradient-bg" />;
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
    <nav className="sticky top-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-sm border-b border-[var(--border)]">
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
          <span className="hl-openai">ChatGPT Lab @ OpenAI</span> & Intern @ <span className="hl-blue">Blue Startups</span> | CS @ <span className="hl-uh">UH Mānoa</span> | ex-<span className="hl-nasa">NASA</span>
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
            I'm a Computer Science student at the <span className="hl-uh">University of Hawai'i at Mānoa</span> through
            the Kaieie Transfer Program, with a background in Natural Science and Information & Computer Science from Kapi'olani Community College (4.0 GPA).
          </p>
          <p>
            Currently, I'm a member of the <span className="hl-openai">OpenAI ChatGPT Lab</span> (1 of 28 students, Cohort 3)
            and an intern at <span className="hl-blue">Blue Startups</span>, Hawaii's top tech accelerator.
            I also do venture capital deal sourcing at Energy Innovation Capital through Extern.
          </p>
          <p>
            Previously, I was a research intern at <span className="hl-nasa">NASA</span> through the SEES program
            at UT Austin's Center for Space Research, worked on data science at Hohonu,
            and completed <span className="hl-stanford">Stanford's</span> AI in Healthcare bootcamp. I'm also a <span className="hl-yc">Y Combinator</span> Startup School participant.
          </p>
          <p>
            I'm passionate about AI/ML, startups, and civic tech. I've advocated for legislation (SB 2975 & HB 1654) supporting work-based learning
            and helped create Hawaii's first Filipino culture curriculum now taught at 7 schools.
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
      description: '1 of 28 students selected (Cohort 3) to help develop and test student-facing ChatGPT features.',
      logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
      link: 'https://openai.com',
    },
    {
      company: 'Blue Startups',
      role: 'Intern',
      period: 'Aug 2025 - Present',
      description: "Helping run Hawaii's top tech accelerator.",
      logo: '/blue-startups-logo.png',
      link: 'https://bluestartups.com',
    },
    {
      company: 'Extern',
      role: 'Energy Innovation Capital - VC Deal Sourcing',
      period: 'Oct 2025 - Present',
      description: 'Venture capital deal sourcing and startup analysis for clean energy investments.',
      logo: '/eic-logo.png',
    },
    {
      company: 'Hohonu',
      role: 'Data Science Intern',
      period: 'Jun - Jul 2025',
      description: 'First startup experience. Worked on tides, data science, and machine learning.',
      logo: '/hohonu-logo.png',
      link: 'https://hohonu.io',
    },
    {
      company: 'After-School All-Stars Hawaii',
      role: 'Program Leader',
      period: 'Feb - Jul 2025',
      description: 'Tutored and coached Title 1 middle school students.',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg',
    },
    {
      company: 'NASA',
      role: 'Research Intern (SEES Program)',
      period: 'May - Jul 2024',
      description: 'Research project at UT Austin Center for Space Research. Presented at AGU Conference.',
      logo: 'https://cdn.worldvectorlogo.com/logos/nasa-6.svg',
      link: 'https://nasa.gov',
    },
    {
      company: 'Civics Unplugged',
      role: 'Civic Innovation Academy Fellow',
      period: 'Aug 2024',
      description: 'UCLA program on youth civic involvement. Placed 2nd in AI cancer research competition by Ellison Institute.',
      logo: '/civics-logo.png',
    },
    {
      company: 'Twiggs Space Lab',
      role: 'Microgravity Research',
      period: 'Jul 2024',
      description: 'CubeSats and microgravity research in Austin, Texas.',
      logo: '/twiggs-logo.png',
    },
    {
      company: 'Stanford AIMI',
      role: 'Summer Health AI Bootcamp',
      period: 'Jun 2024',
      description: 'AI in Healthcare specialization including ML fundamentals, evaluations, and health equity.',
      logo: '/stanford-logo.png',
      link: 'https://aimi.stanford.edu',
    },
    {
      company: 'UH Mānoa',
      role: 'CS Intern - Laboratory of Applications in Informatics & Analytics',
      period: 'Aug 2023 - Jun 2024',
      description: 'Created a natural language processing app for patient-physician conversation transcription.',
      logo: '/uh-logo.png',
    },
    {
      company: 'Chamber of Commerce Hawaii',
      role: 'Student Leadership Board',
      period: 'Sep 2023 - Apr 2024',
      description: 'Advocated for SB 2975 & HB 1654, bills supporting work-based learning for high school students.',
      logo: '/chamber-logo.png',
    },
    {
      company: 'Nalukai Foundation',
      role: 'Cohort 10 Student "Founder"',
      period: 'Jun - Jul 2023',
      description: 'Startup accelerator for high school students. Recognized by Governor Josh Green.',
      logo: '/nalukai-logo.png',
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
                <div className="flex items-start justify-between gap-4 flex-wrap">
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
      title: 'Filipino Curriculum Project',
      description: 'Created a Filipino history and culture course for students in the Hawaii DOE, now actively being taught at 7 schools.',
      tags: ['Education', 'Curriculum', 'Advocacy'],
      period: 'Jan 2023 - Aug 2024',
      links: {},
    },
    {
      title: 'Synth - AI Contract Review',
      description: 'Contract review & financial analysis AI chatbot with working demo. Won 2nd place at Hawaii State DECA Innovation Plan competition.',
      tags: ['AI', 'NLP', 'Fintech'],
      period: 'Jan 2024',
      links: {},
    },
    {
      title: 'NLP Medical Transcription App',
      description: 'Natural language processing application that transcribes patient-physician conversations to structured JSON using GPT-4.',
      tags: ['Python', 'NLP', 'GPT-4', 'Healthcare'],
      period: '2023 - 2024',
      links: {},
    },
    {
      title: 'AI in Cancer Research',
      description: 'Research on NLP systems in clinical settings. Won 2nd place at Ellison Medical Institute Medical Sciences Challenge.',
      tags: ['AI', 'Healthcare', 'Research'],
      period: 'Aug 2024',
      links: {},
    },
    {
      title: 'NASA GRACE-FO Research',
      description: 'Analyzed gravitational and sea level changes due to ice sheet melting. Presented at AGU Conference in Washington D.C.',
      tags: ['Data Science', 'Research', 'Climate'],
      period: 'May - Jul 2024',
      links: {},
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <h2 className="section-title">Projects</h2>
        <div className="grid gap-4">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {project.period}
                </span>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                {project.description}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
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
                  {project.links.site && (
                    <a href={project.links.site} target="_blank" rel="noopener noreferrer" className="link-arrow">
                      View <ArrowUpRight size={14} />
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
      <GradientBackground />
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
