import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.lib.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

/**
 * 1. GET ALL USERS FOR THE SIDEBAR
 * This controller finds all users registered in the system so you can see them 
 * in your sidebar contact list and start a conversation.
 */
export async function getUsersForSidebar(req, res) {
  try {
    // We grab the ID of the currently logged-in user (attached earlier by protectRoute).
    const loggedInUserId = req.user._id;

    // We search MongoDB for all users EXCEPT ($ne = Not Equal) the current logged-in user.
    // .select("-clerkId") tells Mongoose explicitly to exclude the private Clerk ID from the results for security.
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-clerkId");

    // Send the list of other users back to the frontend with a 200 OK status.
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * 2. GET ACTIVE CONVERSATIONS FOR SIDEBAR
 * This controller uses a MongoDB 'Aggregate Pipeline' (an advanced multi-step filter) 
 * to show only the people you have actively chatted with, sorting them by the most recent message.
 */
export async function getConversationsForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      // Step 1: Keep only the messages where I am either the sender OR the receiver.
      { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
      
      // Step 2: Group the matching messages together by 'chat partner' so we don't get duplicates.
      {
        $group: {
          // If I sent the message, the partner is the 'receiverId'. Otherwise, they are the 'senderId'.
          _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
          // Track the timestamp ($max) of the very latest message exchanged with this person.
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      
      // Step 3: Sort the conversations dynamically. -1 means descending order (most recent text on top).
      { $sort: { lastMessageAt: -1 } },
      
      // Step 4: Go to the 'users' collection and look up the full profile of the partner using their matched ID.
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      
      // Step 5: Clean up the data structure. Because $lookup returns an array, we pull out the first object ($first).
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      
      // Step 6: Exclude the sensitive clerkId field from being sent out to the browser.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationsForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * 3. GET CHAT HISTORY BETWEEN TWO USERS
 * This controller fetches every single message exchanged between you and the person you clicked on.
 */
export async function getMessages(req, res) {
  try {
    // Extract the dynamic parameter ':id' from the URL (the ID of the user we want to chat with).
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Find messages where:
    // (I am the sender AND they are the receiver) OR (They are the sender AND I am the receiver)
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sort by '1' (Ascending order) so old messages stay up top, new ones scroll down.

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * 4. SEND A NEW MESSAGE (WITH OPTIONAL MEDIA UPLOADS)
 * This controller processes text text messages, runs uploaded images/videos through Multer 
 * to ImageKit, saves them into MongoDB, and alerts the other user via Socket.io instantly.
 */
export async function sendMessage(req, res) {
  try {
    const { text } = req.body; // Extract text text sent alongside any files from req.body (thanks to Multer)
    const { id: receiverId } = req.params; // Who is getting this message
    const senderId = req.user._id; // Who is sending this message (You!)

    let imageUrl;
    let videoUrl;

    // Check if Multer caught a file upload block ('req.file')
    if (req.file) {
      // Security Check: Verify our cloud storage configurations in .env are active
      if (!hasImageKitConfig()) {
        return res.status(500).json({ message: "Media upload is not configured" });
      }

      // Fire the file buffer off to ImageKit and wait for the final cloud URL link
      const url = await uploadChatMedia(req.file);
      
      // Dynamically sort whether to save it under the image slot or video slot based on the file type
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    // Map all our collected strings and URLs into our structural Message model
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    // Save the new message permanently to your MongoDB cluster
    await newMessage.save();

    // --- REALTIME WEB SOCKETS PIPELINE ---
    // Look up whether the receiver is currently online and active on the app right now
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (receiverSocketId) {
      // If they are online, immediately beam the message directly onto their screen 
      // without requiring them to refresh or reload their browser window!
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Respond back to the sender confirming it was successfully created (201 Created)
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}