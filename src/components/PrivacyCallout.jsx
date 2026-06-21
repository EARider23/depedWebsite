import React from 'react'
import { motion } from 'framer-motion'
import { Shield, EyeOff, CloudOff, Code2 } from 'lucide-react'

export default function PrivacyCallout() {
  return (
    <section className="py-24 px-6 bg-[#09090b] relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass-card bg-black/40 border border-white/10 rounded-[32px] p-10 md:p-16 text-center overflow-hidden"
        >
          {/* Subtle gradient glow behind the card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 shadow-inner shadow-white/5">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Your code never leaves your machine.
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              PEEAK runs 100% locally. No telemetry, no analytics, no cloud sync. Your dependency data is yours alone. Always.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <EyeOff className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">Zero Analytics</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <CloudOff className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">No Cloud</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Code2 className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-300 font-medium">Open Source</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
