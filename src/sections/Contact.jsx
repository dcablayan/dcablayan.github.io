import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, Linkedin, Github, Youtube, Music, MessageCircle, ExternalLink, Code2 } from 'lucide-react';

const contactLinks = [
    {
        name: 'Email',
        value: 'dylancablayan07@gmail.com',
        href: 'mailto:dylancablayan07@gmail.com',
        icon: Mail,
        color: 'from-blue-500 to-cyan-500',
        hoverColor: 'hover:border-cyan-400/50',
    },
    {
        name: 'LinkedIn',
        value: '/in/dylancablayan',
        href: 'https://www.linkedin.com/in/dylancablayan',
        icon: Linkedin,
        color: 'from-blue-600 to-blue-400',
        hoverColor: 'hover:border-blue-400/50',
    },
    {
        name: 'GitHub',
        value: '@dcablayan',
        href: 'https://github.com/dcablayan',
        icon: Github,
        color: 'from-gray-600 to-gray-400',
        hoverColor: 'hover:border-gray-400/50',
    },
    {
        name: 'LeetCode',
        value: '@dcablayan',
        href: 'https://leetcode.com/dcablayan',
        icon: Code2,
        color: 'from-yellow-600 to-orange-500',
        hoverColor: 'hover:border-yellow-400/50',
    },
    {
        name: 'YouTube',
        value: '@dylancablayan',
        href: 'https://youtube.com/@dylancablayan',
        icon: Youtube,
        color: 'from-red-600 to-red-400',
        hoverColor: 'hover:border-red-400/50',
    },
    {
        name: 'Spotify',
        value: 'Dylan Cablayan',
        href: 'https://open.spotify.com/user/dylancablayan',
        icon: Music,
        color: 'from-green-600 to-green-400',
        hoverColor: 'hover:border-green-400/50',
    },
    {
        name: 'Discord',
        value: '@dylancablayan',
        href: '#',
        icon: MessageCircle,
        color: 'from-indigo-600 to-purple-500',
        hoverColor: 'hover:border-purple-400/50',
    },
];

function ContactCard({ contact, index }) {
    const Icon = contact.icon;

    return (
        <motion.a
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={`group flex items-center gap-4 p-5 rounded-2xl liquid-glass border border-white/10 ${contact.hoverColor} transition-all duration-300`}
        >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${contact.color} bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {contact.name}
                </h4>
                <p className="text-gray-400 text-sm truncate">
                    {contact.value}
                </p>
            </div>

            {/* Arrow */}
            <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors duration-300" />
        </motion.a>
    );
}

export default function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section id="contact" className="relative py-32 px-6 overflow-hidden">
            <div className="container mx-auto max-w-4xl relative z-10">
                {/* Section Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold chrome-gradient mb-4">
                        Let's Connect
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full neon-glow-blue" />
                    <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
                        I'm always excited to connect with fellow technologists, researchers, and innovators.
                        Feel free to reach out!
                    </p>
                </motion.div>

                {/* Contact Links Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contactLinks.map((contact, index) => (
                        <ContactCard
                            key={contact.name}
                            contact={contact}
                            index={index}
                        />
                    ))}
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 liquid-glass rounded-2xl p-8 text-center"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                            <Mail className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Prefer Email?
                    </h3>
                    <p className="text-gray-400 mb-4">
                        I typically respond within 24 hours
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.a
                            href="mailto:dylancablayan07@gmail.com"
                            className="px-6 py-3 rounded-lg chrome-surface hover:neon-glow-blue transition-all duration-300 text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            dylancablayan07@gmail.com
                        </motion.a>
                        <motion.a
                            href="mailto:dylanj7@hawaii.edu"
                            className="px-6 py-3 rounded-lg glass hover:neon-glow-purple transition-all duration-300 text-white font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            dylanj7@hawaii.edu
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
        </section>
    );
}
