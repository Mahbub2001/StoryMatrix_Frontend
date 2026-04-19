"use client";
import { useState } from "react";
import { modelComparisons } from "../data";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const radarData = [
  {
    metric: "SSIM x100",
    "STORYMATRIX-4D": 81,
    "Open-Sora 2.0": 72,
    "Wan 2.2": 75,
    HunyuanVideo: 74,
  },
  {
    metric: "CLIPScore x100",
    "STORYMATRIX-4D": 83,
    "Open-Sora 2.0": 76,
    "Wan 2.2": 78,
    HunyuanVideo: 77,
  },
  {
    metric: "VBench Motion",
    "STORYMATRIX-4D": 59.3,
    "Open-Sora 2.0": 55,
    "Wan 2.2": 58.4,
    HunyuanVideo: 61.8,
  },
  {
    metric: "TCI x100",
    "STORYMATRIX-4D": 84,
    "Open-Sora 2.0": 61,
    "Wan 2.2": 68,
    HunyuanVideo: 65,
  },
  {
    metric: "FVD Efficiency",
    "STORYMATRIX-4D": 100,
    "Open-Sora 2.0": 0,
    "Wan 2.2": 47,
    HunyuanVideo: 69,
  },
];

const barData = [
  {
    name: "TCI x100",
    "STORYMATRIX-4D": 84,
    "Open-Sora 2.0": 61,
    "Wan 2.2": 68,
    HunyuanVideo: 65,
  },
  {
    name: "SSIM x100",
    "STORYMATRIX-4D": 81,
    "Open-Sora 2.0": 72,
    "Wan 2.2": 75,
    HunyuanVideo: 74,
  },
  {
    name: "CLIPScore x100",
    "STORYMATRIX-4D": 83,
    "Open-Sora 2.0": 76,
    "Wan 2.2": 78,
    HunyuanVideo: 77,
  },
  {
    name: "FVD Efficiency",
    "STORYMATRIX-4D": 100,
    "Open-Sora 2.0": 0,
    "Wan 2.2": 47,
    HunyuanVideo: 69,
  },
];

const COLORS = {
  "STORYMATRIX-4D": "#9D4EDD",
  "Open-Sora 2.0": "#4CC9F0",
  "Wan 2.2": "#F72585",
  HunyuanVideo: "#00F5FF",
};

const ablationRows = [
  {
    variant: "Baseline Wan 2.1",
    fvd: 380,
    ssim: 0.75,
    clipScore: 0.78,
    gain: "-",
  },
  {
    variant: "+ Sparse Temporal Attention",
    fvd: 374,
    ssim: 0.76,
    clipScore: 0.76,
    gain: "-1.6% FVD",
  },
  {
    variant: "+ RLFP",
    fvd: 364,
    ssim: 0.77,
    clipScore: 0.77,
    gain: "-4.2% FVD",
  },
  {
    variant: "+ STF",
    fvd: 355,
    ssim: 0.78,
    clipScore: 0.775,
    gain: "-6.6% FVD",
  },
  {
    variant: "+ Multi-view Character Sheets",
    fvd: 348,
    ssim: 0.79,
    clipScore: 0.8,
    gain: "-8.4% FVD",
  },
  {
    variant: "+ Full MARL System (Final)",
    fvd: 344,
    ssim: 0.81,
    clipScore: 0.83,
    gain: "-9.5% FVD",
  },
];

const progressiveRows = [
  { phase: "Baseline (Week 2)", fvd: 380, ssim: 0.75, maxLength: "~30 sec" },
  {
    phase: "+ STF + RLFP (Week 3)",
    fvd: 350,
    ssim: 0.78,
    maxLength: "~60 sec",
  },
  {
    phase: "Final (MARL + 4D LWM + CTFE)",
    fvd: 344,
    ssim: 0.81,
    maxLength: "4+ min",
  },
];

const humanEvalRows = [
  {
    model: "Wan 2.2",
    narrative: 3.1,
    character: 3.3,
    creative: 3.2,
  },
  {
    model: "HunyuanVideo",
    narrative: 3.4,
    character: 3.5,
    creative: 3.3,
  },
  {
    model: "STORYMATRIX-4D",
    narrative: 4.6,
    character: 4.5,
    creative: 4.7,
    badge: "Ours",
  },
];

