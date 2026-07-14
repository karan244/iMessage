import { create } from "zustand";
import { persist } from "zustand/middleware";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

// 1. CREATING THE CHAT STATE MACHINE
// We use Zustand's 'create' function to build a global container for our data.
// We wrap the store function inside 'persist()' middleware, which saves chosen state values 
// into the web browser's 'localStorage' memory so they survive page reloads.
export const useChatStore = create(
  persist(
    (set, get) => ({
      // ==========================================
      // GLOBAL STATE VALUES (The Storage Registers)
      // ==========================================
      users: [],                  // Array holding all potential users in the system
      conversations: [],          // Array holding all active chat conversation rows for the sidebar
      messages: [],               // Array holding the history of chat bubbles for the active screen
      selectedUser: null,         // Object containing the profile details of the person you clicked on
      isConversationsLoading: false, // Loading state for loading the sidebar list
      isUsersLoading: false,      // Loading state for gathering system users
      isMessagesLoading: false,   // Loading state for fetching text messages
      activeConversationId: null, // The MongoDB ID of the conversation thread currently open
      searchQuery: "",            // Tracks search string inputs typed into the sidebar filter bar
      sidebarTab: "chats",        // Tracks whether the sidebar shows "chats" list or "groups/settings"
      composerText: "",           // Holds the text you are typing into the input box before hitting send
      isSoundEnabled: true,       // A true/false toggle determining if message sound alerts play
      isSendingMedia: false,      // Loading state to block the send button while an image uploads

      // ==========================================
      // STORE ACTIONS (The Logic Functions)
      // ==========================================

      /**
       * ACTION: GET USERS
       * Hits the backend database to grab a list of all chat users.
       */
      getUsers: async () => {
        set({ isUsersLoading: true }); // Step 1: Turn on the user loading spinner
        try {
          const res = await axiosInstance.get("/messages/users"); // Step 2: Make the HTTP request
          
          // Step 3: Update states. If we had a 'selectedUser' open, double-check if they are still 
          // inside the new database list. If they vanished, reset back to null to avoid errors.
          set((state) => ({
            users: res.data,
            selectedUser:
              state.selectedUser && res.data.some((user) => user._id === state.selectedUser._id)
                ? state.selectedUser
                : null,
          }));
        } catch (error) {
          console.log("Error in get Users", error.message);
        } finally {
          set({ isUsersLoading: false }); // Step 4: Turn off loading state no matter what
        }
      },

      /**
       * ACTION: GET CONVERSATIONS
       * Gathers all existing chat rooms/threads to compile the user's sidebar.
       */
      getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
          const res = await axiosInstance.get("/messages/conversations");
          set({ conversations: res.data });
        } catch (error) {
          console.log("Error in getConversations", error.message);
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      /**
       * ACTION: GET MESSAGES
       * Loads the previous chat bubble message logs for a specific chosen friend.
       */
      getMessages: async (userId) => {
        if (!userId) return; // Safety check: if no target ID is passed, break out early.
        set({ isMessagesLoading: true });
        try {
          // Hits the custom Express endpoint: '/api/messages/:userId'
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data }); // Load the text objects into the global screen timeline array
        } catch (error) {
          // Triggers a red notification toast pop-up alert if the request fails
          toast.error(error.response?.data?.message || "Failed to load messages");
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      /**
       * ACTION: SEND GENERIC MESSAGE
       * The underlying core action that makes an HTTP POST request to submit message data payloads.
       */
      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get(); // 'get()' pulls fresh variables out of this exact store
        if (!selectedUser) return false;

        try {
          // Hits the custom Express route to send a message to a specific account ID
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          
          // IMMUTABILITY TRICK: Create a brand new array, expand the old chat bubbles inside it using 
          // the spread operator ('...messages'), and append the fresh response data object onto the end!
          // Also resets the text box ('composerText') back to blank.
          set({ messages: [...messages, res.data], composerText: "" });
          
          // Instantly refresh the conversation list to update the sidebar's text preview snippet.
          get().getConversations();
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
          return false;
        }
      },

      /**
       * ACTION: SUBSCRIBE TO WEBSOCKET INTERCOM
       * Connects your UI window directly to the server's live broadcast feed so texts arrive instantly.
       */
      subscribeToMessages: (userId) => {
        if (!userId) return;

        // CROSS-STORE BRIDGING:
        // We look over into 'useAuthStore' using '.getState()' to grab the active socket engine pipeline!
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Clean up duplicate triggers: turn off any existing 'newMessage' listener before mounting a new one.
        socket.off("newMessage");

        // START LISTENING: The moment the server taps us on the shoulder over the socket wire...
        socket.on("newMessage", (newMessage) => {
          // SECURITY RULE: If the incoming message's sender ID does not match the person we are 
          // actively talking to on screen right now, ignore it completely.
          if (String(newMessage.senderId) !== String(userId)) return;

          // Append the live text object straight into the array so it pops up immediately on the screen!
          set({ messages: [...get().messages, newMessage] });

          // Refresh the sidebar to show the latest text preview layout updates.
          get().getConversations();
        });
      },

      /**
       * ACTION: UNSUBSCRIBE FROM WEBSOCKETS
       * Instructs the socket client to detach the event listener to avoid memory leaks.
       */
      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage"); // Hangs up the text listening channel cleanly.
      },

      // SIMPLE UPDATER FUNCTIONS (Set state adjustments dynamically)
      setSelectedUser: (selectedUser) => set({ selectedUser }),

      /**
       * ACTION: SET ACTIVE CONVERSATION
       * Changes who you are talking to on screen and updates the message log viewport target.
       */
      setActiveConversationId: (activeConversationId) => {
        set((state) => ({
          activeConversationId,
          // Checks both the user list and the conversation list to assign the target profile details
          selectedUser:
            state.users.find((user) => user._id === activeConversationId) ||
            state.conversations.find((user) => user._id === activeConversationId) ||
            null,
          // If closing the chat box, dump the message arrays. Otherwise, keep them loaded.
          messages: activeConversationId ? state.messages : [],
        }));
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSidebarTab: (sidebarTab) => set({ sidebarTab }),
      setComposerText: (composerText) => set({ composerText }),
      setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),

      /**
       * ACTION: SEND STANDARD TEXT MESSAGE
       * Triggers when typing out text and pressing the enter key or the send arrow button.
       */
      sendTextMessage: async (conversationId) => {
        const messageText = get().composerText.trim(); // Clears empty white spaces at margins
        if (!conversationId || !messageText) return false;

        // Passes a plain JSON object body downstream to our underlying core function
        return get().sendMessage({ text: messageText });
      },

      /**
       * ACTION: SEND BINARY MEDIA/IMAGE MESSAGE
       * Formats raw media file data blocks for multipart network delivery.
       */
      sendMediaMessage: async ({ conversationId, file }) => {
        if (!conversationId || !file) return false;

        // MULTIPART MEDIA TRICK: Standard JSON fails when handling heavy binary data blocks like images.
        // We instantiate a browser-native 'FormData()' instance to act as an envelope container.
        const formData = new FormData();
        formData.append("media", file); // Slaps the raw file block inside, keyed as "media" matching backend parsing configurations.

        set({ isSendingMedia: true }); // Block the submit button so the user can't double-click send
        try {
          return await get().sendMessage(formData); // Send the encoded envelope out
        } finally {
          set({ isSendingMedia: false }); // Unblock the action control button when finished
        }
      },
    }),
    {
      // LOCALSTORAGE PERSISTENT SETTINGS CONFIGURATIONS:
      name: "imessage-storage", // The identification string index within the browser's application storage tab
      
      // PERFORMANCE FILTER: We instruct the middleware store to ONLY remember the sound toggle boolean state.
      // We explicitly leave out conversations and messages so we don't clog user storage arrays with old data logs!
      partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
    },
  ),
);