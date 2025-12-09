export type DayContent = {
  background?: string;
  items?: any[]; // EditorCanvas items
};

export type Calendar = {
  id: string;
  title: string;
  description?: string;
  timezone: string; // IANA TZ name
  token: string; // edit token
  createdAt: number;
  days: Record<number, DayContent>;
};

export interface Storage {
  create(cal: Omit<Calendar, 'id' | 'createdAt'>): Promise<Calendar>;
  get(id: string): Promise<Calendar | null>;
  update(id: string, token: string, patch: Partial<Calendar>): Promise<Calendar | null>;
}

const mem = new Map<string, Calendar>();

function uid() {
  return crypto.randomUUID();
}

export const InMemoryStorage: Storage = {
  async create(cal) {
    const id = uid();
    const createdAt = Date.now();
    const full: Calendar = { id, createdAt, ...cal };
    mem.set(id, full);
    return full;
  },
  async get(id) {
    return mem.get(id) ?? null;
  },
  async update(id, token, patch) {
    const curr = mem.get(id);
    if (!curr || curr.token !== token) return null;
    const next = { ...curr, ...patch } as Calendar;
    mem.set(id, next);
    return next;
  },
};

export function getStorage(): Storage {
  const backend = process.env.STORAGE_BACKEND || 'memory';
  // Future: switch on 'postgres' or 'vercel-kv' when configured
  if (backend === 'kv') {
    try {
      const { KVStorage } = require('./storage_kv');
      return KVStorage as Storage;
    } catch {
      return InMemoryStorage;
    }
  }
  if (backend === 'postgres') {
    try {
      const { PostgresStorage } = require('./storage_pg');
      return PostgresStorage as Storage;
    } catch {
      return InMemoryStorage;
    }
  }
  return InMemoryStorage;
}
