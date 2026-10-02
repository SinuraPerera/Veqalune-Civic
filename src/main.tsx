import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import './index.css';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);
        registration.update().catch((error) => {
          console.warn('ServiceWorker update check failed:', error);
        });
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
