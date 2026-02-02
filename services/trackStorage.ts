import { LoopTrack } from '../types';

const DB_NAME = 'neuroamp_audio_db';
const STORE_NAME = 'tracks';
const META_KEY = 'neuroamp_loop_metadata';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const loadSession = async (): Promise<LoopTrack[]> => {
    const metaStr = localStorage.getItem(META_KEY);
    if (!metaStr) return [];
    
    try {
        const metadata: Partial<LoopTrack>[] = JSON.parse(metaStr);
        if (!metadata.length) return [];

        const db = await openDB();
        const tracks: LoopTrack[] = [];
        
        // Process sequentially to maintain order
        for (const meta of metadata) {
            if (!meta.id) continue;
            try {
                const blob = await new Promise<Blob>((resolve, reject) => {
                    const tx = db.transaction(STORE_NAME, 'readonly');
                    const store = tx.objectStore(STORE_NAME);
                    const req = store.get(meta.id!);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                });

                if (blob) {
                    tracks.push({
                        ...meta as LoopTrack,
                        blob,
                        url: URL.createObjectURL(blob)
                    });
                }
            } catch (e) {
                console.warn(`Could not load audio for track ${meta.id}`, e);
            }
        }
        return tracks;
    } catch (e) {
        console.error("Error parsing session metadata", e);
        return [];
    }
};

export const saveSession = async (tracks: LoopTrack[]) => {
    // 1. Save Metadata (instant)
    const metadata = tracks.map(({ blob, url, ...rest }) => rest);
    localStorage.setItem(META_KEY, JSON.stringify(metadata));

    // 2. Sync Blobs (async)
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);

        // Get all existing keys
        const existingKeys = await new Promise<string[]>((resolve, reject) => {
            const req = store.getAllKeys();
            req.onsuccess = () => resolve(req.result as string[]);
            req.onerror = () => reject(req.error);
        });

        const currentIds = new Set(tracks.map(t => t.id));
        
        // Delete orphans (tracks removed from UI)
        for (const key of existingKeys) {
            if (!currentIds.has(key)) {
                store.delete(key);
            }
        }

        // Add/Update current tracks
        for (const track of tracks) {
             // Only write if not already in DB to save write cycles/performance
             // Note: This assumes blob content doesn't change for a given ID. 
             // If you edit audio, you must generate a new ID or force update.
             if (!existingKeys.includes(track.id)) {
                 store.put(track.blob, track.id);
             }
        }

    } catch (e) {
        console.error("Failed to sync audio to IndexedDB", e);
    }
};

export const clearSession = async () => {
    localStorage.removeItem(META_KEY);
    try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
    } catch (e) {
        console.error("Failed to clear DB", e);
    }
};