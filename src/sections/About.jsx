import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="about" className="relative py-32 px-6 overflow-hidden">
            <div className="container mx-auto max-w-4xl relative z-10">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-bold chrome-gradient mb-4">
                            About Me
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full neon-glow-blue" />
                    </div>

                    {/* About Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="liquid-glass rounded-3xl p-8 md:p-12"
                    >
                        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                            <p>
                                Hi! I'm <span className="text-cyan-400 font-semibold">Dylan Cablayan</span>,
                                a Computer Science student at the <span className="text-purple-400">University of Hawai'i at Mānoa</span>,
                                passionate about the intersection of artificial intelligence, machine learning, and real-world impact.
                            </p>

                            <p>
                                Currently, I'm a member of the <span className="text-cyan-400 font-semibold">OpenAI ChatGPT Lab</span>,
                                where I collaborate with a select group of students across North America to help shape the future of AI-powered education tools.
                                I've also had the privilege of interning at <span className="text-purple-400">NASA</span> as part of their SEES program,
                                where I contributed to GRACE-FO research on ice sheet melting and sea level changes.
                            </p>

                            <p>
                                Beyond research, I'm deeply interested in the startup ecosystem. As an intern at
                                <span className="text-cyan-400 font-semibold"> Blue Startups</span> and a deal sourcing analyst at
                                <span className="text-purple-400"> Energy Innovation Capital</span>, I've gained hands-on experience
                                evaluating early-stage companies and understanding what makes ventures succeed.
                            </p>

                            <p>
                                When I'm not coding or analyzing startups, you'll find me exploring new technologies,
                                attending tech conferences, or working on side projects that push my understanding of AI/ML.
                                I'm always excited to connect with fellow technologists and innovators!
                            </p>
                        </div>

                        {/* Quick Facts */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                            {[
                                { label: 'Location', value: "Hawai'i" },
                                { label: 'University', value: 'UH Mānoa' },
                                { label: 'Major', value: 'CS + Data Science' },
                                { label: 'Focus', value: 'AI/ML' },
                            ].map((fact, index) => (
                                <motion.div
                                    key={fact.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    className="glass rounded-xl p-4 text-center hover:neon-glow-blue transition-all duration-300"
                                >
                                    <p className="text-sm text-gray-400">{fact.label}</p>
                                    <p className="text-lg font-semibold text-white">{fact.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl" />
        </section>
    );
}
