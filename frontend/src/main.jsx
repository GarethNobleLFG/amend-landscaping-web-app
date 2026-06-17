import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SessionExpiredProvider } from './hooks/SessionExpiredContextProvider'; 
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionExpiredProvider> 
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </SessionExpiredProvider>
  </StrictMode>,
)