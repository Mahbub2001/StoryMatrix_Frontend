"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#demo", label: "Demo" },
    { href: "#showcase", label: "Showcase" },
    { href: "#methodology", label: "Methodology" },
    { href: "#compare", label: "Results" },
    { href: "#research", label: "Impact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "navbar-blur shadow-lg" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-10 h-10 rounded-lg border border-neon-purple/40 overflow-hidden dark:bg-dark-800/70 bg-white/80 group-hover:border-neon-purple/80 transition-colors">
            <img
              src="/StoryMatrix_LOGO.png"
              alt="StoryMatrix logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-display font-bold text-base sm:text-xl gradient-text">
            STORYMATRIX
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-body transition-colors relative group dark:text-white/60 dark:hover:text-white text-gray-600 hover:text-gray-900"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-neon-purple to-neon-blue group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* CTA and Theme Toggle */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-body rounded-lg transition-all dark:text-white/70 dark:border-white/10 dark:hover:border-neon-purple/50 dark:hover:text-white text-gray-600 border border-gray-300 hover:border-neon-purple/50 hover:text-gray-900"
          >
            GitHub
          </a>
          <a
            href="#demo"
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium font-body bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            Try Demo
          </a>
        </div>

        {/* Mobile menu button and theme toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 transition-colors dark:text-white/70 dark:hover:text-white text-gray-700 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`h-px bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-neon-purple/20 px-4 sm:px-6 py-3 sm:py-4 flex flex-col gap-2 sm:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors py-1 dark:text-white/70 dark:hover:text-white text-gray-600 hover:text-gray-900 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#demo"
            className="mt-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-center font-medium bg-gradient-to-r from-neon-purple to-neon-blue rounded-lg text-white"
          >
            Try Demo
          </a>
        </div>
      )}
    </nav>
  );
}
