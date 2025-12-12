import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const htmlElement = document.documentElement;

const revealApp = () => {
  htmlElement.classList.remove('font-init');
  htmlElement.classList.add('font-ready');
};

if ('fonts' in document) {
  const fontReadyPromise = document.fonts.ready.catch(() => undefined);
  const fallbackTimeout = new Promise(resolve => {
    window.setTimeout(resolve, 400);
  });

  Promise.race([fontReadyPromise, fallbackTimeout]).finally(revealApp);
} else {
  revealApp();
}

createRoot(document.getElementById('root')!).render(<App />);
