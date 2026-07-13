import { AuthActionPanel } from "../components/auth/AuthActionPanel";
import AuthHeader from "../components/auth/AuthHeader";
import { AuthHeroPanel } from "../components/auth/AuthHeroPanel";
import { useWallpaper } from "../context/wallpaper";

function AuthPage() {
  // We extract 'frameStyle' from our global wallpaper context.
  // This custom context object dynamically tracks and returns CSS properties 
  // (like custom padding, background-color blends, or wallpaper image properties) 
  // depending on what wallpaper background the user picks in the header picker.
  const { frameStyle } = useWallpaper();

  return (
    // 1. THE MAIN DEVICE VIEWPORT WRAPPER
    // - 'min-h-dvh': Stands for 'Dynamic Viewport Height'. It makes the container expand to exactly 
    //   100% of the screen height, perfectly adjusting if mobile browsers slide their URL search bars away.
    // - 'p-3 sm:p-5 md:p-8': Adds dynamic layout margins around our primary central dashboard card.
    // - 'style={frameStyle}': Binds our wallpaper style configs straight into the absolute structural container.
    <div className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8" style={frameStyle}>
      
      {/* 2. THE FLOATING APPLICATION CARD SHELL */}
      {/* - 'max-w-368': Restricts the maximum layout scale width to a clean desktop dimension size. */}
      {/* - 'bg-background text-foreground': Employs HeroUI structural token classes so the container 
          swaps backgrounds instantly if a user clicks light or dark mode themes. */}
      {/* - 'overflow-hidden rounded-3xl': Rounds off the outer corners with a premium curved design 
          and ensures internal content (like header strips) gets cropped cleanly at the boundaries. */}
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground">
        
        {/* THE NAVBAR TOP PANEL: Contains app branding metadata and wallpaper/theme switches */}
        <AuthHeader />

        {/* 3. THE SPLIT-SCREEN MAIN WORKING VIEWPORTS */}
        {/* - 'md:flex-row': Layout Engine Matrix! On phone displays, the layout defaults to a column vertical stack 
            (Hero banner on top, Sign-in button below it). The moment it hits a medium screen size (tablets/laptops), 
            it flips into a horizontal row, sliding them into beautiful side-by-side columns! */}
        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          
          {/* LEFT PANEL (Desktop): Displays the floating cyber-gateway title grid and infographic */}
          <AuthHeroPanel />
          
          {/* RIGHT PANEL (Desktop): Hosts the secure Sparkles badge and Clerk authentication login buttons */}
          <AuthActionPanel />
          
        </main>
      </div>
    </div>
  );
}

export default AuthPage;