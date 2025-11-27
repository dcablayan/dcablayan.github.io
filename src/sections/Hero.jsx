import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const openContactModal = () => setIsContactModalOpen(true);
    const closeContactModal = () => setIsContactModalOpen(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/10 via-black to-black" />

            <div className="container mx-auto px-6 py-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    {/* Liquid Glass Title */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-7xl md:text-9xl font-bold mb-6 liquid-glass-text relative tracking-tight cursor-pointer"
                        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, letterSpacing: '-0.02em' }}
                    >
                        DYLAN CABLAYAN
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-2xl md:text-4xl mb-4 neon-blue font-light tracking-wide"
                    >
                        AI/ML Researcher & Venture Capital Analyst
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
                    >
                        CS Student at UH Mānoa | OpenAI ChatGPT Lab | Former NASA Researcher |
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex gap-4 justify-center flex-wrap"
                    >
                        <button className="px-8 py-4 rounded-lg chrome-surface hover:neon-glow-blue transition-all duration-300 text-white font-medium">
                            View Projects
                        </button>
                        <button
                            onClick={openContactModal} // Add onClick handler
                            className="px-8 py-4 rounded-lg glass hover:neon-glow-purple transition-all duration-300 text-white font-medium"
                        >
                            Contact Me
                        </button>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
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
