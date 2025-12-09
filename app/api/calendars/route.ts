import { NextRequest } from 'next/server';
import { getStorage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, description, timezone } = body ?? {};
  const token = crypto.randomUUID();
  const store = getStorage();
  const created = await store.create({ title, description, timezone, token, days: {} });
  return Response.json(created);
}
