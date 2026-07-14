import { useWallpaper } from "../context/wallpaper";
import { useChatStore } from "../store/useChatStore";
import { useSelectedConversation } from "../hooks/useSelectedConversation";
import { useEffect } from "react";
import ChatSidebar from "../components/chat/ChatSidebar";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { ChatComposer } from "../components/chat/ChatComposer";

function ChatPage() {
  // Pulls the selected chat screen background structure style parameters from the active theme provider context
  const { frameStyle } = useWallpaper();

  // 1. ZUSTAND SELECTORS: Pulling chat actions from the database store pipeline
  const getConversations = useChatStore((state) => state.getConversations);
  const getMessages = useChatStore((state) => state.getMessages);
  const getUsers = useChatStore((state) => state.getUsers);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  const unsubscribeFromMessages = useChatStore((state) => state.unsubscribeFromMessages);

  // 2. CHAT LAYOUT HOOK: Tracks which specific user/room we have open, and if we are on a desktop screen
  const { activeConversation, activeConversationId, isLargeScreen } = useSelectedConversation();

  // 3. COMPONENT INITIALIZATION
  // This side effect hook fires off exactly once when this page renders to load our initial contacts 
  // list and active conversation rows out of the database cluster.
  useEffect(() => {
    getUsers();
    getConversations();
  }, [getConversations, getUsers]);

  // 4. REALTIME SUBSCRIBER TUNNEL LIFECYCLE
  // Runs automatically whenever a user switches conversations in the application sidebar.
  useEffect(() => {
    // If no specific conversation window is highlighted, stop right here.
    if (!activeConversationId) return;

    // Load old text logs, and open up the WebSocket pipeline for new messages coming to this specific channel.
    getMessages(activeConversationId);
    subscribeToMessages(activeConversationId);

    // CLEANUP FUNCTION (The "Hang up" mechanism):
    // Crucial practice! When the user clicks away or switches to a completely different friend, 
    // React fires this return block to cleanly detach the old websocket connection listener before opening the new one.
    return () => unsubscribeFromMessages();
  }, [getMessages, activeConversationId, subscribeToMessages, unsubscribeFromMessages]);

  return (
    // Outer dynamic frame layout that implements our global custom background backdrop variables
    <div className="flex h-dvh flex-col overflow-hidden p-2 sm:p-3 md:p-8" style={frameStyle}>
      
      {/* CENTRALIZED DASHBOARD WORKSPACE */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden rounded-2xl border border-border bg-background text-foreground">
        
        {/* THE ACTIVE USER/CONTACTS LIST PANELS (Left side strip) */}
        <ChatSidebar />

        {/* 5. RESPONSIVE CONVERSATION SCREEN WRAPPER CONTAINER (Right side window) */}
        {/* - '!isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"': 
            Brilliant dynamic layout handling! On a smartphone screen size, if the user hasn't selected a 
            specific chat thread yet, this code completely hides the empty window space so the sidebar expands 
            to fill the entire screen. The moment they click a name, it lights up the chat screen area! */}
        <div
          className={`flex-1 flex-col overflow-hidden ${
            !isLargeScreen && !activeConversationId ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Top layout strip containing friend's avatar identity and active socket green online state */}
          <ChatHeader />
          
          {/* Scrollable grid screen displaying the actual bubble list timeline elements */}
          <MessageList />

          {/* CHAT INPUT AREA COMPOSER */}
          {/* - 'activeConversation ? <ChatComposer /> : null': Safety Guard block. 
              Only render the input text area and attach file button if a conversation thread is actually active! */}
          {activeConversation ? <ChatComposer /> : null}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;