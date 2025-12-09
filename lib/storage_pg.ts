import { sql } from '@vercel/postgres';
import type { Calendar, Storage } from './storage';

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS calendars (
      id UUID PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      timezone TEXT NOT NULL,
      token TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      days JSONB NOT NULL
    );
  `;
}

export const PostgresStorage: Storage = {
  async create(cal) {
    await ensureTables();
    const id = crypto.randomUUID();
    const createdAt = Date.now();
    const days = cal.days ?? {};
    await sql`
      INSERT INTO calendars (id, title, description, timezone, token, created_at, days)
      VALUES (${id}::uuid, ${cal.title}, ${cal.description}, ${cal.timezone}, ${cal.token}, ${createdAt}, ${JSON.stringify(days)}::jsonb)
    `;
    return { id, createdAt, ...cal } as Calendar;
  },
  async get(id) {
    await ensureTables();
    const { rows } = await sql<Calendar>`SELECT id, title, description, timezone, token, created_at as "createdAt", days FROM calendars WHERE id = ${id}::uuid LIMIT 1`;
    return rows[0] ?? null;
  },
  async update(id, token, patch) {
    await ensureTables();
    const curr = await this.get(id);
    if (!curr || curr.token !== token) return null;
    const next = { ...curr, ...patch } as Calendar;
    await sql`
      UPDATE calendars SET
        title = ${next.title},
        description = ${next.description},
        timezone = ${next.timezone},
        token = ${next.token},
        days = ${JSON.stringify(next.days)}::jsonb
      WHERE id = ${id}::uuid
    `;
    return next;
  }
};
