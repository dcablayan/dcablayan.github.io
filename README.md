# Dylan Cablayan - Portfolio Website

A modern, responsive single-page portfolio website featuring a space-themed design with smooth animations, dark/light mode, and a typewriter effect.

**Live Site**: [https://dcablayan.github.io](https://dcablayan.github.io)

## Features

- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Typewriter Effect**: Animated role cycling in the hero section
- **Smooth Animations**: Scroll-triggered fade-in transitions using Framer Motion
- **Space Theme**: Animated star field background with shooting stars
- **Interactive Elements**: Hover effects, modals, and expandable cards
- **Glassmorphism UI**: Modern glass-like card effects

## Sections

1. **Hero**: Full-screen intro with typewriter effect and CTA buttons
2. **About**: Personal background and quick facts
3. **Skills**: Categorized programming languages, frameworks, and tools with icons
4. **Experience**: Timeline of work experience with expandable details
5. **Projects**: Grid of project cards with links to demos/repos
6. **Contact**: Social links and contact information
7. **Footer**: Copyright and playful credits

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Three.js** (optional) - 3D graphics

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dcablayan/dcablayan.github.io.git
cd dcablayan.github.io

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment to GitHub Pages

### Automatic Deployment

Push to the `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Manual Deployment

```bash
npm run deploy
```

## Customization Guide

### Updating Personal Information

#### Hero Section (`src/sections/Hero.jsx`)
- Change the name in the `<h1>` tag
- Modify the `roles` array for typewriter effect:
```javascript
const roles = [
    'Your Role 1',
    'Your Role 2',
    'Developer',
    // Add more roles...
];
```

#### About Section (`src/sections/About.jsx`)
- Update the paragraphs with your background
- Modify the "Quick Facts" grid

#### Skills Section (`src/sections/Skills.jsx`)
- Update the `skillCategories` array:
```javascript
const skillCategories = [
    {
        name: 'Languages',
        icon: '{ }',
        skills: [
            { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
            // Add more skills...
        ],
    },
    // Add more categories...
];
```

#### Experience Section (`src/sections/Experience.jsx`)
- Update the `experiences` array:
```javascript
const experiences = [
    {
        company: 'Company Name',
        role: 'Your Role',
        period: 'Start - End',
        description: 'Brief description',
        achievements: ['Achievement 1', 'Achievement 2'],
        logo: '/your-logo.png', // Place in public folder
    },
    // Add more experiences...
];
```

#### Projects Section (`src/sections/Projects.jsx`)
- Update the `projects` array:
```javascript
const projects = [
    {
        title: 'Project Name',
        description: 'Project description',
        image: 'https://images.unsplash.com/...',
        tags: ['React', 'Python', 'AI'],
        links: {
            github: 'https://github.com/...',
            demo: 'https://...',
            youtube: 'https://youtube.com/...',
        },
        featured: true,
    },
    // Add more projects...
];
```

#### Contact Section (`src/sections/Contact.jsx`)
- Update the `contactLinks` array with your social profiles

### Adding a Resume PDF

1. Place your resume PDF in the `public/` folder as `resume.pdf`
2. The navbar already links to `/resume.pdf`

### Adding Company Logos

1. Add logo images to the `public/` folder
2. Reference them with a leading `/`: `logo: '/company-logo.png'`

### Customizing Colors

Colors are defined in `src/index.css`:

```css
:root {
  --accent-cyan: #00c8ff;
  --accent-purple: #8a2be2;
  /* Modify these values */
}
```

### Customizing the Theme Toggle

The theme toggle persists to localStorage. To change the default theme, modify `src/App.jsx`:

```javascript
const [theme, setTheme] = useState(() => {
    // Change 'dark' to 'light' for light mode default
    return 'dark';
});
```

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx      # Sticky navigation with theme toggle
│   ├── Footer.jsx      # Site footer
│   ├── Stars.jsx       # Animated star background
│   └── NeuralNetwork.jsx # Optional neural network animation
├── sections/
│   ├── Hero.jsx        # Hero with typewriter
│   ├── About.jsx       # About section
│   ├── Skills.jsx      # Skills grid
│   ├── Experience.jsx  # Experience timeline
│   ├── Projects.jsx    # Project cards
│   └── Contact.jsx     # Contact links
├── App.jsx             # Main app with theme logic
├── main.jsx            # React entry point
└── index.css           # Global styles and theme
```

## Performance Optimization

- Images are lazy-loaded with `loading="lazy"`
- Animations use `useInView` for scroll-triggered reveals
- Stars canvas is only rendered in dark mode
- CSS uses CSS custom properties for theme switching

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this for your own portfolio!

## Credits

- Icons: [Devicon](https://devicons.github.io/devicon/)
- UI Icons: [Lucide](https://lucide.dev/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- Fonts: [Inter](https://rsms.me/inter/), [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
