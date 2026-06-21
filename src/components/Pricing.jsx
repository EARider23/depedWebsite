import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Skull } from 'lucide-react'

// Helper to shuffle arrays
function shuffleArray(array) {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const initialCards = [
  { id: 'standard', type: 'free' },
  { id: 'extortion', type: 'free' },
  { id: 'pro', type: 'free' }
]

export default function Pricing() {
  const [cards, setCards] = useState(initialCards)
  // All cards start face down (flipped to the back side)
  const [flippedCards, setFlippedCards] = useState(initialCards.map(c => c.id))
  const [isShuffling, setIsShuffling] = useState(false)
  const [playCount, setPlayCount] = useState(0)
  const [showRageMessage, setShowRageMessage] = useState(false)

  const handleCardClick = async (clickedId) => {
    if (isShuffling || playCount >= 3) return

    // Only allow clicking face-down cards
    if (!flippedCards.includes(clickedId)) return

    setIsShuffling(true)
    const newPlayCount = playCount + 1
    setPlayCount(newPlayCount)

    // Select a DIFFERENT card to flip up (the troll)
    const otherCardIds = cards.map(c => c.id).filter(id => id !== clickedId)
    const trollCardId = otherCardIds[Math.floor(Math.random() * otherCardIds.length)]

    // 1. Flip the OTHER card face up
    setFlippedCards(prev => prev.filter(id => id !== trollCardId))

    // 2. Let the user read the card for 2 seconds
    await new Promise(r => setTimeout(r, 2000))

    // 3. If they've played 3 times, show the message and stop!
    if (newPlayCount >= 3) {
      setShowRageMessage(true)
      setIsShuffling(false)
      return // End game
    }

    // 4. Flip the card back down
    setFlippedCards(cards.map(c => c.id))

    // Wait for flip down animation to finish
    await new Promise(r => setTimeout(r, 600))

    // 5. Shuffle rapidly 5 times
    for (let i = 0; i < 5; i++) {
      setCards(prev => shuffleArray(prev))
      await new Promise(r => setTimeout(r, 350)) // match layout transition
    }

    setIsShuffling(false)
  }

  // Common card styling
  const freeCardClasses = "h-[450px] w-full bg-white/[0.02] border border-white/20 rounded-3xl p-8 flex flex-col relative cursor-default"

  return (
    <section id="pricing" className="py-32 px-6 bg-[#09090b] relative z-10 border-t border-white/5 overflow-hidden" style={{ perspective: '2000px' }}>

      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.1)_0%,transparent_70%)]"></div>
      </div>

      {/* Rage Message Dropdown (REMOVED) */}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Simple, transparent <span className="text-purple-500">pricing.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Pick a card, any card. See if you can find the expensive tier.
          </p>
        </div>

        {/* The Game Board or The Truth Message */}
        <AnimatePresence mode="wait">
          {showRageMessage ? (
            <motion.div
              key="truth-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center py-20"
            >
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Sorry to Have Fun with You
              </h3>

              <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mb-6">
                PEEAK is a <span className="text-white font-bold">100% free</span> tool built by an individual, for developers.
              </p>

              <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mt-12">
                We were just trying to rage-bait you.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="game-board"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center h-[450px]"
            >
              {cards.map((card) => {
                const isFlipped = flippedCards.includes(card.id)

                return (
                  <motion.div
                    key={card.id}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full h-[450px] cursor-pointer group"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    onClick={() => handleCardClick(card.id)}
                  >

                    {/* FRONT FACE (The Reveal) */}
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className={freeCardClasses}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
                          The Truth
                        </div>
                        <div className="mb-6 mt-2">
                          <h3 className="text-2xl font-black text-white mb-2">The PEEAK Way</h3>
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white">$0</span>
                            <span className="text-purple-400 font-bold">/ forever</span>
                          </div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                          <li className="flex items-center gap-3 text-gray-200 font-medium text-sm">
                            <div className="bg-purple-500/20 p-1 rounded-full shrink-0"><Check className="w-4 h-4 text-purple-400" /></div>
                            Manage infinite projects
                          </li>
                          <li className="flex items-center gap-3 text-gray-200 font-medium text-sm">
                            <div className="bg-purple-500/20 p-1 rounded-full shrink-0"><Check className="w-4 h-4 text-purple-400" /></div>
                            Full system auditing
                          </li>
                          <li className="flex items-center gap-3 text-gray-200 font-medium text-sm">
                            <div className="bg-purple-500/20 p-1 rounded-full shrink-0"><Check className="w-4 h-4 text-purple-400" /></div>
                            Local & Private
                          </li>
                          <li className="flex items-center gap-3 text-gray-200 font-medium text-sm">
                            <div className="bg-purple-500/20 p-1 rounded-full shrink-0"><Check className="w-4 h-4 text-purple-400" /></div>
                            No paywalls, no BS.
                          </li>
                        </ul>
                        <a href="#download" onClick={(e) => e.stopPropagation()} className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-center transition-colors block relative z-50">
                          Download Now
                        </a>
                      </div>
                    </div>

                    {/* BACK FACE (Professional SaaS Card Back) */}
                    <div
                      className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                      <div className="flex items-center gap-3 relative z-10 opacity-40">
                        <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        </div>
                        <span className="font-black text-xl text-white tracking-widest">PEEAK</span>
                      </div>
                    </div>

                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
