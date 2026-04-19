"use client";

import Navbar from "./components/Navbar";
import HeroSectionEnhanced from "./components/HeroSectionEnhanced";
import ShowcaseSection from "./components/ShowcaseSection";
import MethodologySection from "./components/MethodologySection";
import ComparisonSection from "./components/ComparisonSection";
import ResearchSection from "./components/ResearchSection";
import DevelopersSection from "./components/DevelopersSection";
import Footer from "./components/Footer";
import ProgressBar from "./components/ProgressBar";
import BackToTop from "./components/BackToTop";
import CursorAura from "./components/CursorAura";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CursorAura />
      <ProgressBar />
      <BackToTop />
      <Navbar />
      <HeroSectionEnhanced />
      <ShowcaseSection />
      <MethodologySection />
      <ComparisonSection />
      <ResearchSection />
      <DevelopersSection />
      <Footer />
    </main>
  );
}
