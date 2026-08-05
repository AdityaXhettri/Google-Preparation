import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top whenever the route changes.
 * Also handles initial page load.
 */
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll the main content area to top
    const main = document.querySelector("main");
    if (main) {
      main.scrollTop = 0;
    }
    // Also scroll the window as fallback
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return null;
}
