import { useSyncExternalStore } from "react";

/**
 * CUSTOM REACT HOOK: useMediaQuery
 * This hook checks if a given CSS media query (like "(min-width: 1024px)") matches the user's current 
 * screen size. It returns 'true' or 'false' dynamically and triggers re-renders instantly when resizing.
 */
export function useMediaQuery(query) {
  // 'useSyncExternalStore' is a built-in React hook designed to safely subscribe to 
  // browser events or data stores that exist outside of React's state ecosystem. 
  // It takes 3 arguments to keep our UI perfectly in sync with the viewport:
  return useSyncExternalStore(
    
    // 1. THE SUBSCRIBE FUNCTION
    // Tells React how to listen for changes. It sets up an open listener line to the browser.
    (onChange) => {
      // 'window.matchMedia' is a native browser tool that parses your query string.
      const mq = window.matchMedia(query);
      
      // We tell the browser: "Whenever the window resizes across this specific breakpoint rule, 
      // fire the 'onChange' function to alert React!"
      mq.addEventListener("change", onChange);
      
      // CLEANUP INTERCEPTOR:
      // When the component stops rendering, React executes this cleanup block. 
      // It physically unmounts the active window change listener, protecting your app's performance threads from running dry!
      return () => mq.removeEventListener("change", onChange);
    },
    
    // 2. THE CLIENT VALUE SNAPSHOT FUNCTION
    // Tells React how to read the current state of the screen on the user's machine.
    // It returns 'true' if the viewport satisfies the media query text right now, otherwise 'false'.
    () => window.matchMedia(query).matches,
    
    // 3. THE SERVER-SIDE FALLBACK VALUE (SSR)
    // Used if you are rendering the code on a server (like Next.js) where a browser window doesn't exist yet.
    // It defaults safely to 'false' during compilation so it doesn't crash your server backend lines.
    () => false,
  );
}