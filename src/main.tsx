import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.tsx'
import { setupAuthInterceptor } from './utils/authInterceptor';

// Setup global auth interceptor for status 498
setupAuthInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
