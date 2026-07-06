import express from "express";
import http from "http";
import { Server } from "socket.io";

// 1. CREATING THE SERVERS
// We initialize a standard Express application instance.
const app = express();

// We create an HTTP server using Node's built-in 'http' module, passing our Express app into it.
// This allows Express (HTTP routes) and Socket.io (WebSockets) to run together on the exact same port.
const server = http.createServer(app);

// 2. CORS CONFIGURATION (The Firewall Permission)
// We determine which frontend URL is allowed to connect to our real-time socket server.
// It will look for 'FRONTEND_URL' inside your .env file, or default to your local Vite development port (5173).
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

// We initialize our Socket.io Server instance on top of our HTTP server, applying the CORS safety rules.
const io = new Server(server, { cors: { origin: [allowedOrigin] } });

/**
 * HELPER FUNCTION: GET RECEIVER'S LIVE SOCKET ID
 * This function takes a database user ID (like 'user123') and looks up their active 
 * browser communication pipe ID (like 'socket_xyz') from our online register map.
 */
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// THE ONLINE USERS REGISTER MAP
// This acts like a live school attendance book. 
// It stores data dynamically in memory like this: { "mongodb_user_id": "active_socket_id" }
const userSocketMap = {};

// 3. LISTENING FOR INCOMING LIVE CONNECTIONS
// 'io.on("connection", ...)' triggers automatically every single time a user logs into your frontend
// and opens up a real-time telephone line with your backend.
io.on("connection", (socket) => {
  // 'socket' represents the unique individual connection line for THIS specific user.

  // We read the user's ID card! The frontend passes their MongoDB userId inside the connection handshake query string.
  const userId = socket.handshake.query.userId;

  // If a valid userId is present, we log them into our attendance register map, tying their 
  // stable database account ID to their temporary, unique browser window session ID ('socket.id').
  if (userId) userSocketMap[userId] = socket.id;

  // THE INTERCOM ANNOUNCEMENT (Broadcast)
  // 'io.emit()' shouts across the entire network to EVERY single connected socket browser.
  // We grab all active user IDs (the keys of our map) and broadcast them down using the event name "getOnlineUsers".
  // This tells the frontend exactly who is online so it can light up those green indicator dots!
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 4. LISTENING FOR DISCONNECTIONS
  // 'socket.on' sets up a listener for a specific individual action. 
  // This triggers if a user closes their tab, clears their browser, logs out, or loses internet connection.
  socket.on("disconnect", () => {
    // If the disconnected user had a valid registered account ID, we erase them from our attendance book.
    if (userId) delete userSocketMap[userId];
    
    // Since the online list has changed, we announce the freshly updated active user array over the intercom 
    // to everyone else still online so their screens update immediately.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// We export these instances so we can mount 'app' and 'server' inside our main 'index.js' file,
// and import 'io' or 'getReceiverSocketId' directly inside our message controllers.
export { app, server, io, getReceiverSocketId };