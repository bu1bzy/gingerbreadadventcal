"use client";
import { useEffect, useState } from 'react';
import { detectTimezone } from '@/lib/time';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [creating, setCreating] = useState(false);
  const [editLink, setEditLink] = useState<string | null>(null);

  useEffect(() => {
    setTimezone(detectTimezone());
  }, []);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch('/api/calendars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, timezone })
      });
      const data = await res.json();
      const url = `/edit/${data.id}?token=${encodeURIComponent(data.token)}`;
      setEditLink(url);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Create Calendar</h1>
      <label className="block space-y-1">
        <span className="text-sm text-white/70">Title</span>
        <input className="w-full rounded bg-white/10 px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-white/70">Description</span>
        <textarea className="w-full rounded bg-white/10 px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-white/70">Timezone</span>
        <input className="w-full rounded bg-white/10 px-3 py-2" value={timezone} onChange={e=>setTimezone(e.target.value)} />
        <div className="text-xs text-white/50">Auto-detected as {timezone}. You can adjust if needed.</div>
      </label>
      <button disabled={creating || !title} onClick={handleCreate} className="rounded bg-emerald-600 px-4 py-2 disabled:opacity-50">Create</button>
      {editLink && (
        <div className="border border-white/20 rounded p-3 text-sm">
          <div className="font-semibold mb-1">Save this link to edit later</div>
          <div className="break-all"><a className="underline" href={editLink}>{location.origin}{editLink}</a></div>
          <div className="mt-1 text-white/70">Important! You'll need this link to make changes to your calendar. Bookmark it or drop it in your notes app.</div>
        </div>
      )}
    </div>
  );
}
