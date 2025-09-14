import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Mount React app with correct basename for GitHub Pages
createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename="/agro">
    <App />
  </BrowserRouter>
);
