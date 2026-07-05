import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Grab the Clerk ID card from the middleware token wrapper
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized - No Session Token Found" });
    }

    // 2. Look up the matching full profile from your MongoDB Atlas database
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    // 3. Attach the database user object to the request packet
    req.user = user;

    // 4. Everything looks good, pass control to the next function (checkAuth)
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};