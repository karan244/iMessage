// This file acts as a utility bridge that connects your Node.js application to your MongoDB database.

// First, we bring in the Mongoose library tool to manage the communication protocols with the database.
import mongoose from "mongoose";

// We create and export an asynchronous function. We use 'async' because connecting to a database 
// happens over the internet and takes time. We have to wait for it to finish.
export async function connectDB() {
  // 'try' is like a safety net. We tell the computer: "Try to run this code block safely..."
  try {
    // We grab the hidden database address string from our '.env' file using 'process.env'.
    // This string contains your secret database password, so it stays hidden here for security.
    const mongoUri = process.env.MONGO_URI;

    // This is a safety check. If you forgot to create a '.env' file or typed the name wrong:
    if (!mongoUri) {
      // We purposefully trigger a crash and error message before anything else breaks.
      throw new Error("MONGO_URI is required");
    }

    // 'await' pauses our code right here until Mongoose completes the connection across the network.
    // 'mongoose.connect()' knocks on MongoDB's door and logs us into our database cluster.
    const conn = await mongoose.connect(mongoUri);

    // Once the connection succeeds, we log it to the backend terminal.
    // 'conn.connection.host' prints out the exact cloud cluster server address we connected to.
    console.log("MongoDB connected", conn.connection.host);

  // If anything fails inside the 'try' block (like a wrong password or no internet connection):
  } catch (error) {
    // The code instantly jumps down here to prevent a silent application freeze.
    // We log the exact error text on the terminal so you can fix it.
    console.error("MongoDB connection error:", error.message);
    
    // We tell the Node.js process to shut down immediately because our app cannot function without a database.
    process.exit(1);
    // Passing the number 1 explicitly flags to hosting servers that this exit was a critical failure.
    // Passing a 0 would mean "everything finished perfectly, goodbye."
  }
}