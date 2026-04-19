export default function Footer() {
  return (
    <footer className="relative py-8 sm:py-16 bg-dark-900 border-t border-neon-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-neon-purple/40 overflow-hidden bg-white/90">
                <img
                  src="/StoryMatrix_LOGO.png"
                  alt="StoryMatrix logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg sm:text-xl gradient-text">
                STORYMATRIX
              </span>
            </div>
            <p className="text-white/40 text-xs sm:text-sm font-body leading-relaxed">
              A multi-agent reinforcement learning framework for context-aware
              creative generation and editing of ultra-long videos.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm sm:text-base">
              Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Demo", href: "#demo" },
                { label: "Showcase", href: "#showcase" },
                { label: "Methodology", href: "#methodology" },
                { label: "Results", href: "#compare" },
                { label: "Impact", href: "#research" },
                { label: "GitHub", href: "https://github.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white/40 hover:text-white text-xs sm:text-sm font-body transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Tech stack */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-white text-sm sm:text-base">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                "PyTorch",
                "3D Encoder",
                "4D Transformer",
                "DiT",
                "LongCat",
                "QMIX",
                "PPO",
                "GRPO",
                "SpatialVID",
                "Next.js",
              ].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 rounded-md text-xs bg-dark-700 border border-white/10 text-white/50 font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-white/30 text-xs font-body text-center sm:text-left">
          <p className="text-white/30 text-xs font-body">
            © 2026 STORYMATRIX · Capstone Research Project · All rights
            reserved
          </p>
          <p className="text-white/30 text-xs font-body">
            Built with Next.js · TailwindCSS · Framer Motion · Recharts
          </p>
        </div>
      </div>
    </footer>
  );
}
