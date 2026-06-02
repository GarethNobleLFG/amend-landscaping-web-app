import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SessionExpiredProvider } from './hooks/SessionExpiredContextProvider';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <SessionExpiredProvider>
        <App />
      </SessionExpiredProvider>
  </StrictMode>,
)
