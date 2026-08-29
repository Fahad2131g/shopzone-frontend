import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <GoogleOAuthProvider clientId="610988784389-lh7d3637jmgc5c76hunta1plbun8h1t0.apps.googleusercontent.com">
        <App />
        </GoogleOAuthProvider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)