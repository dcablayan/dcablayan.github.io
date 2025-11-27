# Personal Website - Y2K Chrome Edition

A modern personal website featuring an AI-inspired Y2K chrome aesthetic with interactive 3D effects.

## ✨ Features

- **Y2K Chrome Aesthetic**: Metallic gradients, neon accents, and futuristic design
- **3D Interactive Effects**: Floating metallic orb powered by Three.js
- **Smooth Animations**: Framer Motion for buttery-smooth transitions
- **Holographic Cards**: Interactive experience cards with hover effects
- **Responsive Design**: Works beautifully on all devices
- **Performance Optimized**: Built with Vite for lightning-fast load times

## 🚀 Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js** (React Three Fiber) - 3D graphics
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 🛠️ Development

### Prerequisites

- Node.js 24+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/personal-website.git
cd personal-website

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

## 📦 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps

1. **Push your code to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/personal-website.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Build and deployment", select "GitHub Actions" as the source

3. **Update the base path**:
   - In `vite.config.js`, change `base: '/personal-website/'` to match your repository name
   - If your repo is named differently, update accordingly

4. **Automatic Deployment**:
   - Every push to the `main` branch will trigger an automatic deployment
   - Your site will be available at `https://YOUR_USERNAME.github.io/personal-website/`

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
npm install -D gh-pages
npm run deploy
```

## 🎨 Customization

### Update Personal Information

1. **Hero Section** (`src/sections/Hero.jsx`):
   - Replace `"YOUR NAME"` with your actual name
   - Update the subtitle and description

2. **Experience Section** (`src/sections/Experience.jsx`):
   - Update the `experiences` array with your actual work experience
   - Replace placeholder logos with your company logos

3. **Company Logos**:
   - Add logo images to `public/` folder
   - Update the `logo` paths in the experiences array

### Color Scheme

The color scheme is defined in `src/index.css`:

- Chrome gradients: `#e0e0e0` to `#a0a0a0`
- Neon blue: `#00c8ff`
- Cyber purple: `#8a2be2`

Modify these values to match your preferred aesthetic.

## 📝 License

MIT License - feel free to use this for your own personal website!

## 🙏 Credits

Design inspired by Y2K aesthetics and modern AI interfaces.
