import { useState, useEffect } from 'react';

export const useTimezone = () => {
  const [timezone, setTimezone] = useState<string>('UTC');
  const [timezoneLabel, setTimezoneLabel] = useState<string>('');

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detected);
      
      // Create a readable label
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: detected,
        timeZoneName: 'long'
      });
      const parts = formatter.formatToParts(now);
      const tzName = parts.find(p => p.type === 'timeZoneName')?.value || detected;
      setTimezoneLabel(tzName);
    } catch (error) {
      console.error('Could not detect timezone:', error);
      setTimezone('UTC');
      setTimezoneLabel('Coordinated Universal Time');
    }
  }, []);

  return { timezone, timezoneLabel };
};

export const getUnlockedDays = (timezone: string, nowOverride?: Date): number[] => {
  const now = nowOverride ?? new Date();
  
  // Get current date in the calendar's timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  
  const parts = formatter.formatToParts(now);
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
  
  // Doors start unlocking from December 14th
  const START_DAY = 14;

  // Only unlock doors in December
  if (month !== 12) {
    // If before December, no doors unlocked
    // If after December (new year), all doors unlocked
    if (month < 12 && year === new Date().getFullYear()) {
      return [];
    }
    // After December or new year, all doors available
    return Array.from({ length: 24 }, (_, i) => i + 1);
  }

  // In December, doors unlock starting from START_DAY
  // Door 1 unlocks on Dec 14, Door 2 on Dec 15, etc.
  const unlockedCount = Math.max(0, day - START_DAY + 1);
  const cap = Math.min(unlockedCount, 24);
  return Array.from({ length: cap }, (_, i) => i + 1);
};

// Common timezone options for the dropdown
export const TIMEZONE_OPTIONS = [
  { value: 'Pacific/Auckland', label: 'Auckland (NZDT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'America/Chicago', label: 'Chicago (CST)' },
  { value: 'America/Denver', label: 'Denver (MST)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  { value: 'UTC', label: 'UTC' },
];
