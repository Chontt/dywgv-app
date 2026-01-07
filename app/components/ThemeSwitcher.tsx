"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const initialTheme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(newTheme);
    };

    if (!theme) return <div className="p-2 w-10 h-10" />;

    return (
        <button
            onClick={toggleTheme}
            className={`
        p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center
        ${theme === 'light'
                    ? 'bg-charcoal text-glow-cyan border-charcoal hover:bg-neon-cyan hover:border-neon-cyan'
                    : 'bg-glow-cyan text-charcoal border-glow-cyan hover:bg-neon-cyan hover:border-neon-cyan'}
      `}
            aria-label="Toggle Theme"
        >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
