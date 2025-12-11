import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTimezone, TIMEZONE_OPTIONS } from '@/hooks/useTimezone';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Gift, Loader2, MapPin } from 'lucide-react';

const CreateCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { timezone: detectedTimezone, timezoneLabel } = useTimezone();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timezone, setTimezone] = useState(detectedTimezone);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update timezone when detected
  useState(() => {
    if (detectedTimezone) {
      setTimezone(detectedTimezone);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please give your calendar a name',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('calendars')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          timezone: timezone || 'UTC',
        })
        .select()
        .single();

      if (error) throw error;

      // Create default doors for the calendar
      const doors = Array.from({ length: 24 }, (_, i) => ({
        calendar_id: data.id,
        day_number: i + 1,
      }));

      await supabase.from('calendar_doors').insert(doors);

      // Navigate to success page with edit info
      navigate(`/created/${data.id}?token=${data.edit_token}`);
    } catch (error) {
      console.error('Error creating calendar:', error);
      toast({
        title: 'Error creating calendar',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-christmas-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-christmas-green/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative z-20 pb-20 pt-8 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl text-christmas-red mb-4">
              Create Your Calendar
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Set up your advent calendar in just a few steps
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="font-body font-semibold text-foreground">
                  Calendar Title *
                </Label>
                <Input
                  id="title"
                  placeholder="My Advent Calendar 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-body"
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-body font-semibold text-foreground">
                  Description (optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="A special countdown to Christmas for my family..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="font-body min-h-[100px] resize-none"
                  maxLength={500}
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="font-body font-semibold text-foreground">
                  Timezone
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Doors will unlock at midnight in this timezone
                </p>
                
                {timezoneLabel && (
                  <div className="flex items-center gap-2 text-sm text-christmas-green mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>Detected: {timezoneLabel}</span>
                  </div>
                )}
                
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="font-body">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5" />
                  Create Calendar
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-body">
            After creating, you'll get a special link to edit your calendar
          </p>
        </div>
      </main>
    </div>
  );
};

export default CreateCalendar;
