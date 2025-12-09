import Link from 'next/link';
import { CalendarGrid } from '@/components/CalendarGrid';
import { unlockedDaysForNow } from '@/lib/time';

export default function HomePage() {
  const unlocked = unlockedDaysForNow('UTC');
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sample Advent Calendar</h1>
      <p className="text-white/80">Explore the demo grid, or create your own to share with friends.</p>
      <CalendarGrid unlockedDays={unlocked} />
      <div>
        <Link href="/create" className="underline">Create your calendar</Link>
      </div>
    </div>
  );
}
