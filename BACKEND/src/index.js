import express from "express";
import "dotenv/config";

import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";


import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";

const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 3000; // Added a fallback port just in case


app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);
});