import { useEffect, useRef } from 'react';

export default function Stars() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Star class
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.twinkleOffset = Math.random() * Math.PI * 2;
                // Random colors for some stars
                const colors = [
                    'rgba(255, 255, 255,',
                    'rgba(150, 200, 255,',
                    'rgba(255, 200, 150,',
                    'rgba(200, 150, 255,',
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update(time) {
                this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${this.currentOpacity})`;
                ctx.fill();

                // Add glow effect for brighter stars
                if (this.size > 1.2 && this.currentOpacity > 0.5) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                    const gradient = ctx.createRadialGradient(
                        this.x, this.y, 0,
                        this.x, this.y, this.size * 2
                    );
                    gradient.addColorStop(0, `${this.color}${this.currentOpacity * 0.3})`);
                    gradient.addColorStop(1, `${this.color}0)`);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
        }

        // Shooting star class
        class ShootingStar {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height * 0.5;
                this.length = Math.random() * 80 + 40;
                this.speed = Math.random() * 10 + 5;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
                this.opacity = 0;
                this.fadeIn = true;
                this.active = false;
            }

            update() {
                if (!this.active) {
                    // Random chance to activate
                    if (Math.random() < 0.001) {
                        this.reset();
                        this.active = true;
                        this.fadeIn = true;
                    }
                    return;
                }

                // Move
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;

                // Fade
                if (this.fadeIn) {
                    this.opacity += 0.1;
                    if (this.opacity >= 1) {
                        this.fadeIn = false;
                    }
                } else {
                    this.opacity -= 0.02;
                }

                // Deactivate if off screen or faded
                if (this.x > canvas.width || this.y > canvas.height || this.opacity <= 0) {
                    this.active = false;
                }
            }

            draw() {
                if (!this.active || this.opacity <= 0) return;

                const tailX = this.x - Math.cos(this.angle) * this.length;
                const tailY = this.y - Math.sin(this.angle) * this.length;

                const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
                gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
                gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Head glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create stars
        const starCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 10000));
        const stars = Array.from({ length: starCount }, () => new Star());
        const shootingStars = Array.from({ length: 3 }, () => new ShootingStar());

        // Animation loop
        let time = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time++;

            // Update and draw stars
            stars.forEach(star => {
                star.update(time);
                star.draw();
            });

            // Update and draw shooting stars
            shootingStars.forEach(star => {
                star.update();
                star.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.8 }}
        />
    );
}
