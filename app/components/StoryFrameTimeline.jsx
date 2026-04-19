"use client";
import { useState, useEffect, useRef } from "react";

export default function StoryFrameTimeline({ storyJsonPath, videoRef, duration, demoVideoSrc }) {
  const [storyData, setStoryData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);
  const timelineRef = useRef(null);
  const activeFrameRef = useRef(null);

  useEffect(() => {
    const loadStory = async () => {
      try {
        const response = await fetch(storyJsonPath);
        const data = await response.json();
        setStoryData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading story:", error);
        setLoading(false);
      }
    };

    if (storyJsonPath) {
      loadStory();
    }
  }, [storyJsonPath]);

  // Generate thumbnails for each shot
  useEffect(() => {
    if (!storyData || !demoVideoSrc || !duration) return;

    let canceled = false;

    const generateThumbnails = async () => {
      setIsGeneratingThumbs(true);

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

        const d = Number.isFinite(probe.duration) && probe.duration > 0 ? probe.duration : duration;
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 90;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const thumbs = [];
        let cumulativeTime = 0;

        // Generate thumbnail for each shot
        for (const scene of storyData.scenes) {
          for (let shotIdx = 0; shotIdx < scene.duration.length; shotIdx++) {
            const shotDuration = scene.duration[shotIdx];
            const thumbTime = Math.min(cumulativeTime + shotDuration * 0.3, d - 0.05);

            await new Promise((resolve) => {
              const onSeeked = () => {
                probe.removeEventListener("seeked", onSeeked);
                resolve();
              };

              const safeTime = Math.max(0, thumbTime);
              if (Math.abs(probe.currentTime - safeTime) < 0.02) {
                resolve();
                return;
              }

              probe.addEventListener("seeked", onSeeked, { once: true });
              probe.currentTime = safeTime;
            });

            if (canceled) return;
            ctx.drawImage(probe, 0, 0, canvas.width, canvas.height);
            thumbs.push(canvas.toDataURL("image/jpeg", 0.75));
            cumulativeTime += shotDuration;
          }
        }

        if (!canceled) setThumbnails(thumbs);
      } catch (error) {
        console.error("Error generating thumbnails:", error);
        if (!canceled) setThumbnails([]);
      } finally {
        if (!canceled) setIsGeneratingThumbs(false);
        probe.src = "";
      }
    };

    void generateThumbnails();

    return () => {
      canceled = true;
    };
  }, [storyData, demoVideoSrc, duration]);

  useEffect(() => {
    const el = videoRef?.current;
    if (!el) return;

    const onTimeUpdate = () => {
      setCurrentTime(el.currentTime || 0);
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [videoRef]);

  // Auto-scroll active frame into view
  useEffect(() => {
    if (activeFrameRef.current) {
      activeFrameRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentTime]);

  if (loading || !storyData) {
    return null;
  }

  // Calculate cumulative time and create frame list
  const frames = [];
  let cumulativeTime = 0;

  storyData.scenes.forEach((scene, sceneIdx) => {
    scene.duration.forEach((shotDuration, shotIdx) => {
      frames.push({
        id: `${sceneIdx}-${shotIdx}`,
        sceneNum: scene.scene_num,
        shotNum: shotIdx + 1,
        duration: shotDuration,
        startTime: cumulativeTime,
        endTime: cumulativeTime + shotDuration,
        videoPrompt: scene.video_prompts[shotIdx],
      });
      cumulativeTime += shotDuration;
    });
  });

  const getActiveFrame = () => {
    return frames.findIndex(
      (frame) =>
        currentTime >= frame.startTime && currentTime < frame.endTime,
    );
  };

  const activeFrameIdx = getActiveFrame();

  return (
    <div className="space-y-3">
      {/* Horizontal Timeline */}
      <div className="glass-card rounded-xl p-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h4 className="font-display font-semibold text-sm dark:text-white text-gray-900">
            📹 Scene Timeline
          </h4>
          {isGeneratingThumbs && (
            <span className="text-xs text-neon-blue font-body">
              Generating frames...
            </span>
          )}
        </div>

        {/* Frame Strip */}
        <div className="relative">
          <div
            ref={timelineRef}
            className="flex gap-1 overflow-x-auto pb-2 scroll-smooth"
          >
            {frames.map((frame, idx) => {
              const isActive = idx === activeFrameIdx;
              const thumbnail = thumbnails[idx];

              return (
                <button
                  key={frame.id}
                  ref={isActive ? activeFrameRef : null}
                  onClick={() => {
                    if (videoRef?.current) {
                      videoRef.current.currentTime = frame.startTime;
                      videoRef.current.play();
                    }
                  }}
                  className={`flex-shrink-0 group relative cursor-pointer transition-all duration-200 border-2 rounded-lg overflow-hidden ${
                    isActive
                      ? "dark:border-neon-cyan border-neon-cyan ring-2 ring-offset-2 dark:ring-offset-dark-800 ring-offset-gray-100 ring-neon-cyan shadow-lg shadow-neon-cyan/30"
                      : "dark:border-white/20 border-gray-300 hover:border-neon-cyan/50"
                  }`}
                  title={`Scene ${frame.sceneNum}, Shot ${frame.shotNum} (${frame.duration}s)`}
                >
                  {/* Thumbnail */}
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={`Scene ${frame.sceneNum}, Shot ${frame.shotNum}`}
                      className="w-32 h-20 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-20 bg-dark-800/50 flex items-center justify-center text-xs text-white/50">
                      Loading...
                    </div>
                  )}

                  {/* Label Overlay */}
                  <div className={`absolute inset-0 flex flex-col justify-between p-1.5 transition-all ${
                    isActive
                      ? "bg-gradient-to-t from-black/80 to-black/20"
                      : "bg-gradient-to-t from-black/60 to-transparent hover:from-black/80"
                  }`}>
                    <div className="text-left">
                      <div className="text-[10px] font-bold text-white drop-shadow-lg">
                        Scene {frame.sceneNum}, Shot {frame.shotNum}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-[9px] text-white/90 drop-shadow-lg font-semibold">
                        {frame.duration}s
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-purple" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress Indicator */}
          {frames.length > 0 && (
            <div className="mt-3 h-1 bg-dark-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple transition-all duration-200"
                style={{
                  width: `${(currentTime / (frames[frames.length - 1]?.endTime || 1)) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Current Shot Info */}
      {activeFrameIdx >= 0 && frames[activeFrameIdx] && (
        <div className="glass-card rounded-lg p-3 border border-neon-cyan/30 bg-neon-cyan/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-mono text-neon-cyan font-semibold">
                🎬 NOW PLAYING
              </p>
              <p className="text-sm dark:text-white text-gray-900 font-body mt-1 font-semibold">
                Scene {frames[activeFrameIdx].sceneNum} • Shot {frames[activeFrameIdx].shotNum}
              </p>
              <p className="text-xs dark:text-white/50 text-gray-600 font-body mt-1 line-clamp-2">
                {frames[activeFrameIdx].videoPrompt}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-mono dark:text-white/70 text-gray-600">
                {currentTime.toFixed(1)}s
              </p>
              <p className="text-xs font-mono dark:text-neon-cyan text-neon-cyan mt-1 font-semibold">
                {frames[activeFrameIdx].duration}s clip
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
