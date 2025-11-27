import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const experiences = [
    {
        company: 'OpenAI',
        role: 'ChatGPT Lab Member',
        period: 'Oct 2025 - Present',
        description: 'Selected as 1 of 28 students across the U.S. & Canada to help develop and test student facing ChatGPT features under active NDA.',
        achievements: [
            'Ran hands-on tests of early prototypes; wrote clear, reproducible bug reports and usability notes that informed sprint priorities',
            'Designed prompt test cases and checklists to stress-test answers for common student tasks (studying, explanations, citations)'
        ],
        logo: 'https://cdn.worldvectorlogo.com/logos/openai-2.svg',
    },
    {
        company: 'Blue Startups',
        role: 'Intern',
        period: 'Aug 2025 - Present',
        description: 'Managing portfolio tracking, CRM workflows, and coordinating program workshops for startup companies.',
        achievements: [
            'Prepared quarterly state expenditure reports; reconciled $75M+ in expenditures across 160+ portfolio companies',
            'Built and maintained portfolio spend tracking; flagged variances and ensured documentation compliance',
            'Implemented CRM workflows and low-/no-code automations to keep founder, mentor, and deal data current',
            'Managed weekly newsletters and press releases for startup companies reaching 15,000 subscribers',
            'Coordinated 30+ program workshops and executed resource updates for 12 startup companies'
        ],
        logo: '/blue-startups-logo.png',
    },
    {
        company: 'Energy Innovation Capital',
        role: 'Venture Capital Deal Sourcing & Startup Analysis',
        period: 'Oct 2025 - Present',
        description: 'Sourcing and evaluating high-potential clean energy startup investments.',
        achievements: [
            'Completed due diligence reports on 12 shortlisted portfolio candidates within 3 weeks, streamlining investment committee evaluations',
            'Sourced and evaluated 20+ high-potential clean energy startup investments per quarter, cultivating a robust deal pipeline',
            'Assessed business models and technology readiness by synthesizing industry trends, regulatory changes, and competitive landscapes'
        ],
        logo: '/eic-logo.png',
    },
    {
        company: 'Hohonu.io',
        role: 'Data Science Intern (Full Time)',
        period: 'Jun 2025 - Aug 2025',
        description: 'Optimized tide-gauge forecasting algorithms and developed visualization systems.',
        achievements: [
            'Optimized tide-gauge forecasting algorithms, driving a 43% boost in accuracy',
            'Developed large-scale Mercator visualizations for data from 100+ sensors',
            'Architected end-to-end tide projection pipelines to automate data processing and forecasting'
        ],
        logo: '/hohonu-logo.png',
    },
    {
        company: 'NASA',
        role: 'Research Intern',
        period: 'May 2024 - Jul 2024',
        description: 'Selected for the prestigious STEM Enhancement in Earth Science (SEES) Summer High School Intern Program with 7% acceptance rate.',
        achievements: [
            'Assigned to the GRACE-FO research team, focusing on analyzing data related to gravitational & sea level changes due to ice sheet melting',
            'Published research findings at the SEES virtual symposium',
            'Invited to present at the 2024 American Geophysical Union Conference in Washington D.C.'
        ],
        logo: 'https://cdn.worldvectorlogo.com/logos/nasa-6.svg',
    },
    {
        company: 'Stanford AIMI',
        role: 'AI Bootcamp Participant',
        period: 'Jun 2024',
        description: 'Selected as 1 of 36 high school students out of 2,000+ applicants (~2% acceptance rate) for the inaugural 2-week virtual bootcamp.',
        achievements: [
            'Learned advanced concepts, evaluation techniques, and deployment strategies for machine learning in healthcare',
            'Collaborated with top experts & Stanford medical school faculty in group discussions and breakout activities about AI in the medical field'
        ],
        logo: '/stanford-logo.png',
    },
    {
        company: 'University of Hawai\'i at Mānoa',
        role: 'Fall Tech Days Student Advisory Committee',
        period: 'May 2024 - Mar 2025',
        description: 'Sole high school representative on the board, collaborating with college-level members.',
        achievements: [
            'Advised the committee on tailoring Fall Tech Days for high school students entering the UH system',
            'Planned tech career fairs and networking events to introduce local students to Hawaii\'s technology job opportunities',
            'Conducted outreach to various Hawai\'i tech companies to secure their participation and presentations'
        ],
        logo: '/uh-logo.png',
    },
    {
        company: 'University of Hawai\'i Laboratory of Applications in Informatics & Analytics',
        role: 'Computer Science Intern',
        period: 'Sep 2023 - Jul 2024',
        description: 'Paid Summer Internship/Research Program for Hawai\'i Highschool Students. Now rebranded as SAIL (Scalable Analytics and Informatics Lab).',
        achievements: [
            'Participated in Project Hokulani, a credit-earning initiative at the University of Hawaii (SCI 295V)',
            'Collaborated with a small team to develop an application that uses NLP to transcribe patient to physician conversations to JSON objects and files',
            'Utilized Python for backend development and integrated ChatGPT-4 to enhance app functionality'
        ],
        logo: '/sail-logo.png',
    },
    {
        company: 'Chamber of Commerce Hawaii',
        role: 'Student Leadership Board Member',
        period: 'Sep 2023 - May 2024',
        description: 'Advised Chamber on work-based learning initiatives targeting K-12 education levels.',
        achievements: [
            'Developed and implemented work-based learning programs specifically designed for middle school students',
            'Advocated in the state senate to establish a paid internship program connecting high school students with local businesses',
            'Lobbied for educational reform promoting practical learning experiences through local business partnerships (SB 2975 & HB 1654)'
        ],
        logo: '/chamber-logo.png',
    },
    {
        company: 'Nalukai Academy',
        role: 'Summer Startup Camp Cohort 10 Student "Founder"',
        period: 'Jul 2023',
        description: '1 of 24 participants selected (6% acceptance rate) for entrepreneurship bootcamp.',
        achievements: [
            'Collaborated within a four-person team to develop a business model focused on battery recycling',
            'Crafted a comprehensive supply chain strategy for the proposed business model',
            'Successfully pitched the business plan to a panel of community leaders in Computer Science, Entrepreneurship, and Venture Capital',
            'Received a Certificate of Recognition from the Governor for outstanding contributions to sustainable business practices and entrepreneurship'
        ],
        logo: '/nalukai-logo.png',
    },
];

