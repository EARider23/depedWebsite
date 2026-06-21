import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Is PEEAK really free?",
      answer: "Yes, 100%. PEEAK is completely free and open source under the MIT license. There are no paid tiers, no premium features, no subscriptions. Every feature you see is available to everyone, forever."
    },
    {
      question: "Does PEEAK send my data anywhere?",
      answer: "No. PEEAK runs entirely on your local machine. It never connects to any external server, never collects analytics, and never transmits your project data. Your code and packages stay completely private."
    },
    {
      question: "What package managers does PEEAK support?",
      answer: "PEEAK currently supports npm (Node.js), pip (Python), cargo (Rust), pub (Dart/Flutter), and Go modules. We auto-detect the package manager by scanning your project files like package.json, requirements.txt, Cargo.toml, pubspec.yaml, and go.mod."
    },
    {
      question: "How is PEEAK different from npm/yarn/pnpm?",
      answer: "PEEAK is not a replacement for your package manager — it's a visual layer on top of it. It still uses npm, pip, or cargo under the hood to install and manage packages. PEEAK just gives you a beautiful GUI to browse, search, update, and remove packages without memorizing terminal commands."
    },
    {
      question: "What are the system requirements?",
      answer: "PEEAK runs on macOS 11+ (including Apple Silicon), Windows 10/11 (64-bit), and Linux (Ubuntu 20.04+, Fedora 36+, Arch). It's built with Tauri so it's extremely lightweight — under 15MB installed and uses minimal RAM."
    },
    {
      question: "Is the VS Code extension available yet?",
      answer: "Not yet — the VS Code extension and AI/MCP server integration are currently in development. Join our Discord or follow us on GitHub to get notified when they launch."
    }
  ]

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-32 px-6 bg-[#09090b] border-t border-white/5 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Frequently Asked <span className="text-purple-500">Questions</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div 
                key={index}
                initial={false}
                animate={{ backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0)' }}
                className={`border ${isOpen ? 'border-purple-500/30' : 'border-white/10'} rounded-2xl overflow-hidden transition-colors`}
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className={`text-lg md:text-xl font-bold ${isOpen ? 'text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 ml-4 p-2 rounded-full transition-colors ${isOpen ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400'}`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="p-6 pt-0 text-base text-gray-400 leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
