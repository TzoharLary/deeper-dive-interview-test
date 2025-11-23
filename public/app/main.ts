import { renderDashboard } from "./ui/dashboard.js";
import { renderPublishersPage } from "./ui/publishers.js";
import { createStore } from "./state/store.js";

async function bootstrap() {
  const root = document.getElementById("app") as HTMLElement;
  if (!root) throw new Error("#app not found");

  // Initialize store
  const store = createStore();

  // Simple client-side router
  async function navigateTo(
    view: "dashboard" | "publishers" | "tools",
    options?: { preselectPublisherId?: string }
  ) {
    root.innerHTML = "";
    if (view === "dashboard") {
      // Render the actual dashboard
      await renderDashboard(root, store, navigateTo);
      setActiveNav("nav-dashboard");
    } else if (view === "publishers") {
      // New publishers page
      await renderPublishersPage(root, { initialPublisherId: options?.preselectPublisherId });
      setActiveNav("nav-publishers");
    } else if (view === "tools") {
      root.innerHTML = "<div style=\"padding: 2rem; text-align: center; color: #64748b;\">Tools coming soon...</div>";
      setActiveNav("nav-tools");
    }
  }

  function setActiveNav(id: string) {
    const ids = ["nav-dashboard", "nav-publishers", "nav-tools"];
    ids.forEach(i => {
      const el = document.getElementById(i);
      if (!el) return;
      if (i === id) {
        el.classList.remove("text-slate-500");
        el.classList.add("text-slate-700", "font-semibold");
      } else {
        el.classList.remove("text-slate-700", "font-semibold");
        el.classList.add("text-slate-500");
      }
    });
  }

  // Wire nav clicks
  const navDashboard = document.getElementById("nav-dashboard");
  const navPublishers = document.getElementById("nav-publishers");
  const navTools = document.getElementById("nav-tools");
  if (navDashboard) navDashboard.addEventListener("click", (e) => { e.preventDefault(); navigateTo("dashboard"); });
  if (navPublishers) navPublishers.addEventListener("click", (e) => { e.preventDefault(); navigateTo("publishers"); });
  if (navTools) navTools.addEventListener("click", (e) => { e.preventDefault(); navigateTo("tools"); });

  // Default route
  await navigateTo("dashboard");
}

bootstrap().catch((err) => {
  console.error("Bootstrap failed", err);
  
  // Show error message to user
  const root = document.getElementById("app") as HTMLElement;
  if (root) {
    root.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #ef4444;">
        <h2>Failed to load application</h2>
        <p>Please check the console for details and refresh the page.</p>
        <pre style="background: #f1f5f9; padding: 1rem; margin: 1rem auto; max-width: 600px; text-align: left; border-radius: 6px;">${err}</pre>
      </div>
    `;
  }
});
