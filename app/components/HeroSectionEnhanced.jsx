"use client";
import { useState, useEffect } from "react";
import HeroNetworkPattern from "./HeroNetworkPattern";

const TYPING_STORIES = [
  "Generate coherent ultra-long videos with context-aware multimodal reasoning...",
  "Use a 3D encoder and 4D transformer for stable story and scene continuity...",
  "Coordinate 5 MARL agents to preserve characters, scenes, and narrative flow...",
  "Scale long-horizon video generation with StoryMatrix and STORYMATRIX...",
];

const HERO_HEADLINES = [
  {
    line1: "STORYMATRIX",
    highlight: "Framework",
    line2: "for Context-Aware",
    line3: "Ultra-Long Videos",
  },
  {
    line1: "Multi-Agent",
    highlight: "Reinforcement",
    line2: "Learning for Creative",
    line3: "Video Generation",
  },
  {
    line1: "StoryMatrix",
    highlight: "4D",
    line2: "Coherent Generation",
    line3: "and Editing",
  },
];

const HERO_SUBTITLES = [
  "STORYMATRIX: A multi-agent reinforcement learning framework for context-aware creative generation and editing of ultra-long videos.",
  "Authors: Mahbub Ahmed Turza, Tonmoy Biswas & Tanvir Ahammed Roudra. Supervisor: Professor Dr. Shafin Rahman.",
  "StoryMatrix combines multimodal inputs, a 3D encoder, a 4D transformer, and 5-agent MARL coordination for long-horizon coherent output.",
];

