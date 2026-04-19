import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "STORYMATRIX - StoryMatrix Capstone Showcase",
  description:
    "STORYMATRIX is a multi-agent reinforcement learning framework for context-aware creative generation and editing of ultra-long videos.",
  keywords: [
    "AI",
    "Video Generation",
    "Multi-Agent RL",
    "StoryMatrix",
    "Long-Horizon Modeling",
  ],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-white dark:bg-dark-900 text-gray-900 dark:text-white antialiased overflow-x-hidden transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
