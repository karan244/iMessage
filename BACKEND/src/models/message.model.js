// This file acts as a reusable blueprint for saving chat messages in your database.

// First, we bring in the Mongoose library tool to help us talk to MongoDB easily.
import mongoose from "mongoose";

// We create a Schema (a template/structure rulebook) for what every single chat message must look like.
const messageSchema = new mongoose.Schema(
  {
    // The senderId stores the unique ID of the user who typed and sent the message.
    senderId: {
      // We use 'ObjectId' instead of a regular text String. This is a special 24-character 
      // security tracking ID card generated automatically by MongoDB for every document.
      type: mongoose.Schema.Types.ObjectId,
      
      // 'ref' establishes a relationship. It tells Mongoose: "This specific ID points 
      // directly to a real person saved over in our 'User' database table."
      ref: "User",
      
      // A message cannot float in space; it MUST have someone who sent it.
      required: true,
    },
    
    // The receiverId stores the unique ID of the person who is supposed to get this message.
    receiverId: {
      // Just like above, this is a special relationship ID card.
      type: mongoose.Schema.Types.ObjectId,
      
      // It also links directly to a person in our 'User' database table.
      ref: "User",
      
      // A message must have a destination, so a receiver is strictly required.
      required: true,
    },
    
    // The actual typed message message text.
    text: {
      type: String, // Expects standard text characters (e.g., "Hey, what's up?").
      // Notice: 'required: true' is missing! A user might send a photo without any text.
    },
    
    // Stores the web link address to an image file.
    image: {
      type: String, // Stored as plain text (e.g., "https://imagekit.io/chat/photo123.jpg").
    },
    
    // Stores the web link address to a video file.
    video: {
      type: String, // Also stored as a link text pointing to where the video file lives online.
    },
  },
  
  // This second configuration object tells Mongoose to automatically manage timing details for us.
  { 
    // Setting this to true instantly creates two automatic timestamps on every record:
    // 1. 'createdAt' -> The exact day and millisecond this message was sent.
    // 2. 'updatedAt' -> The exact time this record was modified (e.g., if we add an "edited" tag later).
    timestamps: true 
  },
);

// We take our completed blueprint ('messageSchema') and convert it into a fully functional operational Model tool named "Message".
// This "Message" object is what you will use to run database actions (like Message.find() or Message.create()).
const Message = mongoose.model("Message", messageSchema);

// Finally, we export the 'Message' tool so that controllers or routes folders anywhere else in our backend 
// project can import it and use it to store or fetch real chat histories.
export default Message;