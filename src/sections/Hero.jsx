import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Mail, Linkedin, X, ExternalLink } from 'lucide-react';

// Typewriter hook
const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
    const [displayText, setDisplayText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const tick = useCallback(() => {
        const currentWord = words[wordIndex];

        if (isPaused) {
            return;
        }

        if (!isDeleting) {
            // Typing
            if (displayText.length < currentWord.length) {
                setDisplayText(currentWord.substring(0, displayText.length + 1));
            } else {
                // Finished typing, pause then start deleting
                setIsPaused(true);
                setTimeout(() => {
                    setIsPaused(false);
                    setIsDeleting(true);
                }, pauseTime);
            }
        } else {
            // Deleting
            if (displayText.length > 0) {
                setDisplayText(currentWord.substring(0, displayText.length - 1));
            } else {
                // Finished deleting, move to next word
                setIsDeleting(false);
                setWordIndex((prev) => (prev + 1) % words.length);
            }
        }
    }, [displayText, isDeleting, isPaused, wordIndex, words, pauseTime]);

    useEffect(() => {
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting, typingSpeed, deletingSpeed]);

    return displayText;
};

const ContactModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 400, duration: 0.3 }}
                        className="liquid-glass rounded-3xl p-12 max-w-4xl w-full relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full glass hover:neon-glow-purple transition-all duration-300 flex items-center justify-center text-white z-50"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
                            {/* Left Side: Title & Info */}
                            <div>
                                <h3 className="text-5xl font-bold chrome-gradient mb-6">
                                    Let's Connect
                                </h3>
                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    I'm always open to discussing new opportunities, research collaborations, or just chatting about AI and tech.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-cyan-400">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-cyan-400">Email Response Time</p>
                                            <p>Usually within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-400">
                                        <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-purple-400">
                                            <Linkedin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-purple-400">LinkedIn</p>
                                            <p>Active Daily</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Links */}
                            <div className="space-y-4">
                                <a
                                    href="mailto:dylancablayan07@gmail.com"
                                    className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-8 h-8 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">Personal Email</h4>
                                        <p className="text-gray-400">dylancablayan07@gmail.com</p>
                                    </div>
                                    <ExternalLink className="ml-auto w-6 h-6 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                                </a>

                                <a
                                    href="mailto:dylanj7@hawaii.edu"
                                    className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-400/50 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-8 h-8 text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">School Email</h4>
                                        <p className="text-gray-400">dylanj7@hawaii.edu</p>
                                    </div>
                                    <ExternalLink className="ml-auto w-6 h-6 text-gray-600 group-hover:text-green-400 transition-colors" />
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/dylancablayan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-6 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Linkedin className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">LinkedIn</h4>
                                        <p className="text-gray-400">Connect with me</p>
                                    </div>
                                    <ExternalLink className="ml-auto w-6 h-6 text-gray-600 group-hover:text-blue-400 transition-colors" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const roles = [
    'Student',
    'Developer',
    'AI Researcher',
    'ML Engineer',
    'VC Analyst',
    'Innovator',
];

export default function Hero() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const typewriterText = useTypewriter(roles, 100, 50, 2000);

    const openContactModal = () => setIsContactModalOpen(true);
    const closeContactModal = () => setIsContactModalOpen(false);

    const scrollToProjects = () => {
        const element = document.querySelector('#projects');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-transparent to-transparent" />

            <div className="container mx-auto px-6 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Greeting */}
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-400 mb-4"
                    >
                        Hi, I'm
                    </motion.p>

                    {/* Liquid Glass Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 liquid-glass-text relative tracking-tight cursor-pointer"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}
                    >
                        DYLAN CABLAYAN
                    </motion.h1>

                    {/* Typewriter Subtitle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-2xl md:text-4xl mb-4 font-light tracking-wide h-12 flex items-center justify-center"
                    >
                        <span className="text-gray-300">I'm a </span>
                        <span className="neon-blue ml-2 font-medium min-w-[200px] text-left">
                            {typewriterText}
                            <span className="typewriter-cursor" />
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                    >
                        CS Student at UH Mānoa | OpenAI ChatGPT Lab | Former NASA Researcher
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex gap-4 justify-center flex-wrap"
                    >
                        <motion.button
                            onClick={scrollToProjects}
                            className="px-8 py-4 rounded-lg chrome-surface hover:neon-glow-blue transition-all duration-300 text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View Projects
                        </motion.button>
                        <motion.button
                            onClick={openContactModal}
                            className="px-8 py-4 rounded-lg glass hover:neon-glow-purple transition-all duration-300 text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Me
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-gray-400"
                    >
                        <span className="text-sm">Scroll to explore</span>
                        <ArrowDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Contact Modal */}
            <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
        </section>
    );
}
