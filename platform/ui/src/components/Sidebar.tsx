import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/dsa", label: "DSA Patterns", icon: "🎯" },
  { to: "/practice/dsa", label: "Practice DSA", icon: "💻" },
  { to: "/study", label: "Study Notes", icon: "📚" },
  { to: "/practice/system-design", label: "System Design", icon: "🏗️" },
  { to: "/practice/behavioral", label: "Behavioral", icon: "🎤" },
  { to: "/chat", label: "Chat", icon: "💬" },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="text-lg font-bold tracking-tight">L4 Prep</div>
        <div className="text-xs text-zinc-500 mt-0.5">Local-only · Vite + Bun</div>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                isActive
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
        Progress in your browser
      </div>
    </aside>
  );
}