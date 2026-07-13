import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/theme";

export function ThemeToggle() {
  // We extract the current theme ("light" or "dark") and the updater function from our global context hook.
  const { theme, setTheme } = useTheme();

  return (
    // 1. OUTER CONTAINER PUSH BUTTON PILL
    // - 'rounded-full': Shapes this pill container into a perfectly curved capsule.
    // - 'bg-surface border-default': Uses global semantic theme colors (so the pill container background color 
    //   adapts nicely whether it's sitting on a light or dark page background).
    // - 'p-1': Adds uniform padding around the buttons inside so they sit comfortably like an apple dashboard switch.
    <div className="flex items-center gap-1 rounded-full border border-default bg-surface p-1 shadow-sm">
      
      {/* 2. LIGHT MODE BUTTON (THE SUN) */}
      <Button
        size="sm"
        // DYNAMIC RENDERING: If the active state is "light", give it a solid "primary" backdrop highlight color.
        // If it isn't active, strip the backdrop entirely ("ghost") so it stays subtle.
        variant={theme === "light" ? "primary" : "ghost"}
        isIconOnly // Truncates default text button alignments to cleanly focus a perfect bounding box around the icon asset.
        onPress={() => setTheme("light")} // HeroUI uses 'onPress' (instead of standard onClick) to natively support fast mobile touches!
      >
        <Sun className="size-4" />
      </Button>

      {/* 3. DARK MODE BUTTON (THE MOON) */}
      <Button
        size="sm"
        // DYNAMIC RENDERING: If the active state is "dark", activate the highlighted "primary" button variant style block.
        // Otherwise, render it as a ghost icon placeholder frame.
        variant={theme === "dark" ? "primary" : "ghost"}
        isIconOnly
        onPress={() => setTheme("dark")} // Triggers state shift updating the root document element classList hooks to dark mode.
      >
        <Moon className="size-4" />
      </Button>
      
    </div>
  );
}