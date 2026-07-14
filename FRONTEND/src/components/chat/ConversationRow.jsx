import { Avatar } from "@heroui/react";
import { AvatarWithOnlineIndicator } from "./AvatarWithOnlineIndicator";

/**
 * SUB-COMPONENT: ConversationRow
 * Renders an individual contact card list item row inside the sidebar feed grid.
 * 
 * Props accepted:
 * - 'user': The mapped configuration data block containing profile details (name, avatar link, initials, etc.).
 * - 'selected': A simple true/false boolean flag telling the row if the user has this conversation actively open.
 * - 'onSelect': The action event callback that sets this conversation ID as active in the Zustand store.
 */
export function ConversationRow({ user, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect} // Triggers 'setActiveConversationId' instantly when clicked
      
      // - 'flex w-full items-center': Aligns the avatar and name inline horizontally.
      // - 'text-left': Prevents standard buttons from automatically centering text elements.
      // - 'bg-accent-soft': A dynamic template style condition! If 'selected' evaluates to true, 
      //   it splashes an active soft background highlight color across the entire row so you know who you're talking to.
      className={`flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-default-100 ${
        selected ? "bg-accent-soft" : ""
      }`}
    >
      {/* 1. REAL-TIME AVATAR INDICATOR CELL */}
      {/* Passes down the online status boolean value flag dynamically straight to our indicator component dot. */}
      <AvatarWithOnlineIndicator isOnline={user.isOnline ?? true}>
        <Avatar className="size-12 shrink-0">
          {/* Main asset: hosted profile photograph */}
          <Avatar.Image alt={user.name} src={user.avatarUrl} />
          {/* Fallback asset: initial characters string fallback ring (e.g. "KR") */}
          <Avatar.Fallback className="text-sm font-medium">{user.initials}</Avatar.Fallback>
        </Avatar>
      </AvatarWithOnlineIndicator>

      {/* 2. PROFILE NAME LABEL DETAILS CONTAINER */}
      {/* - 'min-w-0 flex-1': A critical structural CSS combination that enables text truncation logic inside flex matrices. */}
      <div className="min-w-0 flex-1">
        {/* - 'truncate': If a user has a massive name that extends off the screen bounding frame box, 
            it automatically clips the overflow text cleanly and appends elegant trailing dots '...' */}
        <p className="truncate text-[15px] font-semibold text-foreground">{user.name}</p>
      </div>
      
    </button>
  );
}