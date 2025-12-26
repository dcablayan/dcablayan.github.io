import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, Youtube, FileText } from 'lucide-react';

const projects = [
    {
        title: 'GRACE-FO Ice Sheet Analysis',
        description: 'Analyzed gravitational and sea level changes due to ice sheet melting using NASA GRACE-FO satellite data. Published findings at SEES symposium and presented at AGU Conference.',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
        tags: ['Python', 'Data Science', 'NASA', 'Research'],
        links: {
            slides: '#',
        },
        featured: true,
    },
    {
        title: 'Patient-Physician NLP Transcriber',
        description: 'Developed an application using NLP to transcribe patient-physician conversations into structured JSON objects, integrating ChatGPT-4 for enhanced functionality.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
        tags: ['Python', 'NLP', 'GPT-4', 'Healthcare'],
        links: {
            github: '#',
        },
        featured: true,
    },
    {
        title: 'Tide Gauge Forecasting System',
        description: 'Optimized tide-gauge forecasting algorithms achieving 43% accuracy boost. Developed large-scale Mercator visualizations for 100+ sensor data points.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
        tags: ['Python', 'Machine Learning', 'Data Visualization', 'IoT'],
        links: {
            demo: '#',
        },
        featured: true,
    },
    {
        title: 'Battery Recycling Business Model',
        description: 'Developed comprehensive business model and supply chain strategy for battery recycling venture. Pitched to community leaders and received recognition from the Governor.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        tags: ['Entrepreneurship', 'Sustainability', 'Business'],
        links: {
            slides: '#',
        },
        featured: false,
    },
    {
        title: 'Portfolio Website',
        description: 'Modern, responsive portfolio website built with React, Vite, and TailwindCSS featuring smooth animations, dark/light mode, and a space-themed design.',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
        tags: ['React', 'Vite', 'TailwindCSS', 'Framer Motion'],
        links: {
            github: 'https://github.com/dcablayan/dcablayan.github.io',
            demo: 'https://dcablayan.github.io',
        },
        featured: false,
    },
    {
        title: 'AI Healthcare Bootcamp Projects',
        description: 'Completed advanced projects on ML evaluation techniques and deployment strategies for healthcare applications during Stanford AIMI bootcamp.',
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
        tags: ['Machine Learning', 'Healthcare AI', 'Stanford'],
        links: {
            notebook: '#',
        },
        featured: false,
    },
];

function ProjectCard({ project, index }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const getLinkIcon = (type) => {
        switch (type) {
            case 'github':
                return <Github className="w-4 h-4" />;
            case 'demo':
                return <ExternalLink className="w-4 h-4" />;
            case 'youtube':
                return <Youtube className="w-4 h-4" />;
            case 'slides':
            case 'notebook':
                return <FileText className="w-4 h-4" />;
            default:
                return <ExternalLink className="w-4 h-4" />;
        }
    };

    const getLinkLabel = (type) => {
        switch (type) {
            case 'github':
                return 'Code';
            case 'demo':
                return 'Demo';
            case 'youtube':
                return 'Video';
            case 'slides':
                return 'Slides';
            case 'notebook':
                return 'Notebook';
            default:
                return 'Link';
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`group liquid-glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 ${
                project.featured ? 'md:col-span-2 lg:col-span-1' : ''
            }`}
        >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Featured Badge */}
                {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass text-xs text-cyan-400 font-medium">
                        Featured
                    </div>
                )}
            </div>

            {/* Project Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-lg glass text-gray-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                    {Object.entries(project.links).map(([type, url]) => (
                        <motion.a
                            key={type}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-gray-300 hover:text-white hover:neon-glow-blue transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {getLinkIcon(type)}
                            {getLinkLabel(type)}
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="projects" className="relative py-32 px-6 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[linear-gradient(to_right,#8a2be2_1px,transparent_1px),linear-gradient(to_bottom,#8a2be2_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Section Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold chrome-gradient mb-4">
                        Projects
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full neon-glow-blue" />
                    <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
                        A selection of projects I've worked on
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.title}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>

                {/* More Projects CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <motion.a
                        href="https://github.com/dcablayan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg chrome-surface hover:neon-glow-blue transition-all duration-300 text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Github className="w-5 h-5" />
                        View More on GitHub
                    </motion.a>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-10 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl" />
        </section>
    );
}
