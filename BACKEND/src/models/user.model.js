// Everything related to configuring and structuring your User collection inside MongoDB.

// We import the Mongoose library tool to handle our structure design and talk to our database.
import mongoose from "mongoose";

// We define a new Schema. Think of this as the master template or data-rulebook for every User profile.
const userSchema = new mongoose.Schema(
  {
    // The clerkId maps this database record directly to the external authentication system (Clerk).
    clerkId: {
      type: String,   // It expects alphanumeric character text.
      required: true, // Data integrity check: You cannot create a user without this field.
      unique: true,   // Security constraint: No two records can share the same login token.
    },
    
    // The email address used for identifying the account.
    email: {
      type: String,   // Stored as plain text.
      required: true, // You cannot bypass account creation without providing an email address.
      unique: true,   // Crucial layer: Prevents duplicate sign-ups with the same email.
    },
    
    // The user's full name.
    fullName: {
      type: String,   // Expects text string input.
      required: true, // A name must be present to print on the chat headers on the front-end.
    },
    
    // The image link string for their display picture.
    profilePic: {
      type: String,   // Stores the web path address string leading to the image hosting service.
      default: "",    // Fallback layer: If a user doesn't upload a picture, it defaults to a safe blank text instead of throwing errors.
    },
  },
  
  // The configuration object to append track-timing data automatically.
  { 
    // Mongoose handles the timestamps logic for us completely behind the scenes.
    // It creates two hidden values: 'createdAt' (account birthtime) and 'updatedAt' (last modified).
    timestamps: true 
  },
);

// This turns your blueprint (the Schema) into a Model. The Model is the actual "tool" your backend 
// code will use to talk to the database (e.g., User.find(), User.create(), User.deleteOne()).
const User = mongoose.model("User", userSchema);

// We perform an export statement to allow code inside your webhooks, routes, and controllers 
// folders across the workspace architecture to import and query this 'User' model.
export default User;