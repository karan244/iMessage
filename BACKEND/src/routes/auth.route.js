import express from "express";
// We import our 'checkAuth' controller logic function.
import { checkAuth } from "../controllers/auth.controller.js";
// We import our 'protectRoute' security guard middleware function.
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// PIPELINE EXPLANATION: When the frontend calls 'GET /api/auth/check':
// 1. The request enters the route and hits 'protectRoute' first.
// 2. 'protectRoute' validates the session and injects the database profile into 'req.user'.
// 3. If valid, 'protectRoute' triggers 'next()', and the request slides smoothly into 'checkAuth'.
// 4. 'checkAuth' fires a clean '200 OK' and sends the user data down to your frontend application.
router.get("/check", protectRoute, checkAuth);

export default router;