import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/geist";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ServerProvider } from "./context/ServerStatusContext.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ServerProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ServerProvider>
    </BrowserRouter>
  </StrictMode>,
);
