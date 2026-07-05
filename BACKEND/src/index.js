//const express = require("express"); this is a better way
import express from "express"
import "dotenv/config";

import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";

// We grab the hidden front-end URL string from our '.env' file using 'process.env'.
// This string contains your secret front-end address, so it stays hidden here for security.
const FRONTEND_URL = process.env.FRONTEND_URL;

import clerkWebhook from "./webhooks/clerk.js";

const app = express();

//console.log("DB_URL =", process.env.DB_URL)
const PORT = process.env.PORT;

app.use("/api/webhooks/clerk",express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => console.log("server is up and running on port:", PORT));