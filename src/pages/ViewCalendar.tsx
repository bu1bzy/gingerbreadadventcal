import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { supabase } from '@/integrations/supabase/client';
import { getUnlockedDays } from '@/hooks/useTimezone';
import { Loader2 } from 'lucide-react';

const ViewCalendar = () => {
  const { id } = useParams();
  const [openedDays, setOpenedDays] = useState<number[]>([]);

  // Fetch calendar data
  const { data: calendar, isLoading: calendarLoading, error: calendarError } = useQuery({
    queryKey: ['calendar', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch doors data
  const { data: doors = [] } = useQuery({
    queryKey: ['calendar-doors', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_doors')
        .select('*')
        .eq('calendar_id', id)
        .order('day_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Calculate unlocked days based on timezone
  const unlockedDays = calendar ? getUnlockedDays(calendar.timezone) : [];

  // Load opened days from localStorage
  useEffect(() => {
    if (id) {
      const stored = localStorage.getItem(`calendar-${id}-opened`);
      if (stored) {
        setOpenedDays(JSON.parse(stored));
      }
    }
  }, [id]);

  // Save opened days to localStorage
  const handleOpenDoor = (day: number) => {
    if (!openedDays.includes(day)) {
      const newOpenedDays = [...openedDays, day];
      setOpenedDays(newOpenedDays);
      localStorage.setItem(`calendar-${id}-opened`, JSON.stringify(newOpenedDays));
    }
  };

  if (calendarLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-christmas-red" />
      </div>
    );
  }

  if (calendarError || !calendar) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <Header />
        <main className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <h1 className="font-display text-4xl text-christmas-red mb-4">
            Calendar Not Found
          </h1>
          <p className="font-body text-muted-foreground">
            This calendar may have been removed or the link is incorrect.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-christmas-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-christmas-green/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative z-20 pb-20 pt-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Calendar Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-christmas-red mb-4 snow-text">
              {calendar.title}
            </h1>
            {calendar.description && (
              <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
                {calendar.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2 font-body">
              🕐 Doors unlock at midnight ({calendar.timezone})
            </p>
          </div>

          {/* Calendar Grid */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-christmas-gold/20 p-4 md:p-8 christmas-glow">
            <CalendarGrid
              doors={doors}
              unlockedDays={unlockedDays}
              openedDays={openedDays}
              onOpenDoor={handleOpenDoor}
            />
          </div>

          {/* Status */}
          <div className="text-center mt-6">
            <p className="font-body text-sm text-muted-foreground">
              {openedDays.length} of {unlockedDays.length} doors opened
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewCalendar;
