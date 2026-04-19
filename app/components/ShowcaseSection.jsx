"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { videos, categories } from "../data";
import StoryScenes from "./StoryScenes";
import StoryFrameTimeline from "./StoryFrameTimeline";

function formatTime(totalSec) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function buildScenes(video, totalDurationSec) {
  const totalShots = 10;
  const shotTypes = Array.from({ length: totalShots }, (_, idx) =>
    idx === totalShots - 1 ? "Ending segment" : "Scene segment",
  );
  const tags = video.tags.slice(0, 3).join(", ");

  return Array.from({ length: totalShots }, (_, idx) => {
    const startSec = Math.floor((totalDurationSec / totalShots) * idx);
    const endSec = Math.min(
      totalDurationSec,
      Math.floor((totalDurationSec / totalShots) * (idx + 1)),
    );
    const sceneNo = idx + 1;

    return {
      id: `${video.id}-scene-${sceneNo}`,
      title: `Scene ${sceneNo}, Shot ${sceneNo}`,
      shotType: shotTypes[idx],
      prompt: `Dummy prompt for scene ${sceneNo}: A cinematic sequence with consistent character identity, smooth camera movement, and balanced lighting suitable for long-form storytelling.`,
      startSec,
      endSec,
    };
  });
}

function getDemoVideoSource(video) {
  return video.src || "/videos/demo-sample-01-storymatrix.mp4";
}