function ExperienceCard({ experience, index, onClick }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="liquid-glass rounded-2xl p-8 group cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Logo container */}
            <div className="relative mb-6 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center group-hover:neon-glow-blue transition-all duration-300 p-4 bg-white border border-gray-200">
                    <img
                        src={experience.logo}
                        alt={`${experience.company} logo`}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="text-center">
                <h3 className="text-2xl font-bold chrome-gradient mb-2">
                    {experience.company}
                </h3>
                <p className="text-lg text-cyan-400 mb-2 font-medium">
                    {experience.role}
                </p>
                <p className="text-sm text-purple-400 mb-4">
                    {experience.period}
                </p>
                <p className="text-gray-400 leading-relaxed text-sm">
                    {experience.description}
                </p>

                {/* Click indicator */}
                <div className="mt-4 text-xs text-cyan-400/60">
                    Click to view details
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-glow-blue" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 neon-glow-purple" />
        </motion.div>
    );
}

export default function Experience() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [expandedCard, setExpandedCard] = useState(null);

    const toggleCard = (index) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    return (
        <section className="relative min-h-screen py-20 px-6 overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full bg-[radial-gradient(circle,#8a2be2_1px,transparent_1px)] bg-[size:3rem_3rem]" />
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-6xl md:text-7xl font-bold chrome-gradient mb-4">
                        Experience
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full neon-glow-blue" />
                    <p className="text-xl text-gray-400 mt-6 max-w-2xl mx-auto">
                        Companies I've had the privilege to work with
                    </p>
                </motion.div>

                {/* Experience grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {experiences.map((experience, index) => (
                        <ExperienceCard
                            key={index}
                            experience={experience}
                            index={index}
                            isExpanded={expandedCard === index}
                            onClick={() => toggleCard(index)}
                        />
                    ))}
                </div>

                {/* Decorative floating elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute top-20 right-10 w-32 h-32 border border-cyan-400/20 rounded-full blur-sm"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute bottom-20 left-10 w-48 h-48 border border-purple-400/20 rounded-full blur-sm"
                />
            </div>

            {/* Expanded Modal */}
            <AnimatePresence mode="wait">
                {expandedCard !== null && (
                    <motion.div
                        key="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setExpandedCard(null)}
                    >
                        <motion.div
                            key={`modal-${expandedCard}`}
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 400, duration: 0.3 }}
                            className="liquid-glass rounded-3xl p-12 max-w-4xl w-full relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setExpandedCard(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full glass hover:neon-glow-purple transition-all duration-300 flex items-center justify-center text-white"
                            >
                                ✕
                            </button>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Left: Logo and Company Info */}
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="w-32 h-32 rounded-full flex items-center justify-center neon-glow-blue p-6 bg-white border border-gray-200 mb-6">
                                        <img
                                            src={experiences[expandedCard].logo}
                                            alt={`${experiences[expandedCard].company} logo`}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <h3 className="text-4xl font-bold chrome-gradient mb-4">
                                        {experiences[expandedCard].company}
                                    </h3>
                                    <p className="text-xl text-cyan-400 mb-2 font-medium">
                                        {experiences[expandedCard].role}
                                    </p>
                                    <p className="text-md text-purple-400">
                                        {experiences[expandedCard].period}
                                    </p>
                                </div>

                                {/* Right: Details */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h4 className="text-2xl font-bold text-cyan-400 mb-4">About the Role</h4>
                                        <p className="text-gray-300 leading-relaxed mb-4">
                                            {experiences[expandedCard].description}
                                        </p>
                                        <ul className="space-y-3 text-gray-300">
                                            {experiences[expandedCard].achievements.map((achievement, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="text-purple-400 mr-3">▸</span>
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-2xl font-bold text-cyan-400 mb-4">Skills & Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Python', 'AI/ML', 'Data Science', 'Leadership', 'Research'].map((skill, i) => (
                                                <span key={i} className="px-4 py-2 rounded-lg glass text-sm text-gray-300 hover:neon-glow-purple transition-all duration-300">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
