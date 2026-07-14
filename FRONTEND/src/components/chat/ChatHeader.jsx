import { Avatar, Button } from "@heroui/react";
import { ChevronLeftIcon, Volume2Icon, VolumeXIcon, XIcon } from "lucide-react";
import { AppLogo } from "../AppLogo";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

import { ThemePresetPicker } from "../ThemePresetPicker";
import { ThemeToggle } from "../ThemeToggle";
import { WallpaperPicker } from "../WallpaperPicker";

import { useChatStore } from "../../store/useChatStore";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function ChatHeader() {
  // 1. STATE SELECTORS FROM ZUSTAND
  // Grabs the sound alert preference configuration and the room switching action function.
  const isSoundEnabled = useChatStore((state) => state.isSoundEnabled);
  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);
  const setSoundEnabled = useChatStore((state) => state.setSoundEnabled);

  // 2. DATA ADAPTER CONTEXT
  // Gathers our cleanly transformed active peer profile details and current screen scale measurements.
  const { activeConversation, isLargeScreen } = useSelectedConversation();

  return (
    // 'sticky top-0 z-10': Locks the header component directly to the absolute top edge of the chat panel workspace container.
    <header className="sticky top-0 z-10 flex shrink-0 flex-wrap items-center gap-1 border-b border-border bg-background px-1.5 py-1.5 sm:gap-2 sm:px-2 sm:py-2">
      
      {/* MOBILE BACK BUTTON (Responsive Navigation Guard) */}
      {/* Condition: If a conversation thread is open, AND the user is viewing this application on a tiny smartphone display, 
          render a back arrow button to let them jump backwards into the sidebar list! */}
      {activeConversation && !isLargeScreen ? (
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="shrink-0"
          onPress={() => setActiveConversationId(null)} // Wipes out active ID state, shifting mobile view back to sidebar list
        >
          <ChevronLeftIcon className="size-6" strokeWidth={2.25} />
        </Button>
      ) : null}

      {/* CONDITIONAL RENDERING BRANCHING POINT */}
      {activeConversation ? (
        // ==========================================
        // DYNAMIC STATE A: AN ACTIVE CONVERSATION IS HIGHLIGHTED
        // ==========================================
        <>
          {/* Custom graphic ring wrapper component that mounts a tiny green ring dot on top of the profile circle layout */}
          <AvatarWithOnlineIndicator isOnline={activeConversation.peer.isOnline ?? true}>
            <Avatar className="size-9 shrink-0">
              {/* Primary: Attempt to download and render the friend's hosted avatar image link */}
              <Avatar.Image
                alt={activeConversation.peer.name}
                src={activeConversation.peer.avatarUrl}
              />
              {/* Secondary Fallback: If image fails or doesn't exist, display their JD capital initials instead! */}
              <Avatar.Fallback className="text-sm font-medium">
                {activeConversation.peer.initials}
              </Avatar.Fallback>
            </Avatar>
          </AvatarWithOnlineIndicator>

          {/* ACTIVE IDENTITY METADATA TEXT */}
          <div className="flex-1 text-center sm:text-left">
            <p className="truncate text-[15px] font-semibold leading-tight">
              {activeConversation.peer.name}
            </p>
            <p className="truncate text-xs text-muted">
              {/* True/False check matching the user's current live WebSocket connection pulse */}
              {activeConversation.peer.isOnline ? (
                <span className="font-medium text-success">Online</span>
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </>
      ) : (
        // ==========================================
        // DYNAMIC STATE B: EMPTY SPACE STAGE (NO ACTIVE CONVERSATION SELECTED)
        // ==========================================
        <div className="flex flex-1 items-center gap-2.5 sm:text-left">
          <AppLogo size={36} className="rounded-[9px]" />
          <div className="flex-1 text-center sm:text-left">
            <p className="truncate text-[13px] font-medium text-muted">Select a conversation</p>
          </div>
        </div>
      )}

      {/* UTILITY BAR TOOLSET ROW (Right Side Action Alignments) */}
      <div className="ml-auto flex max-w-full shrink-0 flex-wrap items-center justify-end gap-0.5 sm:gap-1">
        
        {/* 'hidden min-[400px]:contents': Clean CSS layout optimization flag.
            Hides the custom color pickers and wallpaper grids on super small screens (like ancient phone profiles) 
            to prevent elements from squishing or layout breaking inside the upper row. */}
        <div className="hidden min-[400px]:contents">
          {/* Custom dialog drawers built in prior script sections */}
          <WallpaperPicker />
          <ThemePresetPicker />
        </div>

        {/* The Capsule pill theme switcher icon block toggle */}
        <ThemeToggle />

        {/* INTERACTIVE NOTIFICATION VOLUME SWITCH TRIGGER */}
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="shrink-0"
          aria-pressed={isSoundEnabled}
          onPress={() => setSoundEnabled(!isSoundEnabled)} // Flips local browser volume configuration states on touch
        >
          {/* Renders a speaker icon with soundwaves if true, otherwise renders a speaker icon slashed out */}
          {isSoundEnabled ? (
            <Volume2Icon className="size-5.5" strokeWidth={2} aria-hidden />
          ) : (
            <VolumeXIcon className="size-5.5" strokeWidth={2} aria-hidden />
          )}
        </Button>

        {/* ABSOLUTE 'X' PANIC EXIT BUTTON */}
        {/* If a window is currently active, render a close button right on the far edge to let desktop users close out chat panes cleanly. */}
        {activeConversation ? (
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="shrink-0"
            aria-label="Close chat"
            onPress={() => setActiveConversationId(null)}
          >
            <XIcon className="size-5.5" strokeWidth={2} aria-hidden />
          </Button>
        ) : null}
      </div>
    </header>
  );
}