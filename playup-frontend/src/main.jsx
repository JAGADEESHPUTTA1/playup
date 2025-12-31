import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import App from "./App.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ToastProvider } from "./components/Toast/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        {/* Fixed Background */}
        <div className="bg-fixed"></div>

        {/* Scrollable App */}
        <div className="bgg">
          <App />
        </div>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);
