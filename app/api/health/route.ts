import { getStorage } from '@/lib/storage';

export async function GET() {
  const backend = process.env.STORAGE_BACKEND || 'memory';
  const store = getStorage();
  // Basic check: memory always OK; kv/pg attempt a benign op
  let ok = true;
  let detail: string | undefined;
  try {
    if (backend === 'kv') {
      // Try a lightweight operation via adapter
      const { kv } = await import('@vercel/kv');
      await kv.ping();
      detail = 'kv-ok';
    } else if (backend === 'postgres') {
      const { sql } = await import('@vercel/postgres');
      await sql`SELECT 1 as ok`;
      detail = 'pg-ok';
    } else {
      detail = 'memory';
    }
  } catch (e: any) {
    ok = false;
    detail = e?.message || 'error';
  }
  return Response.json({ ok, backend, detail });
}
