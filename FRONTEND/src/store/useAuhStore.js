import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

// The base target network link where our Socket server lives.
// If coding locally, it communicates with the backend port 3000. Otherwise, it points to the production root.
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// We create a global hook 'useAuthStore' that any component in our app can read from or update!
export const useAuthStore = create((set, get) => ({
  
  // ==========================================
  // 1. GLOBAL STATE INITIAL VALUES (The Variables)
  // ==========================================
  authUser: null,       // Holds the logged-in user's profile data (null means logged out)
  isCheckingAuth: true, // A loading flag to prevent flashing the screen while checking tokens on reload
  onlineUsers: [],      // Array storing the user IDs of everyone currently active on the app
  socket: null,         // Holds the active WebSocket instance connection client

  // ==========================================
  // 2. GLOBAL ACTIONS (The Functions)
  // ==========================================

  /**
   * ACTION: CHECK AUTHENTICATION STATUS
   * Runs instantly when the user first opens or refreshes the app to see if they are logged in.
   */
  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Step A: Turn on the loading spinner state

    try {
      // Step B: Ask our backend server if our session cookie/token is still valid
      const res = await axiosInstance.get("/auth/check");
      
      // Step C: If valid, save the profile info directly into our global authUser state
      set({ authUser: res.data });

      // Step D: Proactively open up our real-time WebSocket connection phone line!
      get().connectSocket(res.data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      // If the backend rejects us (expired session), make sure authUser stays null
      set({ authUser: null });
    } finally {
      // Step E: Turn off the authentication loader so the UI can safely render
      set({ isCheckingAuth: false });
    }
  },

  /**
   * ACTION: CLEAR AUTHENTICATION
   * Cleanly wipe the global states when a user decides to log out.
   */
  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket(); // Hang up the real-time websocket line safely
  },

  /**
   * ACTION: CONNECT TO WEBSOCKET SERVER
   * Establishes the real-time link between this browser tab and our backend socket engine.
   */
  connectSocket: (user) => {
    // Safety check: If there is no user logged in, or we are already connected, do nothing!
    if (!user || get().socket?.connected) return;

    // Initialize 'socket.io-client'. 
    // We pass our target BASE_URL and inject the user's ID inside the handshake query string, 
    // which maps perfectly to the 'socket.handshake.query.userId' logic we built in our backend!
    const socket = io(BASE_URL, { query: { userId: user._id } });

    // Save the active connection client into our state register array
    set({ socket });

    // START LISTENING: Every time our backend intercom system shouts "getOnlineUsers",
    // catch the array of live user IDs and instantly save it into our global 'onlineUsers' variable.
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  /**
   * ACTION: DISCONNECT FROM WEBSOCKET SERVER
   * Cleanly closes the socket tunnel so we don't leak performance bandwidth when logging out.
   */
  disconnectSocket: () => {
    const socket = get().socket;
    // If a connection is running right now, physically break it off
    if (socket?.connected) socket.disconnect();
    // Wipe out the socket variable memory container
    set({ socket: null });
  },
}));