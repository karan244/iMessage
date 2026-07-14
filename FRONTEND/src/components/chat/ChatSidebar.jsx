import { getInitials, useSelectedConversation } from "../../hooks/useSelectedConversation";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { APP_NAME, AppLogo } from "../AppLogo";
import { UserButton } from "@clerk/react";

import { SearchField, Tabs } from "@heroui/react";
import { MessageSquareIcon, UsersIcon } from "lucide-react";
import { ConversationRow } from "./ConversationRow";

/**
 * UTILITY LIST TRANSLATOR (mapUserForList)
 * Adapts raw user profiles into matching configurations for our contact rows.
 * Injects the live websocket state directly by checking if the user ID is in the online array.
 */
function mapUserForList(user, onlineUsers) {
  return {
    conversationId: user._id,
    id: user._id,
    name: user.fullName,
    avatarUrl: user.profilePic,
    initials: getInitials(user.fullName),
    isOnline: onlineUsers.includes(user._id), // Check if user is currently logged in and active
    peer: {
      name: user.fullName,
      avatarUrl: user.profilePic,
      initials: getInitials(user.fullName),
      isOnline: onlineUsers.includes(user._id),
    },
  };
}

function ChatSidebar() {
  // 1. ZUSTAND HOOK STATE SYNCS (Pull variables and updates out of storage engines)
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);

  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);

  const sidebarTab = useChatStore((state) => state.sidebarTab);
  const setSidebarTab = useChatStore((state) => state.setSidebarTab);

  const setActiveConversationId = useChatStore((state) => state.setActiveConversationId);

  // Grab the live array tracking active online user IDs via the WebSocket store
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // Extract layout viewport sizing contexts out of our responsive media query hook
  const { activeConversationId, isLargeScreen } = useSelectedConversation();

  // 2. SEARCH & FILTER INLINE PROCESSING
  // Trim trailing white spaces and lowercase everything to ensure searching is seamless and forgiving
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  // Translate raw system blocks into unified template data maps
  const conversationUsers = conversations.map((user) => mapUserForList(user, onlineUsers));
  const allUsers = users.map((user) => mapUserForList(user, onlineUsers));

  // Dynamic Array Filtering: If a user typed a search query, filter matching contacts by name string blocks
  const filteredConversations = normalizedSearchQuery
    ? conversationUsers.filter((conversation) =>
        conversation.peer.name.toLowerCase().includes(normalizedSearchQuery),
      )
    : conversationUsers;

  const filteredUsers = normalizedSearchQuery
    ? allUsers.filter((user) => user.name.toLowerCase().includes(normalizedSearchQuery))
    : allUsers;

  return (
    // MAIN SIDEBAR HOUSING ELEMENT
    // - '!isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"':
    //   Mobile view handling! On phones, if a conversation is open, hide this entire sidebar panel completely 
    //   so the chat stream can take up 100% of the screen space.
    <aside
      className={`w-full shrink-0 flex-col overflow-hidden border-r border-border bg-background lg:w-72 ${
        !isLargeScreen && activeConversationId ? "hidden lg:flex" : "flex"
      }`}
    >
      {/* HEADER STRIP: BRANDING TITLE & USER CLERK ACCOUNTS ACTION BUTTON */}
      <div className="shrink-0 border-b border-border px-2 pb-2 pt-2.5 sm:px-3 sm:pt-3">
        <div className="flex items-center gap-2 px-0.5 sm:gap-2.5 sm:px-1">
          <AppLogo size={32} className="size-8 shrink-0 rounded-[9px] sm:size-8.5" alt="" />
          <p className="flex-1 truncate text-lg font-bold tracking-tight sm:text-[22px]">
            {APP_NAME}
          </p>
          {/* Clerk Account Management Button: Pops up profile editing parameters instantly */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
        </div>
      </div>

      {/* INTERACTIVE COMPONENT TABS WRAPPER (HeroUI Component Stack) */}
      <Tabs
        selectedKey={sidebarTab}
        onSelectionChange={(key) => setSidebarTab(String(key))}
        variant="secondary"
        className="flex flex-1 flex-col overflow-hidden"
      >
        {/* THE SEARCH INPUT FIELD FRAME AREA */}
        <div className="shrink-0 border-b border-border px-3 pb-2 pt-2">
          <SearchField
            fullWidth
            variant="secondary"
            className="w-full"
            value={searchQuery}
            onChange={setSearchQuery} // Syncs text inputs straight back to Zustand store
          >
            <SearchField.Group className="rounded-xl">
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search" />
              {/* If a user has typed characters, render a clear 'X' button to instantly erase search filters */}
              {searchQuery ? <SearchField.ClearButton /> : null}
            </SearchField.Group>
          </SearchField>
        </div>

        {/* TAB NAVIGATION TOGGLES SELECTOR STRIP */}
        <Tabs.ListContainer className="shrink-0 border-b border-border px-2 pb-2 pt-1">
          <Tabs.List className="w-full gap-0.5">
            <Tabs.Tab id="chats" className="flex-1 justify-center gap-1.5">
              <MessageSquareIcon className="size-3.5 opacity-80" aria-hidden />
              Chats
            </Tabs.Tab>
            <Tabs.Tab id="users" className="flex-1 justify-center gap-1.5">
              <UsersIcon className="size-3.5 opacity-80" aria-hidden />
              Users
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        {/* TAB SCREEN PANEL 1: RECENT ACTIVE CHATS LIST */}
        <Tabs.Panel
          id="chats"
          className="flex-1 overflow-x-hidden overflow-y-auto outline-none"
        >
          {filteredConversations.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">
              No conversations match your search.
            </p>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationRow
                key={conversation.id}
                user={conversation}
                selected={conversation.id === activeConversationId} // Evaluates if highlighted background accents should apply
                onSelect={() => setActiveConversationId(conversation.id)} // Focuses conversation target when clicked
              />
            ))
          )}
        </Tabs.Panel>

        {/* TAB SCREEN PANEL 2: DISCOVER SYSTEM PEOPLE/CONTACTS LIST */}
        <Tabs.Panel id="users" className="flex-1 overflow-x-hidden overflow-y-auto outline-none">
          {filteredUsers.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-zinc-400">No people match your search.</p>
          ) : (
            filteredUsers.map((user) => (
              <ConversationRow
                key={user.conversationId}
                user={user}
                selected={user.conversationId === activeConversationId}
                onSelect={() => setActiveConversationId(user.conversationId)}
              />
            ))
          )}
        </Tabs.Panel>
      </Tabs>
    </aside>
  );
}

export default ChatSidebar;