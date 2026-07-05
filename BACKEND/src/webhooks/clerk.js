// This file acts as a secure processing station. It listens for messages sent by Clerk's servers 
// over the internet, double-checks their security "passports", and updates your MongoDB database.

import express from "express";
import User from "../models/user.model.js"; // Importing your User database blueprint tool
import { verifyWebhook } from "@clerk/backend/webhooks"; // A security wrapper tool provided by Clerk

const router = express.Router();

// This endpoint triggers when Clerk sends a POST request through your localtunnel link.
router.post("/", async (req, res) => {
  try {
    // 1. SECURITY CHECK — SECRET VALIDATION
    // Grab the secret signature key you saved inside your backend '.env' file.
    const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!signingSecret) {
      // If you forgot to paste the key, immediately tell Clerk "Service Unavailable" (503).
      res.status(503).json({ message: "Webhook secret is not provided" });
      return;
    }

    // 2. DATA TRANSLATION
    // Clerk expects standard text payload, but Express raw mode grabs it as a raw memory Buffer.
    // If it's a buffer, we convert it back into a readable UTF-8 text String.
    const payload = Buffer.isBuffer(req.body) ? req.body.toString("utf8") : String(req.body);
    
    // We recreate a standard web "Request" object so Clerk's verification tool can read it easily.
    const request = new Request("http://internal/webhooks/clerk", {
      method: "POST",
      headers: new Headers(req.headers), // Forwards the security tokens sent in the header packet
      body: payload,
    });

    // 3. THE SECURITY GUARD LAYER
    // This line performs the cryptographical check. It compares Clerk's secret headers against your 'signingSecret'.
    // If the data was altered by a hacker along the way, or the signature is wrong, it instantly throws an error.
    const evt = await verifyWebhook(request, { signingSecret });

    // 4. CHOOSE YOUR ACTION: SIGN-UP OR PROFILE UPDATE
    // If the event code is a brand new sign-up or someone changing their details:
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const u = evt.data; // Extract the raw account variables Clerk sent you

      // Extraction logic: Try to find their primary checked email address.
      // If they don't have a primary set, fallback safely to the very first email address in their profile array.
      const email =
        u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
        u.email_addresses?.[0]?.email_address;

      // Formatting logic: Combine their first and last name together with a space.
      // If those are missing, use their username; if that is empty, just slice their email handle (e.g., "karan" from "karan@example.com").
      const fullName =
        [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || email?.split("@")[0];

      // THE DATABASE COMMAND
      // This is a powerful command that means "Find One and Update, or Create if missing".
      await User.findOneAndUpdate(
        { clerkId: u.id }, // Look for a user inside MongoDB matching this specific Clerk ID card number
        { clerkId: u.id, email, fullName, profilePic: u.image_url }, // Overwrite or populate these fields
        { 
          new: true,             // Give us back the clean, updated user document
          upsert: true,          // Essential: If they don't exist in MongoDB yet, instantly create a new record!
          setDefaultsOnInsert: true // Applies any fallback rules from your User model template (like profilePic default)
        },
      );
    }

    // 5. CHOOSE YOUR ACTION: ACCOUNT DELETION
    // If the event tells us a user permanently chose to delete their profile:
    if (evt.type === "user.deleted") {
      // Look up their Clerk tracking ID card and completely erase their profile document from your MongoDB cluster.
      if (evt.data.id) await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    // 6. TELL CLERK WE ARE DONE
    // Send a 200 (Success) back to Clerk's automated delivery system so they know we processed it perfectly.
    res.status(200).json({ received: true });
    
  } catch (error) {
    // If verification fails (wrong signature or bad request parsing), catch the crash here.
    console.error("Error in Clerk webhook:", error);
    // Return an HTTP 400 error back out to let Clerk know the delivery failed verification.
    res.status(400).json({ message: "Webhook verification failed" });
  }
});

export default router;