/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VERSES as RAW_VERSES } from './data/verses';

const RAW_IMAGES = [
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1506744626753-dba37c25a1f1?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1470071131384-001b85755e96?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d4?auto=format&fit=crop&w=1920&q=80"
];

const CYCLE_INTERVAL_MS = 10000;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function App() {
  // Use useMemo to shuffle once per session
  const shuffledVerses = useMemo(() => shuffleArray(RAW_VERSES), []);
  const shuffledImages = useMemo(() => shuffleArray(RAW_IMAGES), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images for smooth transitions
  useEffect(() => {
    let loadedCount = 0;
    shuffledImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        // Start showing once a few images are ready to ensure initial transition is smooth
        if (loadedCount >= 1) {
          setImagesLoaded(true);
        }
      };
    });
  }, [shuffledImages]);

  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % shuffledVerses.length);
    }, CYCLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [imagesLoaded, shuffledVerses.length]);

  const currentVerse = shuffledVerses[currentIndex];
  // Cycle through shuffled images
  const currentImage = shuffledImages[currentIndex % shuffledImages.length];

  if (!imagesLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950 selection:bg-white/30 selection:text-white">
      {/* Background Images Crossfade */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentImage})` }}
        />
      </AnimatePresence>

      {/* Dark Gradient Overlay for Text Legibility */}
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

      {/* Foreground Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 h-full pointer-events-none text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVerse.reference}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="max-w-5xl flex flex-col items-center justify-center gap-6 md:gap-8"
          >
            <p className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white/95 leading-relaxed md:leading-normal drop-shadow-2xl">
              "{currentVerse.text}"
            </p>
            <div className="w-16 h-px bg-white/60 my-2 shadow-sm" />
            <p className="font-sans font-medium text-sm sm:text-base md:text-lg text-white/90 tracking-[0.25em] uppercase drop-shadow-lg">
              {currentVerse.reference}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
