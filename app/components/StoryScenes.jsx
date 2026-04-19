"use client";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function StoryScenes({ storyJsonPath }) {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedScenes, setExpandedScenes] = useState({});
  const [expandedShots, setExpandedShots] = useState({});
  const [showFullStory, setShowFullStory] = useState(false);

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

  const toggleScene = (sceneNum) => {
    setExpandedScenes((prev) => ({
      ...prev,
      [sceneNum]: !prev[sceneNum],
    }));
  };

  const toggleShot = (shotId) => {
    setExpandedShots((prev) => ({
      ...prev,
      [shotId]: !prev[shotId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neon-blue text-sm font-body">Loading story...</div>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="text-center py-12 dark:text-white/40 text-gray-600 font-body">
        Story data not available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Story Header */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display font-bold text-lg dark:text-white text-gray-900">
            📖 {storyData.story_name}
          </h3>
          <button
            onClick={() => setShowFullStory(!showFullStory)}
            className="px-4 py-2 rounded-lg text-xs font-body border dark:border-neon-purple/30 dark:text-white/70 dark:hover:text-white dark:hover:border-neon-purple/60 border-gray-300 text-gray-600 hover:text-gray-900 transition-all"
          >
            {showFullStory ? "Hide Full Story" : "Show Full Story"}
          </button>
        </div>

        {/* Style Tag */}
        <div className="px-3 py-1.5 rounded-lg bg-neon-purple/10 border border-neon-purple/30 text-xs text-neon-purple font-mono inline-block">
          Style: {storyData.style.substring(0, 60)}...
        </div>

        {/* Full Story (Collapsible) */}
        {showFullStory && (
          <div className="mt-4 p-4 rounded-xl dark:bg-dark-800/70 bg-gray-100 border dark:border-white/10 border-gray-300">
            <p className="text-sm dark:text-white/70 text-gray-700 font-body leading-relaxed line-clamp-8">
              {storyData.full_story}
            </p>
          </div>
        )}
      </div>

      {/* Scenes */}
      <div className="space-y-3">
        <h4 className="font-display font-semibold text-base dark:text-white text-gray-900 px-2">
          🎬 Scenes & Shots ({storyData.scenes.length} scenes)
        </h4>

        {storyData.scenes.map((scene) => {
          const shotCount = scene.video_prompts?.length || 0;
          return (
            <div
              key={scene.scene_num}
              className="glass-card rounded-2xl overflow-hidden border border-neon-purple/20"
            >
              {/* Scene Header */}
              <button
                onClick={() => toggleScene(scene.scene_num)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neon-purple/5 transition-colors"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center text-sm font-bold text-neon-purple">
                    {scene.scene_num}
                  </div>
                  <div>
                    <h5 className="font-display font-semibold dark:text-white text-gray-900">
                      Scene {scene.scene_num}
                    </h5>
                    <p className="text-xs dark:text-white/50 text-gray-600 font-body mt-1">
                      {shotCount} shot{shotCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono dark:text-white/40 text-gray-500">
                  <span>{shotCount} shots</span>
                  {expandedScenes[scene.scene_num] ? (
                    <ChevronUp size={18} className="text-neon-purple" />
                  ) : (
                    <ChevronDown size={18} className="text-neon-purple" />
                  )}
                </div>
              </button>

              {/* Expanded Scene Content */}
              {expandedScenes[scene.scene_num] && (
                <div className="px-6 py-4 space-y-3 dark:bg-dark-800/50 bg-gray-50 border-t border-neon-purple/10">
                  {Array.from({ length: shotCount }).map((_, shotIndex) => {
                    const shotId = `${scene.scene_num}-${shotIndex}`;
                    return (
                      <div
                        key={shotId}
                        className="border dark:border-neon-blue/20 border-neon-blue/15 rounded-xl overflow-hidden"
                      >
                        {/* Shot Header */}
                        <button
                          onClick={() => toggleShot(shotId)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-neon-blue/5 transition-colors"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-xs font-mono px-2 py-1 rounded bg-neon-blue/20 text-neon-blue">
                              Shot {shotIndex + 1}
                            </span>
                            <div>
                              <p className="text-sm font-body dark:text-white/80 text-gray-800">
                                Duration: {scene.duration[shotIndex]}s
                              </p>
                            </div>
                          </div>
                          {expandedShots[shotId] ? (
                            <ChevronUp size={16} className="text-neon-blue" />
                          ) : (
                            <ChevronDown size={16} className="text-neon-blue" />
                          )}
                        </button>

                        {/* Expanded Shot Content */}
                        {expandedShots[shotId] && (
                          <div className="px-4 py-4 space-y-4 dark:bg-dark-700/50 bg-white border-t border-neon-blue/10">
                            {/* Video Prompt */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-neon-purple font-semibold">
                                  🎥 Video Prompt
                                </span>
                                {scene.cut[shotIndex] && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-mono">
                                    CUT
                                  </span>
                                )}
                                <span className="text-xs px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan font-mono ml-auto">
                                  {scene.duration[shotIndex]}s
                                </span>
                              </div>
                              <p className="text-xs dark:text-white/60 text-gray-700 font-body leading-relaxed bg-neon-purple/5 dark:bg-dark-600/50 p-3 rounded-lg">
                                {scene.video_prompts[shotIndex]}
                              </p>
                            </div>

                            {/* First Frame Prompt */}
                            <div className="space-y-2">
                              <span className="text-xs font-mono text-neon-cyan font-semibold">
                                🖼️ First Frame Prompt
                              </span>
                              <p className="text-xs dark:text-white/60 text-gray-700 font-body leading-relaxed bg-neon-cyan/5 dark:bg-dark-600/50 p-3 rounded-lg">
                                {scene.first_frame_prompt[shotIndex]}
                              </p>
                            </div>

                            {/* Speech & Subtitle */}
                            <div className="grid grid-cols-1 gap-3">
                              <div className="space-y-2">
                                <span className="text-xs font-mono text-neon-pink font-semibold">
                                  🎤 Speech
                                </span>
                                <p className="text-xs dark:text-white/60 text-gray-700 font-body italic bg-neon-pink/5 dark:bg-dark-600/50 p-3 rounded-lg">
                                  "{scene.speech[shotIndex]}"
                                </p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-xs font-mono text-neon-blue font-semibold">
                                  📝 Subtitle
                                </span>
                                <p className="text-xs dark:text-white/60 text-gray-700 font-body bg-neon-blue/5 dark:bg-dark-600/50 p-3 rounded-lg">
                                  "{scene.subtitle[shotIndex]}"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
