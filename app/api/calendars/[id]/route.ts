import { NextRequest } from 'next/server';
import { getStorage } from '@/lib/storage';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const store = getStorage();
  const cal = await store.get(params.id);
  if (!cal) return new Response('Not found', { status: 404 });
  return Response.json(cal);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const patch = await req.json();
  const store = getStorage();
  const updated = await store.update(params.id, token, patch);
  if (!updated) return new Response('Unauthorized or not found', { status: 401 });
  return Response.json(updated);
}
