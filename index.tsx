
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log("LeadGen Pro: Hydrating Application...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical Error: Target container 'root' not found in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App successfully mounted to DOM.");
  } catch (err) {
    console.error("React mounting failed:", err);
  }
}
