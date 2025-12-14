import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Calendar, Share2 } from 'lucide-react';
import { useTimezone, getUnlockedDays } from '@/hooks/useTimezone';
import { saveImage, loadAllImages } from '@/lib/storageDB';
import { defaultGifts } from '@/data/gifts';
const Index = () => {
  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [simulate, setSimulate] = useState(false);
  const [simDate, setSimDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Use defaultGifts as the single source of truth for door content
  const [doorGifts, setDoorGifts] = useState(() => {
    const saved = localStorage.getItem('doorGifts');
    if (saved) return JSON.parse(saved);
    return defaultGifts;
  });



  // Sample calendar with some example content
  const getDoorImages = (day: number) => {
    // All days 1-12 have custom images
    if (day > 12) return { front_image_url: null, front_hover_image_url: null };
    return {
      front_image_url: `/images/day${day}-front.png`,
      front_hover_image_url: `/images/day${day}-front-hover.png`,
    };
  };

  const sampleDoors = useMemo(() => doorGifts.map((gift, i) => {
    const day = gift.day_number;
    const images = getDoorImages(day);
    return {
      ...gift,
      ...images,
    };
  }), [doorGifts]);

  // Determine unlocked days using the calendar timezone so preview reflects real unlock dates
  const { timezone } = useTimezone();

  const unlockedDays = (() => {
    if (simulate) {
      const d = new Date(simDate + 'T00:00:00');
      return getUnlockedDays(timezone, d);
    }
    return getUnlockedDays(timezone);
  })();
  const handleOpenDoor = (day: number) => {
    if (!openedDays.includes(day)) {
      setOpenedDays(prev => [...prev, day]);
    }
  };




  return <div className="min-h-screen bg-background relative overflow-hidden">
      <Snowfall />
      
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-christmas-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-christmas-green/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-christmas-gold/5 rounded-full blur-2xl" />
      </div>

      <Header />

      <main className="relative z-20 pb-20">
        {/* Hero Section */}
        <section className="text-center px-4 md:py-[4px] py-[10px]">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display lg:text-8xl mb-6 snow-text animate-fade-in text-3xl text-christmas-red md:text-4xl">✨Advent Calendar✨</h1>
            <p style={{
            animationDelay: '0.1s'
          }} className="font-body text-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in md:text-xl text-lg">Behind each door is a surprise awaiting!
Doors unlock at midnight!</p>
            
          </div>
        </section>

        {/* Sample Calendar */}
        <section className="px-4 py-[5px]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 flex items-center justify-center gap-2 flex-wrap">
              <div className="flex gap-2 items-center">
                {saveStatus && <div className="text-sm text-christmas-green font-medium">{saveStatus}</div>}
              </div>
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-christmas-gold/20 p-4 md:p-8 christmas-glow">
              <div className="mb-4 flex items-center justify-center gap-4 flex-wrap">
                <label className="inline-flex items-center gap-2 font-body text-sm">
                  <input type="checkbox" checked={simulate} onChange={e => setSimulate(e.target.checked)} />
                  <span>Simulate date</span>
                </label>
                <input
                  type="date"
                  value={simDate}
                  onChange={e => setSimDate(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  disabled={!simulate}
                />
                <div className="text-sm text-muted-foreground">(Timezone: {timezone})</div>
                {/* Debug: show computed unlocked days for clarity */}
                <div className="w-full text-center mt-2">
                  <div className="inline-block bg-muted/20 px-3 py-1 rounded text-sm">
                    Computed unlocked days: {unlockedDays.length > 0 ? unlockedDays.join(', ') : 'none'}
                  </div>
                </div>
              </div>

              <CalendarGrid doors={sampleDoors} unlockedDays={unlockedDays} openedDays={openedDays} onOpenDoor={handleOpenDoor} previewMode={false} />



            </div>
          </div>
        </section>

        {/* Features */}
        

        {/* CTA */}
        
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center text-muted-foreground font-body border-t border-border">
        <p className="flex items-center justify-center gap-2">
          Made with <span className="text-christmas-red">❤️</span> for the holiday season
        </p>
      </footer>
    </div>;
};
const FeatureCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {};
export default Index;