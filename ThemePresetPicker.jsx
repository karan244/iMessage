import { Button, Modal, useOverlayState } from "@heroui/react";
import { Check, Palette } from "lucide-react";
import { applyThemePresetToDocument, useTheme } from "../context/theme";
import { HERO_UI_THEME_PRESETS } from "../data/herouiThemePresets";

export function ThemePresetPicker() {
  // 'useOverlayState' handles the open/close state logic for our HeroUI modal pop-up window.
  const modal = useOverlayState();
  
  // Custom context hook pulling our active theme identifier and its corresponding state updater function.
  const { themePreset, setThemePreset } = useTheme();

  // Triggered when a user clicks a color circle option
  const handleSelect = (id) => {
    // 1. Core Action: Manipulates raw HTML document roots or updates Tailwind variable mappings 
    //    so the system updates primary action button rendering styles globally.
    applyThemePresetToDocument(id);
    
    // 2. Local Sync: Saves selection context globally inside our React application state context.
    setThemePreset(id);
    
    // 3. UI Cleanup: Closes the color sheet drawer smoothly.
    modal.close();
  };

  return (
    <Modal.Root state={modal}>
      {/* THE HEADER BUTTON: Displays a clean paint-palette icon from lucide-react */}
      <Modal.Trigger>
        <Button variant="ghost" size="sm" isIconOnly className="text-foreground">
          <Palette className="size-5" />
        </Button>
      </Modal.Trigger>

      {/* MODAL LAYER BLOCK */}
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="md" scroll="inside" placement="center">
          <Modal.Dialog className="max-h-[85dvh] border border-white/10 bg-[#2a2a2c] text-foreground shadow-2xl">
            
            {/* TITLE BAR SECTION */}
            <Modal.Header className="flex flex-row items-center justify-between gap-3 border-b border-white/10 pb-3">
              <Modal.Heading className="text-lg font-semibold tracking-tight text-white">
                Accent theme
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>

            {/* MAIN CONTENT AREA */}
            <Modal.Body className="isolate pt-4">
              <p className="mb-4 text-sm text-zinc-400">
                HeroUI components use the accent color for primary actions and focus.
              </p>
              
              {/* THE RESPONSIVE RESPONSIVE GRID LAYOUT */}
              {/* - 'grid-cols-3 sm:grid-cols-4': Loops through colors displaying 3 icons wide on smaller screens, 
                  automatically scaling to 4 on standard tablet sizes. */}
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {HERO_UI_THEME_PRESETS.map((p) => {
                  // Truth evaluation check to check if this color swatch circle is the one actively enabled
                  const selected = themePreset === p.id;
                  
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelect(p.id)}
                      className={[
                        "relative flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-colors",
                        // Dynamic styling changes: If active, render a glowing border container ('ring-2 ring-accent'). 
                        // If inactive, give a soft gray opacity layer on mouse hover.
                        selected
                          ? "bg-white/10 ring-2 ring-accent ring-offset-2 ring-offset-[#2a2a2c]"
                          : "hover:bg-white/6",
                      ].join(" ")}
                      aria-pressed={selected}
                    >
                      {/* COLOR CIRCLE CARD ASSET CONTAINER */}
                      <span className="relative">
                        {/* - 'style={{ background: p.swatch }}': Directly injects the custom hex code string 
                            (e.g., #FF0000) from our presets array data straight into the background circle asset. */}
                        <span
                          className="block size-14 shrink-0 rounded-full shadow-md ring-1 ring-white/20"
                          style={{ background: p.swatch }}
                        />

                        {/* FLOATING CORNER CHECKMARK: Renders on the top right corner of the swatch circle ONLY when selected */}
                        {selected ? (
                          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md">
                            <Check className="size-3" strokeWidth={3} />
                          </span>
                        ) : null}
                      </span>
                      
                      {/* SWATCH COLOR TITLE LABEL (e.g., "Emerald", "Ocean Blue") */}
                      <span
                        className={[
                          "text-[11px] font-medium leading-tight",
                          selected ? "text-white" : "text-zinc-400",
                        ].join(" ")}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Modal.Body>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}