import React, { useState, useEffect } from 'react'
import { Download, Monitor, Apple, Terminal as TerminalIcon } from 'lucide-react'
import { defaultConfig } from '../data/defaultConfig'
import { useOSDetection } from '../hooks/useOSDetection'

export default function DownloadCTA() {
  const os = useOSDetection()
  const [config, setConfig] = useState(defaultConfig)

  useEffect(() => {
    const storedConfig = localStorage.getItem('peeak_site_config')
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig))
      } catch (e) {
        // use default
      }
    }
  }, [])

  const getPrimaryDownloadLink = () => {
    if (os === 'macOS') return config.downloads.macOS
    if (os === 'Windows') return config.downloads.Windows
    if (os === 'Linux') return config.downloads.Linux
    return config.downloads.Windows // fallback
  }

  return (
    <section id="download" className="py-32 px-6 bg-[#09090b] relative z-10 overflow-hidden">
      {/* Background Aurora */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto glass-card rounded-[40px] p-12 md:p-20 text-center border border-purple-500/20 shadow-[0_0_100px_rgba(147,51,234,0.15)]">
        
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
          Ready to see clearly?
        </h2>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Join developers who are shipping faster by managing their packages visually. Free and open source.
        </p>

        <a 
          href={getPrimaryDownloadLink()}
          className="group inline-flex items-center justify-center gap-4 py-5 px-10 bg-white text-black rounded-2xl font-bold text-lg md:text-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-cyan-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-3">
            <Download className="w-6 h-6" />
            Download for {os !== 'unknown' ? os : 'Windows'}
          </span>
        </a>

        <div className="mt-8 text-sm text-gray-400 font-mono">
          Version {config.version} • Free forever
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mr-4">Other Platforms:</p>
          
          <a href={config.downloads.macOS} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Apple className="w-5 h-5" /> macOS
          </a>
          <a href={config.downloads.Windows} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Monitor className="w-5 h-5" /> Windows
          </a>
          <a href={config.downloads.Linux} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <TerminalIcon className="w-5 h-5" /> Linux
          </a>
        </div>

      </div>
    </section>
  )
}
