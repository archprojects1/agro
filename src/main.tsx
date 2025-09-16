import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Use "/agro" for GitHub Pages, "/" locally
const basename =
  import.meta.env.MODE === "production" ? "/agro" : "/";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    basename={basename}
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <App />
  </BrowserRouter>
);
