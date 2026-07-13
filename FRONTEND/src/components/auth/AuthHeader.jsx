import { APP_NAME, AppLogo } from "../AppLogo";
import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

function AuthHeader() {
  return (
    // 1. THE HEADER CONTAINER
    // - 'sticky top-0 z-10': Locks the header to the very top of the page when scrolling, staying above text content.
    // - 'flex shrink-0 items-center gap-2': Uses flexbox to align content horizontally in a straight line, preventing the header from shrinking if the page gets tight.
    // - 'border-b bg-[#F6F6F6]/95 ... dark:bg-[#1C1C1E]/95': Applies subtle bottom borders and semi-transparent backgrounds with a fallback for light/dark mode.
    // - 'backdrop-blur-md': Gives that premium, glassy, blurry look to the background color when text scrolls underneath it.
    <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b border-black/10 bg-[#F6F6F6]/95 px-3 py-2 backdrop-blur-md dark:border-white/10 dark:bg-[#1C1C1E]/95">
      
      {/* 2. LEFT SIDE: LOGO AND BRANDING */}
      {/* - 'flex-1': Tells this container to take up all the available horizontal space it can, pushing the utility controls to the far right. */}
      {/* - 'gap-2.5': Puts a nice, clean space between the logo image and the text grouping next to it. */}
      <div className="flex flex-1 items-center gap-2.5 px-1">
        {/* The component representing your app's graphic icon */}
        <AppLogo size={30} className="rounded-[7px]" alt="" />

        <div>
          {/* - 'truncate': Safety feature. If the app name is super long, it cuts off cleanly with '...' instead of breaking the layout. */}
          {/* - 'leading-tight': Reduces default line spacing so the subtext sits cleanly underneath the main title. */}
          <p className="truncate text-[15px] font-semibold leading-tight">{APP_NAME}</p>
          <p className="truncate text-xs text-[#8E8E93] dark:text-[#98989D]">Private session</p>
        </div>
      </div>

      {/* 3. RIGHT SIDE: UTILITY CONTROLS */}
      {/* - 'shrink-0': Guarantees these utility pickers will never get crushed or distorted on small phone screen sizes. */}
      {/* - 'gap-0.5': Keeps the control buttons extremely close together for a tight, polished desktop tool navbar feel. */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* Component to change chat background wallpaper */}
        <WallpaperPicker />

        {/* Component to choose accent color palettes/presets */}
        <ThemePresetPicker />

        {/* Component to instantly toggle between Light Mode and Dark Mode */}
        <ThemeToggle />
      </div>
    </header>
  );
}

export default AuthHeader;