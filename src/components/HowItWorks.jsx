import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { num: '01', title: 'Import Project', desc: 'Drag and drop any project folder. We auto-detect the frameworks and dependencies instantly.', image: '/screenshots/SR1.png' },
    { num: '02', title: 'Analyze', desc: 'See your entire dependency tree visualized. Spot vulnerabilities, size bloat, and outdated versions.', image: '/screenshots/SR3.png' },
    { num: '03', title: 'Manage', desc: 'Update, remove, or install new packages with a single click. No terminal commands required.', image: '/screenshots/SR2.png' }
  ]

  return (
    <section id="how-it-works" className="py-32 px-6 bg-[#09090b] relative z-10 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16 items-center">

          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
              From folder to <span className="text-purple-500">fully managed</span> in seconds.
            </h2>

            <div className="space-y-12 mt-12">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex gap-6 group cursor-pointer transition-opacity duration-300 ${activeStep === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  onMouseEnter={() => setActiveStep(idx)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <span className={`text-3xl font-black transition-colors duration-500 ${activeStep === idx ? 'text-transparent bg-clip-text bg-gradient-to-b from-purple-400 to-cyan-400' : 'text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent'}`}>
                      {step.num}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative w-full aspect-square md:aspect-[4/3] glass-card rounded-[40px] border border-white/10 p-2 shadow-2xl overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-cyan-900/20 opacity-50 z-0"></div>

              <div className="w-full h-full relative z-10 rounded-[32px] overflow-hidden bg-black/50 border border-white/5">
                <AnimatePresence>
                  <motion.img
                    key={activeStep}
                    src={steps[activeStep].image}
                    alt={steps[activeStep].title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    onError={(e) => {
                      // Fallback if image doesn't exist yet
                      e.target.style.display = 'none'
                      if (!e.target.parentElement.querySelector('.error-msg')) {
                        e.target.parentElement.insertAdjacentHTML('beforeend', `<div class="error-msg absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">Please place ${steps[activeStep].image} in the public folder</div>`)
                      }
                    }}
                  />
                </AnimatePresence>
              </div>

              <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] group-hover:bg-cyan-500/20 transition-colors duration-1000 z-0 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
