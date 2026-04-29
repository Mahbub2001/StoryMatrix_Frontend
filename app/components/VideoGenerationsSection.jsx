"use client";
import { useState } from "react";

export default function VideoGenerationsSection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const bestStoryVideos = [
    {
      id: 1,
      title: "The Boy Who Painted Stars",
      filename: "ADVENTURE_The_Boy_Who_Painted_Stars.mp4",
      category: "Adventure",
      emoji: "🎨",
    },
    {
      id: 2,
      title: "The Ember Seed",
      filename: "ADVENTURE_The_Ember_Seed.mp4",
      category: "Adventure",
      emoji: "🔥",
    },
    {
      id: 3,
      title: "The Torch of Prometheus",
      filename: "MYTHOLOGY_The_Torch_of_Prometheus.mp4",
      category: "Mythology",
      emoji: "🔦",
    },
    {
      id: 4,
      title: "The Girl Who Swallowed the Moon",
      filename: "Magical_Adventure_The_Girl_Who_Swallowed_the_Moon.mp4",
      category: "Magical",
      emoji: "🌙",
    },
    {
      id: 5,
      title: "The Cartographer of the Skies",
      filename: "Magical_Adventure_Cartographer_skies.mp4",
      category: "Magical",
      emoji: "🗺️",
    },
    {
      id: 6,
      title: "The Magical Dragon",
      filename: "Magical_Dragon.mp4",
      category: "Fantasy",
      emoji: "🐉",
    },
    {
      id: 7,
      title: "Hare and Tortoise",
      filename: "Hare_and_Tortoise.mp4",
      category: "Fable",
      emoji: "🐢",
    },
    {
      id: 8,
      title: "The Boy Who Cried Wolf",
      filename: "boy_who_cried_wolf_detailed.mp4",
      category: "Fable",
      emoji: "🐺",
    },
    {
      id: 9,
      title: "The Weight of Gravity",
      filename: "weight_of_gravity_detailed.mp4",
      category: "Drama",
      emoji: "⚖️",
    },
    {
      id: 10,
      title: "48 Hour Heartbeat",
      filename: "48_hour_heartbeat_detailed.mp4",
      category: "Drama",
      emoji: "💓",
    },
    {
      id: 11,
      title: "Spring Japan",
      filename: "spring_japan.mp4",
      category: "Slice of Life",
      emoji: "🌸",
    },
    {
      id: 12,
      title: "The Woodcutter",
      filename: "woodcutter.mp4",
      category: "Drama",
      emoji: "🪚",
    },
    {
      id: 13,
      title: "Bayazid",
      filename: "bayazid.mp4",
      category: "Historical",
      emoji: "👑",
    },
    {
      id: 14,
      title: "The Emperor",
      filename: "emperor.mp4",
      category: "Drama",
      emoji: "🏰",
    },
    {
      id: 15,
      title: "Ji Lan",
      filename: "Ji_lan.mp4",
      category: "Adventure",
      emoji: "⚔️",
    },
    
  ];

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="relative py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              StoryMatrix Generations
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Explore our collection of AI-generated stories across multiple genres and styles
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestStoryVideos.map((video) => (
            <div
              key={video.id}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                {/* Video Thumbnail/Preview */}
                <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    src={`/best_stories/${video.filename}`}
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-4xl">▶</div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white leading-tight flex-1 group-hover:text-blue-400 transition-colors">
                      {video.title}
                    </h3>
                    <span className="text-2xl ml-2">{video.emoji}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-500/30">
                      {video.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-slate-900 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Video Player */}
              <video
                className="w-full aspect-video bg-black"
                src={`/best_stories/${selectedVideo.filename}`}
                controls
                autoPlay
              />

              {/* Video Info */}
              <div className="p-6 bg-slate-800">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-500/30">
                  {selectedVideo.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-lg mb-6">
            Discover the power of AI-generated storytelling
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Explore More Stories
          </button>
        </div>
      </div>
    </section>
  );
}
