import React from 'react';

export type EditorItem =
  | { type: 'text'; text: string }
  | { type: 'image'; url: string }
  | { type: 'shape'; shape: 'circle' | 'square' | 'star' }
  | { type: 'sticker'; name: string }
  | { type: 'link'; url: string; label?: string };

export function EditorCanvas({ items }: { items: EditorItem[] }) {
  return (
    <div className="border border-white/20 rounded-md p-4 min-h-[240px]">
      {items.length === 0 ? (
        <div className="text-white/60 text-sm">No items yet. Add background, stickers, text, images, or links.</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {items.map((it, idx) => (
            <li key={idx} className="border border-white/10 rounded px-2 py-1">
              {JSON.stringify(it)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
