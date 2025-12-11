import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Lock, Gift, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DoorContent {
  text?: string | null;
  imageUrl?: string | null;
  link?: string | null;
}

interface AdventDoorProps {
  day: number;
  isUnlocked: boolean;
  isOpened: boolean;
  content?: DoorContent;
  onOpen?: (day: number) => void;
  previewMode?: boolean;
}

export const AdventDoor = ({ 
  day, 
  isUnlocked, 
  isOpened, 
  content,
  onOpen,
  previewMode = false
}: AdventDoorProps) => {
  const [showContent, setShowContent] = useState(false);
  const [isFlipped, setIsFlipped] = useState(isOpened);

  const handleClick = () => {
    if (!isUnlocked && !previewMode) return;
    
    if (!isFlipped && onOpen) {
      setIsFlipped(true);
      setTimeout(() => {
        onOpen(day);
        setShowContent(true);
      }, 600);
    } else {
      setShowContent(true);
    }
  };

  const getDoorColor = () => {
    if (!isUnlocked && !previewMode) return 'bg-door-locked';
    if (isFlipped || isOpened) return 'bg-door-opened';
    return 'bg-door-unopened';
  };

  const defaultContent: DoorContent = {
    text: `🎄 Day ${day} of Christmas! 🎄\n\nMay your day be filled with joy and wonder!`,
  };

  const displayContent = content?.text || content?.imageUrl ? content : defaultContent;

  return (
    <>
      <div className="flip-card aspect-square">
        <button
          onClick={handleClick}
          disabled={!isUnlocked && !previewMode}
          className={cn(
            "flip-card-inner w-full h-full relative",
            (isFlipped || isOpened) && "flipped"
          )}
        >
          {/* Front of door */}
          <div
            className={cn(
              "flip-card-front absolute inset-0 rounded-xl door-shadow transition-all duration-300",
              "flex items-center justify-center overflow-hidden",
              "border-4 border-christmas-gold/30",
              getDoorColor(),
              isUnlocked || previewMode 
                ? "cursor-pointer hover:scale-105 hover:border-christmas-gold" 
                : "cursor-not-allowed opacity-70"
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "font-display text-2xl md:text-3xl lg:text-4xl font-bold",
                isUnlocked || previewMode ? "text-christmas-snow" : "text-christmas-snow/60"
              )}>
                {day}
              </span>
              
              <div className="mt-1">
                {!isUnlocked && !previewMode ? (
                  <Lock className="w-4 h-4 text-christmas-snow/50" />
                ) : (
                  <Star className="w-4 h-4 text-christmas-gold animate-twinkle" />
                )}
              </div>
            </div>

            {(isUnlocked || previewMode) && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-christmas-gold/30" />
            )}
            
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-christmas-gold/40" />
            <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-christmas-gold/40" />
          </div>

          {/* Back of door (revealed content preview) */}
          <div
            className={cn(
              "flip-card-back absolute inset-0 rounded-xl door-shadow",
              "flex items-center justify-center overflow-hidden",
              "border-4 border-christmas-gold/50",
              "bg-christmas-green cursor-pointer"
            )}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              {displayContent.imageUrl ? (
                <img 
                  src={displayContent.imageUrl} 
                  alt={`Day ${day}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <Gift className="w-6 h-6 text-christmas-gold mb-1" />
                  <span className="font-display text-lg text-christmas-snow">
                    Day {day}
                  </span>
                </>
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Content Dialog */}
      <Dialog open={showContent} onOpenChange={setShowContent}>
        <DialogContent className="bg-card border-christmas-gold/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-center text-christmas-red flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-christmas-gold" />
              Day {day}
              <Star className="w-6 h-6 text-christmas-gold" />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {displayContent.imageUrl && (
              <img 
                src={displayContent.imageUrl} 
                alt={`Day ${day} surprise`}
                className="w-full rounded-lg shadow-md"
              />
            )}
            {displayContent.text && (
              <p className="text-center font-body text-lg whitespace-pre-line leading-relaxed">
                {displayContent.text}
              </p>
            )}
            {displayContent.link && (
              <a 
                href={displayContent.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-christmas-green hover:text-christmas-green-light underline font-medium"
              >
                Open Link →
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
