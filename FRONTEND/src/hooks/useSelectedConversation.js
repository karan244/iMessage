import { useMediaQuery } from "./useMediaQuery";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

/**
 * UTILITY ACCENT: GET INITIALS
 * Converts a name string like "John Doe" into a clean abbreviation capital: "JD".
 * If a user has no uploaded profile image, the UI uses these letters inside a colored fallback avatar ring!
 */
export function getInitials(name) {
  return name
    .split(" ")          // Split the name string anywhere there is a space -> ["John", "Doe"]
    .filter(Boolean)     // Safety step: filters out accidental double empty spaces
    .map((namePart) => namePart[0]) // Extract the very first letter of each name block -> ["J", "D"]
    .join("");           // Glue them back together into a single word string -> "JD"
}

/**
 * THE DATA ADAPTER TRANSLATOR (mapUserToConversation)
 * This function translates raw database models into organized layout structures.
 * 
 * It completes two massive transformations:
 * 1. Raw text entries -> Nicely formatted UI bubbles tagged with specific ownership ("me" or "them").
 * 2. Raw profile logs -> Clean 'peer' metadata blocks indicating active websocket online statuses.
 */
function mapUserToConversation({ user, messages, authUser, onlineUsers }) {
  // Step A: Format the message log array data objects
  const mappedMessages = messages.map((message) => ({
    id: message._id,
    // THE OWNERSHIP CHECK: If the sender ID matches the logged-in user profile ID token, 
    // it belongs to "me" (floats right in green). Otherwise, it belongs to "them" (floats left in gray).
    role: String(message.senderId) === String(authUser?._id) ? "me" : "them",
    text: message.text || "",
    time: formatMessageTime(message.createdAt), // Formats timestamp string using our utility helper tool
    imageUrl: message.image,                    // Links image files if attached
    videoUrl: message.video,                    // Links video content streams if attached
  }));

  // Step B: Return the single unified conversation map structure
  return {
    id: user._id,
    peer: {
      name: user.fullName,
      subtitle: user.email,
      // THE SOCKET ACTIVE CHECK: Looks inside the live WebSocket store register array. 
      // If this contact's MongoDB target ID is present inside that list, light up the green online indicator dot!
      isOnline: onlineUsers.includes(user._id),
      avatarUrl: user.profilePic,
      initials: getInitials(user.fullName),
    },
    messages: mappedMessages, // Injects our cleanly mapped chat log histories here
  };
}

/**
 * MAIN RESPONSIVE ADAPTER HOOK: useSelectedConversation
 * Aggregates global authentication store variables and chat registers into one clean package.
 */
export function useSelectedConversation() {
  // 1. SELECT FRESH STATES OUT OF THE ZUSTAND STATE REGISTERS
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const messages = useChatStore((state) => state.messages);

  const authUser = useAuthStore((state) => state.authUser);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  // 2. BREAKPOINT MONITORING
  // Connects to our optimized resize engine tool to determine screen scale constraints
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  // 3. IDENTIFY THE SELECTED PERSON
  // Scans through user profile registers or conversation tracking loops to isolate 
  // the exact account database card matching our active conversation ID indicator.
  const selectedUser = activeConversationId
    ? users.find((user) => user._id === activeConversationId) ||
      conversations.find((user) => user._id === activeConversationId)
    : null;

  // 4. TRANSFORM DATA THROUGH THE TRANSLATOR ENGINE
  // If a profile card is matched, pass it through the translator function. If empty, keep it null.
  const activeConversation = selectedUser
    ? mapUserToConversation({ user: selectedUser, messages, authUser, onlineUsers })
    : null;

  // Expose these 3 vital variables globally to your application elements!
  return {
    activeConversation,
    activeConversationId,
    isLargeScreen,
  };
}