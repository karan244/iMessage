/**
 * UTILITY FUNCTION: FORMAT MESSAGE TIMESTAMP
 * This helper takes an ISO date string from MongoDB (like "2026-07-14T12:00:00.000Z")
 * and converts it into a clean, human-readable timestamp (like "12:00 PM") for the chat bubbles.
 */
export function formatMessageTime(date) {
  // 1. CONVERTING TO A DATE OBJECT
  // Mongoose saves timestamps as raw text strings. 'new Date(date)' parses that string
  // and transforms it into a native, workable JavaScript Date object.
  return new Date(date).toLocaleTimeString([], {
    
    // 2. TIMING FORMAT CONFIGURATIONS:
    // - hour: "numeric" -> Displays the hour using digits, automatically dropping leading zeros (e.g., '5' instead of '05').
    // - minute: "2-digit" -> Guarantees minutes are always 2 characters long, keeping zeros intact (e.g., '07' instead of '7').
    hour: "numeric",
    minute: "2-digit",
  });
}