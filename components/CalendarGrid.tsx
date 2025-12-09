"use client";
import React from 'react';
import { Door } from './Door';

export function CalendarGrid({ unlockedDays = 0, onOpen }: { unlockedDays?: number; onOpen?: (day: number) => void }) {
  const days = Array.from({ length: 24 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-6 gap-3">
      {days.map((d) => (
        <Door key={d} day={d} unlocked={d <= unlockedDays} onOpen={onOpen} />
      ))}
    </div>
  );
}
