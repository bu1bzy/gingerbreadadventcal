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
  frontImageUrl?: string | null;
  frontHoverImageUrl?: string | null;
  onOpen?: (day: number) => void;
  previewMode?: boolean;
}

export const AdventDoor = ({ 
  day, 
  isUnlocked, 
  isOpened, 
  content,
  frontImageUrl,
  frontHoverImageUrl,
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
            (isFlipped || isOpened) && "flipped",
            "group" // enable group-hover for child image swapping
          )}
        >
          {/* Front of door */}
          <div
            className={cn(
              "flip-card-front absolute inset-0 overflow-hidden",
              isUnlocked || previewMode 
                ? "cursor-pointer hover:scale-105" 
                : "cursor-not-allowed opacity-70"
            )}
          >
            {/* render optional front images as background layers; text/icons remain above */}
            {frontImageUrl && (
              <img
                src={frontImageUrl}
                alt={`Day ${day} front`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
            )}

            {frontHoverImageUrl && (
              <img
                src={frontHoverImageUrl}
                alt={`Day ${day} front hover`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            )}
          </div>

          {/* Back of door (revealed content preview) */}
          <div
            className={cn(
              "flip-card-back absolute inset-0 overflow-hidden"
            )}
          >
            {/* Show hover image as the back of door */}
            {frontHoverImageUrl && (
              <img
                src={frontHoverImageUrl}
                alt={`Day ${day} back`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
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
              <p className="text-center font-body text-sm whitespace-pre-line leading-relaxed">
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
