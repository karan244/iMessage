import multer from "multer";

// We define the maximum allowable file size. 
// 25 Megabytes is calculated in bytes: 25 * 1024 (Kilobytes) * 1024 (Bytes).
const MAX_FILE_SIZE = 25 * 1024 * 1024; 

// We initialize and configure our Multer instance, exporting it as 'upload'.
export const upload = multer({
  // 1. STORAGE STRATEGY:
  // We tell Multer to store the file in your server's short-term RAM memory (Buffer).
  // This keeps your local hard drive clean since we only need to hold the file 
  // long enough to upload it to the cloud (ImageKit).
  storage: multer.memoryStorage(),

  // 2. FILE SIZE LIMITATION:
  // We apply our 25MB cap. If a user tries to upload a massive file (like a 2GB movie),
  // Multer will immediately block the request to protect your server from running out of RAM.
  limits: { fileSize: MAX_FILE_SIZE },

  // 3. FILE TYPE FILTER (The Security Guard):
  // This function runs the moment a file hits your server, checking if it's safe to accept.
  fileFilter: (req, file, cb) => {
    // 'file.mimetype' is a built-in identifier (e.g., "image/jpeg" or "video/mp4").
    // We check if the incoming file type starts with "image/" or "video/".
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    // If the file is NEITHER an image NOR a video (e.g., a .exe script or a .pdf document):
    if (!isImage && !isVideo) {
      // We pass an error into the callback 'cb'. 
      // This tells Express: "Stop right here! This file is not allowed."
      cb(new Error("Only image and video uploads are allowed"));
      return;
    }

    // If it passes the check, we call the callback with 'null' (no error) and 'true' (approved).
    // The security guard steps aside and lets the file pass through to the controller.
    cb(null, true);
  },
});