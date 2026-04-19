"use client";
import { useState, useEffect } from "react";

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            setProgress(scrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1">
            <div
                className="h-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
            <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-neon-blue/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}
