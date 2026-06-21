import React, { useState, useEffect } from 'react'
import { LayoutGrid, Layers, Search, Cpu, HardDrive, PackageCheck, BarChart3, ShieldAlert, Folder, FileJson, CheckCircle2, TerminalSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FeatureCard from './FeatureCard'
import { getPackageIcon } from '../assets/icons/iconLinks.js'

export default function FeatureGrid() {
  const [typingText, setTypingText] = useState('');
  const searchTerms = ['framer-motion', 'react', 'tailwindcss', 'zod'];

  useEffect(() => {
    let currentTermIdx = 0;
    let currentCharIdx = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const currentTerm = searchTerms[currentTermIdx];

      if (isDeleting) {
        setTypingText(currentTerm.substring(0, currentCharIdx - 1));
        currentCharIdx--;
      } else {
        setTypingText(currentTerm.substring(0, currentCharIdx + 1));
        currentCharIdx++;
      }

      let typeSpeed = isDeleting ? 50 : 150;

      if (!isDeleting && currentCharIdx === currentTerm.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && currentCharIdx === 0) {
        isDeleting = false;
        currentTermIdx = (currentTermIdx + 1) % searchTerms.length;
        typeSpeed = 500; // Pause before typing new word
      }

      timeout = setTimeout(type, typeSpeed);
    };

    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const features = [
    {
      id: 'f-1',
      title: "Visual Package Browser",
      description: "Browse installed packages, read changelogs, and manage versions through a stunning interface instead of terminal walls of text. No more guessing what you installed.",
      icon: <LayoutGrid className="w-6 h-6" />,
      gridClass: "md:col-span-2 md:row-span-2",
      mockup: (
        <div className="flex flex-col h-full w-full opacity-90 pt-4 rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-2xl mt-4 relative">
          {/* Laser Scan Line */}
          <motion.div
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 3, ease: "linear", repeat: Infinity }}
            className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none z-20 border-b border-cyan-500/20"
          />

          <div className="h-12 border-b border-white/10 flex items-center px-4 mb-3 bg-white/[0.02]">
            <div className="w-full h-8 bg-white/5 rounded-md border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)] flex items-center px-3 relative overflow-hidden">
              <Search className="w-4 h-4 text-cyan-400 mr-2" />
              <div className="w-40 h-1.5 bg-gray-600 rounded-full overflow-hidden relative">
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-cyan-400/50"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 px-4 pb-4 relative flex-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b] z-10 pointer-events-none"></div>

            {/* Infinite Marquee Scroll */}
            <motion.div
              animate={{ y: [0, -120] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="flex flex-col gap-3"
            >
              {[
                { name: 'react', version: '18.2.0' },
                { name: 'tailwindcss', version: '3.4.1' },
                { name: 'framer-motion', version: '11.0.3' },
                { name: 'lucide-react', version: '0.344.0' },
                { name: 'axios', version: '1.6.7' },
                { name: 'zod', version: '3.22.4' },
                // Duplicate for seamless loop
                { name: 'react', version: '18.2.0' },
                { name: 'tailwindcss', version: '3.4.1' },
              ].map((pkg, i) => {
                const iconData = getPackageIcon(pkg.name);
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                    <motion.div
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%]"
                    />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-10 h-10 rounded-xl ${iconData.color ? iconData.color.replace('bg-', 'bg-').replace('-500', '-500/10') : 'bg-[#1a1a1c]'} border border-white/5 flex items-center justify-center shadow-inner overflow-hidden`}>
                        {iconData.image ? (
                          <img src={iconData.image} alt={pkg.name} className="w-6 h-6 object-contain" />
                        ) : (
                          <span className={`text-sm font-bold ${iconData.textColor}`}>{iconData.icon}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-sm font-bold text-gray-200">{pkg.name}</div>
                        <div className="text-xs text-gray-500 font-mono">v{pkg.version}</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 relative z-10">
                      Up to date
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      )
    },
    {
      id: 'f-2',
      title: "Size Analysis",
      description: "Instantly spot heavy packages bloating your project. Sorted from Tiny to Huge.",
      icon: <HardDrive className="w-6 h-6" />,
      gridClass: "md:col-span-1 md:row-span-1",
      mockup: (
        <div className="flex flex-col h-full w-full opacity-90 mt-4 border border-white/5 bg-black/20 rounded-xl p-4 overflow-hidden relative">
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] pointer-events-none"
          />
          <div className="flex justify-between items-end mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Size</span>
            <div className="flex items-baseline gap-1">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="w-1.5 h-1.5 rounded-full bg-red-500 mb-1 inline-block"
              />
              <span className="text-lg font-black text-white">184.2 MB</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex mb-4">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "50%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 3, ease: "easeOut" }}
              className="h-full bg-red-500 relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
            </motion.div>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "25%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 3, ease: "easeOut" }}
              className="h-full bg-yellow-500"
            />
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "25%" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 3, ease: "easeOut" }}
              className="h-full bg-emerald-500"
            />
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">puppeteer</span>
              <motion.span
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 10px rgba(239,68,68,0.5)", "0 0 0px rgba(239,68,68,0)"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
              >
                HUGE
              </motion.span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">lodash</span>
              <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">LARGE</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'f-3',
      title: "Smart Discovery",
      description: "Search multiple registries instantly from one unified search bar.",
      icon: <Search className="w-6 h-6" />,
      gridClass: "md:col-span-1 md:row-span-1",
      mockup: (
        <div className="flex flex-col h-full w-full opacity-90 mt-4 border border-white/5 bg-black/20 rounded-xl p-4 relative overflow-hidden">
          <div className="w-full h-8 bg-black/40 rounded border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center px-2 mb-3">
            <Search className="w-3 h-3 text-cyan-400 mr-2" />
            <span className="text-xs text-white font-mono">{typingText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-[2px] h-3 bg-cyan-400 ml-0.5"
            />
          </div>
          <div className="flex flex-col gap-2 relative z-10">
            {[
              { name: 'framer-motion', reg: 'npm', color: 'cyan' },
              { name: 'framer-api', reg: 'PyPI', color: 'purple' }
            ].map((res, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 + 1, repeat: Infinity, repeatDelay: 5 }}
                className="flex justify-between items-center bg-white/[0.03] border border-white/5 p-2 rounded"
              >
                <span className="text-xs font-semibold text-gray-200">{res.name}</span>
                <span className={`text-[10px] font-black text-${res.color}-400`}>{res.reg}</span>
              </motion.div>
            ))}
          </div>
          {/* Subtle gradient overlay to fade out bottom */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-20"></div>
        </div>
      )
    },
    {
      id: 'f-4',
      title: "Cross-Framework Magic",
      description: "Auto-detects npm, pip, pub, cargo, and go modules. It just works, instantly.",
      icon: <Layers className="w-6 h-6" />,
      gridClass: "md:col-span-2 md:row-span-1",
      mockup: (
        <div className="flex flex-row items-center h-full w-full opacity-90 mt-2 gap-8 border border-white/5 bg-black/20 rounded-xl p-6 overflow-hidden relative">
          <div className="flex flex-col gap-4 border-l-2 border-white/10 pl-6 relative flex-1">
            <motion.div
              animate={{ height: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-[-2px] top-0 w-[2px] bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            />
            {[
              { file: 'package.json', badge: 'npm detected', icon: <FileJson className="w-4 h-4 text-yellow-500" /> },
              { file: 'requirements.txt', badge: 'pip detected', icon: <TerminalSquare className="w-4 h-4 text-blue-500" /> },
              { file: 'Cargo.toml', badge: 'cargo detected', icon: <TerminalSquare className="w-4 h-4 text-orange-500" /> },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.3, repeat: Infinity, repeatDelay: 4 }}
                className="flex items-center justify-between relative group"
              >
                <div className="absolute -left-6 top-1/2 w-6 h-px bg-white/10"></div>
                <div className="flex items-center gap-3">
                  {f.icon}
                  <span className="text-sm text-gray-300 font-mono">{f.file}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{f.badge}</span>
              </motion.div>
            ))}
          </div>
          <div className="w-32 h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center relative shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-[1px] border-transparent border-t-cyan-500/50"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-cyan-500/10 rounded-full"
            />
            <Layers className="w-10 h-10 text-cyan-400 relative z-10" />
            <div className="absolute -right-2 top-0 text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded shadow-lg z-20">AUTO</div>
          </div>
        </div>
      )
    },
    {
      id: 'f-5',
      title: "System Scanners",
      description: "Audit globally installed packages across your OS.",
      icon: <Cpu className="w-6 h-6" />,
      gridClass: "md:col-span-1 md:row-span-1",
      mockup: (
        <div className="flex flex-col h-full w-full items-center justify-center relative opacity-90 mt-4 border border-white/5 bg-black/20 rounded-xl overflow-hidden min-h-[140px]">
          {/* Scrolling background logs */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
            <motion.div
              animate={{ y: [0, -200] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="flex flex-col gap-1 text-[8px] font-mono text-cyan-500 pl-2 pt-2 whitespace-nowrap"
            >
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i}>{`> scanning /usr/local/lib/pkg_${Math.random().toString(36).substr(2, 5)}...`}</div>
              ))}
            </motion.div>
          </div>

          {/* Radar Rings */}
          <div className="absolute w-32 h-32 border border-cyan-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-20 h-20 border border-cyan-500/40 rounded-full"></div>
          <div className="absolute w-10 h-10 bg-black border border-cyan-500/60 rounded-full flex items-center justify-center z-10 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>

          {/* Radar Scan Line */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute w-16 h-16 origin-bottom-right right-1/2 bottom-1/2 border-r-2 border-cyan-400 bg-gradient-to-br from-transparent to-cyan-500/30 rounded-tl-full"
          />

          <div className="absolute bottom-3 left-0 right-0 text-center z-20 bg-black/60 backdrop-blur-sm py-1">
            <p className="text-[10px] font-mono text-cyan-400">Scanning global modules...</p>
          </div>
        </div>
      )
    }
  ]

  return (
    <section id="features" className="py-32 px-6 bg-slate-50 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Everything you need. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Zero CLI config.</span>
          </h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl mx-auto">
            PEEAK replaces five different package managers with one unified, beautiful visual interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gridClass={feature.gridClass}
            >
              {feature.mockup}
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  )
}
