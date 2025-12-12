import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Snowfall } from '@/components/Snowfall';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Calendar, Share2, Edit2, X } from 'lucide-react';
import { useTimezone, getUnlockedDays } from '@/hooks/useTimezone';
const Index = () => {
  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editImage, setEditImage] = useState<string | null>(null);
  const [editLink, setEditLink] = useState<string | null>(null);

  // Sample door texts (editable state)
  const defaultTexts = [
    "🎄 Welcome to Advent! Let the countdown begin!",
    "❄️ May your day sparkle like fresh snow!",
    "🎁 The best gift is time spent with loved ones",
    "⭐ Make a wish upon the Christmas star",
    "🕯️ Light a candle, spread some warmth",
    "🦌 Rudolph says hello!",
    "🍪 Time for cookies and hot cocoa!",
    "🎵 Sing your favorite Christmas carol",
    "❤️ Share kindness with someone today",
    "🌟 You're on the nice list!",
    "🎅 Ho ho ho! Keep the spirit alive!",
    "🔔 Jingle all the way!"
  ];

  const [doorTexts, setDoorTexts] = useState(defaultTexts);
  const [doorImages, setDoorImages] = useState<(string | null)[]>(Array(12).fill(null));
  const [doorLinks, setDoorLinks] = useState<(string | null)[]>(Array(12).fill(null));

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
      content_text: doorTexts[i],
      content_image_url: doorImages[i] ?? null,
      content_link: doorLinks[i] ?? null,
      ...images,
    };
  }), [doorTexts, doorImages, doorLinks]);

  // Determine unlocked days using the calendar timezone so preview reflects real unlock dates
  const { timezone } = useTimezone();

  // Simulation controls (choose a date to preview unlocks)
  const [simulate, setSimulate] = useState(false);
  const [simDate, setSimDate] = useState(() => new Date().toISOString().slice(0, 10));

  const unlockedDays = (() => {
    if (simulate) {
      // build a Date at local midnight for the selected ISO date
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

  const handleSaveEdit = () => {
    if (editingDay !== null) {
      const newTexts = [...doorTexts];
      newTexts[editingDay - 1] = editText;
      setDoorTexts(newTexts);
      const newImages = [...doorImages];
      newImages[editingDay - 1] = editImage;
      setDoorImages(newImages);
      const newLinks = [...doorLinks];
      newLinks[editingDay - 1] = editLink;
      setDoorLinks(newLinks);
      setEditingDay(null);
      setEditText('');
      setEditImage(null);
      setEditLink(null);
    }
  };

  const openEditDialog = (day: number) => {
    setEditingDay(day);
    setEditText(doorTexts[day - 1]);
    setEditImage(doorImages[day - 1] ?? null);
    setEditLink(doorLinks[day - 1] ?? null);
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
            <div className="text-center mb-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setEditMode(!editMode)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-christmas-red text-white rounded text-sm hover:bg-christmas-red-light transition"
              >
                <Edit2 className="w-4 h-4" />
                {editMode ? 'Done Editing' : 'Edit Gifts'}
              </button>
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

              {/* Edit Gift Modal */}
              {editMode && editingDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                  <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 border border-christmas-gold/30">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-display text-christmas-red">Edit Day {editingDay}</h2>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <label className="block text-sm font-medium mb-1">Gift text</label>
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full h-24 border rounded px-3 py-2 mb-3 font-body text-sm resize-none"
                      placeholder="Enter gift text..."
                    />

                    <label className="block text-sm font-medium mb-1">Image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEditImage(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border rounded px-3 py-2 mb-3 text-sm"
                    />

                    <label className="block text-sm font-medium mb-1">Link (optional)</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={editLink ?? ''}
                        onChange={e => setEditLink(e.target.value || null)}
                        placeholder="https://example.com or /internal/path"
                        className="flex-1 border rounded px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => {
                          // generate QR from link using qrserver
                          if (editLink) {
                            const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(editLink)}`;
                            setEditImage(qr);
                          }
                        }}
                        disabled={!editLink}
                        className="px-3 py-2 bg-christmas-gold text-white rounded text-sm hover:brightness-95 disabled:opacity-50"
                      >
                        Generate QR
                      </button>
                    </div>

                    {editImage && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Image preview</label>
                        <img src={editImage} alt="preview" className="w-full h-auto rounded shadow-sm" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-4 py-2 bg-christmas-green text-white rounded hover:bg-christmas-green-light transition font-body"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingDay(null)}
                        className="flex-1 px-4 py-2 bg-muted text-foreground rounded hover:bg-muted/80 transition font-body"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Mode: Show Edit Buttons on Each Day */}
              {editMode && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      onClick={() => openEditDialog(day)}
                      className="px-2 py-1 bg-christmas-gold/20 hover:bg-christmas-gold/40 border border-christmas-gold/50 rounded text-sm font-body transition"
                    >
                      Edit Day {day}
                    </button>
                  ))}
                </div>
              )}
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