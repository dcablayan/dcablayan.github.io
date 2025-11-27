import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function NeuralNetwork() {
    const [nodes, setNodes] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Initialize layered neural network structure
    useEffect(() => {
        const createLayeredNodes = () => {
            const newNodes = [];
            const layers = [
                { count: 8, x: 0.15, color: 'cyan' },      // Input layer
                { count: 12, x: 0.35, color: 'cyan' },     // Hidden layer 1
                { count: 10, x: 0.55, color: 'purple' },   // Hidden layer 2
                { count: 6, x: 0.75, color: 'purple' },    // Hidden layer 3
                { count: 4, x: 0.90, color: 'cyan' },      // Output layer
            ];

            let nodeId = 0;
            const width = window.innerWidth;
            const height = window.innerHeight;

            layers.forEach((layer, layerIndex) => {
                const spacing = height / (layer.count + 1);

                for (let i = 0; i < layer.count; i++) {
                    const x = width * layer.x;
                    const y = spacing * (i + 1);

                    newNodes.push({
                        id: nodeId++,
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        vx: 0,
                        vy: 0,
                        layer: layerIndex,
                        color: layer.color,
                    });
                }
            });

            setNodes(newNodes);
        };

        createLayeredNodes();

        const handleResize = () => createLayeredNodes();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animation loop
    useEffect(() => {
        if (!canvasRef.current || nodes.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update node positions (repel from mouse)
            const updatedNodes = nodes.map(node => {
                const dx = mousePos.x - node.x;
                const dy = mousePos.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 200;

                let newVx = node.vx;
                let newVy = node.vy;

                if (distance < repelRadius && distance > 0) {
                    const force = (repelRadius - distance) / repelRadius;
                    newVx = -dx / distance * force * 5;
                    newVy = -dy / distance * force * 5;
                }

                // Return to base position
                const returnForce = 0.08;
                newVx += (node.baseX - node.x) * returnForce;
                newVy += (node.baseY - node.y) * returnForce;

                // Apply friction
                newVx *= 0.85;
                newVy *= 0.85;

                return {
                    ...node,
                    x: node.x + newVx,
                    y: node.y + newVy,
                    vx: newVx,
                    vy: newVy,
                };
            });

            setNodes(updatedNodes);

            // Draw connections between adjacent layers
            for (let i = 0; i < updatedNodes.length; i++) {
                for (let j = 0; j < updatedNodes.length; j++) {
                    if (updatedNodes[j].layer === updatedNodes[i].layer + 1) {
                        // Soft rainbow gradient for connections
                        const colors = [
                            'rgba(255, 150, 200, 0.2)', // Soft pink
                            'rgba(150, 200, 255, 0.2)', // Soft cyan
                            'rgba(200, 255, 200, 0.2)', // Soft green
                            'rgba(220, 180, 255, 0.2)', // Soft purple
                        ];
                        const colorIndex = updatedNodes[i].layer % 4;

                        ctx.strokeStyle = colors[colorIndex];
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(updatedNodes[i].x, updatedNodes[i].y);
                        ctx.lineTo(updatedNodes[j].x, updatedNodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [nodes, mousePos]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Render nodes */}
            {nodes.map((node) => {
                const rainbowColors = [
                    'radial-gradient(circle, rgba(255, 100, 200, 0.8) 0%, rgba(255, 100, 200, 0.3) 50%, transparent 100%)', // Soft Pink
                    'radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, rgba(100, 200, 255, 0.3) 50%, transparent 100%)', // Soft Cyan
                    'radial-gradient(circle, rgba(150, 255, 200, 0.8) 0%, rgba(150, 255, 200, 0.3) 50%, transparent 100%)', // Soft Green
                    'radial-gradient(circle, rgba(200, 150, 255, 0.8) 0%, rgba(200, 150, 255, 0.3) 50%, transparent 100%)', // Soft Purple
                ];

                const shadowColors = [
                    '0 0 15px rgba(255, 100, 200, 0.6), 0 0 30px rgba(255, 100, 200, 0.3)',
                    '0 0 15px rgba(100, 200, 255, 0.6), 0 0 30px rgba(100, 200, 255, 0.3)',
                    '0 0 15px rgba(150, 255, 200, 0.6), 0 0 30px rgba(150, 255, 200, 0.3)',
                    '0 0 15px rgba(200, 150, 255, 0.6), 0 0 30px rgba(200, 150, 255, 0.3)',
                ];

                const colorIndex = node.layer % 4;

                return (
                    <motion.div
                        key={node.id}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                            left: node.x - 6,
                            top: node.y - 6,
                            background: rainbowColors[colorIndex],
                            boxShadow: shadowColors[colorIndex],
                        }}
                        animate={{
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                );
            })}
        </div>
    );
}
