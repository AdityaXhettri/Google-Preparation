import { useEffect, useState } from "react";

/**
 * Floating "scroll to top" button.
 * Appears when the user scrolls down more than 300px.
 * Clicking it smooth-scrolls the main content area to top.
 */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const main = document.querySelector("main");
      const scrollY = main ? main.scrollTop : window.scrollY;
      setVisible(scrollY > 300);
    };
    const main = document.querySelector("main");
    if (main) {
      main.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (main) main.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    const main = document.querySelector("main");
    if (main) {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}
      className={`px-3 py-3 rounded-full shadow-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg transition-all hover:scale-110 active:scale-95 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      ⬆
    </button>
  );
}
