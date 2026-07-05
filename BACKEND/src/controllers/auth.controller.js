// This is the controller endpoint designed to check the user's authentication state.
export async function checkAuth(req, res) {
  try {
    // Because 'protectRoute' did all the heavy lifting of finding the user in MongoDB
    // and pinned it onto 'req.user', we don't need to make any database lookups here!
    // We simply hand that attached user profile payload directly back to the frontend.
    res.status(200).json(req.user);
  } catch (error) {
    // Standard catch block to prevent silent app crashes if something goes wrong.
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}