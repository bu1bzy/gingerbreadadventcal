import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Calendar, Share2 } from 'lucide-react';
const Index = () => {
  const [openedDays, setOpenedDays] = useState<number[]>([]);

  // Sample calendar with some example content
  const getDoorImages = (day: number) => {
    // All days 1-12 have custom images
    if (day > 12) return { front_image_url: null, front_hover_image_url: null };
    return {
      front_image_url: `/images/day${day}-front.png`,
      front_hover_image_url: `/images/day${day}-front-hover.png`,
    };
  };

  const sampleDoors = useMemo(() => Array.from({
    length: 12
  }, (_, i) => {
    const day = i + 1;
    const images = getDoorImages(day);
    return {
      day_number: day,
      content_text: ["🎄 Welcome to Advent! Let the countdown begin!", "❄️ May your day sparkle like fresh snow!", "🎁 The best gift is time spent with loved ones", "⭐ Make a wish upon the Christmas star", "🕯️ Light a candle, spread some warmth", "🦌 Rudolph says hello!", "🍪 Time for cookies and hot cocoa!", "🎵 Sing your favorite Christmas carol", "❤️ Share kindness with someone today", "🌟 You're on the nice list!", "🎅 Ho ho ho! Keep the spirit alive!", "🔔 Jingle all the way!"][i],
      ...images,
    };
  }), []);

  // In preview mode, all days are "unlocked"
  const unlockedDays = Array.from({
    length: 12
  }, (_, i) => i + 1);
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
            <h1 className="font-display lg:text-8xl mb-6 snow-text animate-fade-in text-3xl text-secondary md:text-4xl">✨Advent Calendar✨</h1>
            <p style={{
            animationDelay: '0.1s'
          }} className="font-body text-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in md:text-xl text-lg">Behind each door is a surprise awaiting!
Doors unlock at midnight!</p>
            
          </div>
        </section>

        {/* Sample Calendar */}
        <section className="px-4 py-[5px]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              
              
            </div>
            
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-xl border border-christmas-gold/20 p-4 md:p-8 christmas-glow">
              <CalendarGrid doors={sampleDoors} unlockedDays={unlockedDays} openedDays={openedDays} onOpenDoor={handleOpenDoor} previewMode={true} />
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