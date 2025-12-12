// IndexedDB helper for storing large image data
const DB_NAME = 'AdventCalendarDB';
const STORE_NAME = 'giftImages';

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }
    
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveImage = async (day: number, imageData: string | null): Promise<void> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    if (imageData === null) {
      store.delete(`day${day}`);
    } else {
      store.put(imageData, `day${day}`);
    }
    
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
};

export const loadImage = async (day: number): Promise<string | null> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(`day${day}`);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      resolve(request.result || null);
    };
  });
};

export const loadAllImages = async (): Promise<(string | null)[]> => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const images: (string | null)[] = Array(12).fill(null);
    
    const keysRequest = store.getAllKeys();
    
    keysRequest.onerror = () => reject(keysRequest.error);
    keysRequest.onsuccess = () => {
      const keys = keysRequest.result;
      let completed = 0;
      
      if (keys.length === 0) {
        resolve(images);
        return;
      }
      
      keys.forEach((key) => {
        const getRequest = store.get(key);
        getRequest.onsuccess = () => {
          const dayNum = parseInt((key as string).replace('day', ''));
          if (dayNum >= 1 && dayNum <= 12 && getRequest.result) {
            images[dayNum - 1] = getRequest.result;
          }
          completed++;
          if (completed === keys.length) {
            resolve(images);
          }
        };
      });
    };
  });
};
