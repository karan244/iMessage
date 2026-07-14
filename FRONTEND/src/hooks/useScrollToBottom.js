import { useEffect, useRef } from "react";

/**
 * CUSTOM REACT HOOK: useScrollToBottom
 * Automatically scrolls a container layout to the bottom edge when:
 * 1. The active conversation thread changes ('threadKey').
 * 2. A new message item is sent or received ('lastItemId').
 * 
 * Returns a 'ref' controller pointer that you attach to your scrollable chat feed div.
 */
function useScrollToBottom(threadKey, lastItemId) {
  // 1. CREATING A MUTABLE REF OBJECT
  // 'useRef(null)' creates a permanent reference pointer. Think of it like a sticky note wrapper. 
  // We attach this note to our chat window div in the UI, allowing JavaScript to directly read 
  // its actual physical dimensions (like height and position) without breaking React's layout engine.
  const scrollRef = useRef(null);

  // 2. THE CHAT WINDOW AUTO-SCROLL LIFECYCLE HOOK
  // This side effect fires off automatically whenever the chat room ID or the last message ID changes.
  useEffect(() => {
    // Safety Interceptor: If no conversation thread is selected, stop right here.
    if (threadKey == null || threadKey === "") return;
    
    // Step A: Grab the raw HTML DOM element out of our sticky note container ref pointer.
    const el = scrollRef.current;
    if (!el) return; // If the container isn't loaded on screen yet, abort safely.

    // Step B: Define our math calculation scrolling function.
    const scrollToBottom = () => {
      // - 'el.scrollHeight': The complete structural height of the chat list, including all text bubbles hidden off screen.
      // - 'el.scrollTop': The pixel coordinate value representing the absolute top edge of what the user currently sees.
      // Setting scrollTop equal to scrollHeight instantly forces the window viewport to jump to the very bottom edge!
      el.scrollTop = el.scrollHeight;
    };
    
    // Step C: Trigger the scroll calculation instantly.
    scrollToBottom();
    
    // Step D: THE PROFESSIONAL DOUBLE-TAP TRICK (requestAnimationFrame)
    // Sometimes images or heavy text blocks take a split millisecond to render their physical layout boundaries on screen.
    // If we only scroll once, the view might scroll *before* the new bubble finishes sizing, leaving you slightly cut off at the bottom.
    // 'requestAnimationFrame' tells the web browser: "On the very next display frame re-draw cycle, fire this scroll check one more time!"
    // This guarantees an absolutely flawless anchor position right at the bottom edge.
    requestAnimationFrame(scrollToBottom);
    
  }, [threadKey, lastItemId]); // The hook actively watches these two state markers to trigger auto-scroll pulses.

  // Return the reference pointer handle so our layout components can easily import and anchor it.
  return scrollRef;
}

export default useScrollToBottom;