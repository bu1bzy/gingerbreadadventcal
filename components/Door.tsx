"use client";
import React from 'react';
import clsx from 'clsx';

export function Door({ day, unlocked, onOpen }: { day: number; unlocked: boolean; onOpen?: (day: number) => void }) {
  return (
    <button
      type="button"
      className={clsx(
        'aspect-square rounded-md border border-white/20 flex items-center justify-center text-xl',
        unlocked ? 'bg-emerald-600/30 hover:bg-emerald-600/40' : 'bg-white/10 cursor-not-allowed'
      )}
      onClick={() => unlocked && onOpen?.(day)}
      aria-disabled={!unlocked}
    >
      {day}
    </button>
  );
}
