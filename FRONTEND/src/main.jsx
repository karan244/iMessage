import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ClerkProvider } from '@clerk/react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider>
      <App />  {/* we have wrapped our entire app with ClerkProvider so that we can use Clerk's authentication features throughout the app. */}
    </ClerkProvider>
  </StrictMode>,
)
