# Dylan Cablayan - Portfolio

A clean, minimal portfolio website built with React and TailwindCSS.

**Live Site**: [https://dcablayan.github.io](https://dcablayan.github.io)

## Features

- Clean, minimal design inspired by [jayyeung.vercel.app](https://jayyeung.vercel.app)
- Dark/light mode toggle with system preference detection
- Responsive layout
- Fast loading (< 70KB gzipped)

## Sections

- **About**: Brief introduction and background
- **Skills**: Programming languages, frameworks, and tools
- **Research**: Work experience and research positions
- **Projects**: Notable projects with links
- **Contact**: Email and social links

## Tech Stack

- React 19
- Vite
- TailwindCSS
- Lucide Icons

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Customization

All content is in `src/App.jsx`. Edit the data arrays:

- `skillCategories` - Skills with icons
- `experiences` - Work experience items
- `projects` - Project cards

### Adding a Resume

Place your PDF at `public/resume.pdf`.

### Theme Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --accent: #2563eb;  /* Change accent color */
}
```

## Deployment

Push to main branch to deploy via GitHub Pages:

```bash
git add .
git commit -m "Update"
git push origin main
```

## License

MIT
