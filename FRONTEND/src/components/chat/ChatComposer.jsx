// 1. ENVIRONMENT CONFIGURATION ENGINE
// This reads your hidden '.env' environment configuration file lines, allowing Mongoose 
// to automatically securely inject your hidden database connection key string (MONGODB_URI).
import "dotenv/config";

import mongoose from "mongoose";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

// 2. THE DUMMY DATA STRUCTURAL MATRIX (The Seed Array)
// A clean multi-dimensional array mapping: [clerkId, fullName, email, avatarImageUrl]
const seedUsers = [
  ["seed_alex_chen", "Alex Chen", "alex.chen@example.com", "https://i.pravatar.cc/150?img=1"],
  ["seed_sam_taylor", "Sam Taylor", "sam.taylor@example.com", "https://i.pravatar.cc/150?img=2"],
  ["seed_jordan_lee", "Jordan Lee", "jordan.lee@example.com", "https://i.pravatar.cc/150?img=3"],
  ["seed_maya_patel", "Maya Patel", "maya.patel@example.com", "https://i.pravatar.cc/150?img=4"],
  ["seed_casey_morgan", "Casey Morgan", "casey.morgan@example.com", "https://i.pravatar.cc/150?img=5"],
  ["seed_riley_kim", "Riley Kim", "riley.kim@example.com", "https://i.pravatar.cc/150?img=6"],
  ["seed_taylor_brooks", "Taylor Brooks", "taylor.brooks@example.com", "https://i.pravatar.cc/150?img=7"],
  ["seed_jamie_wilson", "Jamie Wilson", "jamie.wilson@example.com", "https://i.pravatar.cc/150?img=8"],
  ["seed_morgan_reed", "Morgan Reed", "morgan.reed@example.com", "https://i.pravatar.cc/150?img=9"],
  ["seed_avery_scott", "Avery Scott", "avery.scott@example.com", "https://i.pravatar.cc/150?img=10"],
  ["seed_quinn_parker", "Quinn Parker", "quinn.parker@example.com", "https://i.pravatar.cc/150?img=11"],
  ["seed_drew_hayes", "Drew Hayes", "drew.hayes@example.com", "https://i.pravatar.cc/150?img=12"],
  ["seed_skyler_evans", "Skyler Evans", "skyler.evans@example.com", "https://i.pravatar.cc/150?img=13"],
  ["seed_harper_lane", "Harper Lane", "harper.lane@example.com", "https://i.pravatar.cc/150?img=14"],
  ["seed_charlie_bennett", "Charlie Bennett", "charlie.bennett@example.com", "https://i.pravatar.cc/150?img=15"],
  ["seed_emerson_gray", "Emerson Gray", "emerson.gray@example.com", "https://i.pravatar.cc/150?img=16"],
  ["seed_finley_price", "Finley Price", "finley.price@example.com", "https://i.pravatar.cc/150?img=17"],
  ["seed_rowan_blake", "Rowan Blake", "rowan.blake@example.com", "https://i.pravatar.cc/150?img=18"],
  ["seed_sage_cooper", "Sage Cooper", "sage.cooper@example.com", "https://i.pravatar.cc/150?img=19"],
  ["seed_reese_carter", "Reese Carter", "reese.carter@example.com", "https://i.pravatar.cc/150?img=20"],
];

/**
 * THE DATABASE MIGRATION CONTROLLER
 * Establishes standard async connections to inject the mock array blocks cleanly.
 */
async function seedDatabase() {
  // Step A: Initialize connection tunnel lines straight to your MongoDB database instance
  await connectDB();

  // Step B: THE HIGH-PERFORMANCE PRO BULK SEED OPERATOR (bulkWrite)
  // Instead of creating 20 slow independent database round-trip calls, '.bulkWrite()' bundles 
  // all operations together and executes them inside a single quick transaction pulse!
  const result = await User.bulkWrite(
    // We use standard array '.map()' to instantly transform our array rows into Mongoose update operations
    seedUsers.map(([clerkId, fullName, email, profilePic]) => ({
      updateOne: {
        // FILTER: Search database documents to verify if this specific 'clerkId' exists.
        filter: { clerkId },
        
        // UPDATE ($set): If matched, push these parameters straight into their corresponding scheme keys.
        update: {
          $set: { clerkId, fullName, email, profilePic },
        },
        
        // THE "UPSERT" MAGIC SWITCH:
        // 'upsert: true' is a genius combination of UPdate + inSERT.
        // - If the filter MATCHES a user (e.g. Alex Chen is already in the DB), it updates their profile data.
        // - If the filter FAILS to find them, it automatically generates a brand new document from scratch!
        // This allows you to run this seed file as many times as you want without causing duplicate document errors.
        upsert: true,
      },
    })),
  );

  // Print execution readouts directly inside your command terminal logs
  console.log(
    `Seeded users. Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}, matched: ${result.matchedCount}`,
  );
}

// 3. LIFECYCLE INTERCEPT ENGINE HANDLERS
seedDatabase()
  .catch((error) => {
    // If our connection drops or syntax fails, catch it here and output terminal error notices.
    console.error("Failed to seed users:", error);
    process.exitCode = 1; // Signals to your system terminal process runner that the script execution failed.
  })
  .finally(async () => {
    // CLEAN HOUSE CLOSURE: Once seeding concludes (whether it succeeded or crashed), 
    // explicitly hang up the Mongoose network line connection to keep memory pools clean.
    await mongoose.connection.close();
  });