function VideoModal({ video, onClose }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSec);
  const [sceneThumbs, setSceneThumbs] = useState([]);
  const [isThumbGen, setIsThumbGen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const sceneStripRef = useRef(null);
  const videoRef = useRef(null);
  const scenes = useMemo(
    () =>
      buildScenes(
        video,
        Math.max(1, Math.floor(duration || video.durationSec)),
      ),
    [video, duration],
  );
  const demoVideoSrc = useMemo(() => getDemoVideoSource(video), [video.src]);

  const handleShare = (platform) => {
    const url = `https://storymatrix.ai/video/${video.id}`;
    const text = `Check out this AI-generated video: "${video.title}" on StoryMatrix`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setActiveScene(0);
    setCurrentTime(0);
    setDuration(video.durationSec);
    setSceneThumbs([]);
  }, [video.id]);

  useEffect(() => {
    let canceled = false;

    const generateThumbs = async () => {
      setIsThumbGen(true);

      const probe = document.createElement("video");
      probe.src = demoVideoSrc;
      probe.muted = true;
      probe.playsInline = true;
      probe.preload = "auto";

      const waitForMeta = new Promise((resolve) => {
        const onMeta = () => {
          probe.removeEventListener("loadedmetadata", onMeta);
          resolve();
        };
        probe.addEventListener("loadedmetadata", onMeta, { once: true });
      });

      try {
        await waitForMeta;
        if (canceled) return;

        const d =
          Number.isFinite(probe.duration) && probe.duration > 0
            ? probe.duration
            : video.durationSec;
        const maxTime = Math.max(d - 0.05, 0);
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const thumbs = [];

        for (let i = 0; i < scenes.length; i += 1) {
          const t = Math.min(maxTime, (d / scenes.length) * i);

          await new Promise((resolve) => {
            const onSeeked = () => {
              probe.removeEventListener("seeked", onSeeked);
              resolve();
            };

            const safeTime = Math.max(0, t);
            if (Math.abs(probe.currentTime - safeTime) < 0.02) {
              resolve();
              return;
            }

            probe.addEventListener("seeked", onSeeked, { once: true });
            probe.currentTime = safeTime;
          });

          if (canceled) return;
          ctx.drawImage(probe, 0, 0, canvas.width, canvas.height);
          thumbs.push(canvas.toDataURL("image/jpeg", 0.76));
        }

        if (!canceled) setSceneThumbs(thumbs);
      } catch {
        if (!canceled) setSceneThumbs([]);
      } finally {
        if (!canceled) setIsThumbGen(false);
        probe.src = "";
      }
    };

    void generateThumbs();

    return () => {
      canceled = true;
    };
  }, [demoVideoSrc, scenes.length, video.durationSec]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onLoadedMeta = () => {
      if (Number.isFinite(el.duration) && el.duration > 0)
        setDuration(el.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime || 0);
      const d =
        Number.isFinite(el.duration) && el.duration > 0
          ? el.duration
          : duration;

      if (d > 0) {
        const idx = Math.min(
          scenes.length - 1,
          Math.floor((el.currentTime / d) * scenes.length),
        );
        setActiveScene((prev) => (prev === idx ? prev : idx));
      }
    };

    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [scenes.length]);

  const seekToScene = (seconds) => {
    const el = videoRef.current;
    if (el) {
      el.currentTime = Math.max(0, Math.min(seconds, duration));
      void el.play();
    }
    setCurrentTime(seconds);
  };

  const selectScene = (index) => {
    const clamped = Math.max(0, Math.min(scenes.length - 1, index));
    setActiveScene(clamped);
    seekToScene(scenes[clamped].startSec);
    const item = sceneStripRef.current?.querySelector(
      `[data-scene-index="${clamped}"]`,
    );
    if (item instanceof HTMLElement)
      item.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded-md text-xs bg-neon-purple/20 text-neon-purple border border-neon-purple/30 font-mono">
                  {video.model}
                </span>
                <span className="px-2 py-1 rounded-md text-xs dark:bg-dark-700 bg-gray-100 dark:text-white/50 text-gray-600 dark:border-white/10 border border-gray-300">
                  {video.resolution}
                </span>
                <span className="px-2 py-1 rounded-md text-xs dark:bg-dark-700 bg-gray-100 dark:text-white/50 text-gray-600 dark:border-white/10 border border-gray-300">
                  ⏱ {formatTime(Math.round(duration || video.durationSec))}
                </span>
                <span className="px-2 py-1 rounded-md text-xs dark:bg-dark-700 bg-gray-100 dark:text-white/50 text-gray-600 dark:border-white/10 border border-gray-300">
                  {video.hasAudio ? "🎧 Audio" : "🔇 No Audio"}
                </span>
                <span className="px-2 py-1 rounded-md text-xs dark:bg-dark-700 bg-gray-100 dark:text-white/50 text-gray-600 dark:border-white/10 border border-gray-300">
                  {video.hasSubtitle ? "📝 Subtitle" : "📝 No Subtitle"}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold dark:text-white text-gray-900">
                {video.title}
              </h2>
              <p className="dark:text-white/50 text-sm mt-1 font-body text-gray-600">
                Updated: {video.date} · Total length:{" "}
                {formatTime(Math.round(duration || video.durationSec))}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl dark:border-white/10 border border-gray-300 dark:text-white/50 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:border-neon-purple/40 hover:border-neon-purple/40 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Video Player */}
          <div className="rounded-xl overflow-hidden border border-neon-purple/20">
            <div className="relative video-container">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
                preload="auto"
              >
                <source src={demoVideoSrc} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>

          {/* Story Scenes (if available) or Default Scene Carousel */}
          {video.storyJsonPath ? (
            <div className="space-y-6">
              <StoryFrameTimeline 
                storyJsonPath={video.storyJsonPath}
                videoRef={videoRef}
                duration={duration}
                demoVideoSrc={demoVideoSrc}
              />
              <StoryScenes storyJsonPath={video.storyJsonPath} />
            </div>
          ) : (
            <div className="glass rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => selectScene(activeScene - 1)}
                className="w-9 h-9 rounded-full border dark:border-white/15 border-gray-300 dark:text-white/60 text-gray-700 dark:hover:text-white hover:text-gray-900 transition-colors"
                aria-label="Previous scene"
              >
                ‹
              </button>
              <div className="text-center">
                <h4 className="font-display font-semibold dark:text-white text-gray-900 text-base">
                  Multi-shot Scene Carousel
                </h4>
                <p className="text-xs dark:text-white/40 text-gray-600 font-body">
                  {scenes[activeScene].title} ·{" "}
                  {formatTime(scenes[activeScene].startSec)} -{" "}
                  {formatTime(scenes[activeScene].endSec)}
                </p>
                {isThumbGen && (
                  <p className="text-[11px] text-neon-blue font-body">
                    Generating scene frames...
                  </p>
                )}
              </div>
              <button
                onClick={() => selectScene(activeScene + 1)}
                className="w-9 h-9 rounded-full border dark:border-white/15 border-gray-300 dark:text-white/60 text-gray-700 dark:hover:text-white hover:text-gray-900 transition-colors"
                aria-label="Next scene"
              >
                ›
              </button>
            </div>

            <div
              ref={sceneStripRef}
              className="flex gap-2 overflow-x-auto pb-1"
            >
              {scenes.map((scene, idx) => (
                <button
                  key={scene.id}
                  data-scene-index={idx}
                  onClick={() => selectScene(idx)}
                  className={`min-w-[140px] text-left rounded-lg overflow-hidden border transition-all ${
                    activeScene === idx
                      ? "border-neon-blue ring-1 ring-neon-blue/40"
                      : "dark:border-white/10 border-gray-300"
                  }`}
                >
                  <img
                    src={sceneThumbs[idx] || video.thumbnail}
                    alt={scene.title}
                    className="w-full h-16 object-cover"
                  />
                  <div className="p-2 dark:bg-dark-800/90 bg-white">
                    <div className="text-[11px] font-mono dark:text-white/40 text-gray-600">
                      {scene.title}
                    </div>
                    <div className="text-[11px] dark:text-white/50 text-gray-700 line-clamp-1">
                      {scene.shotType}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <div className="h-2 rounded-full dark:bg-dark-700 bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                  style={{
                    width: `${duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs dark:text-white/40 text-gray-600 font-mono">
                <span>{formatTime(Math.floor(currentTime))}</span>
                <span>{formatTime(Math.round(duration))}</span>
              </div>
            </div>

            <div className="rounded-xl dark:bg-dark-800/70 bg-gray-100 border dark:border-white/10 border-gray-300 p-3 space-y-1">
              <div className="text-xs uppercase tracking-wide dark:text-white/40 text-gray-600 font-body">
                Scene-by-Scene Prompt
              </div>
              <p className="text-sm dark:text-white/70 text-gray-700 font-body leading-relaxed">
                {scenes[activeScene].prompt}
              </p>
            </div>
          </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div
              className="relative"
              onMouseEnter={() => setShowShareOptions(true)}
              onMouseLeave={() => setShowShareOptions(false)}
            >
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border dark:border-white/10 dark:text-white/50 dark:hover:border-neon-blue/40 dark:hover:text-neon-blue border-gray-300 text-gray-600 hover:border-neon-blue/40 hover:text-neon-blue transition-all font-body text-sm hover:scale-105 active:scale-100">
                🔗 Share
              </button>
              {showShareOptions && (
                <div className="absolute bottom-full mb-2 w-48 rounded-xl glass-card p-2 space-y-2">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg dark:hover:bg-dark-700 hover:bg-gray-100 transition-all font-body text-sm dark:text-white/70 text-gray-700"
                  >
                    🐦 Twitter
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg dark:hover:bg-dark-700 hover:bg-gray-100 transition-all font-body text-sm dark:text-white/70 text-gray-700"
                  >
                    📱 WhatsApp
                  </button>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://storymatrix.ai/video/${video.id}`,
                      )
                    }
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg dark:hover:bg-dark-700 hover:bg-gray-100 transition-all font-body text-sm dark:text-white/70 text-gray-700"
                  >
                    📋 Copy Link
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-body text-sm hover:scale-105 active:scale-100 ${
                bookmarked
                  ? "bg-neon-blue/20 border-neon-blue/40 text-neon-blue"
                  : "dark:border-white/10 border-gray-300 dark:text-white/50 text-gray-600 dark:hover:border-neon-blue/40 hover:border-neon-blue/40 dark:hover:text-neon-blue hover:text-neon-blue"
              }`}
            >
              {bookmarked ? "🔖 Saved" : "🏷️ Save"}
            </button>
          </div>

          {/* Details + Tags */}
          <div className="grid md:grid-cols-1 gap-4">
            <div className="glass rounded-xl p-4 space-y-3">
              <h4 className="text-xs dark:text-white/40 text-gray-600 uppercase tracking-wider font-body">
                Video Details
              </h4>
              <div className="space-y-2">
                {[
                  {
                    label: "Total Length",
                    value: formatTime(
                      Math.round(duration || video.durationSec),
                    ),
                  },
                  { label: "Resolution", value: video.resolution },
                  { label: "Audio", value: video.hasAudio ? "Included" : "No" },
                  {
                    label: "Subtitle",
                    value: video.hasSubtitle ? "Included" : "No",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex justify-between text-xs dark:bg-dark-800/60 bg-gray-100 border dark:border-white/10 border-gray-300 rounded-lg px-3 py-2"
                  >
                    <span className="dark:text-white/45 text-gray-600 font-body">
                      {m.label}
                    </span>
                    <span className="dark:text-white/80 text-gray-700 font-mono">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs border border-neon-blue/20 text-neon-blue/70 bg-neon-blue/5 font-body"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="text-xs dark:text-white/40 text-gray-600 font-body">
            Display data comes from local files in the asset folder. Placeholder
            comments and synthetic counters were removed.
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onClick }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const previewSrc = useMemo(() => getDemoVideoSource(video), [video.src]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
    }
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
      style={{ transition: "transform 0.15s ease, box-shadow 0.3s ease" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <video
          src={previewSrc}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 video-overlay" />

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-mono">
          {video.duration}
        </div>

        {/* Model badge */}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-neon-purple/30 backdrop-blur-sm border border-neon-purple/30 text-neon-blue text-xs font-mono">
          {video.model}
        </div>

        {/* Play overlay on hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1" />
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold dark:text-white text-gray-900 text-base leading-tight line-clamp-1">
            {video.title}
          </h3>
          <p className="dark:text-white/40 text-gray-600 text-xs font-body mt-1 line-clamp-2">
            {video.story}
          </p>
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs dark:text-white/40 text-gray-600 font-body">
          <span>{video.date}</span>
          <span>{video.resolution}</span>
          <span>⏱ {video.duration}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-body">
          <span className="px-2 py-0.5 rounded-full border border-neon-blue/20 text-neon-blue/70 bg-neon-blue/5">
            {video.hasAudio ? "🎧 Audio" : "🔇 No Audio"}
          </span>
          {video.hasSubtitle && (
            <span className="px-2 py-0.5 rounded-full border border-neon-purple/20 text-neon-purple/70 bg-neon-purple/5">
              📝 Subtitle
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {video.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs bg-neon-blue/5 border border-neon-blue/15 text-neon-blue/60 font-body"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Card action */}
        <div className="flex items-center justify-between pt-2 dark:border-white/5 border-gray-200 border-t">
          <span className="text-xs dark:text-white/35 text-gray-500 font-body">
            Local asset video
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className={`text-base transition-all ${bookmarked ? "text-neon-blue" : "dark:text-white/30 dark:hover:text-neon-blue text-gray-400 hover:text-neon-blue"}`}
          >
            {bookmarked ? "🔖" : "🏷️"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = videos
    .filter((v) => {
      const matchSearch =
        !search ||
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.story.toLowerCase().includes(search.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat =
        activeCategory === "all" || v.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "duration") return b.durationSec - a.durationSec;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const groupedCategories = categories.reduce((acc, cat) => {
    if (!cat.group) return acc;
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {});

  const quickTags = useMemo(
    () => Array.from(new Set(videos.flatMap((v) => v.tags))).slice(0, 8),
    [],
  );

  const activeFilterCount =
    (activeCategory !== "all" ? 1 : 0) + (search.trim() ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  return (
    <section id="showcase" className="relative py-24 dark:bg-dark-800 bg-white">
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-sm text-neon-blue font-body mb-4">
            🎬 Video Showcase
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold dark:text-white text-gray-900 mb-4">
            StoryMatrix <span className="gradient-text">Generations</span>
          </h2>
          <p className="dark:text-white/50 text-gray-600 max-w-lg mx-auto font-body text-sm sm:text-base">
            Explore AI-generated videos from diverse story genres, all powered
            by the StoryMatrix model.
          </p>
        </div>

        {/* Search + Sort + Filter controls */}
        <div className="glass-card rounded-2xl p-3 sm:p-4 mb-6 border border-neon-purple/20 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
            <div className="relative group search-shell">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-white/40 text-gray-500 text-lg transition-transform duration-300 group-focus-within:scale-125">
                🔍
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, story, or tag..."
                className="w-full dark:bg-dark-700/80 bg-gray-100 border border-neon-purple/20 rounded-xl pl-12 pr-10 py-2.5 sm:py-3 dark:text-white/80 text-gray-800 text-xs sm:text-sm font-body dark:placeholder-white/30 placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full dark:bg-dark-600 bg-gray-200 dark:text-white/50 text-gray-500 dark:hover:text-white hover:text-gray-800 transition-all"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="dark:bg-dark-700/80 bg-gray-100 border border-neon-purple/20 rounded-xl px-3 py-2.5 sm:py-3 dark:text-white/70 text-gray-700 text-xs sm:text-sm font-body focus:outline-none focus:border-neon-purple/50 focus:ring-2 focus:ring-neon-purple/20 min-w-[170px]"
            >
              <option value="newest">📅 Newest First</option>
              <option value="duration">⏱ Longest First</option>
              <option value="title">🔤 Title A-Z</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-body transition-all min-w-[150px] ${
                showFilters
                  ? "bg-neon-purple/20 border-neon-purple/50 text-neon-purple"
                  : "dark:border-neon-purple/20 border-neon-purple/25 dark:text-white/60 text-gray-700 hover:border-neon-purple/45"
              }`}
            >
              🏷️ Filters {hasActiveFilters ? `· ${activeFilterCount}` : ""}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] uppercase tracking-wider dark:text-white/35 text-gray-500 font-body">
              Quick Tags
            </span>
            {quickTags.map((tag) => {
              const isActiveTag =
                search.trim().toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSearch(isActiveTag ? "" : tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    isActiveTag
                      ? "border-neon-blue/60 bg-neon-blue/20 text-neon-blue"
                      : "dark:border-white/10 border-gray-300 dark:text-white/50 text-gray-600 hover:border-neon-blue/40 hover:text-neon-blue"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="ml-auto px-3 py-1 rounded-full text-[11px] border border-neon-pink/35 text-neon-pink hover:bg-neon-pink/10 transition-all"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="glass rounded-2xl p-6 mb-6 space-y-5 border border-neon-purple/25 animate-slide-up">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display font-semibold dark:text-white text-gray-900 text-base">
                Filter by Category
              </h3>
              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="px-2.5 py-1 rounded-md text-xs border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all"
                >
                  Clear Category
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`cat-pill ${activeCategory === "all" ? "active" : ""}`}
              >
                ⚡ All
              </button>
            </div>
            {Object.entries(groupedCategories).map(([group, cats]) => (
              <div key={group} className="space-y-2">
                <div className="text-xs dark:text-white/30 text-gray-500 uppercase tracking-wider font-body">
                  {group}
                </div>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`cat-pill ${activeCategory === cat.id ? "active" : ""}`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="dark:text-white/45 text-gray-600 text-sm font-body">
            Showing{" "}
            <span className="dark:text-white text-gray-900">
              {filtered.length}
            </span>{" "}
            video{filtered.length !== 1 ? "s" : ""}
            {search && (
              <span>
                {" "}
                for &ldquo;<span className="text-neon-blue">{search}</span>
                &rdquo;
              </span>
            )}
            {activeCategory !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="text-neon-purple">
                  {categories.find((c) => c.id === activeCategory)?.label ||
                    activeCategory}
                </span>
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 text-xs dark:text-white/30 text-gray-500 font-body">
            <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
            Live · {videos.length} total
          </div>
        </div>

        {/* Video grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🎬</div>
            <p className="font-display text-xl">No videos found</p>
            <p className="text-sm mt-2 font-body">
              Try a different search term or category
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
