import { AdventDoor } from './AdventDoor';

interface DoorData {
  day_number: number;
  content_text?: string | null;
  content_image_url?: string | null;
  content_link?: string | null;
  background_color?: string | null;
  front_image_url?: string | null;
  front_hover_image_url?: string | null;
}

interface CalendarGridProps {
  doors: DoorData[];
  unlockedDays: number[];
  openedDays: number[];
  onOpenDoor?: (day: number) => void;
  previewMode?: boolean;
}

export const CalendarGrid = ({ 
  doors, 
  unlockedDays, 
  openedDays, 
  onOpenDoor,
  previewMode = false
}: CalendarGridProps) => {
  // Create array for all 12 days
  const allDays = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 max-w-2xl mx-auto">
      {allDays.map((day) => {
        const doorData = doors.find(d => d.day_number === day);
        return (
          <AdventDoor
            key={day}
            day={day}
            isUnlocked={unlockedDays.includes(day)}
            isOpened={openedDays.includes(day)}
            content={{
              text: doorData?.content_text,
              imageUrl: doorData?.content_image_url,
              link: doorData?.content_link,
            }}
            frontImageUrl={doorData?.front_image_url ?? null}
            frontHoverImageUrl={doorData?.front_hover_image_url ?? null}
            onOpen={onOpenDoor}
            previewMode={previewMode}
          />
        );
      })}
    </div>
  );
};
