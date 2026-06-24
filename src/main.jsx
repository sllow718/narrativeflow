import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { initFirebase } from "./analytics/config";
import { initSession } from "./analytics/analytics";
import "./styles.css";

// Initialize Firebase and analytics on app startup
initFirebase();
initSession(navigator.userAgent, window.screen.width, window.screen.height);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
