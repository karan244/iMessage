import express from "express";
// 1. IMPORTING CONTROLLERS:
// We bring in the business logic functions from our controller file.
// These functions contain the code that actually fetches data from MongoDB or sends a text.
import {
  getConversationsForSidebar,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

// 2. IMPORTING MIDDLEWARE GUARDS:
// 'protectRoute' ensures a user is securely logged in before accessing chat data.
import { protectRoute } from "../middleware/auth.middleware.js";
// 'upload' is our Multer instance that intercepts and processes incoming image/video files.
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// 3. THE GLOBAL LOCK (router.use):
// This is a brilliant shortcut. By placing 'router.use(protectRoute)' at the top,
// you are locking down EVERY SINGLE ROUTE defined below it. 
// No one can sneak past or read/send messages without passing the security guard first!
router.use(protectRoute);

// Route: GET /api/messages/users
// PURPOSE: Fetches a list of all users to display in the sidebar so you can click on someone to chat.
router.get("/users", getUsersForSidebar);

// Route: GET /api/messages/conversations
// PURPOSE: Fetches a list of active chats/conversations the user currently has open.
router.get("/conversations", getConversationsForSidebar);

// Route: GET /api/messages/:id
// PURPOSE: Fetches the entire chat message history between you and a specific user.
// The ':id' is a dynamic parameter that represents the unique MongoDB ID of the person you clicked on.
router.get("/:id", getMessages);

// Route: POST /api/messages/send/:id
// PURPOSE: Sends a message (text, media, or both) to a specific user (identified by ':id').
// PIPELINE EXECUTION:
//   Step A: 'protectRoute' confirms who you are and sets up 'req.user'.
//   Step B: 'upload.single("media")' intercepts the request, checks if there is an image/video file 
//           named "media" attached, runs it through our 25MB safety filter, and places it in 'req.file'.
//   Step C: 'sendMessage' controller takes over, fires the image to ImageKit, and saves the message to MongoDB!
router.post("/send/:id", upload.single("media"), sendMessage);

export default router;