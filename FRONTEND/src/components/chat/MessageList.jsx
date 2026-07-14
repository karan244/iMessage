import useScrollToBottom from "../../hooks/useScrollToBottom";
import { MessageBubble } from "./MessageBubble";
import { NoConversationPlaceholder } from "./NoConversationPlaceholder";
import { useSelectedConversation } from "../../hooks/useSelectedConversation";

export function MessageList() {
  // 1. ADAPTER INTEGRATION
  // We extract the cleanly translated conversation details and active thread ID from our custom hook.
  const { activeConversation, activeConversationId } = useSelectedConversation();

  // 2. ISOLATING THE LAST ITEM TRIGGER
  // - 'activeConversation?.messages.at(-1)': The '.at(-1)' method is a handy modern JavaScript trick 
  //   that safely peaks inside an array to grab the absolute LAST item without checking array length!
  //   If messages exist, we isolate its unique ID so our scroll hook knows precisely when a new text lands.
  const lastMessageId = activeConversation?.messages.at(-1)?.id;

  // 3. ANCHORING THE SCROLL REFERENCE POINTER
  // We pass the tracking metrics down to our custom scrolling engine hook to obtain our scroll control pointer handle.
  const messagesScrollRef = useScrollToBottom(activeConversationId, lastMessageId);

  return (
    // Outer layout workspace box container
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      
      {/* CONDITIONAL BRANCHING: Verify if a chat thread window is actively selected */}
      {activeConversation ? (
        // ==========================================
        // DYNAMIC STATE A: CHAT FEED DISPLAY STAGE
        // ==========================================
        <div
          ref={messagesScrollRef} // Physically anchors our custom scroll hook pointer handle onto this DOM layout element!
          
          // - 'overflow-y-auto': Enables vertical mouse-wheel scrolling only if content bubbles bleed off-screen.
          // - 'overscroll-contain': A fantastic UI mobile optimization class! It locks scroll boundaries 
          //   strictly to this box container, preventing the main browser body webpage from bouncing or scrolling 
          //   when you scroll all the way to the top or bottom edge of your message list on mobile devices.
          className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-2 py-3 sm:px-3 sm:py-4"
        >
          {/* HARDCODED DATETIME SEPARATOR LABEL STRIP */}
          <p className="mb-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted">
            Today
          </p>

          {/* THE RENDERING ENGINE LOOP */}
          {/* We cycle through our mapped message logs array using standard '.map()'. 
              For every single message packet entry present inside the array, we instantiate 
              and paint a unique '<MessageBubble />' component item onto the timeline grid stack. */}
          {activeConversation.messages.map((message) => (
            <MessageBubble 
              key={message.id}   // React unique layout key identifier required for fast item updating in lists
              message={message} // Passes individual message properties (text, role, timestamp) straight into the bubble child layout
            />
          ))}
        </div>
      ) : (
        // ==========================================
        // DYNAMIC STATE B: EMPTY ROOM STAGE
        // ==========================================
        // Renders the fullscreen premium application branding placeholder graphic if 'activeConversation' evaluates to null.
        <NoConversationPlaceholder />
      )}
    </div>
  );
}