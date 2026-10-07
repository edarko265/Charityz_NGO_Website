import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// After a new deploy, a tab opened earlier may request page chunks that no longer exist.
// Reload once to pick up the new build instead of showing a broken page.
window.addEventListener("vite:preloadError", (event) => {
  try {
    // At most one automatic reload per minute, so a genuinely missing file can't cause a reload loop
    const last = Number(sessionStorage.getItem("reloaded-after-deploy-at") || 0);
    if (Date.now() - last < 60_000) return;
    sessionStorage.setItem("reloaded-after-deploy-at", String(Date.now()));
  } catch {
    return; // Storage unavailable: can't guard against loops, so don't auto-reload
  }
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(<App />);
