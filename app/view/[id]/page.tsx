import { notFound } from 'next/navigation';
import { InMemoryStorage } from '../../../lib/storage';
import { isDayUnlocked } from '../../../lib/time';

export default async function ViewPage({ params }: { params: { id: string } }) {
  const cal = await InMemoryStorage.get(params.id);
  if (!cal) return notFound();
  const days = Array.from({ length: 24 }, (_, i) => i + 1);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{cal.title}</h1>
      <p className="text-white/80">{cal.description}</p>
      <div className="grid grid-cols-6 gap-3">
        {days.map((d) => {
          const unlocked = isDayUnlocked(d, cal.timezone);
          return (
            <a key={d} href={`/api/calendars/${cal.id}/day/${d}`} className={`aspect-square rounded-md border border-white/20 flex items-center justify-center ${unlocked ? 'bg-emerald-600/30' : 'bg-white/10 pointer-events-none'}`}>{d}</a>
          );
        })}
      </div>
    </div>
  );
}
