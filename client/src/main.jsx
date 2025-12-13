import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
// import Browserouter
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
       <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
