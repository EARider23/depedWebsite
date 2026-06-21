import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false); // Ref mirror for use inside stable callbacks
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const audioRef = useRef(null);
  const dataArrayRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    analyserRef.current.smoothingTimeConstant = 0.6;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
  }, []);

  const playSong = async (songData, type) => {
    initAudio();
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    // Pause current audio (don't call pause() which sets state)
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const blob = new Blob([songData], { type: type || 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
    }
    
    audioRef.current.src = url;
    try {
        await audioRef.current.play();
        setIsPlaying(true);
    } catch (e) {
        console.error("Playback failed:", e);
        setIsPlaying(false);
    }
  };

  const pause = () => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resume = async () => {
      if (audioRef.current && audioContextRef.current) {
          if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
          }
          await audioRef.current.play();
          setIsPlaying(true);
      }
  };

  // Stable callback — uses refs, never becomes stale
  const getFrequencyData = useCallback(() => {
    if (analyserRef.current && dataArrayRef.current && isPlayingRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      return dataArrayRef.current;
    }
    return null;
  }, []);

  const getAudioElement = useCallback(() => audioRef.current, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    playSong,
    pause,
    resume,
    getFrequencyData,
    getAudioElement
  };
}
