import { kv } from '@vercel/kv';
import type { Calendar, Storage } from './storage';

export const KVStorage: Storage = {
  async create(cal) {
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const full: Calendar = { id, createdAt, ...cal };
    await kv.set(`calendar:${id}`, full);
    return full;
  },
  async get(id) {
    const data = await kv.get<Calendar>(`calendar:${id}`);
    return data ?? null;
  },
  async update(id, token, patch) {
    const curr = await kv.get<Calendar>(`calendar:${id}`);
    if (!curr || curr.token !== token) return null;
    const next: Calendar = { ...curr, ...patch };
    await kv.set(`calendar:${id}`, next);
    return next;
  }
};
