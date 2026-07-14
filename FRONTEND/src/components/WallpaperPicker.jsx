import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, ImageIcon } from "lucide-react";
import { useTransition } from "react";
import { useWallpaper } from "../context/wallpaper";
import { WALLPAPER_SECTIONS, WALLPAPERS } from "../data/wallpapers";

/**
 * 1. THE INDIVIDUAL WALLPAPER BUTTON COMPONENT (WallpaperThumb)
 * This sub-component renders each individual thumbnail image card inside the picker grid.
 */
function WallpaperThumb({ wallpaper, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(wallpaper.id)} // Fires the selection handler when clicked
      className={[
        // - 'aspect-4/3': Forces the button to maintain a standard photography dimension ratio (4 wide by 3 tall).
        // - 'contain-[layout]': Advanced CSS trick that tells the browser engine this item won't affect the size of other components, boosting UI rendering performance.
        "relative aspect-4/3 w-full overflow-hidden rounded-xl bg-zinc-900 contain-[layout]",
        
        // Dynamic Outline: If selected, draw a solid white highlight border ring. If not, make it transparent until hovered.
        selected
          ? "outline-2 outline-offset-2 outline-white"
          : "outline-1 outline-transparent hover:outline-white/45",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a2a2c]",
      ].join(" ")}
      aria-pressed={selected} // Accessibility flag telling screen readers whether this option is currently active
    >
      {/* PERFORMANCE TRICK: Highly Optimized Thumb Image */}
      <img
        src={wallpaper.url}
        alt=""
        width={320}
        height={240}
        className="pointer-events-none h-full w-full object-cover select-none"
        loading="lazy"         // Don't load this image until the user actually scrolls it into view inside the modal.
        decoding="async"       // Decodes the image data in the background to prevent the modal popup animation from lagging.
        fetchPriority="low"    // Tells the browser to download these small thumbnails with lower priority than your main content.
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px" // Responsive image scaling instruction
        referrerPolicy="no-referrer"
        draggable={false}
      />
      
      {/* Absolute overlay banner displaying the title string of the theme backdrop */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-black/55 px-2 py-1.5 text-left text-[11px] font-medium leading-tight text-white/95">
        {wallpaper.label}
      </span>
      
      {/* THE GREEN CHECKMARK ACCENT: Only renders a floating check circle if this specific thumb is selected */}
      {selected ? (
        <span className="absolute right-1.5 top-1.5 z-10 flex size-6 items-center justify-center rounded-full bg-white text-[#1a1a1c] shadow-md">
          <Check className="size-3.5" strokeWidth={3} />
        </span>
      ) : null}
    </button>
  );
}

/**
 * 2. MAIN WALLPAPER PICKER DIALOG WRAPPER
 */
export function WallpaperPicker() {
  // 'useOverlayState' controls whether this pop-up modal panel is open or closed.
  const modal = useOverlayState();
  
  // Custom context hook pulling the global active wallpaper ID state and modifier function.
  const { wallpaperId, setWallpaperId } = useWallpaper();
  
  // 'useTransition' is a React hook used to prevent heavy state updates from freezing your UI.
  const [, startTransition] = useTransition();

  // Triggered when a thumbnail is clicked
  const handleSelect = (id) => {
    modal.close(); // Close the pop-up modal window cleanly
    
    // 'startTransition' tells React: "Change the wallpaper state in the background. 
    // If the browser is busy rendering it, don't freeze the modal close animation!"
    startTransition(() => {
      setWallpaperId(id);
    });
  };

  return (
    <Modal.Root state={modal}>
      {/* THE TRIGGER: The tiny icon button inside the header bar that opens this picker */}
      <Modal.Trigger>
        <Button variant="ghost" size="sm" isIconOnly className="text-foreground">
          <ImageIcon className="size-5" />
        </Button>
      </Modal.Trigger>

      {/* THE MODAL POPUP LAYER */}
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] border border-white/10 bg-[#2a2a2c] text-foreground shadow-2xl">
            
            {/* MODAL TITLE ROW */}
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-white">
                Backdrop
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            {/* MODAL MAIN CONTENT: The Category Sections & Grid loops */}
            {/* - 'scroll="inside"' on the container ensures if you have 50 images, only the body scrolls while the header stays locked in view. */}
            <Modal.Body className="isolate space-y-8 pt-4">
              {/* Outer Loop: Maps through sections (e.g., "Solid Colors", "Graphic Blurs") */}
              {WALLPAPER_SECTIONS.map((section) => (
                <section key={section.id} className="space-y-3">
                  <h3 className="text-sm font-medium text-zinc-400">{section.title}</h3>
                  
                  {/* Inner Layout: A beautifully responsive layout grid matching columns to screen widths */}
                  {/* - 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4': 2 columns on phones, 3 on tablets, 4 on desktop monitors. */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {/* Inner Loop: Filter wallpaper array to show only ones belonging to this section category */}
                    {WALLPAPERS.filter((w) => w.category === section.id).map((w) => (
                      <WallpaperThumb
                        key={w.id}
                        wallpaper={w}
                        selected={wallpaperId === w.id} // Truth checker determining if outline/checkmark render
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </Modal.Body>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}