import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { getBestIcon } from '../../../deped/src/assets/iconLinks.js';
import { getTechIcon } from '../../../deped/src/assets/iconLinks.js';

import { SmoothCursor } from './ui/smooth-cursor';
import { BorderBeam } from './ui/border-beam';
import { Ripple } from './ui/ripple';

export default function DashboardPreview() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const reactIcon = getBestIcon('react')?.image;
  const tsIcon = getBestIcon('typescript')?.image;
  const viteIcon = getBestIcon('vite')?.image;

  const tabs = [
    { id: 'dashboard', label: 'Intuitive Dashboard' },
    { id: 'delete', label: '1 - Click Delete Packages' },
    { id: 'install', label: 'Quick Install Packages & Update Easily' },
    { id: 'creation', label: 'Project Studio' }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isHoveringSection, setIsHoveringSection] = useState(false);
  const sectionRef = useRef(null);

  // Auto-cycle tabs every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = tabs.findIndex(tab => tab.id === prevTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activeTab]); // Passing activeTab as a dependency resets the 10s timer if the user manually clicks a tab

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const checkHover = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInside = lastX >= rect.left && lastX <= rect.right && lastY >= rect.top && lastY <= rect.bottom;
      setIsHoveringSection(isInside);
    };

    const handlePointerMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      checkHover();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', checkHover, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', checkHover);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#0a0a0a] overflow-hidden relative cursor-none [&_*]:!cursor-none"
    >
      <SmoothCursor isActive={isHoveringSection} />

      <Ripple />

      <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Immersive Dashboard Ever
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Interact with your dependencies. Switch tabs to explore the entire PEEAK feature set.
          </p>

          {/* Interactive Tab Bar */}
          <div className="flex justify-center relative z-20">
            <div className="bg-white/5 p-2 px-3 rounded-[1.25rem] flex gap-5 backdrop-blur-sm border border-white/10 shadow-sm">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50 scale-105'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex justify-center items-center py-12"
          style={{ perspective: "2500px" }}
        >
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full max-w-[1200px] rounded-[2.5rem] p-3"
          >
            {/* Main Card Background - moved here so neon glow can go behind it */}
            <div className="absolute inset-0 bg-white rounded-[2.5rem] shadow-[0_45px_100px_-20px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 backdrop-blur-xl -z-10" />

            <BorderBeam size={300} duration={10} colorFrom="#a855f7" colorTo="#06b6d4" borderWidth={2} />

            <div className="bg-[#f4f5f8] rounded-[2rem] p-8 pt-16 border border-slate-100 shadow-inner w-full min-h-[500px] relative overflow-hidden" style={{ transformStyle: "preserve-3d" }}>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {activeTab === 'dashboard' && <DashboardTab reactIcon={reactIcon} tsIcon={tsIcon} viteIcon={viteIcon} />}
                  {activeTab === 'delete' && <DeleteTab />}
                  {activeTab === 'install' && <InstallTab />}
                  {activeTab === 'creation' && <CreationTab />}
                </motion.div>
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* =========================================
   TAB 1: INTUITIVE DASHBOARD (Original Layout)
   ========================================= */
