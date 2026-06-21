import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Upload, Music, Trash2 } from 'lucide-react';

export default function MiniAudioPlayer({
    songs,
    isPlaying,
    playSong,
    pause,
    resume,
    addSong,
    deleteSong,
    currentSongIndex,
    setCurrentSongIndex,
    isScrolled,
    onHoverChange,
    getAudioElement
}) {
    const fileInputRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loadedSongId, setLoadedSongId] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (onHoverChange) {
            onHoverChange(isHovered);
        }
    }, [isHovered, onHoverChange]);

    const activeSong = songs ? songs[currentSongIndex] : null;

    // 1. Immediately extract duration when a song is uploaded, before playing
    useEffect(() => {
        if (!activeSong) {
            setDuration(0);
            setCurrentTime(0);
            return;
        }

        const blob = new Blob([activeSong.data], { type: activeSong.type || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const tempAudio = new Audio(url);

        tempAudio.addEventListener('loadedmetadata', () => {
            setDuration(tempAudio.duration);
            setCurrentTime(0);
        });

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [activeSong]);

    // 2. High-performance, React-friendly time syncing during playback
    useEffect(() => {
        let animationFrameId;

        const updateTime = () => {
            if (isPlaying && getAudioElement) {
                const audioEl = getAudioElement();
                if (audioEl) {
                    setCurrentTime(audioEl.currentTime);
                }
                animationFrameId = requestAnimationFrame(updateTime);
            }
        };

        if (isPlaying) {
            updateTime();
        } else if (getAudioElement) {
            // Ensure exact time when paused
            const audioEl = getAudioElement();
            if (audioEl) setCurrentTime(audioEl.currentTime);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isPlaying, getAudioElement]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            await addSong(file);
            setCurrentSongIndex(0);
        }
    };

    const handleActionClick = () => {
        if (!songs || songs.length === 0) {
            fileInputRef.current?.click();
            return;
        }

        if (isPlaying) {
            pause();
        } else {
            // If the same song is already loaded, just resume
            if (activeSong && loadedSongId === activeSong.id) {
                resume();
            } else {
                // Otherwise load and play the new song
                if (activeSong) {
                    playSong(activeSong.data);
                    setLoadedSongId(activeSong.id);
                }
            }
        }
    };

    const formatTime = (secs) => {
        if (!secs || isNaN(secs)) return "0:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const hoverTimeoutRef = useRef(null);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
        }, 500); // Small delay so the user can easily click play without it jumping!
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 300); // Small delay so it doesn't flicker when moving mouse
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        };
    }, []);

    // Info for display
    const title = activeSong ? activeSong.name.replace(/\.[^/.]+$/, "") : "No track selected";
    const subtitle = activeSong ? (activeSong.album || "Local Audio") : "Upload to visualize";

    return (
        <motion.div
            className={`flex items-center ${isScrolled ? 'bg-white/20 border-white/20 hover:bg-white/30' : 'bg-black/5 border-black/10 hover:bg-black/10'} rounded-full overflow-hidden transition-colors backdrop-blur-md shadow-sm h-[40px] z-50 cursor-pointer`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
                if (!isHovered) {
                    setIsHovered(true);
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                }
            }} // allow tap on mobile
            animate={{ width: (!songs || songs.length === 0) || isHovered ? 'auto' : '40px' }}
            initial={{ width: (!songs || songs.length === 0) ? 'auto' : '40px' }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="audio/*"
                className="hidden"
            />

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick();
                }}
                className={`h-[40px] flex items-center shrink-0 relative group outline-none ${(!songs || songs.length === 0) && isHovered ? 'bg-black/5' : ''} rounded-full transition-colors ${(!songs || songs.length === 0) ? 'w-auto px-4 gap-2' : 'w-[40px] justify-center'}`}
                aria-label={!songs || songs.length === 0 ? "Upload audio" : isPlaying ? "Pause" : "Play"}
            >
                {(!songs || songs.length === 0) ? (
                    <>
                        <Upload size={16} className={isScrolled ? 'text-slate-300' : 'text-slate-500'} />
                        <span className={`text-xs font-bold ${isScrolled ? 'text-white' : 'text-slate-700'}`}>Upload song</span>
                    </>
                ) : (
                    <>
                        {/* Main Icon */}
                        <div className={isPlaying ? 'text-purple-500' : (isScrolled ? 'text-slate-300' : 'text-slate-500')}>
                            <Music size={20} />
                        </div>

                        {/* Hover overlay action icon */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            {isPlaying ? (
                                <Pause size={16} className="text-white" />
                            ) : (
                                <Play size={16} className="text-white ml-0.5" />
                            )}
                        </div>
                    </>
                )}
            </button>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center pr-4 pl-1 whitespace-nowrap overflow-hidden"
                    >
                        <div className="flex flex-col justify-center">
                            <span className={`text-xs font-bold ${isScrolled ? 'text-white drop-shadow-sm' : 'text-slate-800'} truncate max-w-[140px] leading-tight`}>{title}</span>
                            <span className={`text-[10px] font-medium ${isScrolled ? 'text-slate-300' : 'text-slate-500'} truncate max-w-[140px] leading-tight`}>{subtitle}</span>
                        </div>
                        <div className={`ml-3 pl-3 border-l ${isScrolled ? 'border-white/20' : 'border-slate-300/50'} flex items-center gap-2`}>
                            <span className={`text-xs font-mono font-medium ${isScrolled ? 'text-white drop-shadow-sm' : 'text-slate-700'} min-w-[65px]`}>
                                {formatTime(currentTime)} <span className={`text-[10px] ${isScrolled ? 'text-slate-300' : 'text-slate-500'}`}>/ {formatTime(duration)}</span>
                            </span>

                            {/* Action Icons */}
                            {songs && songs.length > 0 && (
                                <div className={`flex items-center gap-1 border-l pl-2 ml-1 ${isScrolled ? 'border-white/20' : 'border-slate-300/50'}`}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                        className={`p-1.5 rounded transition-colors ${isScrolled ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-black/5'}`}
                                        title="Upload new audio"
                                    >
                                        <Upload size={14} />
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (isPlaying) pause();
                                            if (activeSong) {
                                                await deleteSong(activeSong.id);
                                            }
                                            setCurrentSongIndex(0);
                                            setCurrentTime(0);
                                            setDuration(0);
                                            setLoadedSongId(null);
                                        }}
                                        className={`p-1.5 rounded transition-colors ${isScrolled ? 'text-slate-300 hover:text-red-400 hover:bg-white/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
                                        title="Remove audio"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
