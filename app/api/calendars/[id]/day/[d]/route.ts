import { NextRequest } from 'next/server';
import { getStorage } from '@/lib/storage';
import { isDayUnlocked } from '@/lib/time';

export async function GET(_: NextRequest, { params }: { params: { id: string, d: string } }) {
  const store = getStorage();
  const cal = await store.get(params.id);
  if (!cal) return new Response('Not found', { status: 404 });
  const day = parseInt(params.d, 10);
  if (!isDayUnlocked(day, cal.timezone)) {
    return new Response('Locked', { status: 403 });
  }
  const content = cal.days?.[day] ?? { items: [] };
  return Response.json(content);
}
