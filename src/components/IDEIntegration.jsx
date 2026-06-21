import React from 'react'
import { Terminal, Command, Code2, Bot } from 'lucide-react'

export default function IDEIntegration() {
  return (
    <section className="py-32 px-6 bg-slate-50 relative z-10 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Meets you where you <span className="text-purple-600">code.</span>
          </h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
            PEEAK integrates deeply with your existing IDE setup and AI workflows through DepEd.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 glass-card !bg-[#09090b] shadow-2xl p-10 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                VS Code Extension 
                <span className="text-[10px] uppercase tracking-widest bg-white/10 border border-white/20 px-2 py-1 rounded-md text-blue-300 font-black">Coming Soon</span>
              </h3>
            </div>
            
            <ul className="space-y-4 text-gray-400 mb-8">
              <li className="flex items-center gap-3"><Command className="w-4 h-4 text-gray-500" /> Open PEEAK directly from command palette</li>
              <li className="flex items-center gap-3"><Command className="w-4 h-4 text-gray-500" /> Auto-sync project paths on open</li>
              <li className="flex items-center gap-3"><Command className="w-4 h-4 text-gray-500" /> Run package scripts inline</li>
            </ul>

            <div className="w-full bg-[#1e1e1e] rounded-xl p-4 font-mono text-sm shadow-inner border border-white/5 relative group-hover:border-white/20 transition-colors">
              <div className="flex gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <p className="text-gray-300"><span className="text-cyan-400">❯</span> <span className="text-purple-400">pkg-gui</span> open</p>
              <p className="text-gray-500 mt-1">Launching PEEAK interface...</p>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
          </div>

          <div className="flex-1 glass-card !bg-[#09090b] shadow-2xl p-10 rounded-[32px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                AI / MCP Server
                <span className="text-[10px] uppercase tracking-widest bg-white/10 border border-white/20 px-2 py-1 rounded-md text-emerald-300 font-black">Coming Soon</span>
              </h3>
            </div>
            
            <ul className="space-y-4 text-gray-400 mb-8">
              <li className="flex items-center gap-3"><Terminal className="w-4 h-4 text-gray-500" /> Connect Claude, Cursor, or Windsurf</li>
              <li className="flex items-center gap-3"><Terminal className="w-4 h-4 text-gray-500" /> AI can analyze your entire dependency tree</li>
              <li className="flex items-center gap-3"><Terminal className="w-4 h-4 text-gray-500" /> Auto-resolve vulnerabilities with agents</li>
            </ul>

            <div className="w-full bg-[#1e1e1e] rounded-xl p-4 font-mono text-sm shadow-inner border border-white/5 relative group-hover:border-white/20 transition-colors">
              <p className="text-gray-300 mb-2">Claude: "I've analyzed your project using the PEEAK MCP."</p>
              <p className="text-emerald-400">Found 3 outdated packages.</p>
              <p className="text-emerald-400">Updating <code>lodash</code> to v4.17.21...</p>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  )
}
