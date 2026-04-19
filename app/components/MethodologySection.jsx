"use client";
import { useState, useEffect, useRef } from "react";
import {
  methodologySteps,
  architectureLayers,
  architectureFlow,
} from "../data";

function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function MethodologySection() {
  const { ref, inView } = useInView();
  const [activeStep, setActiveStep] = useState(0);
  const [activeLayer, setActiveLayer] = useState(0);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [abstract, setAbstract] = useState(false);
  const [diagramSrc, setDiagramSrc] = useState(
    "Architecture.jpg",
  );

  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setActiveStep((s) => (s + 1) % methodologySteps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [inView]);

  useEffect(() => {
    if (!isPosterOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setIsPosterOpen(false);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isPosterOpen]);

  return (
    <section
      id="methodology"
      className="relative py-24 dark:bg-dark-900 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-15" />
      <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-neon-purple/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/30 bg-neon-pink/5 text-sm text-neon-pink font-body mb-4">
            🧠 Methodology
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4">
            How <span className="gradient-text">STORYMATRIX</span> Works
          </h2>
          <p className="dark:text-white/50 text-gray-600 max-w-lg mx-auto font-body text-sm sm:text-base">
            A six-stage multimodal pipeline combines 3D encoding, 4D world
            modeling, and 5-agent MARL for coherent ultra-long videos.
          </p>
        </div>

        {/* Abstract (expand/collapse) */}
        <div className="glass rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
          <button
            onClick={() => setAbstract(!abstract)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-display font-semibold dark:text-white text-gray-900 text-base sm:text-lg">
              📋 Abstract
            </span>
            <span
              className={`text-neon-purple transition-transform duration-300 ${abstract ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          {abstract && (
            <div className="mt-4 space-y-4 dark:text-white/60 text-gray-600 text-sm sm:text-base font-body leading-relaxed">
              <p>
                Although generative AI has improved image and short video
                creation, producing long, coherent, and imaginative visual
                content remains challenging. This review covers diffusion-based
                video generation, multi-agent reinforcement learning,
                long-horizon video modeling, and creative AI benchmarks, along
                with tools like PyTorch and GPU platforms.
              </p>
              <p>
                StoryMatrix is a multimodal video generation framework that
                encodes visual and audio inputs into a unified latent space
                using a 3D encoder. It refines these representations and models
                spatio-temporal dynamics with a 4D transformer to generate
                coherent videos. A multi-agent reinforcement learning system
                ensures consistency in story, scenes, and characters, and a 3D
                decoder converts latents into the final video output.
              </p>
            </div>
          )}
        </div>

        {/* Architecture block from final presentation */}
        <div className="glass rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="font-display font-semibold dark:text-white text-gray-900 text-base sm:text-lg">
              Visualizing the STORYMATRIX-4D Architecture
            </h3>
            <span className="text-xs font-mono px-3 py-1 rounded-full border border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5 w-fit">
              System Architecture
            </span>
          </div>
          <p className="dark:text-white/55 text-gray-600 text-sm font-body leading-relaxed mb-5">
            End-to-end stack: VCU multimodal conditioning, 5-agent MARL
            planning, 4D latent world memory, CTFE token recall, and a 2B DiT
            generation backbone with STF + RLFP.
          </p>

          <div className="grid xl:grid-cols-5 gap-4 sm:gap-5 mb-6">
            <div className="xl:col-span-3 relative rounded-2xl overflow-hidden border dark:border-neon-purple/25 border-neon-purple/30 bg-gradient-to-br from-neon-purple/10 via-neon-blue/10 to-neon-pink/10">
              <button
                type="button"
                onClick={() => setIsPosterOpen(true)}
                className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-mono bg-dark-900/70 text-neon-cyan border border-neon-cyan/40 hover:bg-dark-800/85 transition-colors"
              >
                Poster View ⤢
              </button>
              <div className="aspect-[16/11] sm:aspect-[16/10] xl:aspect-[4/3] w-full">
                <img
                  src={diagramSrc}
                  alt="STORYMATRIX-4D system architecture"
                  className="w-full h-full object-contain p-2 sm:p-3 cursor-zoom-in"
                  onClick={() => setIsPosterOpen(true)}
                  onError={() => {
                    if (
                      diagramSrc !==
                      "/architecture/storymatrix-architecture.svg"
                    ) {
                      setDiagramSrc(
                        "/architecture/storymatrix-architecture.svg",
                      );
                    }
                  }}
                />
              </div>
            </div>

            <div className="xl:col-span-2 space-y-3">
              {[
                {
                  title: "Model Core",
                  value: "2B STORYMATRIX-DiT",
                  desc: "STF + RLFP for efficient long-context generation",
                  color: "#9D4EDD",
                },
                {
                  title: "Planning",
                  value: "5-Agent MARL + QMIX",
                  desc: "Director, Visual, Narrative, Audio, World agents",
                  color: "#F72585",
                },
                {
                  title: "Memory",
                  value: "4D LWM + CTFE",
                  desc: "Persistent geometry and token-based cross-temporal recall",
                  color: "#3A86FF",
                },
                {
                  title: "Efficiency",
                  value: "O(n^2) to O(n·k)",
                  desc: "Sparse temporal attention and memory-aware alignment",
                  color: "#00F5FF",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl p-3 sm:p-4 border"
                  style={{
                    borderColor: `${item.color}55`,
                    background: `${item.color}10`,
                    boxShadow: `0 0 20px ${item.color}18`,
                  }}
                >
                  <p
                    className="text-xs font-mono mb-1"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </p>
                  <p className="font-display dark:text-white text-gray-900 text-sm sm:text-base font-semibold">
                    {item.value}
                  </p>
                  <p className="text-xs dark:text-white/55 text-gray-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 space-y-3">
              {architectureLayers.map((layer, idx) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(idx)}
                  className="w-full text-left rounded-xl p-3 sm:p-4 border transition-all duration-300"
                  style={{
                    borderColor:
                      activeLayer === idx
                        ? `${layer.color}70`
                        : "rgba(156,163,175,0.25)",
                    background:
                      activeLayer === idx
                        ? `${layer.color}10`
                        : "rgba(148,163,184,0.06)",
                    boxShadow:
                      activeLayer === idx
                        ? `0 0 20px ${layer.color}20`
                        : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span
                      className="text-xs font-mono px-2 py-1 rounded"
                      style={{
                        color: layer.color,
                        background: `${layer.color}20`,
                      }}
                    >
                      Component {layer.stage}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: layer.color }}
                    />
                  </div>
                  <h4 className="font-display font-semibold dark:text-white text-gray-900 text-sm sm:text-base mb-1">
                    {layer.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-body dark:text-white/55 text-gray-600 leading-relaxed mb-2">
                    {layer.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {layer.tech.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded text-xs font-mono dark:bg-dark-700 bg-gray-100 dark:text-white/45 text-gray-600 border dark:border-white/10 border-gray-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl p-4 border dark:border-white/10 border-gray-200 dark:bg-dark-800/60 bg-gray-50">
                <h4 className="font-display font-semibold dark:text-white text-gray-900 text-sm sm:text-base mb-2">
                  Active Layer Focus
                </h4>
                <p className="text-xs sm:text-sm font-body dark:text-white/55 text-gray-600 leading-relaxed">
                  {architectureLayers[activeLayer].desc}
                </p>
              </div>

              <div className="rounded-xl p-4 border dark:border-white/10 border-gray-200 dark:bg-dark-800/60 bg-gray-50">
                <h4 className="font-display font-semibold dark:text-white text-gray-900 text-sm sm:text-base mb-3">
                  End-to-End Flow
                </h4>
                <div className="space-y-2">
                  {architectureFlow.map((item, idx) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-neon-purple/20 text-neon-purple">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-body dark:text-white/60 text-gray-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline visualization */}
        <div ref={ref} className="relative">
          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            {/* Connection line */}
            <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />

            <div className="grid grid-cols-6 gap-4">
              {methodologySteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-500 ${
                    inView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                  onClick={() => setActiveStep(idx)}
                >
                  {/* Step number connector dot */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xl mb-4 transition-all duration-300 ${
                      activeStep === idx ? "scale-125" : "scale-100"
                    }`}
                    style={{
                      background:
                        activeStep === idx
                          ? `radial-gradient(circle, ${step.color}40, ${step.color}20)`
                          : "rgba(18,15,46,0.8)",
                      border: `1px solid ${activeStep === idx ? step.color : "rgba(157,78,221,0.2)"}`,
                      boxShadow:
                        activeStep === idx
                          ? `0 0 20px ${step.color}50`
                          : "none",
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Card */}
                  <div
                    className={`glass-card rounded-xl p-4 w-full text-center transition-all duration-300 ${
                      activeStep === idx ? "border-opacity-60" : ""
                    }`}
                    style={{
                      borderColor:
                        activeStep === idx ? `${step.color}60` : undefined,
                      background:
                        activeStep === idx ? `${step.color}08` : undefined,
                    }}
                  >
                    <div className="text-xs font-mono dark:text-white/30 text-gray-500 mb-1">
                      Step {step.step}
                    </div>
                    <h4 className="font-display font-semibold dark:text-white text-gray-900 text-sm mb-2">
                      {step.title}
                    </h4>
                    <p
                      className={`text-xs font-body leading-relaxed transition-all duration-300 ${
                        activeStep === idx ? "text-white/60" : "text-white/30"
                      }`}
                    >
                      {step.desc}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                      {step.tech.map((t) => (
                        <span
                          key={t}
                          className="px-1.5 py-0.5 rounded text-xs dark:bg-dark-700 bg-gray-200 dark:text-white/40 text-gray-600 font-mono dark:border-white/5 border-gray-300 border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical list */}
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {methodologySteps.map((step, idx) => (
              <div
                key={step.step}
                className={`flex gap-4 transition-all duration-500 ${
                  inView
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: `${step.color}20`,
                      border: `1px solid ${step.color}60`,
                    }}
                  >
                    {step.icon}
                  </div>
                  {idx < methodologySteps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-neon-purple/30 to-transparent min-h-[40px]" />
                  )}
                </div>
                <div className="glass-card rounded-xl p-3 sm:p-4 flex-1 mb-2">
                  <div className="text-xs font-mono dark:text-white/30 text-gray-500 mb-1">
                    Step {step.step}
                  </div>
                  <h4 className="font-display font-semibold dark:text-white text-gray-900 text-xs sm:text-sm mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs dark:text-white/50 text-gray-600 font-body leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {step.tech.map((t) => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded text-xs dark:bg-dark-700 bg-gray-200 dark:text-white/40 text-gray-600 font-mono dark:border-white/5 border-gray-300 border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active step detail */}
        <div className="mt-8 sm:mt-12 glass rounded-2xl p-4 sm:p-8 max-w-2xl mx-auto text-center">
          <div className="text-3xl sm:text-4xl mb-4">
            {methodologySteps[activeStep].icon}
          </div>
          <h3 className="font-display text-lg sm:text-2xl font-bold dark:text-white text-gray-900 mb-3">
            Step {methodologySteps[activeStep].step}:{" "}
            <span style={{ color: methodologySteps[activeStep].color }}>
              {methodologySteps[activeStep].title}
            </span>
          </h3>
          <p className="dark:text-white/60 text-gray-600 font-body leading-relaxed text-sm sm:text-base">
            {methodologySteps[activeStep].desc}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            {methodologySteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`transition-all duration-300 rounded-full ${
                  activeStep === idx
                    ? "w-6 h-2 bg-neon-purple"
                    : "w-2 h-2 dark:bg-white/20 dark:hover:bg-white/40 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {isPosterOpen && (
        <div
          className="fixed inset-0 z-[140] bg-black/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded architecture poster"
          onClick={() => setIsPosterOpen(false)}
        >
          <div
            className="relative w-full max-w-7xl max-h-[92vh] rounded-2xl overflow-hidden border border-neon-cyan/30 bg-dark-900/95"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-mono bg-dark-800/85 text-neon-cyan border border-neon-cyan/40">
              Expanded Poster View
            </div>
            <button
              type="button"
              onClick={() => setIsPosterOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full border border-white/25 text-white/90 hover:bg-white/10"
              aria-label="Close poster preview"
            >
              ✕
            </button>
            <img
              src={diagramSrc}
              alt="STORYMATRIX-4D system architecture enlarged"
              className="w-full h-full max-h-[92vh] object-contain p-2 sm:p-4"
            />
          </div>
        </div>
      )}
    </section>
  );
}
