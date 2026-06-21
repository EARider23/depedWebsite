import { useState, useEffect, useCallback } from 'react';
import * as jsmediatagsModule from 'jsmediatags/dist/jsmediatags.min.js';

const jsmediatags = jsmediatagsModule.default || jsmediatagsModule.window?.jsmediatags || jsmediatagsModule;

const DB_NAME = 'PEEAK_AudioDB';
const STORE_NAME = 'songs';
const DB_VERSION = 1;
const MAX_SONGS = 5;

// Dependency-free function to extract the average color of an image
const getAverageColor = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width = img.width || 100;
  const height = canvas.height = img.height || 100;
  
  ctx.drawImage(img, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;
  
  let r = 0, g = 0, b = 0, count = 0;
  // Sample every 4th pixel to speed up extraction
  for (let i = 0; i < data.length; i += 16) {
    r += data[i];
    g += data[i+1];
    b += data[i+2];
    count++;
  }
  
  return count > 0 ? [Math.floor(r/count), Math.floor(g/count), Math.floor(b/count)] : null;
};

const extractMetadata = (file) => {
  return new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: function(tag) {
        let dominantColor = null;
        const picture = tag.tags.picture;
        const album = tag.tags.album || null;
        
        if (picture) {
          try {
            const blob = new Blob([new Uint8Array(picture.data)], { type: picture.format });
            const url = URL.createObjectURL(blob);
            
            const img = new Image();
            img.onload = () => {
              try {
                dominantColor = getAverageColor(img);
              } catch (e) {
                console.warn("Failed to extract color from canvas", e);
              }
              URL.revokeObjectURL(url);
              resolve({ dominantColor, album });
            };
            img.onerror = () => {
              URL.revokeObjectURL(url);
              resolve({ dominantColor: null, album });
            };
            img.src = url;
          } catch (e) {
            console.warn("Failed to create image blob", e);
            resolve({ dominantColor: null, album });
          }
        } else {
          resolve({ dominantColor: null, album });
        }
      },
      onError: function(error) {
        console.warn('Error reading tags', error);
        resolve({ dominantColor: null, album: null });
      }
    });
  });
};

// Promisified IndexedDB helper
const idb = {
  db: null,
  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  },
  async getAll() {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async put(song) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(song);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async delete(id) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};

export function useAudioStore() {
  const [songs, setSongs] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const loadSongs = useCallback(async () => {
    try {
      const allSongs = await idb.getAll();
      // Sort by id (timestamp) descending (newest first)
      allSongs.sort((a, b) => b.id - a.id);
      setSongs(allSongs);
      setIsReady(true);
    } catch (err) {
      console.error("Failed to load songs from IndexedDB:", err);
    }
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  const addSong = async (file) => {
    const [arrayBuffer, metadata] = await Promise.all([
      file.arrayBuffer(),
      extractMetadata(file)
    ]);
    
    const newSong = {
      id: Date.now(), // Use timestamp as ID
      name: file.name,
      type: file.type,
      data: arrayBuffer,
      dominantColor: metadata.dominantColor,
      album: metadata.album
    };

    // Fetch current songs to enforce limits
    let currentSongs = await idb.getAll();
    currentSongs.sort((a, b) => b.id - a.id);

    // If we already have 5 (or more) songs, delete the oldest
    if (currentSongs.length >= MAX_SONGS) {
      // Remove elements from the end to keep only MAX_SONGS - 1
      const toDelete = currentSongs.slice(MAX_SONGS - 1);
      for (const oldSong of toDelete) {
        await idb.delete(oldSong.id);
      }
    }

    await idb.put(newSong);
    await loadSongs(); // Reload state
  };

  const deleteSong = async (id) => {
    await idb.delete(id);
    await loadSongs();
  };

  return { songs, isReady, addSong, deleteSong };
}
