import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Code2, Lock, Monitor } from 'lucide-react'

export default function SocialProof() {
  const metrics = [
    { icon: <Heart className="w-4 h-4 text-white" />, text: "100% Free & Open Source" },
    { icon: <Code2 className="w-4 h-4 text-white" />, text: "Built with Tauri & React" },
    { icon: <Lock className="w-4 h-4 text-white" />, text: "Local & Private — No Data Sent" },
    { icon: <Monitor className="w-4 h-4 text-white" />, text: "macOS, Windows, Linux" }
  ]

  return (
    <section className="py-8 bg-[#09090b] border-t border-b border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm md:text-base text-gray-400 font-medium max-w-2xl mb-6"
        >
          The visual package manager for npm, pip, cargo, pub, and Go. Browse and manage your dependencies — no terminal required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex items-center gap-2 group">
              <div className="bg-white/10 p-1.5 rounded-md border border-white/10 group-hover:bg-white/20 transition-colors">
                {metric.icon}
              </div>
              <span className="text-sm text-gray-400 font-medium">
                {metric.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
