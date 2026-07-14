// =========================================================================
// IMAGEKIT REAL-TIME MEDIA OPTIMIZATION ENGINE
// Chat media files are securely stored on ImageKit. We optimize delivery on the fly 
// using URL parameters instead of shipping full-resolution originals down the network wire.
// Reference: https://imagekit.io/docs/image-transformation
// =========================================================================

/**
 * UTILITY CHECKER: isImageKitUrl
 * Inspects a resource string to verify if it is an authentic ImageKit cloud media delivery target link.
 * Returns true if it matches our asset delivery servers, otherwise returns false.
 */
export function isImageKitUrl(url) {
  // We use the strict conditional 'typeof url === "string"' to instantly block code crashes 
  // if an unpopulated or missing asset link object gets passed down into the checker block.
  return typeof url === "string" && url.includes("ik.imagekit.io");
}

/**
 * UTILITY TRANSFORMATOR: withTransform
 * Appends custom real-time ImageKit alteration instructions ('tr' parameters) onto an active link.
 * If the link points anywhere else (like an external user profile image), it acts as a safe 'no-op' 
 * and skips calculations completely, returning the baseline original URL string.
 */
export function withTransform(url, transform) {
  // Step 1: Safety Interceptor. If it is not hosted on our ImageKit bucket servers, return the URL untouched.
  if (!isImageKitUrl(url)) return url;

  // Step 2: STRIP THE STRINGS
  // We use JavaScript Destructuring coupled with '.split("?")'.
  // This cleanly breaks the URL at the query symbol:
  // - 'path' holds the core address: "https://ik.imagekit.io/my_bucket/chat_image.png"
  // - 'query' gathers existing parameter flags (e.g. "v=123"). Defaults to a blank string if empty.
  const [path, query = ""] = url.split("?");

  // Step 3: BUILD THE WEB QUERY MATRIX
  // 'URLSearchParams' is a powerful native browser utility engine. It allows us to safely modify 
  // complex URL query parameters without making typos or handling broken string concatenations manually!
  const params = new URLSearchParams(query);
  
  // Step 4: EMBED THE CONVERSION RULES
  // We attach the 'tr' (transformation) flag value string requested by our UI component layout views.
  params.set("tr", transform);

  // Step 5: COMPILE THE NEW OPTIMIZED HYPERLINK
  // Convert our search matrix parameters back into a standard URL string block and return it smoothly.
  return `${path}?${params.toString()}`;
}