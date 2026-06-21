import React, { useState, useEffect } from 'react'
import { defaultConfig } from '../data/defaultConfig'

export default function Changelog() {
  const [changelog, setChangelog] = useState([])

  useEffect(() => {
    // Attempt to load from localStorage (admin might have updated it)
    const storedConfig = localStorage.getItem('peeak_site_config')
    if (storedConfig) {
      try {
        const parsed = JSON.parse(storedConfig)
        setChangelog(parsed.changelog || defaultConfig.changelog)
      } catch (e) {
        setChangelog(defaultConfig.changelog)
      }
    } else {
      setChangelog(defaultConfig.changelog)
    }
  }, [])

  const getTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'feature': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
      case 'fix': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
      case 'optimization': return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
    }
  }

  return (
    <section id="changelog" className="py-32 px-6 bg-[#09090b] relative z-10 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
            Constantly <span className="text-cyan-400">evolving.</span>
          </h2>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-0">
          {changelog.map((item, index) => (
            <div key={item.id || index} className="mb-12 ml-8 relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#09090b] border-2 border-purple-500 group-hover:bg-purple-500 transition-colors duration-300"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-white">v{item.version}</h3>
                <span className="text-gray-500 text-sm font-mono">{item.date}</span>
                {item.type && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                )}
              </div>
              
              <h4 className="text-lg text-gray-300 font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
