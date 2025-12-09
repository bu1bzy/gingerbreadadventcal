"use client";
import { useEffect, useMemo, useState } from 'react';
import { EditorCanvas, EditorItem } from '@/components/EditorCanvas';

export default function EditPage({ params, searchParams }: { params: { id: string }, searchParams: { token?: string } }) {
  const id = params.id;
  const token = searchParams.token ?? '';
  const [calendar, setCalendar] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [items, setItems] = useState<EditorItem[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/calendars/${id}`);
      const data = await res.json();
      setCalendar(data);
      const existing = data?.days?.[selectedDay]?.items ?? [];
      setItems(existing);
    })();
  }, [id]);

  useEffect(() => {
    const existing = calendar?.days?.[selectedDay]?.items ?? [];
    setItems(existing);
  }, [selectedDay, calendar]);

  async function saveDay() {
    setSaving(true);
    try {
      const patch = { days: { ...calendar.days, [selectedDay]: { ...(calendar.days?.[selectedDay] ?? {}), items } } };
      const res = await fetch(`/api/calendars/${id}?token=${encodeURIComponent(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      setCalendar(data);
    } finally {
      setSaving(false);
    }
  }

  const unlockedDays = 24; // Editor shows all for convenience

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit Calendar</h1>
      {!calendar ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          <div className="text-white/80">{calendar.title} — {calendar.description}</div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }, (_, i) => i + 1).map((d) => (
                  <button key={d} className={`aspect-square rounded border ${selectedDay===d?'border-emerald-400':'border-white/20'}`} onClick={()=>setSelectedDay(d)}>{d}</button>
                ))}
              </div>
              <div className="mt-2 text-sm text-white/70">Select a day to edit</div>
            </div>
            <div className="w-1/2">
              <EditorCanvas items={items} />
              <div className="mt-2 flex gap-2">
                <button className="rounded bg-white/10 px-2 py-1 text-sm" onClick={()=>setItems([...items, { type: 'text', text: 'Hello' }])}>Add Text</button>
                <button className="rounded bg-white/10 px-2 py-1 text-sm" onClick={()=>setItems([...items, { type: 'shape', shape: 'star' }])}>Add Shape</button>
                <button className="rounded bg-white/10 px-2 py-1 text-sm" onClick={()=>setItems([...items, { type: 'link', url: 'https://example.com', label: 'Link' }])}>Add Link</button>
                <button disabled={saving} className="rounded bg-emerald-600 px-3 py-1 text-sm" onClick={saveDay}>Save Day</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
