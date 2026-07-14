import axios from "axios";

// =========================================================================
// PRE-CONFIGURED AXIOS INSTANCE INTERCEPTOR
// We use 'axios.create()' to build a reusable, custom HTTP networking tool.
// This sets up global default rules for every backend server request we send out!
// =========================================================================
export const axiosInstance = axios.create({
  
  // 1. DYNAMIC ENVIRONMENT BASE URL SWITCHING
  // - 'import.meta.env.MODE === "development"': Inspects Vite's environmental flag tools.
  // - If coding locally, it automatically appends '/api' onto your localhost port 3000 target.
  // - If the project is compiled and deployed live, it drops the absolute localhost prefix entirely 
  //   and uses standard relative production pathways ('/api') so it adapts perfectly to cloud servers!
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",

  // 2. THE SECURITY CREDENTIALS LIFELINE (withCredentials)
  // This is an absolute requirement for modern, secure authentication systems!
  // By setting 'withCredentials: true', we explicitly command the web browser to automatically 
  // attach secure session cookies (like JWT authentication tokens) onto the headers of every single outgoing API call.
  // Without this line, the server won't know who is making the request, causing security blocks to fail!
  withCredentials: true,
});