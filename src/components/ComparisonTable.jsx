import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, CheckCircle2, XCircle, LayoutGrid, Trash2, HardDrive, Search, Folder } from 'lucide-react'

// Import some icons for the "Old Way" and "PEEAK" visuals
import npmIcon from '../assets/icons/npm.png'
import pipIcon from '../assets/icons/pip.png'
import cargoIcon from '../assets/icons/cargo.png'
import pythonIcon from '../assets/icons/python.png'

const tabs = [
  {
    id: 'dashboard',
    title: 'See Everything in One Place',
    peeakText: 'A clear, beautiful dashboard to manage all your projects and tools.',
    oldText: 'Typing confusing commands into a blank screen for every single language.',
    peeakVisual: <DashboardVisual />,
    oldVisual: <TerminalVisual />
  },
  {
    id: 'batch',
    title: 'Update & Delete Fast',
    peeakText: 'Click a single button to update or remove many items at exactly the same time.',
    oldText: 'Typing out and running slow commands one by one, manually.',
    peeakVisual: <BatchVisual />,
    oldVisual: <ManualVisual />
  },
  {
    id: 'size',
    title: 'Find Heavy Files Instantly',
    peeakText: 'Automatically shows you exactly which files are slowing down your project and taking up space.',
    oldText: "You have to search online for third-party scripts just to figure out what's heavy.",
    peeakVisual: <SizeVisual />,
    oldVisual: <ThirdPartyVisual />
  },
  {
    id: 'clean',
    title: 'Clean Up Your Computer',
    peeakText: 'Easily scan your entire computer to find and delete old, hidden project files.',
    oldText: 'Junk files stay hidden in deep, forgotten folders forever, wasting space.',
    peeakVisual: <CleanVisual />,
    oldVisual: <HiddenVisual />
  }
]

// Visual Components
function DashboardVisual() {
  return (
    <div className="flex flex-col gap-2 h-full justify-center">
      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
        <LayoutGrid className="w-5 h-5 text-cyan-400" />
        <div className="h-2 w-24 bg-white/20 rounded-full"></div>
      </div>
      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
        <img src={npmIcon} className="w-5 h-5 object-contain" />
        <div className="h-2 w-16 bg-white/20 rounded-full"></div>
      </div>
      <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
        <img src={pythonIcon} className="w-5 h-5 object-contain" />
        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
      </div>
    </div>
  )
}

function TerminalVisual() {
  return (
    <div className="flex flex-col gap-1 h-full justify-center font-mono text-[10px] text-gray-500">
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>npm list -g --depth=0</span></div>
      <div>...</div>
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>pip freeze</span></div>
      <div>...</div>
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>cargo install --list</span></div>
      <div>...</div>
    </div>
  )
}

function BatchVisual() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="flex gap-2">
         <div className="w-4 h-4 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-cyan-400" /></div>
         <div className="w-4 h-4 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-cyan-400" /></div>
         <div className="w-4 h-4 rounded bg-cyan-500/20 border border-cyan-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-cyan-400" /></div>
      </div>
      <div className="bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-1">
        <Trash2 className="w-3 h-3" /> Delete All Selected
      </div>
    </div>
  )
}

function ManualVisual() {
  return (
    <div className="flex flex-col gap-1 h-full justify-center font-mono text-[10px] text-gray-500">
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>npm uninstall pkg-1</span></div>
      <div>removing...</div>
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>npm uninstall pkg-2</span></div>
      <div>removing...</div>
      <div className="flex items-center gap-2"><span className="text-emerald-500">$</span> <span>npm uninstall pkg-3</span></div>
      <div className="animate-pulse">_</div>
    </div>
  )
}

function SizeVisual() {
  return (
    <div className="flex flex-col h-full justify-center gap-3 w-full px-2">
      <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-red-500/30">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-gray-400" />
          <div className="h-2 w-16 bg-white/20 rounded-full hidden sm:block"></div>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">1.2 GB</span>
      </div>
      <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-yellow-500/30">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-gray-400" />
          <div className="h-2 w-12 bg-white/20 rounded-full hidden sm:block"></div>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded">840 MB</span>
      </div>
    </div>
  )
}

function ThirdPartyVisual() {
  return (
    <div className="flex flex-col gap-1 h-full justify-center font-mono text-[10px] text-gray-500 items-center text-center">
      <Search className="w-5 h-5 text-gray-600 mb-1" />
      <div>"how to find heavy packages"</div>
      <div className="text-blue-400 underline mt-1 px-2 line-clamp-1">StackOverflow: Use npkill...</div>
    </div>
  )
}

function CleanVisual() {
  return (
    <div className="flex items-center justify-center h-full relative">
      <div className="absolute inset-0 bg-cyan-500/10 animate-pulse rounded-full blur-xl"></div>
      <div className="relative bg-cyan-500/20 border border-cyan-500/50 p-3 rounded-full">
        <Search className="w-6 h-6 text-cyan-400 animate-[spin_3s_linear_infinite]" />
      </div>
      <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] px-2 py-1 rounded border border-emerald-500/30">Found 4 hidden</div>
    </div>
  )
}

function HiddenVisual() {
  return (
    <div className="flex flex-col gap-2 h-full justify-center items-center opacity-50">
      <div className="flex gap-2">
        <Folder className="w-5 h-5 text-gray-600" />
        <Folder className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex gap-2 mt-1">
        <Folder className="w-5 h-5 text-gray-600" />
        <Folder className="w-5 h-5 text-gray-600" />
        <Folder className="w-5 h-5 text-gray-600" />
      </div>
      <div className="text-[9px] text-gray-500 mt-1">Forgotten since 2022</div>
    </div>
  )
}


export default function ComparisonTable() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="py-24 px-6 bg-slate-50 relative z-10 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Why use <span className="text-purple-600">PEEAK?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Stop fighting with confusing terminal commands. PEEAK makes managing your projects visual, fast, and simple.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs Navigation */}
          <div className="flex flex-col gap-3 lg:w-1/3">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`text-left px-6 py-5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20 lg:scale-[1.02]' 
                      : 'bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-700 border border-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-purple-600 z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 font-bold text-lg">{tab.title}</div>
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="lg:w-2/3 bg-[#09090b] rounded-3xl p-1 shadow-2xl border border-slate-200/50">
            <div className="bg-black/40 w-full h-full rounded-[22px] border border-white/5 p-5 sm:p-8 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  
                  {/* The Side by Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full flex-1">
                    
                    {/* The Old Way */}
                    <div className="flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-center gap-2 bg-white/[0.01]">
                        <Terminal className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">The Old Way</span>
                      </div>
                      <div className="flex-1 p-5 sm:p-6 flex flex-col">
                        <div className="h-32 mb-6 bg-black/50 rounded-xl border border-white/5 overflow-hidden p-3 relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                          {tabs[activeTab].oldVisual}
                        </div>
                        <div className="mt-auto flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            {tabs[activeTab].oldText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PEEAK */}
                    <div className="flex flex-col bg-purple-900/10 border border-purple-500/20 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(147,51,234,0.1)]">
                      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-center gap-2 bg-purple-500/5 relative z-10">
                        <span className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                          With PEEAK
                        </span>
                      </div>
                      <div className="flex-1 p-5 sm:p-6 flex flex-col relative z-10">
                        <div className="h-32 mb-6 bg-black/40 rounded-xl border border-purple-500/30 overflow-hidden p-3 relative shadow-inner">
                          {tabs[activeTab].peeakVisual}
                        </div>
                        <div className="mt-auto flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-200 font-medium leading-relaxed">
                            {tabs[activeTab].peeakText}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
