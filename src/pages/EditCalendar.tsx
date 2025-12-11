import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, ExternalLink, Gift, Lock, Upload, Image, X } from 'lucide-react';

const EditCalendar = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [doorContent, setDoorContent] = useState({ text: '', imageUrl: '', link: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Fetch calendar
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

  // Verify token
  const isAuthorized = calendar?.edit_token === token;

  // Fetch doors
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
    enabled: !!id && isAuthorized,
  });

  // Upload image
  const handleImageUpload = async (file: File) => {
    if (!id || !selectedDay) return;
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/day-${selectedDay}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('door-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('door-images')
        .getPublicUrl(fileName);
      
      setDoorContent(prev => ({ ...prev, imageUrl: publicUrl }));
      toast({ title: 'Image uploaded!', description: 'Your photo has been added' });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Upload failed', description: 'Please try again', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Update door mutation
  const updateDoor = useMutation({
    mutationFn: async ({ day, content }: { day: number; content: typeof doorContent }) => {
      const { error } = await supabase
        .from('calendar_doors')
        .update({
          content_text: content.text || null,
          content_image_url: content.imageUrl || null,
          content_link: content.link || null,
        })
        .eq('calendar_id', id)
        .eq('day_number', day);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-doors', id] });
      toast({ title: 'Door updated!', description: `Day ${selectedDay} content saved` });
      setSelectedDay(null);
    },
    onError: () => {
      toast({ title: 'Error saving', description: 'Please try again', variant: 'destructive' });
    },
  });

  const handleDoorClick = (day: number) => {
    const door = doors.find(d => d.day_number === day);
    setDoorContent({
      text: door?.content_text || '',
      imageUrl: door?.content_image_url || '',
      link: door?.content_link || '',
    });
    setSelectedDay(day);
  };

  const handleSave = () => {
    if (selectedDay) {
      updateDoor.mutate({ day: selectedDay, content: doorContent });
    }
  };

  const clearImage = () => {
    setDoorContent(prev => ({ ...prev, imageUrl: '' }));
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Snowfall />
        <Header />
        <main className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <Lock className="w-16 h-16 text-christmas-red mb-4" />
          <h1 className="font-display text-4xl text-christmas-red mb-4">
            Access Denied
          </h1>
          <p className="font-body text-muted-foreground max-w-md">
            You don't have permission to edit this calendar. 
            Make sure you're using the correct edit link with a valid token.
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
          {/* Editor Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-christmas-red">
                Edit: {calendar.title}
              </h1>
              <p className="text-muted-foreground font-body mt-1">
                Click any door to customize its content
              </p>
            </div>
            <Link to={`/calendar/${id}`} target="_blank">
              <Button variant="christmas-green" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Preview
              </Button>
            </Link>
          </div>

          {/* Door Grid */}
          <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-christmas-gold/20 p-4 md:p-8">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((day) => {
                const door = doors.find(d => d.day_number === day);
                const hasContent = door?.content_text || door?.content_image_url || door?.content_link;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDoorClick(day)}
                    className={`
                      aspect-square rounded-xl transition-all duration-300
                      flex flex-col items-center justify-center overflow-hidden
                      border-4 border-christmas-gold/30 hover:border-christmas-gold
                      hover:scale-105 active:scale-95 cursor-pointer
                      ${hasContent ? 'bg-christmas-green' : 'bg-christmas-red'}
                    `}
                  >
                    {door?.content_image_url ? (
                      <img 
                        src={door.content_image_url} 
                        alt={`Day ${day}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <span className="font-display text-2xl md:text-3xl font-bold text-christmas-snow">
                          {day}
                        </span>
                        {hasContent && (
                          <Gift className="w-3 h-3 text-christmas-gold mt-1" />
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm font-body text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-christmas-red" />
                <span>Empty</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-christmas-green" />
                <span>Has content</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Door Dialog */}
      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-card border-christmas-gold/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-christmas-red">
              Edit Day {selectedDay}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="font-body font-semibold flex items-center gap-2">
                <Image className="w-4 h-4" />
                Photo
              </Label>
              
              {doorContent.imageUrl ? (
                <div className="relative">
                  <img 
                    src={doorContent.imageUrl} 
                    alt="Door content" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full h-32 border-2 border-dashed border-christmas-gold/50 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-christmas-gold hover:bg-christmas-gold/5 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-christmas-gold" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-christmas-gold" />
                      <span className="text-sm text-muted-foreground">
                        Tap to upload from camera roll
                      </span>
                    </>
                  )}
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-text" className="font-body font-semibold">
                Message
              </Label>
              <Textarea
                id="content-text"
                placeholder="Write a festive message..."
                value={doorContent.text}
                onChange={(e) => setDoorContent(prev => ({ ...prev, text: e.target.value }))}
                className="font-body min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-link" className="font-body font-semibold">
                Link (optional)
              </Label>
              <Input
                id="content-link"
                placeholder="https://example.com"
                value={doorContent.link}
                onChange={(e) => setDoorContent(prev => ({ ...prev, link: e.target.value }))}
                className="font-body"
              />
            </div>

            <Button
              onClick={handleSave}
              variant="christmas"
              className="w-full gap-2"
              disabled={updateDoor.isPending}
            >
              {updateDoor.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCalendar;
