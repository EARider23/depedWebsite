import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MiniAudioPlayer from './MiniAudioPlayer'

export default function Navbar({ songs, isPlaying, playSong, pause, resume, addSong, deleteSong, currentSongIndex, setCurrentSongIndex, getAudioElement }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPlayerHovered, setIsPlayerHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6"
    >
      <nav
        className={`flex items-center justify-between !transition-all !duration-700 !ease-in-out overflow-hidden ${isScrolled
          ? 'glass-card px-6 py-3 rounded-full w-full max-w-4xl border border-white/10 bg-black/40'
          : 'w-full max-w-[1400px] px-8 py-2 border-transparent bg-transparent rounded-none'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center  shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <span className={`font-black tracking-tight text-lg transition-colors duration-700 ${isScrolled ? 'text-white' : 'text-slate-900 drop-shadow-sm'}`}>PEEAK</span>
        </div>

        <AnimatePresence>
          {!(isScrolled && isPlayerHovered) && (
            <motion.div 
              initial={{ opacity: 0, width: 0, gap: 0 }}
              animate={{ opacity: 1, width: 'auto', gap: '2rem' }}
              exit={{ opacity: 0, width: 0, gap: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className={`hidden md:flex items-center text-sm font-semibold overflow-hidden ${isScrolled ? 'text-gray-300' : 'text-slate-600'}`}
            >
              <a href="#features" className={`transition-colors whitespace-nowrap ${isScrolled ? 'hover:text-white' : 'hover:text-black'}`}>Features</a>
              <a href="#how-it-works" className={`transition-colors whitespace-nowrap ${isScrolled ? 'hover:text-white' : 'hover:text-black'}`}>How it works</a>
              <a href="#pricing" className={`transition-colors whitespace-nowrap ${isScrolled ? 'hover:text-white' : 'hover:text-black'}`}>Pricing</a>
              <a href="#changelog" className={`transition-colors whitespace-nowrap ${isScrolled ? 'hover:text-white' : 'hover:text-black'}`}>Changelog</a>
              <a href="#faq" className={`transition-colors whitespace-nowrap ${isScrolled ? 'hover:text-white' : 'hover:text-black'}`}>FAQ</a>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4">
          <MiniAudioPlayer 
            songs={songs}
            isPlaying={isPlaying}
            playSong={playSong}
            pause={pause}
            resume={resume}
            addSong={addSong}
            deleteSong={deleteSong}
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            isScrolled={isScrolled}
            onHoverChange={setIsPlayerHovered}
            getAudioElement={getAudioElement}
          />
          <a href="https://github.com/AceCentre/peeak" target="_blank" rel="noreferrer" className={`hidden md:flex transition-colors duration-700 ${isScrolled ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-black'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
          </a>
          <a href="#download" className={`px-5 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all ${isScrolled ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-black text-white'}`}>
            Download
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
