import { WallpaperProvider } from "./context/WallpaperContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

import { Toaster } from "react-hot-toast";

function App() {
  // 1. CLERK INITIAL FLAGS
  // - 'isLoaded': Flag tracking if the Clerk security script has finished downloading from the internet.
  // - 'isSignedIn': A real-time true/false switch telling us if a user is actively authenticated.
  const { isSignedIn, isLoaded } = useAuth();

  // 2. ZUSTAND SELECTORS PATTERN (Performance optimization)
  // Instead of destructuring the whole store (Option 1), we select specific slices (Option 2).
  // This makes sure this App component ONLY re-renders if these precise variables change, 
  // keeping the app fast and lightweight.
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  // 3. SECURING THE LIFE-CYCLE LIFELINE
  // This hook synchronization block fires off immediately whenever Clerk detects an identity state change.
  useEffect(() => {
    // If Clerk is still spinning up, pause here and wait.
    if (!isLoaded) return;

    // If the user signed in on Clerk, trigger our Zustand global brain to sync up our backend 
    // database verification values and wire up our real-time WebSockets.
    if (isSignedIn) checkAuth();
    // If they logged out, scrub our global state and hang up the WebSockets immediately.
    else clearAuth();
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

  // 4. THE LOADING BUFFER SHIELD
  // If Clerk is downloading, OR if the user is authenticated but our database check hasn't 
  // finished verification yet, freeze the screen cleanly using a premium full-screen loader layout.
  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />;

  return (
    // 5. GLOBAL DECORATIVE LAYOUT PROVIDERS
    // Wraps everything so accent colors and wallpaper image state selections are shared everywhere!
    <ThemeProvider>
      <WallpaperProvider>
        
        {/* 6. SECURITY NAVIGATION GUARDS (React Router) */}
        <Routes>
          {/* THE CHAT SCREEN PATH (Root /) */}
          {/* If signed in, show the main Chat page. If not, forcefully bounce them to '/auth'. */}
          <Route path="/" element={isSignedIn ? <ChatPage /> : <Navigate to={"/auth"} replace />} />
          
          {/* THE SECURITY AUTHENTICATION PATH (/auth) */}
          {/* If NOT signed in, let them access the AuthPage. If they are already signed in, 
              don't let them look at the login buttons—bounce them right back to the chat dashboard! */}
          <Route
            path="/auth"
            element={!isSignedIn ? <AuthPage /> : <Navigate to={"/"} replace />}
          />
        </Routes>
        
        {/* GLOBAL POPUP TOAST NOTIFICATIONS HUB */}
        {/* Renders beautiful visual notification popups on the screen when a message arrives or errors occur */}
        <Toaster />
        
      </WallpaperProvider>
    </ThemeProvider>
  );
}

export default App;