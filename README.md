# StoryMatrix - Capstone Showcase Frontend

StoryMatrix is a Next.js showcase site for an AI story-to-video concept. The app presents a full product narrative: hero demo, video gallery, methodology pipeline, model comparisons, research metrics, and team section.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- Recharts (comparison charts)
- Framer Motion
- Lucide React

## Features

- Interactive hero demo with typed story prompts and simulated generation progress
- Video showcase with search, filtering, sorting, likes, comments, bookmark, and share actions
- Modal player experience with scene-by-scene carousel and generated shot prompts
- Methodology section with six-step pipeline and expandable abstract
- Model comparison dashboard (StoryMatrix, WAN, LongCat, OpenSora) with radar/bar charts
- Research and metrics section with animated counters and benchmark cards
- Light/dark theme toggle powered by context + localStorage
- Back-to-top button, progress bar, cursor aura, and animated neon visual style

## Getting Started

### Prerequisites

- Node.js 18.17+ (or newer LTS)
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

Open http://localhost:3000

### Production Build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Build production bundle
- `npm run start` - Start production server

## Project Structure

```text
storymatrix-frontend/
|- app/
|  |- components/
|  |  |- Navbar.jsx
|  |  |- HeroSectionEnhanced.jsx
|  |  |- ShowcaseSection.jsx
|  |  |- MethodologySection.jsx
|  |  |- ComparisonSection.jsx
|  |  |- ResearchSection.jsx
|  |  |- DevelopersSection.jsx
|  |  |- Footer.jsx
|  |  |- ProgressBar.jsx
|  |  |- BackToTop.jsx
|  |  |- CursorAura.jsx
|  |  |- ThemeToggle.jsx
|  |- context/
|  |  |- ThemeContext.jsx
|  |- data.js
|  |- globals.css
|  |- layout.jsx
|  |- page.jsx
|- public/
|  |- videos/
|  |- team/
|- next.config.js
|- tailwind.config.js
|- package.json
```

## Main Page Composition

The homepage in `app/page.jsx` renders sections in this order:

1. CursorAura
2. ProgressBar
3. BackToTop
4. Navbar
5. HeroSectionEnhanced
6. ShowcaseSection
7. MethodologySection
8. ComparisonSection
9. ResearchSection
10. DevelopersSection
11. Footer

## Content Customization Guide

### 1. Update dataset content

Edit `app/data.js` to change:

- `categories` (filter options)
- `videos` (cards, metadata, tags, dates)
- `modelComparisons` (chart and model stats)
- `methodologySteps` (pipeline content)
- `metrics` (research summary values)

### 2. Replace video assets

- Local demo videos are stored in `public/videos`.
- Mapping from video id to local file is handled inside `getDemoVideoSource()` in `app/components/ShowcaseSection.jsx`.
- Comparison section uses YouTube embeds from `youtubeId` values in `app/data.js`.

### 3. Replace team placeholders

- Team cards are currently placeholder entries in `app/components/DevelopersSection.jsx`.
- Replace names, roles, bios, skills, and image paths.
- Add your images under `public/team` and update the `image` fields.

### 4. Theme and styling

- Theme logic is in `app/context/ThemeContext.jsx`.
- Global styles are in `app/globals.css`.
- Tailwind theme customization (colors, animations, fonts) is in `tailwind.config.js`.

## Notes

- `next.config.js` allows remote images from `img.youtube.com` and `picsum.photos`.
- Some links in the research section are placeholders (`#`) and should be replaced before final deployment.

## Repository

GitHub: https://github.com/Tonmoy221/StoryMatrix-CAPSTONE-SHOWCASE
# StoryMatrix-Frontend
