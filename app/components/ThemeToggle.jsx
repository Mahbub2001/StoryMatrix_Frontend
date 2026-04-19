"use client";

import { useTheme } from "@/app/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted on client side
    if (!mounted) {
        return <div className="p-2" />;
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors duration-300 border border-transparent hover:border-neon-purple/30 dark:text-white dark:hover:text-neon-blue text-gray-700 hover:text-neon-purple"
            aria-label="Toggle theme"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
            {theme === "dark" ? (
                <Sun size={20} />
            ) : (
                <Moon size={20} />
            )}
        </button>
    );
}
