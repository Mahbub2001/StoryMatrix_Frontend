"use client";
import { useState, useEffect, useRef } from "react";

function useCountUp(target, inView, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(current));
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export default function ResearchSection() {
  const { ref, inView } = useInView();

  const rawVideoHours = useCountUp(21000, inView);
  const processedClips = useCountUp(2700000, inView);
  const dynamicContentHours = useCountUp(7089, inView);
  const annotationSignals = useCountUp(5, inView);
  const tci = useCountUp(84, inView);
  const ssim = useCountUp(81, inView);
  const clipScore = useCountUp(83, inView);
  const vbenchMotion = useCountUp(59, inView);

  const researchHighlights = [
    {
      icon: "🧩",
      title: "Context",
      desc: "Generative AI has improved image and short video creation, but sustaining coherence and creativity across ultra-long video remains a core challenge.",
    },
    {
      icon: "📊",
      title: "Dataset",
      desc: "SpatialVID (arXiv:2509.09676) contains 21,000+ hours of raw in-the-wild video, processed into 2.7M clips (7,089 hours) with camera pose, depth, masks, captions, and motion instructions.",
    },
    {
      icon: "🌍",
      title: "Impact",
      desc: "The framework improves long-form narrative consistency and enables scalable creative workflows across media, education, and simulation.",
    },
    {
      icon: "🔭",
      title: "Future Work",
      desc: "Next targets include multi-character memory banks, richer text reasoning in CTFE tokens, faster generation through distillation, and public release of the LVCB benchmark.",
    },
  ];

  return (
    <section
      id="research"
      className="relative py-24 dark:bg-dark-900 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 text-sm text-neon-purple font-body mb-4">
            📊 Context, SpatialVID Dataset, and Impact
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4">
            Poster <span className="gradient-text">Highlights</span>
          </h2>
        </div>

        {/* Stat counters */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-16"
        >
          {[
            {
              label: "Raw Video Hours",
              value: rawVideoHours,
              suffix: "+",
              color: "#9D4EDD",
            },
            {
              label: "Processed Clips",
              value: processedClips,
              suffix: "",
              color: "#4CC9F0",
            },
            {
              label: "Dynamic Hours",
              value: dynamicContentHours,
              suffix: "",
              color: "#F72585",
            },
            {
              label: "Core Annotation Signals",
              value: annotationSignals,
              suffix: "",
              color: "#00F5FF",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-4 sm:p-6 text-center"
              style={{ borderColor: `${stat.color}20` }}
            >
              <div
                className="font-display text-3xl sm:text-4xl font-bold mb-2"
                style={{
                  color: stat.color,
                  textShadow: `0 0 20px ${stat.color}50`,
                }}
              >
                {stat.value.toLocaleString("en-US")}
                {stat.suffix}
              </div>
              <div className="dark:text-white/50 text-gray-600 text-xs sm:text-sm font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Performance bars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="glass-card rounded-2xl p-4 sm:p-8 space-y-4 sm:space-y-6">
            <h3 className="font-display font-semibold dark:text-white text-gray-900 text-lg sm:text-xl">
              STORYMATRIX-4D Metrics (Table 4.1)
            </h3>
            {[
              {
                label: "Temporal Consistency Index (TCI)",
                value: tci,
                max: 100,
                color: "#9D4EDD",
              },
              {
                label: "SSIM",
                value: ssim,
                max: 100,
                color: "#4CC9F0",
              },
              {
                label: "CLIPScore",
                value: clipScore,
                max: 100,
                color: "#F72585",
              },
              {
                label: "VBench Motion",
                value: vbenchMotion,
                max: 100,
                color: "#00F5FF",
              },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-body">
                  <span className="dark:text-white/70 text-gray-700">
                    {metric.label}
                  </span>
                  <span className="font-mono" style={{ color: metric.color }}>
                    {metric.value}%
                  </span>
                </div>
                <div className="h-2 dark:bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: inView ? `${metric.value}%` : "0%",
                      background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
                      boxShadow: `0 0 8px ${metric.color}50`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-8 space-y-4">
            <h3 className="font-display font-semibold dark:text-white text-gray-900 text-lg sm:text-xl">
              SpatialVID and Training Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  label: "Raw Collection",
                  value: "21,000+ hours",
                  good: true,
                  desc: "In-the-wild videos with diverse camera motion",
                },
                {
                  label: "Processed Clips",
                  value: "2.7M",
                  good: true,
                  desc: "Hierarchical filtering and processing pipeline",
                },
                {
                  label: "Dynamic Content",
                  value: "7,089 hours",
                  good: true,
                  desc: "Total dynamic clips after processing",
                },
                {
                  label: "Spatial Annotations",
                  value: "Pose + Depth + Masks",
                  good: true,
                  desc: "Also includes captions and motion instructions",
                },
                {
                  label: "Training Stack",
                  value: "SpatialVID + WebVid + HowTo100M",
                  good: true,
                  desc: "Plus LongVideo-Reason and custom creative set",
                },
                {
                  label: "Infrastructure",
                  value: "RunPod H200 (80GB)",
                  good: true,
                  desc: "PyTorch + Ray RLlib + Optuna",
                },
              ].map((bench) => (
                <div
                  key={bench.label}
                  className="p-3 sm:p-4 rounded-xl dark:bg-dark-700/50 bg-gray-100 dark:border-white/5 border-gray-300 border"
                >
                  <div className="text-xs dark:text-white/40 text-gray-600 font-body mb-1">
                    {bench.label}
                  </div>
                  <div className="font-display font-bold text-lg sm:text-xl dark:text-white text-gray-900">
                    {bench.value}
                  </div>
                  <div className="text-xs dark:text-white/30 text-gray-600 font-body mt-1">
                    {bench.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Research highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {researchHighlights.map((item, idx) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-4 sm:p-6 space-y-3 transition-all duration-500"
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <div className="text-2xl sm:text-3xl">{item.icon}</div>
              <h4 className="font-display font-semibold dark:text-white text-gray-900 text-base sm:text-lg">
                {item.title}
              </h4>
              <p className="dark:text-white/50 text-gray-600 text-xs sm:text-sm font-body leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-8 sm:mt-16 text-center space-y-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold dark:text-white text-gray-900">
            Novelty Focus
          </h3>
          <p className="dark:text-white/50 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto font-body">
            STORYMATRIX uses SpatialVID-scale supervision and multi-agent
            planning to improve long-horizon coherence, controllability, and
            creative stability in ultra-long video generation.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {[
              {
                label: "📄 SpatialVID (arXiv)",
                href: "https://arxiv.org/abs/2509.09676",
                color: "#9D4EDD",
                external: true,
              },
              {
                label: "📥 SpatialVID PDF",
                href: "https://arxiv.org/pdf/2509.09676",
                color: "#4CC9F0",
                external: true,
              },
              {
                label: "📈 Results",
                href: "#compare",
                color: "#F72585",
                external: false,
              },
              {
                label: "🧠 Methodology",
                href: "#methodology",
                color: "#00F5FF",
                external: false,
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-body text-xs sm:text-sm transition-all hover:scale-105"
                style={{
                  border: `1px solid ${link.color}40`,
                  color: link.color,
                  background: `${link.color}08`,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
