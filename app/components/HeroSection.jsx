"use client";
import { useState, useEffect, useRef } from "react";

const TYPING_STORIES = [
  "In a forgotten kingdom, a blacksmith discovers an ancient dragon egg beneath the forge...",
  "An AI researcher intercepts signals from Andromeda containing a hidden code...",
  "Two strangers in Dhaka exchange monsoon letters until one writes the last...",
  "Detective Maya has 12 hours to break the suspect who hasn't spoken in 5 years...",
];

const SUBTITLES = [
  "StoryMatrix is an AI-powered video generation system that transforms written narratives into high-quality cinematic videos using advanced diffusion models and temporal coherence algorithms.",
  "From screenplay to screen, our AI crafts compelling visual stories with stunning detail and emotional depth, setting a new standard for automated video creation.",
  "Leveraging cutting-edge generative models, StoryMatrix breathes life into your words, producing fluid, coherent, and visually spectacular video sequences.",
];

const HEADLINES = [
  { line1: "Turn", highlight: "Stories", line2: "into Cinematic", line3: "Videos" },
  { line1: "Transform", highlight: "Scripts", line2: "into Visual", line3: "Masterpieces" },
  { line1: "Bring", highlight: "Narratives", line2: "to Life with", line3: "AI" },
];

export default function HeroSection() {
  const [storyText, setStoryText] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [displayedSubtitle, setDisplayedSubtitle] = useState("");
  const [subtitleCharIndex, setSubtitleCharIndex] = useState(0);
  const [isDeletingSubtitle, setIsDeletingSubtitle] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [inputStory, setInputStory] = useState("");
  const videoRef = useRef(null);

  // Typing animation for headline and subtitle
  useEffect(() => {
    const headlineTimer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
    }, 4000); // Change headline every 4 seconds

    return () => clearInterval(headlineTimer);
  }, []);

  useEffect(() => {
    const subtitle = SUBTITLES[subtitleIndex];
    const timer = setTimeout(() => {
      if (!isDeletingSubtitle) {
        if (subtitleCharIndex < subtitle.length) {
          setDisplayedSubtitle(subtitle.slice(0, subtitleCharIndex + 1));
          setSubtitleCharIndex(subtitleCharIndex + 1);
        } else {
          setTimeout(() => setIsDeletingSubtitle(true), 2000); // Pause before deleting
        }
      } else {
        if (subtitleCharIndex > 0) {
          setDisplayedSubtitle(subtitle.slice(0, subtitleCharIndex - 1));
          setSubtitleCharIndex(subtitleCharIndex - 1);
        } else {
          setIsDeletingSubtitle(false);
          setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
        }
      }
    }, isDeletingSubtitle ? 20 : 35); // Faster deleting, slower typing

    return () => clearTimeout(timer);
  }, [subtitleCharIndex, isDeletingSubtitle, subtitleIndex]);

  // Typing animation for placeholder demo
  useEffect(() => {
    const story = TYPING_STORIES[currentStory];
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < story.length) {
          setStoryText(story.slice(0, charIdx + 1));
          setCharIdx(charIdx + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIdx > 0) {
          setStoryText(story.slice(0, charIdx - 1));
          setCharIdx(charIdx - 1);
        } else {
          setIsDeleting(false);
          setCurrentStory((currentStory + 1) % TYPING_STORIES.length);
        }
      }
    }, isDeleting ? 30 : 60);
    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, currentStory]);

  const handleGenerate = () => {
    if (!inputStory.trim()) return;
    setGenerating(true);
    setProgress(0);
    setGenerated(false);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenerated(true);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 100);
  };

  const generationSteps = [
    { label: "Parsing narrative structure...", threshold: 20 },
    { label: "Decomposing into scenes...", threshold: 40 },
    { label: "Engineering visual prompts...", threshold: 60 },
    { label: "Generating keyframes...", threshold: 80 },
    { label: "Assembling final video...", threshold: 100 },
  ];

  const currentStep = generationSteps.find(s => progress < s.threshold) || generationSteps[4];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 dark:bg-dark-900 bg-white" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      <div className="absolute inset-0 dark:bg-hero-gradient" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-neon-pink/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
        {/* Left: Hero text */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 text-sm text-neon-blue font-body">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            Capstone Research Project · 2025
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter dark:text-white text-gray-900 transition-all duration-300">
            {HEADLINES[headlineIndex].line1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">{HEADLINES[headlineIndex].highlight}</span>
            <br />
            {HEADLINES[headlineIndex].line2}
            <br />
            {HEADLINES[headlineIndex].line3}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl dark:text-white/60 text-gray-600 max-w-2xl font-body h-32">
            {displayedSubtitle}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Right: Interactive story input */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold dark:text-white text-gray-900">Generate Your Video</h3>
            <div className="flex items-center gap-2 text-xs dark:text-white/40 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Model v2.1 Active
            </div>
          </div>

          {/* Right: Interactive Demo Panel */}
          <div id="demo" className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-base sm:text-lg dark:text-white text-gray-900">Try StoryMatrix</h3>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            </div>

            {/* Story input */}
            <div className="space-y-2">
              <label className="text-xs dark:text-white/40 text-gray-600 font-body uppercase tracking-wider">Your Story</label>
              <textarea
                value={inputStory}
                onChange={(e) => setInputStory(e.target.value)}
                placeholder={storyText || "Enter your story here..."}
                rows={3}
                className="w-full dark:bg-dark-800/80 bg-gray-100 border border-neon-purple/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 dark:text-white/80 text-gray-800 text-xs sm:text-sm font-body dark:placeholder-white/30 placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
              />
              <div className="flex items-center justify-between text-xs dark:text-white/30 text-gray-500">
                <span>Min 20 characters for best results</span>
                <span>{inputStory.length}/500</span>
              </div>
            </div>

            {/* Settings row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {[
                { label: "Style", options: ["Cinematic", "Anime", "Documentary", "Noir"], default: "Cinematic" },
                { label: "Duration", options: ["15s", "30s", "60s", "2min"], default: "30s" },
              ].map((sel) => (
                <div key={sel.label} className="space-y-1">
                  <label className="text-xs dark:text-white/40 text-gray-600 font-body">{sel.label}</label>
                  <select className="w-full dark:bg-dark-800 bg-gray-100 border border-neon-purple/20 rounded-lg px-2 sm:px-3 py-2 dark:text-white/70 text-gray-700 text-xs sm:text-sm font-body focus:outline-none focus:border-neon-purple/50">
                    {sel.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Generate button */}
            {!generating && !generated && (
              <button
                onClick={handleGenerate}
                disabled={inputStory.length < 10}
                className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl font-medium text-white text-sm font-body hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ⚡ Generate Video with StoryMatrix
              </button>
            )}

            {/* Generation progress */}
            {generating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                  <span className="text-xs text-neon-blue font-body">{currentStep.label}</span>
                </div>
                <div className="w-full h-2 dark:bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-200"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {["Parse", "Scene", "Prompt", "Frame", "Render"].map((step, i) => (
                    <div
                      key={step}
                      className={`h-1 rounded-full transition-all duration-300 ${progress > i * 20 ? "bg-neon-blue" : "dark:bg-dark-600 bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-xs dark:text-white/40 text-gray-500 text-right font-mono">{Math.round(Math.min(progress, 100))}%</div>
              </div>
            )}

            {/* Generated result */}
            {generated && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400 text-sm font-body">
                  <span>✓</span> Video generated successfully!
                </div>
                <div ref={videoRef} className="rounded-xl overflow-hidden border border-neon-purple/20">
                  <div className="relative video-container">
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    >
                      <source src="/videos/whatsapp-1.mp4" type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs dark:text-white/40 text-gray-500 font-body">
                  <span>⏱ Generated in 4.2s</span>
                  <span>📐 1080p · 30fps</span>
                </div>
                <button
                  onClick={() => { setGenerated(false); setInputStory(""); }}
                  className="w-full py-2 border border-neon-purple/30 rounded-xl dark:text-white/50 text-gray-600 text-sm dark:hover:text-white hover:text-gray-900 dark:hover:border-neon-purple/60 hover:border-neon-purple/60 transition-all font-body"
                >
                  Try Another Story
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 dark:text-white/30 text-gray-500 text-xs font-body">
          <span>Scroll to explore</span>
          <div className="w-px h-10 bg-gradient-to-b from-neon-purple/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
