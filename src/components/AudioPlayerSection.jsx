import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Upload, SkipBack, SkipForward, Music, Trash2 } from 'lucide-react';
import HalftoneAudioCanvas from './HalftoneAudioCanvas';
import { useAudioStore } from '../hooks/useAudioStore';
import { useAudioVisualizer } from '../hooks/useAudioVisualizer';

export default function AudioPlayerSection() {
  const { songs, isReady, addSong, deleteSong } = useAudioStore();
  const { isPlaying, playSong, pause, resume, getFrequencyData } = useAudioVisualizer();
  const fileInputRef = useRef(null);
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // If the list of songs changes, make sure our index is still valid
  useEffect(() => {
      if (songs.length > 0 && currentSongIndex >= songs.length) {
          setCurrentSongIndex(0);
      }
  }, [songs, currentSongIndex]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      await addSong(file);
      // Play the newly added song (which will be at index 0 because we sort descending by id)
      setCurrentSongIndex(0);
    }
  };

  const handlePlayPause = () => {
    if (songs.length === 0) return;
    
    if (isPlaying) {
      pause();
    } else {
      // If we haven't played anything yet, or we paused, we resume/play
      const currentSong = songs[currentSongIndex];
      playSong(currentSong.data, currentSong.type);
    }
  };

  const playNext = () => {
    if (songs.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % songs.length;
    setCurrentSongIndex(nextIndex);
    const nextSong = songs[nextIndex];
    playSong(nextSong.data, nextSong.type);
  };

  const playPrev = () => {
    if (songs.length === 0) return;
    const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    setCurrentSongIndex(prevIndex);
    const prevSong = songs[prevIndex];
    playSong(prevSong.data, prevSong.type);
  };

  const handleDelete = (e, id) => {
      e.stopPropagation();
      deleteSong(id);
      if (songs[currentSongIndex]?.id === id) {
          pause();
      }
  };

  const activeSong = songs[currentSongIndex];

  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden border-t border-gray-100 bg-white">
      {/* Interactive Background */}
      <HalftoneAudioCanvas getFrequencyData={getFrequencyData} />

      {/* Glassmorphic Player UI */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]">
        
        {/* Header / Track Info */}
        <div className="text-center mb-8">
            <h3 className="text-sm font-bold tracking-widest uppercase text-purple-600 mb-2">Vibe Check</h3>
            <h2 className="text-2xl font-black text-gray-900 truncate">
                {activeSong ? activeSong.name.replace(/\.[^/.]+$/, "") : "Upload a track to begin"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {songs.length > 0 ? `${songs.length} / 5 Tracks` : "No tracks available"}
            </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
            <button 
                onClick={playPrev}
                disabled={songs.length === 0}
                className="p-3 text-gray-700 hover:text-black hover:bg-white/50 rounded-full transition disabled:opacity-30"
            >
                <SkipBack size={24} />
            </button>
            
            <button 
                onClick={handlePlayPause}
                disabled={songs.length === 0}
                className="w-16 h-16 flex items-center justify-center bg-black text-white rounded-full hover:scale-105 active:scale-95 transition disabled:opacity-30 shadow-xl"
            >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>

            <button 
                onClick={playNext}
                disabled={songs.length === 0}
                className="p-3 text-gray-700 hover:text-black hover:bg-white/50 rounded-full transition disabled:opacity-30"
            >
                <SkipForward size={24} />
            </button>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-6">
            <input 
                type="file" 
                accept="audio/*" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-bold transition"
            >
                <Upload size={18} />
                Upload Song
            </button>
        </div>

        {/* Mini Playlist */}
        <div className="space-y-2">
            {songs.map((song, idx) => (
                <div 
                    key={song.id} 
                    onClick={() => {
                        setCurrentSongIndex(idx);
                        playSong(song.data, song.type);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                        idx === currentSongIndex 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-white/50 text-gray-700 hover:bg-white/80'
                    }`}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Music size={16} className="flex-shrink-0" />
                        <span className="text-sm font-semibold truncate">
                            {song.name.replace(/\.[^/.]+$/, "")}
                        </span>
                    </div>
                    <button 
                        onClick={(e) => handleDelete(e, song.id)}
                        className={`p-2 rounded-full hover:bg-black/10 transition ${idx === currentSongIndex ? 'text-white' : 'text-gray-400 hover:text-red-500'}`}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}
