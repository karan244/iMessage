import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- 1. IMPORT THE ROUTER
import './index.css'
import App from './App.jsx'

import { ClerkProvider } from '@clerk/react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable.')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. ADD WRAPPER MATRIX TUNNEL CHANNELS */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter> 
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)