import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label="Toggle dark mode"
      className="px-3 py-2 bg-gray-200 dark:bg-gray-800 dark:text-white text-black rounded-lg transition-shadow hover:shadow-sm text-sm"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
