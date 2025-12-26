import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, Rocket } from 'lucide-react';

const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/dcablayan', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/in/dylancablayan', icon: Linkedin },
    { name: 'Email', href: 'mailto:dylancablayan07@gmail.com', icon: Mail },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-12 px-6 border-t border-white/10">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & Copyright */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center md:items-start gap-2"
                    >
                        <span className="text-2xl font-bold chrome-gradient">Dylan Cablayan</span>
                        <p className="text-gray-500 text-sm">
                            &copy; {currentYear} All rights reserved.
                        </p>
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-4"
                    >
                        {socialLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:neon-glow-blue transition-all duration-300"
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label={link.name}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.a>
                            );
                        })}
                    </motion.div>

                    {/* Playful Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-gray-500 text-sm"
                    >
                        <span>Built with</span>
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </motion.span>
                        <span>and</span>
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0], y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                        >
                            <Rocket className="w-4 h-4 text-cyan-400" />
                        </motion.span>
                        <span>in Hawai'i</span>
                    </motion.div>
                </div>

                {/* Tech Stack Credit */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 pt-6 border-t border-white/5 text-center"
                >
                    <p className="text-gray-600 text-xs">
                        Built with React, Vite, TailwindCSS & Framer Motion
                    </p>
                </motion.div>
            </div>
        </footer>
    );
}
