import React from 'react'

export default function FeatureCard({ title, description, icon, gridClass = "", className = "", children }) {
  return (
    <div 
      className={`glass-card !bg-[#09090b] shadow-2xl shimmer-hover rounded-3xl p-8 flex flex-col relative overflow-hidden group border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] ${gridClass} ${className}`}
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shrink-0 bg-white/5 border border-white/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 group-hover:text-cyan-400 transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 shrink-0">{title}</h3>
        
        <p className="text-gray-400 font-medium leading-relaxed mb-6 shrink-0 text-sm md:text-base">
          {description}
        </p>
        
        {children && (
          <div className="flex-1 relative w-full flex flex-col">
            {children}
          </div>
        )}
      </div>
      
      {/* Decorative gradient orb */}
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-purple-600/5 blur-[80px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-700" />
    </div>
  )
}