export default function HeroSection() {
  const [storyText, setStoryText] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [headlineIdx, setHeadlineIdx] = useState(0);
  const [subtitleIdx, setSubtitleIdx] = useState(0);
  const [subtitleCharIdx, setSubtitleCharIdx] = useState(0);
  const [subtitleText, setSubtitleText] = useState("");
  const [subtitleDeleting, setSubtitleDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [inputStory, setInputStory] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [attachmentResults, setAttachmentResults] = useState([]);
  const [processingAttachments, setProcessingAttachments] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIdx((prev) => (prev + 1) % HERO_HEADLINES.length);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const subtitle = HERO_SUBTITLES[subtitleIdx];
    const atEnd = !subtitleDeleting && subtitleCharIdx === subtitle.length;
    const delay = atEnd ? 1200 : subtitleDeleting ? 14 : 24;

    const timer = setTimeout(() => {
      if (!subtitleDeleting && subtitleCharIdx < subtitle.length) {
        setSubtitleText(subtitle.slice(0, subtitleCharIdx + 1));
        setSubtitleCharIdx((prev) => prev + 1);
        return;
      }

      if (!subtitleDeleting && subtitleCharIdx === subtitle.length) {
        setSubtitleDeleting(true);
        return;
      }

      if (subtitleDeleting && subtitleCharIdx > 0) {
        setSubtitleText(subtitle.slice(0, subtitleCharIdx - 1));
        setSubtitleCharIdx((prev) => prev - 1);
        return;
      }

      setSubtitleDeleting(false);
      setSubtitleIdx((prev) => (prev + 1) % HERO_SUBTITLES.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [subtitleIdx, subtitleCharIdx, subtitleDeleting]);

  // Typing animation for placeholder demo
  useEffect(() => {
    const story = TYPING_STORIES[currentStory];
    const timer = setTimeout(
      () => {
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
      },
      isDeleting ? 30 : 60,
    );
    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, currentStory]);

  const extractPdfText = async (file) => {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

    const buffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    const pages = Array.from({ length: pdf.numPages }, (_, index) => index + 1);
    const pageTexts = await Promise.all(
      pages.map(async (pageNumber) => {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        return textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
      }),
    );

    return pageTexts.join("\n");
  };

  const extractDocText = async (file) => {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const processAttachmentFiles = async (files) => {
    if (!files.length) {
      setAttachmentResults([]);
      return;
    }

    setProcessingAttachments(true);

    const parsedResults = await Promise.all(
      files.map(async (file) => {
        const lowerName = file.name.toLowerCase();

        try {
          if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
            const text = await extractPdfText(file);
            return {
              name: file.name,
              type: "PDF",
              text,
              error: "",
            };
          }

          if (lowerName.endsWith(".doc") || lowerName.endsWith(".docx")) {
            const text = await extractDocText(file);
            return {
              name: file.name,
              type: "DOC",
              text,
              error: "",
            };
          }

          return {
            name: file.name,
            type: "UNKNOWN",
            text: "",
            error: "Unsupported format. Use PDF, DOC, or DOCX.",
          };
        } catch {
          return {
            name: file.name,
            type: "UNKNOWN",
            text: "",
            error:
              "Could not read this file in the browser. Try PDF or DOCX for best results.",
          };
        }
      }),
    );

    setAttachmentResults(parsedResults);
    setProcessingAttachments(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const accepted = files.filter((file) => {
      const lowerName = file.name.toLowerCase();
      return (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        lowerName.endsWith(".png") ||
        lowerName.endsWith(".jpg") ||
        lowerName.endsWith(".jpeg")
      );
    });
    setImageFiles(accepted);
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setAudioFile(null);
      return;
    }

    const lowerName = file.name.toLowerCase();
    if (file.type === "audio/mpeg" || lowerName.endsWith(".mp3")) {
      setAudioFile(file);
      return;
    }

    setAudioFile(null);
  };

  const handleAttachmentUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    setAttachmentFiles(files);
    await processAttachmentFiles(files);
  };

  const canGenerate =
    !!inputStory.trim() ||
    imageFiles.length > 0 ||
    !!audioFile ||
    attachmentFiles.length > 0;

  const handleGenerate = () => {
    if (!canGenerate || processingAttachments) return;
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

  const currentStep =
    generationSteps.find((s) => progress < s.threshold) || generationSteps[4];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Dynamic network background */}
      <div className="absolute inset-0 -z-10 hero-network-wrap">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(76,201,240,0.10),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(157,78,221,0.12),transparent_45%),linear-gradient(180deg,rgba(2,4,12,0.95),rgba(5,8,22,0.94))]" />
        <HeroNetworkPattern />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/35 to-white/65 dark:from-black/10 dark:via-dark-900/45 dark:to-dark-900/70" />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 dark:bg-dark-900/20 bg-white/15" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute inset-0 dark:bg-hero-gradient" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-neon-pink/5 blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 items-center">
        {/* Left: Hero text */}
        <div className="space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/5 text-sm text-neon-blue font-body backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            CAPSTONE SHOWCASE . SPRING 2026
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="dark:text-white text-gray-900">
                {HERO_HEADLINES[headlineIdx].line1}
              </span>{" "}
              <span className="gradient-text">
                {HERO_HEADLINES[headlineIdx].highlight}
              </span>
              <br />
              <span className="dark:text-white text-gray-900">
                {HERO_HEADLINES[headlineIdx].line2.split(" ")[0]}
              </span>{" "}
              <span className="gradient-text-blue">
                {HERO_HEADLINES[headlineIdx].line2
                  .split(" ")
                  .slice(1)
                  .join(" ")}
              </span>
              <br />
              <span className="dark:text-white text-gray-900">
                {HERO_HEADLINES[headlineIdx].line3}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="dark:text-white/60 text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed font-body max-w-lg">
            {subtitleText}
            <span className="animate-pulse">|</span>
          </p>

          {/* Stats row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
            {[
              { value: "5-Agent", label: "MARL Setup" },
              { value: ">5 min", label: "Output Length" },
              { value: "720p-1080p", label: "Resolution" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-xl sm:text-2xl gradient-text">
                  {stat.value}
                </div>
                <div className="dark:text-white/40 text-gray-600 text-xs font-body mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <a
              href="#showcase"
              className="px-4 sm:px-6 py-3 text-center bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl font-medium text-sm sm:text-base text-white hover:opacity-90 transition-all font-body box-glow-purple"
            >
              View Showcase →
            </a>
            <a
              href="#methodology"
              className="px-4 sm:px-6 py-3 text-center border dark:border-neon-purple/30 dark:text-white/70 dark:hover:text-white dark:hover:border-neon-purple/60 border-gray-300 text-gray-700 text-sm sm:text-base hover:text-gray-900 hover:border-gray-400 rounded-xl transition-all font-body"
            >
              How It Works
            </a>
          </div>
        </div>

        {/* Right: Interactive Demo Panel */}
        <div
          id="demo"
          className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-base sm:text-lg dark:text-white text-gray-900">
              Try STORYMATRIX
            </h3>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60 animate-pulse" />
              <div
                className="w-3 h-3 rounded-full bg-yellow-500/60 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-3 h-3 rounded-full bg-green-500/60 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>

          {/* Story input */}
          <div className="space-y-2">
            <label className="text-xs dark:text-white/40 text-gray-600 font-body uppercase tracking-wider">
              Your Story
            </label>
            <textarea
              value={inputStory}
              onChange={(e) => setInputStory(e.target.value)}
              placeholder={storyText || "Enter your story here..."}
              rows={3}
              className="w-full dark:bg-dark-800/80 bg-gray-100 border border-neon-purple/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 dark:text-white/80 text-gray-800 text-xs sm:text-sm font-body dark:placeholder-white/30 placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 resize-none transition-colors"
            />
            <div className="flex items-center justify-between text-xs dark:text-white/30 text-gray-500">
              <span>No character limit</span>
              <span>{inputStory.length} chars</span>
            </div>
          </div>

          {/* Image input */}
          <div className="space-y-2">
            <label className="text-xs dark:text-white/40 text-gray-600 font-body uppercase tracking-wider">
              Image Input (.png, .jpg)
            </label>
            <label className="block w-full cursor-pointer py-2.5 px-3 border border-neon-purple/20 rounded-lg dark:bg-dark-800 bg-gray-100 text-xs sm:text-sm dark:text-white/70 text-gray-700 font-body hover:border-neon-purple/50 transition-colors">
              Upload image files
              <input
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {imageFiles.length > 0 && (
              <div className="text-xs dark:text-white/50 text-gray-600 space-y-1 font-body">
                {imageFiles.map((file) => (
                  <div key={file.name}>• {file.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Audio input */}
          <div className="space-y-2">
            <label className="text-xs dark:text-white/40 text-gray-600 font-body uppercase tracking-wider">
              Audio Input (.mp3)
            </label>
            <label className="block w-full cursor-pointer py-2.5 px-3 border border-neon-purple/20 rounded-lg dark:bg-dark-800 bg-gray-100 text-xs sm:text-sm dark:text-white/70 text-gray-700 font-body hover:border-neon-purple/50 transition-colors">
              Upload audio file
              <input
                type="file"
                accept=".mp3,audio/mpeg"
                className="hidden"
                onChange={handleAudioUpload}
              />
            </label>
            {audioFile && (
              <div className="text-xs dark:text-white/50 text-gray-600 font-body">
                Selected: {audioFile.name}
              </div>
            )}
          </div>

          {/* Attach input */}
          <div className="space-y-2">
            <label className="text-xs dark:text-white/40 text-gray-600 font-body uppercase tracking-wider">
              Attach (Docs or PDF)
            </label>
            <label className="block w-full cursor-pointer py-2.5 px-3 border border-neon-purple/20 rounded-lg dark:bg-dark-800 bg-gray-100 text-xs sm:text-sm dark:text-white/70 text-gray-700 font-body hover:border-neon-purple/50 transition-colors">
              Upload attachments
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                multiple
                className="hidden"
                onChange={handleAttachmentUpload}
              />
            </label>
            <div className="text-xs dark:text-white/40 text-gray-500 font-body">
              Frontend parsing runs in parallel for all uploaded files.
            </div>
            {processingAttachments && (
              <div className="text-xs text-neon-blue font-body">
                Processing attachments in browser...
              </div>
            )}
            {attachmentResults.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-auto pr-1">
                {attachmentResults.map((result) => (
                  <div
                    key={result.name}
                    className="p-2 rounded-lg border border-neon-purple/20 dark:bg-dark-800/70 bg-gray-100"
                  >
                    <div className="text-xs dark:text-white/70 text-gray-700 font-body">
                      {result.name}
                    </div>
                    {result.error ? (
                      <div className="text-xs text-red-400 font-body mt-1">
                        {result.error}
                      </div>
                    ) : (
                      <div className="text-xs dark:text-white/50 text-gray-600 font-body mt-1">
                        {(result.text || "No text found").slice(0, 180)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              {
                label: "Style",
                options: ["Cinematic", "Anime", "Documentary", "Noir"],
                default: "Cinematic",
              },
              {
                label: "Duration",
                options: ["15s", "30s", "60s", "2min"],
                default: "30s",
              },
            ].map((sel) => (
              <div key={sel.label} className="space-y-1">
                <label className="text-xs dark:text-white/40 text-gray-600 font-body">
                  {sel.label}
                </label>
                <select className="w-full dark:bg-dark-800 bg-gray-100 border border-neon-purple/20 rounded-lg px-2 sm:px-3 py-2 dark:text-white/70 text-gray-700 text-xs sm:text-sm font-body focus:outline-none focus:border-neon-purple/50">
                  {sel.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Generate button */}
          {!generating && !generated && (
            <button
              onClick={handleGenerate}
              disabled={!canGenerate || processingAttachments}
              className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl font-medium text-white text-sm font-body hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ⚡ Generate with StoryMatrix
            </button>
          )}

          {/* Generation progress */}
          {generating && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                <span className="text-xs text-neon-blue font-body">
                  {currentStep.label}
                </span>
              </div>
              <div className="w-full h-2 dark:bg-dark-700 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-blue transition-all duration-200"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="grid grid-cols-5 gap-1">
                {["Parse", "Scene", "Prompt", "Frame", "Render"].map(
                  (step, i) => (
                    <div
                      key={step}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        progress > i * 20
                          ? "bg-neon-blue"
                          : "dark:bg-dark-600 bg-gray-300"
                      }`}
                    />
                  ),
                )}
              </div>
              <div className="text-xs dark:text-white/40 text-gray-500 text-right font-mono">
                {Math.round(Math.min(progress, 100))}%
              </div>
            </div>
          )}

          {/* Generated result */}
          {generated && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-yellow-300 text-sm font-body">
                <span>•</span> Backend work is under process
              </div>
              <div className="rounded-xl border border-neon-purple/20 dark:bg-dark-800/70 bg-gray-100 p-4">
                <p className="text-sm dark:text-white/70 text-gray-700 font-body">
                  Backend work is under process
                </p>
                <p className="text-xs dark:text-white/45 text-gray-500 font-body mt-2">
                  The frontend collected your text and uploaded files. Real
                  generation will appear here after backend integration is
                  completed.
                </p>
              </div>
              <button
                onClick={() => {
                  setGenerated(false);
                  setInputStory("");
                  setImageFiles([]);
                  setAudioFile(null);
                  setAttachmentFiles([]);
                  setAttachmentResults([]);
                }}
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
    </section>
  );
}