export default function ComparisonSection() {
  const [activeModel, setActiveModel] = useState("STORYMATRIX-4D");
  const [chartType, setChartType] = useState("radar");

  const activeModelData =
    modelComparisons.find((m) => m.model === activeModel) ||
    modelComparisons[0];
  const activeModelLabel =
    activeModelData.badge === "Ours" ? "storymatrix" : activeModelData.model;

  return (
    <section
      id="compare"
      className="relative py-24 dark:bg-dark-800 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l dark:from-neon-blue/3 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-sm text-neon-cyan font-body mb-4">
            📈 Results and Graphs
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white text-gray-900 mb-4">
            STORYMATRIX-4D vs{" "}
            <span className="gradient-text">Benchmark Models</span>
          </h2>
          <p className="dark:text-white/50 text-gray-600 max-w-lg mx-auto font-body text-sm sm:text-base">
            Results updated from the final presentation: Table 4.1 benchmark
            comparison plus ablation and human-evaluation summaries.
          </p>
        </div>

        {/* Model tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {modelComparisons.map((model) => (
            <button
              key={model.model}
              onClick={() => setActiveModel(model.model)}
              className={`relative flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl font-body text-xs sm:text-sm transition-all duration-300 ${
                activeModel === model.model
                  ? "text-white"
                  : "dark:text-white/50 dark:border-white/10 dark:hover:text-white dark:hover:border-white/20 text-gray-600 border-gray-300 hover:text-gray-900 hover:border-gray-400"
              }`}
              style={
                activeModel === model.model
                  ? {
                      background: `${model.color}20`,
                      border: `1px solid ${model.color}60`,
                      boxShadow: `0 0 20px ${model.color}20`,
                    }
                  : {}
              }
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: model.color }}
              />
              {model.model}
              {model.badge && (
                <span
                  className="px-1.5 py-0.5 rounded text-xs font-mono"
                  style={{ background: `${model.color}30`, color: model.color }}
                >
                  {model.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Video Preview */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 dark:border-white/5 border-gray-200 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: activeModelData.color,
                    boxShadow: `0 0 8px ${activeModelData.color}`,
                  }}
                />
                <span className="font-display font-semibold dark:text-white text-gray-900">
                  {activeModelLabel}
                </span>
              </div>
              <div className="flex gap-2 text-xs font-mono dark:text-white/40 text-gray-600">
                <span>{activeModelData.resolution}</span>
                <span>·</span>
                <span>{activeModelData.fps}fps</span>
              </div>
            </div>
            <div className="relative video-container">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                src={
                  activeModelData.videoSrc ||
                  "/videos/final-demo-sample-audio-subtitle-storymatrix.mp4"
                }
              />
            </div>
            <div className="p-2 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {[
                {
                  label: "FVD (lower better)",
                  value: activeModelData.fvd,
                  color: activeModelData.color,
                },
                {
                  label: "TCI",
                  value: activeModelData.tci?.toFixed(2),
                  color: activeModelData.color,
                },
                {
                  label: "Max Length",
                  value: activeModelData.maxLength,
                  color: activeModelData.color,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="text-center p-2 sm:p-3 rounded-xl"
                  style={{
                    background: `${m.color}08`,
                    border: `1px solid ${m.color}20`,
                  }}
                >
                  <div
                    className="font-display font-bold text-base sm:text-lg"
                    style={{ color: m.color }}
                  >
                    {m.value}
                  </div>
                  <div className="dark:text-white/40 text-gray-600 text-xs font-body mt-1">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="glass-card rounded-2xl p-3 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-col sm:flex-row gap-3 sm:gap-0">
              <h3 className="font-display font-semibold dark:text-white text-gray-900 text-base sm:text-lg">
                Performance Analysis
              </h3>
              <div className="flex rounded-lg overflow-hidden dark:border-white/10 border-gray-300 border">
                {["radar", "bar"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 text-xs font-body transition-all ${
                      chartType === type
                        ? "bg-neon-purple/20 text-neon-purple"
                        : "dark:text-white/40 dark:hover:text-white text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {type === "radar" ? "🕸 Radar" : "📊 Bar"}
                  </button>
                ))}
              </div>
            </div>

            {chartType === "radar" ? (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                  />
                  {modelComparisons.map((model) => (
                    <Radar
                      key={model.model}
                      name={model.model}
                      dataKey={model.model}
                      stroke={model.color}
                      fill={model.color}
                      fillOpacity={activeModel === model.model ? 0.15 : 0.03}
                      strokeWidth={activeModel === model.model ? 2 : 1}
                      strokeOpacity={activeModel === model.model ? 1 : 0.3}
                    />
                  ))}
                  <Legend
                    wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans" }}
                    formatter={(value) => (
                      <span style={{ color: COLORS[value] }}>{value}</span>
                    )}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={barData}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#07030F",
                      border: "1px solid rgba(157,78,221,0.3)",
                      borderRadius: 8,
                      fontFamily: "DM Sans",
                    }}
                    labelStyle={{ color: "white" }}
                  />
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: COLORS[value] }}>{value}</span>
                    )}
                  />
                  {modelComparisons.map((model) => (
                    <Bar
                      key={model.model}
                      dataKey={model.model}
                      fill={model.color}
                      opacity={activeModel === model.model ? 1 : 0.3}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Comparison table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h3 className="font-display font-semibold dark:text-white text-gray-900">
              Table 4.1 Benchmark Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-xs dark:text-white/40 text-gray-600 uppercase tracking-wider font-body">
                    Metric
                  </th>
                  {modelComparisons.map((m) => (
                    <th
                      key={m.model}
                      className="px-6 py-3 text-xs uppercase tracking-wider font-body"
                      style={{ color: m.color }}
                    >
                      {m.model}{" "}
                      {m.badge && (
                        <span className="normal-case">({m.badge})</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Input", render: (m) => m.input },
                  { label: "Max Stable Length", render: (m) => m.maxLength },
                  { label: "Resolution", render: (m) => m.resolution },
                  { label: "FVD ↓", render: (m) => m.fvd },
                  { label: "SSIM ↑", render: (m) => m.ssim.toFixed(2) },
                  {
                    label: "CLIPScore ↑",
                    render: (m) => m.clipScore.toFixed(2),
                  },
                  {
                    label: "VBench Motion ↑",
                    render: (m) => `${m.vbenchMotion.toFixed(1)}%`,
                  },
                  { label: "TCI ↑", render: (m) => m.tci.toFixed(2) },
                ].map((row, rowIdx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${rowIdx % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                  >
                    <td className="px-6 py-4 dark:text-white/60 text-gray-700 text-sm font-body">
                      {row.label}
                    </td>
                    {modelComparisons.map((m) => {
                      const val = row.render(m);

                      return (
                        <td
                          key={m.model}
                          className="px-6 py-4 text-center font-mono text-sm"
                        >
                          <span className="dark:text-white/50 text-gray-700">
                            {val}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <h3 className="font-display font-semibold dark:text-white text-gray-900 mb-4">
              Others Part: Ablation (Table 4.2)
            </h3>
            <div className="space-y-3">
              {ablationRows.map((row, idx) => (
                <div
                  key={row.variant}
                  className="p-3 rounded-xl dark:bg-dark-700/60 bg-gray-100 border dark:border-white/5 border-gray-200"
                  style={{
                    borderColor:
                      idx === ablationRows.length - 1 ? "#9D4EDD66" : undefined,
                    boxShadow:
                      idx === ablationRows.length - 1
                        ? "0 0 20px rgba(157,78,221,0.15)"
                        : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-xs sm:text-sm font-body dark:text-white/70 text-gray-700">
                      {row.variant}
                    </p>
                    <span className="text-xs font-mono text-neon-cyan">
                      {row.gain}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg p-2 dark:bg-dark-800/70 bg-white">
                      <div className="text-xs dark:text-white/40 text-gray-600">
                        FVD
                      </div>
                      <div className="font-mono text-sm dark:text-white text-gray-900">
                        {row.fvd}
                      </div>
                    </div>
                    <div className="rounded-lg p-2 dark:bg-dark-800/70 bg-white">
                      <div className="text-xs dark:text-white/40 text-gray-600">
                        SSIM
                      </div>
                      <div className="font-mono text-sm dark:text-white text-gray-900">
                        {row.ssim.toFixed(2)}
                      </div>
                    </div>
                    <div className="rounded-lg p-2 dark:bg-dark-800/70 bg-white">
                      <div className="text-xs dark:text-white/40 text-gray-600">
                        CLIP
                      </div>
                      <div className="font-mono text-sm dark:text-white text-gray-900">
                        {row.clipScore.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h3 className="font-display font-semibold dark:text-white text-gray-900 mb-4">
                Progressive Development (Table 4.3)
              </h3>
              <div className="space-y-3">
                {progressiveRows.map((row, idx) => (
                  <div
                    key={row.phase}
                    className="p-3 rounded-xl dark:bg-dark-700/50 bg-gray-100 border dark:border-white/5 border-gray-200"
                  >
                    <div className="text-xs dark:text-white/50 text-gray-600 mb-1">
                      {row.phase}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
                      <div>
                        <div className="dark:text-white/30 text-gray-500">
                          FVD
                        </div>
                        <div className="font-mono dark:text-white text-gray-900">
                          {row.fvd}
                        </div>
                      </div>
                      <div>
                        <div className="dark:text-white/30 text-gray-500">
                          SSIM
                        </div>
                        <div className="font-mono dark:text-white text-gray-900">
                          {row.ssim.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="dark:text-white/30 text-gray-500">
                          Length
                        </div>
                        <div
                          className="font-mono"
                          style={{
                            color:
                              idx === progressiveRows.length - 1
                                ? "#9D4EDD"
                                : undefined,
                          }}
                        >
                          {row.maxLength}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h3 className="font-display font-semibold dark:text-white text-gray-900 mb-4">
                Human Evaluation (Table 4.4)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 dark:text-white/50 text-gray-600 font-body">
                        Model
                      </th>
                      <th className="py-2 dark:text-white/50 text-gray-600 font-body">
                        Narrative
                      </th>
                      <th className="py-2 dark:text-white/50 text-gray-600 font-body">
                        Character
                      </th>
                      <th className="py-2 dark:text-white/50 text-gray-600 font-body">
                        Creative
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {humanEvalRows.map((row) => (
                      <tr key={row.model} className="border-b border-white/5">
                        <td className="py-2 pr-2 dark:text-white/70 text-gray-700 font-body">
                          {row.model}{" "}
                          {row.badge && (
                            <span className="text-xs font-mono text-neon-purple">
                              ({row.badge})
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-center font-mono dark:text-white text-gray-900">
                          {row.narrative.toFixed(1)}
                        </td>
                        <td className="py-2 text-center font-mono dark:text-white text-gray-900">
                          {row.character.toFixed(1)}
                        </td>
                        <td className="py-2 text-center font-mono dark:text-white text-gray-900">
                          {row.creative.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
