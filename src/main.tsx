
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
          .register('/service-worker.js')
          .then(() => console.log('Service Worker registered!'))
          .catch((err) => console.log('SW registration failed:', err));
    });
  }