function DashboardTab({ reactIcon, tsIcon, viteIcon }) {
  return (
    <div className="flex flex-col relative w-full h-full p-8" style={{ transformStyle: "preserve-3d" }}>
      {/* Dashboard Header Mockup */}
      <div style={{ transform: "translateZ(20px)" }} className="flex items-center justify-between mb-8 relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center">
            Project <span className="text-[#8b5cf6] ml-2">Details</span>
          </h2>
        </div>
        <div className="h-10 px-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2 text-slate-700 font-black hover:bg-slate-50 cursor-pointer transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span className="text-xs uppercase tracking-widest">Sync</span>
        </div>
      </div>

      {/* Top Area: Main Grid */}
      <div className="grid grid-cols-12 gap-6 relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Left Tall Card - Branding (Pops out cleanly) */}
        <div style={{ transform: "translateZ(80px)", transformStyle: "preserve-3d" }} className="col-span-4 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-col items-center relative group h-[460px] z-40">
          {/* Action Icons */}
          <div className="w-full flex justify-between absolute top-6 px-6">
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
            </div>
          </div>
          {/* Logo Area */}
          <div className="flex-1 flex flex-col items-center justify-center w-full mt-8">
            <div className="w-32 h-32 rounded-[2rem] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-slate-50 flex items-center justify-center mb-8 relative z-10"><div className="text-indigo-500"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></div></div>
            <h3 className="text-[26px] font-black text-slate-900 mb-8 tracking-tighter text-center">my-awesome-app</h3>
            <div className="flex -space-x-3 items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-50 relative z-10 p-2">{reactIcon ? <img src={reactIcon} alt="React" className="w-full h-full object-contain" /> : <div className="w-6 h-6 rounded-full bg-blue-400" />}</div>
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-50 relative z-20 p-2">{tsIcon ? <img src={tsIcon} alt="TS" className="w-full h-full object-contain" /> : <div className="w-6 h-6 rounded bg-blue-600" />}</div>
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-50 relative z-30 p-2">{viteIcon ? <img src={viteIcon} alt="Vite" className="w-full h-full object-contain" /> : <div className="w-6 h-6 rounded bg-purple-500 transform rotate-45" />}</div>
            </div>
          </div>
        </div>


        {/* Right Area: Grid of cards */}
        <div className="col-span-8 flex flex-col gap-6 relative h-[460px]" style={{ transformStyle: "preserve-3d" }}>

          <div className="grid grid-cols-12 gap-6 h-[140px]" style={{ transformStyle: "preserve-3d" }}>
            <div style={{ transform: "translateZ(10px)" }} className="col-span-3 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative border-l-[2px] border-l-indigo-500/30 z-10">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                </div>
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Packages</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-indigo-600 tracking-tighter leading-none">149</span>
              </div>
            </div>

            <div style={{ transform: "translateZ(10px)" }} className="col-span-3 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative border-l-[2px] border-l-blue-500/30 z-10">
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Updates</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-amber-600 tracking-tighter leading-none">3</span>
              </div>
            </div>

            <div style={{ transform: "translateZ(80px)" }} className="col-span-6 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-[0_30px_60px_rgba(16,185,129,0.15)] flex flex-col justify-between relative z-50 overflow-hidden">
              <div className="absolute top-5 right-5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Security Analysis</span>
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter leading-none text-emerald-600">Project Secure</span>
                  <div className="flex gap-2 mt-3">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-lg">Verified Clean</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 h-[140px]" style={{ transformStyle: "preserve-3d" }}>
            <div style={{ transform: "translateZ(10px)" }} className="col-span-4 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col justify-between relative border-l-[2px] border-l-slate-300/50 z-10">
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                </div>
                <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Disk Usage</span>
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none">104.54 MB</span>
              </div>
            </div>

            <div style={{ transform: "translateZ(10px)" }} className="col-span-8 bg-indigo-50/60 rounded-[2rem] p-5 border border-indigo-100 shadow-[inset_0_2px_8px_rgba(99,102,241,0.08)] flex flex-col justify-between z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-black uppercase text-[9px] tracking-widest">Node Modules</span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 font-black text-[9px] rounded-lg px-2.5 py-1 shadow-sm uppercase tracking-widest">Isolated</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active shielding</span>
              </div>
              <div className="flex items-center gap-4 p-2 bg-white rounded-2xl border border-indigo-100 shadow-sm mb-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
                <span className="text-xs font-mono font-medium text-slate-600 truncate flex-1 tracking-tight">D:\my-awesome-app</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div style={{ transform: "translateZ(10px)" }} className="col-span-12 bg-white rounded-[2rem] p-5 border border-slate-200 shadow-sm flex flex-col h-[132px] z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <span className="text-slate-900 font-black uppercase text-[10px] tracking-[0.1em]">Project Scripts</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {['BUILD', 'DEV', 'LINT', 'PREVIEW'].map(script => (
                <div key={script} className="h-8 px-3 rounded-xl border border-slate-200 bg-slate-50 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-sm text-slate-700">
                  <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <svg className="w-2 h-2 text-indigo-600 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                  {script}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Storage Consumed Package Line & Bentos */}
      <div className="mt-12 w-full relative z-10" style={{ transformStyle: "preserve-3d" }}>
        <motion.div style={{ transform: "translateZ(40px)" }} className="flex items-center justify-between relative mb-8">
          <div className="text-center absolute left-8 -top-3"><div className="flex items-center gap-1 text-slate-500 font-black text-[9px] uppercase tracking-widest justify-center"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>High Usage</div><div className="text-slate-400 text-[8px] font-bold mt-1 uppercase tracking-widest">Max Storage</div></div>
          <div className="flex-1 h-[1px] bg-slate-200 mx-32"></div>
          <div className="absolute left-1/2 -translate-x-1/2 -top-4 bg-white border border-slate-200 px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm"><div className="text-indigo-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11l-7 4-7-4m14-3l-7 4-7-4m14 6l-7 4-7-4M3 8l7 4 7-4-7-4-7 4z" /></svg></div><span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Storage Consumed Package</span></div>
          <div className="text-center absolute right-8 -top-3"><div className="flex items-center gap-1 text-slate-500 font-black text-[9px] uppercase tracking-widest justify-center">Low Usage<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg></div><div className="text-slate-400 text-[8px] font-bold mt-1 uppercase tracking-widest">Min Storage</div></div>
        </motion.div>

        <div className="flex items-end justify-between gap-4 px-6 h-32" style={{ transformStyle: "preserve-3d" }}>
          {[{ num: '01', icon: 'TS', z: '50px' }, { num: '02', icon: 'Box', z: '60px' }, { num: '03', icon: 'Box', z: '70px' }, { num: '04', icon: 'Box', z: '80px' }, { num: '05', icon: 'Diamond', z: '90px' }].map((item, i) => (
            <div key={i} style={{ transform: `translateZ(${item.z})` }} className="flex-1 bg-[#fcfcfd] rounded-t-[2rem] border border-slate-200 border-b-0 h-28 relative overflow-hidden flex items-end justify-between p-6 group hover:h-32 transition-all duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-10">
              <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 shadow-sm relative z-10 group-hover:-translate-y-2 transition-transform">
                {item.icon === 'TS' ? <span className="font-bold text-xs">TS</span> : item.icon === 'Box' ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
              </div>
              <span className="text-6xl font-black italic text-slate-300/40 leading-none tracking-tighter select-none">{item.num}</span>
            </div>
          ))}
        </div>
      </div>
    </div >
  )
}

/* =========================================
   TAB 2: 1-CLICK DELETE PACKAGES MOCK
   ========================================= */
function DeleteTab() {
  const initialPackages = [
    { name: '@eslint/js', version: '10.0.1', size: '15.32 KB' },
    { name: '@types/node', version: '24.13.2', size: '2.43 MB', hasUpdate: true, latest: '26.0.0' },
    { name: '@types/react', version: '19.2.17', size: '398.1 KB' },
    { name: 'eslint', version: '10.5.0', size: '2.77 MB' },
  ];

  const [packages, setPackages] = useState(initialPackages);
  const [selected, setSelected] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 300, visible: false, click: false });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runAnimation = async () => {
      while (isMounted) {
        setPackages(initialPackages);
        setSelected([]);
        setIsUpdating(false);
        setCursorPos({ x: 400, y: 300, visible: true, click: false });
        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;

        // Move to @types/node checkbox (card 2)
        setCursorPos({ x: 320, y: 155, visible: true, click: false });
        await new Promise(r => setTimeout(r, 600));
        if (!isMounted) break;

        // Click
        setCursorPos(p => ({ ...p, click: true }));
        await new Promise(r => setTimeout(r, 150));
        if (!isMounted) break;
        setSelected(['@types/node']);
        setCursorPos(p => ({ ...p, click: false }));

        await new Promise(r => setTimeout(r, 400));
        if (!isMounted) break;

        // Move to @types/react checkbox (card 3)
        setCursorPos({ x: 570, y: 155, visible: true, click: false });
        await new Promise(r => setTimeout(r, 600));
        if (!isMounted) break;

        // Click
        setCursorPos(p => ({ ...p, click: true }));
        await new Promise(r => setTimeout(r, 150));
        if (!isMounted) break;
        setSelected(['@types/node', '@types/react']);
        setCursorPos(p => ({ ...p, click: false }));

        await new Promise(r => setTimeout(r, 800));
        if (!isMounted) break;

        // Move to DELETE SELECTED button in top bar
        setCursorPos({ x: 800, y: 45, visible: true, click: false });
        await new Promise(r => setTimeout(r, 800));
        if (!isMounted) break;

        // Click Delete
        setCursorPos(p => ({ ...p, click: true }));
        await new Promise(r => setTimeout(r, 150));
        if (!isMounted) break;

        setPackages(prev => prev.filter(p => !['@types/node', '@types/react'].includes(p.name)));
        setSelected([]);
        setCursorPos(p => ({ ...p, click: false }));

        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;

        // Move to UPDATE ALL button in top bar
        setCursorPos({ x: 550, y: 45, visible: true, click: false });
        await new Promise(r => setTimeout(r, 600));
        if (!isMounted) break;

        // Click Update
        setCursorPos(p => ({ ...p, click: true }));
        await new Promise(r => setTimeout(r, 150));
        if (!isMounted) break;
        setCursorPos(p => ({ ...p, click: false }));
        setIsUpdating(true);

        await new Promise(r => setTimeout(r, 2000));
        if (!isMounted) break;

        setCursorPos(p => ({ ...p, visible: false }));
        await new Promise(r => setTimeout(r, 2000));
      }
    };
    runAnimation();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-6 relative overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner" style={{ transformStyle: "preserve-3d" }}>

      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6" style={{ transform: "translateZ(20px)" }}>
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-center px-4 h-12 shadow-sm">
          <svg className="w-4 h-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="text-slate-400 text-sm font-medium">Filter dependencies...</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm h-12">
          <div className="px-4 text-xs font-bold text-indigo-600 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            NAME
          </div>
          <div className="px-4 text-xs font-bold text-slate-400">SIZE</div>
        </div>

        <div className="bg-indigo-600 text-white px-6 h-12 rounded-2xl flex items-center justify-center text-xs font-bold gap-2 shadow-lg">
          <svg className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          UPDATE ALL
        </div>

        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9, width: 0 }} animate={{ opacity: 1, scale: 1, width: 'auto' }} exit={{ opacity: 0, scale: 0.9, width: 0 }} className="flex items-center gap-4 overflow-hidden">
              <div className="border border-indigo-200 text-indigo-600 bg-indigo-50 px-6 h-12 rounded-2xl flex items-center justify-center text-xs font-bold gap-2 whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                UPDATE SELECTED ({selected.length})
              </div>
              <div className="border border-rose-200 text-rose-600 bg-rose-50 px-6 h-12 rounded-2xl flex items-center justify-center text-xs font-bold gap-2 whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                DELETE SELECTED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm h-12 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg></div>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg></div>
        </div>
      </div>

      {/* Package List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 flex-1 relative z-10 content-start" style={{ transformStyle: "preserve-3d" }}>
        <AnimatePresence>
          {packages.map((pkg, i) => {
            const isSelected = selected.includes(pkg.name);
            const iconInfo = getTechIcon(pkg.name);
            return (
              <motion.div
                key={pkg.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ translateZ: 100 + i * 10, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                style={{ transform: `translateZ(${10 + i * 10}px)`, transformStyle: "preserve-3d" }}
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 bg-white shadow-sm z-10 ${pkg.hasUpdate ? 'border-amber-400 shadow-[0_8px_30px_rgb(251,191,36,0.15)] bg-amber-50/10' : isSelected ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'}`}
              >
                {pkg.hasUpdate && (
                  <div className="absolute -top-3 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-200 z-10">
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  </div>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                      {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                  <div className="p-1.5 text-slate-400 bg-slate-50 border border-slate-100 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl border-2 bg-white flex items-center justify-center p-3 shadow-sm ${pkg.hasUpdate ? 'border-amber-300' : 'border-slate-100'}`}>
                    {iconInfo.image ? (
                      <img src={iconInfo.image} className="w-full h-full object-contain" alt={pkg.name} />
                    ) : (
                      <span className={`font-black ${iconInfo.textColor}`}>{iconInfo.icon}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-[16px] text-slate-900 truncate leading-tight mb-1">{pkg.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold font-mono text-slate-700 bg-slate-100 px-1.5 rounded">v{pkg.version}</span>
                      {pkg.hasUpdate && (
                        <span className="text-[10px] font-bold font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 uppercase">
                          ↑ v{pkg.latest}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
                        <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">NPM</span>
                      </div>
                      <span className="text-[12px] font-bold font-mono text-slate-900">{pkg.size}</span>
                    </div>
                    {pkg.hasUpdate && (
                      <div className="bg-amber-400 text-black px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        UPDATE
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 w-full text-left">
                    <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                    <span className="text-[10px] font-mono text-slate-400 truncate tracking-tight">D:\my-awesome-app\node_modules\{pkg.name}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Mock Cursor */}
      <AnimatePresence>
        {cursorPos.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ x: cursorPos.x, y: cursorPos.y, opacity: 1, scale: cursorPos.click ? 0.8 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.5 }}
            className="absolute top-0 left-0 z-50 pointer-events-none"
            style={{ transform: "translateZ(100px)" }}
          >
            {/* The cursor SVG with a drop shadow */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="text-slate-900 fill-white drop-shadow-xl" style={{ filter: 'drop-shadow(0px 10px 8px rgba(0,0,0,0.3))' }}>
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            {cursorPos.click && (
              <motion.div
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute top-0 left-0 w-8 h-8 rounded-full bg-indigo-500/40 -z-10"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* =========================================
   TAB 3: QUICK INSTALL
   ========================================= */
function InstallTab() {
  const [text, setText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const runAnimation = async () => {
      while (isMounted) {
        // Reset state
        setText('');
        setShowResults(false);
        setIsSearching(false);
        await new Promise(r => setTimeout(r, 1000));
        if (!isMounted) break;

        // Type word
        const word = "time";
        for (let i = 1; i <= word.length; i++) {
          setText(word.slice(0, i));
          await new Promise(r => setTimeout(r, 150));
          if (!isMounted) break;
        }

        await new Promise(r => setTimeout(r, 600));
        if (!isMounted) break;

        // Simulate click & search
        setIsSearching(true);
        await new Promise(r => setTimeout(r, 800));
        if (!isMounted) break;

        // Show results
        setIsSearching(false);
        setShowResults(true);

        // Wait before looping
        await new Promise(r => setTimeout(r, 5000));
      }
    };

    runAnimation();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-6 relative overflow-hidden bg-slate-50/50 rounded-[2rem] border border-slate-100 shadow-inner" style={{ transformStyle: "preserve-3d" }}>

      {/* Dashboard Header Mockup */}
      <div style={{ transform: "translateZ(20px)" }} className="flex items-center justify-between mb-6 relative z-20">

      </div>

      <div className="flex flex-col xl:flex-row items-stretch justify-center gap-6 flex-1 relative z-10" style={{ transformStyle: "preserve-3d" }}>
        {/* Left Card: Quick Install */}
        <motion.div whileHover={{ translateZ: 80, scale: 1.02 }} style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }} className="bg-white flex-[2] rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:border-indigo-300 transition-all duration-300 border-l-[3px] border-l-indigo-500/50 hover:border-l-indigo-500 z-10">

          {/* Top Header Section */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Quick Install</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">1 - Click Install Packages</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-md ml-8">
              {/* Search Input */}
              <div className={`flex-1 h-10 rounded-xl ${isSearching ? 'border-indigo-400 bg-white' : 'border-slate-200 bg-slate-50'} border flex items-center px-4 shadow-inner transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="flex-1 flex items-center overflow-hidden">
                  <span className={`font-bold text-sm ${text.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                    {text || 'Search packages...'}
                  </span>
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className={`w-0.5 h-4 bg-slate-700 ml-[1px] ${showResults && text.length > 0 ? 'hidden' : 'block'}`}
                  />
                </div>
              </div>

              {/* Buttons */}
              <motion.button
                animate={isSearching ? { scale: 0.95, backgroundColor: "#64748b" } : { scale: 1, backgroundColor: "#4f46e5" }}
                className="h-10 px-5 rounded-xl text-white font-black uppercase tracking-widest text-[10px] shadow-sm transition-colors"
              >
                {isSearching ? 'Searching' : 'Search'}
              </motion.button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1 p-5 flex flex-col gap-3 overflow-hidden relative" style={{ transformStyle: "preserve-3d" }}>
            <AnimatePresence>
              {showResults && [
                {
                  name: 'time',
                  desc: '"time.h" bindings for Node.js',
                  ver: 'v0.12.0',
                  z: '50px'
                },
                {
                  name: 'd3-time',
                  desc: 'A calculator for humanity’s peculiar conventions of time.',
                  ver: 'v3.1.0',
                  z: '60px'
                }
              ].map((pkg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ translateZ: parseInt(pkg.z) + 40, scale: 1.03 }}
                  transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
                  style={{ transform: `translateZ(${pkg.z})` }}
                  className="bg-white rounded-[1rem] p-3.5 flex items-center justify-between group hover:bg-indigo-50/50 transition-all duration-300 border-2 border-slate-100 hover:border-indigo-300 cursor-pointer shadow-sm z-20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 shadow-inner flex items-center justify-center p-2 shrink-0 group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 780 250" className="w-full h-full"><path fill="#231F20" d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"></path></svg>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[15px] font-black text-slate-900 leading-none">{pkg.name}</h4>
                        <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                          {pkg.ver}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 truncate max-w-xs">{pkg.desc}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-indigo-200">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Card: Update Packages */}
        <motion.div whileHover={{ translateZ: 100, scale: 1.03 }} style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="bg-white flex-[1] rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group hover:border-rose-300 transition-all duration-300 border-r-[3px] border-r-rose-500/50 hover:border-r-rose-500 z-10">

          {/* Top Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Update Packages</h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Monitor & Update</span>
              </div>
            </div>
          </div>

          {/* Body Space */}
          <div className="flex-1 p-5 flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-white to-slate-50">

            <div className="w-full max-w-[240px] bg-white rounded-xl p-4 flex items-center justify-between border-2 border-slate-100 shadow-sm transition-transform hover:scale-105 hover:border-rose-200">
              <span className="text-slate-800 font-black text-[13px] whitespace-nowrap">Auto Update</span>
              <div className="w-10 h-5 bg-rose-400 rounded-full flex items-center px-0.5 shadow-inner cursor-pointer relative overflow-hidden transition-colors">
                <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute right-0.5"></div>
              </div>
            </div>

            <button className="w-full max-w-[240px] bg-rose-50 border-2 border-rose-200 rounded-xl px-4 py-3.5 flex items-center justify-center gap-2 hover:bg-rose-100 transition-all shadow-sm hover:shadow-md text-rose-600 group hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-black uppercase tracking-widest text-[11px] whitespace-nowrap">Check Updates</span>
            </button>

          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* =========================================
   TAB 4: PROJECT CREATION STUDIO
   ========================================= */
function CreationTab() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4" style={{ transformStyle: "preserve-3d" }}>
      <motion.div whileHover={{ translateZ: 90 }} transition={{ duration: 0.4 }} style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }} className="bg-[#0e0e11] text-gray-200 w-full max-w-[1250px] h-[550px] rounded-[2rem] border border-[#27272a] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-sans selection:bg-[#2b2b36] selection:text-white relative -mt-12 transition-all duration-300">

        {/* Topbar */}
        <div className="h-14 border-b border-[#27272a] bg-[#0e0e11] flex items-center justify-between px-4 z-50 shrink-0 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white rounded-md px-2 h-8 flex items-center text-sm transition-colors cursor-pointer">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Dashboard
            </button>
            <div className="h-4 w-px bg-gray-700" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
              <span className="font-semibold text-gray-100 text-sm tracking-wide">Project Studio</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* SIDEBAR */}
          <div className="w-56 border-r border-white/5 bg-[#0e0e11]/60 backdrop-blur-xl shrink-0 flex flex-col h-full shadow-[5px_0_30px_rgba(0,0,0,0.2)]">
            <div className="p-4 pb-2">
              <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Templates</h2>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Start a new workspace from templates or build your own.
              </p>
            </div>

            <div className="px-3 pb-2">
              <div className="w-full text-left p-2.5 rounded-lg flex items-center gap-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 group cursor-pointer hover:from-indigo-500/20 hover:to-purple-500/20 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
                <div className="w-7 h-7 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <svg className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" /></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-indigo-100">Custom Stack</span>
                  <span className="text-[9px] text-indigo-300/70">Build from scratch wizard</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#27272a] to-transparent mx-4 my-1" />

            <div className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
              <div className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium bg-white/10 text-white shadow-sm border border-white/5 cursor-pointer">
                Web
                <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
              {['Backend', 'Mobile', 'AI & ML', 'Databases', 'Misc', 'Education', 'Management'].map(cat => (
                <div key={cat} className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 cursor-pointer transition-colors">
                  {cat}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#0e0e11]">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Featured Web templates</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'nextjs', name: 'NextJS', desc: 'Vibe code a new full-stack NextJS app with server-side rendering' },
                { id: 'react', name: 'React + Vite', desc: 'Vibe code a new React app in TypeScript or Javascript, built with Vite' },
                { id: 'vue', name: 'Vue.js', desc: 'Create a new Vue.js template with TS or JS and Vite' },
                { id: 'svelte', name: 'Svelte', desc: 'Create a new Svelte app in TypeScript or JavaScript, built with Vite' },
              ].map((tpl, i) => {
                const iconInfo = getTechIcon(tpl.id);
                return (
                  <motion.div key={tpl.id} whileHover={{ translateZ: 40, scale: 1.05 }} transition={{ duration: 0.2 }} className="bg-[#141417]/80 backdrop-blur-md border border-white/5 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 hover:bg-[#1a1a1f]/90 transition-all duration-300 group shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] z-10 relative">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-black/50 border border-[#27272a] flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                        {iconInfo.image ? (
                          <img src={iconInfo.image} alt={iconInfo.name} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                        ) : (
                          <span className={`font-bold text-[15px] group-hover:scale-110 transition-transform ${iconInfo.textColor}`}>{iconInfo.icon}</span>
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h4 className="font-bold text-gray-100 text-sm">{tpl.name}</h4>
                      </div>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{tpl.desc}</p>
                  </motion.div>
                )
              })}
            </div>



          </div>
        </div>

      </motion.div>
    </div>
  )
}
