export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}

export function unlockedDaysForNow(calendarTz: string): number {
  // Unlock from Dec 1 to Dec 24 inclusive.
  const now = new Date();
  // Convert now to calendar TZ via formatter approximation (client-side simplification)
  // For server-side, use luxon or @js-temporal polyfill; here keep simple.
  const month = now.getUTCMonth() + 1; // 1-12
  const day = now.getUTCDate();
  const year = now.getUTCFullYear();
  // For simplicity, assume December of current year; unlock up to current day if month is Dec.
  if (month !== 12) return 0;
  const d = Math.min(24, Math.max(0, day));
  return d;
}

export function isDayUnlocked(day: number, calendarTz: string, at = new Date()): boolean {
  // Simplified: unlocked if current date (calendar TZ) is >= Dec day
  const month = at.getUTCMonth() + 1;
  const currDay = at.getUTCDate();
  if (month !== 12) return false;
  return currDay >= day;
}
