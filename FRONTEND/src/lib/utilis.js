/**
 * UTILITY ACCENT: FORMAT MESSAGE TIME
 * Takes a raw database timestamp string and transforms it into a clean clock timestamp.
 * Example input:  "2026-07-14T06:04:33.123Z"
 * Example output: "11:34 AM"
 */
export function formatMessageTime(date) {
  // 1. CONVERT STRING INTO A DATE OBJECT
  // 'new Date(date)' instantiates a native JavaScript Date engine instance. 
  // It reads the raw database timestamp string and automatically converts it into 
  // the exact local timezone of the user's web browser or mobile phone screen!
  return new Date(date).toLocaleTimeString([], {
    
    // 2. TIMELINE CONFIGURATION MAPPING
    // - 'hour: "numeric"': Displays the hour number cleanly (e.g. "11" or "5" instead of "05").
    hour: "numeric",
    
    // - 'minute: "2-digit"': Guarantees the minute section always takes up two character spaces.
    //   This ensures that if a message is sent at four minutes past eleven, it renders beautifully 
    //   as "11:04 AM" instead of look breaking as "11:4 AM".
    minute: "2-digit",
  });
}