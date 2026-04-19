"use client";

import { useEffect, useRef } from "react";

const MAX_LINK_DISTANCE = 145;
const MOUSE_LINK_DISTANCE = 190;

export default function HeroNetworkPattern() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let frameId = 0;
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);

        const mouse = {
            x: 0,
            y: 0,
            active: false,
        };

        let nodes = [];

        const nodeCountByArea = () => {
            const area = width * height;
            const base = Math.floor(area / 15000);
            return Math.max(60, Math.min(140, base));
        };

        const randomNode = () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.22),
            vy: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.22),
            size: Math.random() * 1.8 + 1.2,
        });

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            nodes = Array.from({ length: nodeCountByArea() }, randomNode);
        };

        const drawConnection = (a, b, alpha) => {
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.strokeStyle = `rgba(76, 201, 240, ${alpha})`;
            context.lineWidth = 1;
            context.stroke();
        };

        const animate = () => {
            context.clearRect(0, 0, width, height);

            for (let i = 0; i < nodes.length; i += 1) {
                const node = nodes[i];

                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                node.x = Math.max(0, Math.min(width, node.x));
                node.y = Math.max(0, Math.min(height, node.y));

                if (mouse.active) {
                    const dx = mouse.x - node.x;
                    const dy = mouse.y - node.y;
                    const d = Math.hypot(dx, dy);

                    if (d < MOUSE_LINK_DISTANCE) {
                        const pull = (1 - d / MOUSE_LINK_DISTANCE) * 0.018;
                        node.x += dx * pull;
                        node.y += dy * pull;

                        const mouseAlpha = 0.1 + (1 - d / MOUSE_LINK_DISTANCE) * 0.5;
                        context.beginPath();
                        context.moveTo(node.x, node.y);
                        context.lineTo(mouse.x, mouse.y);
                        context.strokeStyle = `rgba(157, 78, 221, ${mouseAlpha})`;
                        context.lineWidth = 1.1;
                        context.stroke();
                    }
                }
            }

            for (let i = 0; i < nodes.length; i += 1) {
                const a = nodes[i];
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const b = nodes[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < MAX_LINK_DISTANCE) {
                        const alpha = (1 - dist / MAX_LINK_DISTANCE) * 0.35;
                        drawConnection(a, b, alpha);
                    }
                }
            }

            for (let i = 0; i < nodes.length; i += 1) {
                const node = nodes[i];
                context.beginPath();
                context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                context.fillStyle = "rgba(215, 252, 255, 0.95)";
                context.fill();

                context.beginPath();
                context.arc(node.x, node.y, node.size * 2.6, 0, Math.PI * 2);
                context.fillStyle = "rgba(76, 201, 240, 0.12)";
                context.fill();
            }

            if (mouse.active) {
                context.beginPath();
                context.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
                context.fillStyle = "rgba(76, 201, 240, 0.08)";
                context.fill();
            }

            frameId = window.requestAnimationFrame(animate);
        };

        const onMouseMove = (event) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
            mouse.active = mouse.x >= 0 && mouse.x <= rect.width && mouse.y >= 0 && mouse.y <= rect.height;
        };

        const onMouseLeave = () => {
            mouse.active = false;
        };

        resize();
        animate();

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseout", onMouseLeave);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseout", onMouseLeave);
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-network-canvas absolute inset-0 w-full h-full" aria-hidden="true" />;
}
