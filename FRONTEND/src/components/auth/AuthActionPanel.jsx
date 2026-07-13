import { useClerk } from "@clerk/react";
import { Button } from "@heroui/react";
import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { AppLogo } from "../AppLogo";
import { AuthCardShell } from "./AuthCardShell";

// Where the user gets redirected immediately after a successful authentication cycle
const AFTER_AUTH = "/";

// 1. TYPOGRAPHY & DESIGN STYLES FOR THE LOGO TILE CONTAINER
const logoTileClassName = [
  // - 'bg-linear-to-b from-white to-[#f2f2f7]': Modern Tailwind v4 syntax for vertical gradients.
  // - 'shadow-black/8 ring-1 ring-black/8': Combines a subtle drop shadow with a thin outer boundary accent border line.
  "relative rounded-2xl bg-linear-to-b from-white to-[#f2f2f7] p-2",
  "shadow-lg shadow-black/8 ring-1 ring-black/8",
  "dark:from-[#2c2c2e] dark:to-[#1a1a1c] dark:shadow-black/50 dark:ring-white/12",
].join(" ");

// 2. STYLES FOR THE CALL-TO-ACTION "CONTINUE" BUTTON
const continueButtonClassName = [
  // - 'group': Assigning the parent class 'group' allows child elements (like the arrow icon) to change properties when this container is hovered!
  // - 'shadow-xl shadow-accent/45': Gives the button a premium colored glow accent based on your current theme color.
  "group relative h-13 overflow-hidden rounded-2xl text-[15px] font-semibold",
  "shadow-xl shadow-accent/45 dark:shadow-accent/35",
  // - 'after: absolute': Creates a pseudo-element overlay layer to add a glossy inner top-border rim, giving it a tactile 3D glass effect.
  "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl",
  "after:shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
  "dark:after:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]",
].join(" ");

export function AuthActionPanel() {
  // 'useClerk' hooks into the global configuration parameters for the application's Clerk instance.
  const clerk = useClerk();

  return (
    // Main structural container row using flexbox to fill horizontal desktop layouts uniformly.
    <section className="relative flex flex-1 flex-col items-stretch justify-center overflow-hidden px-5 py-12 sm:px-10 md:px-14 md:py-10 lg:px-16">
      
      {/* Decorative grouping frame providing layout alignment structure */}
      <AuthCardShell>
        
        {/* LOGO BOX AND SUBTITLE BLOCK */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            {/* - 'bg-linear-to-br ... blur-xl': An empty absolute div positioned behind the logo that casts an ultra-soft colorful neon ambient backdrop aura glow. */}
            <div
              aria-hidden // Hides this presentation-only glow asset layer from screen reader assistance layouts
              className="absolute -inset-3.5 rounded-[20px] bg-linear-to-br from-accent/22 via-accent/8 to-transparent opacity-90 blur-xl dark:from-accent/28 dark:via-accent/10"
            />
            
            {/* The structural card framework holding the application logo symbol */}
            <div className={logoTileClassName}>
              <AppLogo size={52} className="rounded-xl" alt="" />
            </div>
          </div>

          {/* Secure badge metadata string label */}
          <div className="flex items-center justify-center gap-1.5 text-accent">
            <SparklesIcon className="size-3.5" strokeWidth={2} aria-hidden />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Secure entry
            </span>
          </div>
        </div>

        {/* CLERK PRIMARY ACTION TRIGGER BUTTON */}
        <Button
          fullWidth
          size="lg"
          variant="primary"
          className={continueButtonClassName}
          onPress={() => {
            // Fires an absolute overlay popup or modal window prompt managed by Clerk.
            // When authentication completes, Clerk safely redirects the user's active context window back to the dashboard route.
            clerk.openSignIn({ fallbackRedirectUrl: AFTER_AUTH, forceRedirectUrl: AFTER_AUTH });
          }}
        >
          <span className="relative z-1 flex items-center justify-center gap-2">
            Continue
            {/* - 'transition-transform group-hover:translate-x-0.5': When you hover over the button container, the arrow graphic shifts 0.5 units rightward dynamically! */}
            <ArrowRightIcon
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Button>

        {/* SECURITY SUB-FOOTER LOGO BADGE */}
        <div className="mt-8 flex items-center justify-center gap-2 border-t border-black/6 pt-6 text-[11px] text-[#8E8E93] dark:border-white/8 dark:text-[#636366]">
          {/* Green check shield emblem indicating encrypted data transmission */}
          <ShieldCheckIcon
            className="size-3.5 shrink-0 text-[#34C759] dark:text-[#30D158]"
            strokeWidth={2}
            aria-hidden
          />
          <span>Protected session · TLS encryption</span>
        </div>
        
      </AuthCardShell>
    </section>
  );
}