import React, { useRef, useEffect } from 'react';

const HeroParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            density: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Gentle random velocity
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 4 + 2; // 2-6px
                this.density = (Math.random() * 20) + 1;

                // Darker, more visible colors for "Google Antigravity" feel
                const colors = ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(79, 70, 229, 0.4)', 'rgba(16, 185, 129, 0.4)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceRadius = 250;

                if (distance < forceRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (forceRadius - distance) / forceRadius;

                    // Attraction (water-like flow towards cursor)
                    const directionX = forceDirectionX * force * this.density * 0.03;
                    const directionY = forceDirectionY * force * this.density * 0.03;

                    this.vx += directionX;
                    this.vy += directionY;
                }

                // Apply velocity
                this.x += this.vx;
                this.y += this.vy;

                // Friction/Damping (simulating water resistance)
                this.vx *= 0.98;
                this.vy *= 0.98;

                // Minimal ambient float (so they never stop completely)
                if (Math.abs(this.vx) < 0.1) this.vx += (Math.random() - 0.5) * 0.02;
                if (Math.abs(this.vy) < 0.1) this.vy += (Math.random() - 0.5) * 0.02;

                // Screen wrapping
                if (this.x < 0) this.x = canvas!.width;
                if (this.x > canvas!.width) this.x = 0;
                if (this.y < 0) this.y = canvas!.height;
                if (this.y > canvas!.height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            // Responsive count
            const particleCount = window.innerWidth < 768 ? 40 : 100;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);

        const handleMouseMove = (e: MouseEvent) => {
            // Adjust mouse coordinates relative to canvas in case it's not top-left (though it is fixed)
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        }

        // Attach to window or canvas? User wanted hero section. 
        // If we attach to window, it tracks mouse even outside hero, which might be nice or weird.
        // Let's attach to the canvas parent interaction if possible, but window is safer for smooth tracking.
        // Actually, the requirement said "On mouse move...". 
        // I will trust the canvas is getting the events or use window for cleaner feel.
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 pointer-events-auto"
            style={{ touchAction: 'none' }}
        />
    );
};

export default HeroParticles;
