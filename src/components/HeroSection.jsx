import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useOSDetection } from '../hooks/useOSDetection'
import HalftoneHeroCanvas from './HalftoneHeroCanvas'

export default function HeroSection({ songs, currentSongIndex, getFrequencyData }) {
  const os = useOSDetection()

  const activeSong = songs ? songs[currentSongIndex] : null;
  const themeColor = activeSong?.dominantColor || null;

  const getDownloadText = () => {
    if (os === 'macOS') return 'Download for macOS'
    if (os === 'Windows') return 'Download for Windows'
    if (os === 'Linux') return 'Download for Linux'
    return 'Download PEEAK'
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] // easeOutExpo equivalent
      }
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 overflow-hidden bg-white text-black">
      {/* Halftone Canvas Background with Audio Reactivity and Video Integration */}
      <HalftoneHeroCanvas
        text1="Your Packages,"
        text2="Now Visualized"
        getFrequencyData={getFrequencyData}
        themeColor={themeColor}
        videoSrc="/Greengrass.mp4"
      />

      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">

        {/* Version Badge (Animated Gradient Text from Magic UI) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative mx-auto mb-6 flex cursor-pointer items-center justify-center rounded-full border border-purple-200/50 bg-white/50 px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-all duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] hover:bg-white/80"
          style={{ "--bg-size": "300%" }}
        >
          <span
            className="animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:var(--bg-size)_100%] p-[1px]"
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-300" />
          <span className="inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent text-sm font-medium tracking-wide">
            PEEAK v1.0 is here
          </span>
          <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </motion.div>

        {/* Screen Reader Headline */}
        <h1 className="sr-only">Your Packages, Now Visualized</h1>
        <div className="h-[300px] w-full flex-shrink-0" aria-hidden="true"></div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#download"
            className="group relative flex items-center justify-center gap-3 w-full sm:w-auto py-4 px-8 bg-black text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              {getDownloadText()}
            </span>
          </a>

          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-8 bg-white hover:bg-gray-50 text-black rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 border border-gray-200 shadow-sm"
          >
            See how it works
          </a>
        </motion.div>
      </div>
    </section>
  )
}
