"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

const THEME_KEY = "theme";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const nextIsDark = stored ? stored === "dark" : prefersDark;
    setIsDark(nextIsDark);
    const root = document.documentElement;
    if (nextIsDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(THEME_KEY, next ? "dark" : "light");
        const root = document.documentElement;
        if (next) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
      return next;
    });
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo iconSize={36} />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700 dark:text-gray-100">
          <Link
            href="/dashboard"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Dashboard
          </Link>
          <Link
            href="/signup"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Signup
          </Link>
          <Link
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link
            href="/products"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Product
          </Link>
          <Link
            href="/pricing"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Pricing
          </Link>
          <Link
            href="/support"
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-700 dark:text-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-4 text-sm text-gray-700 dark:text-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs">Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800"
            >
              {isDark ? "Dark" : "Light"}
            </button>
          </div>

          <Link
            href="/dashboard"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Dashboard
          </Link>
          <Link
            href="/signup"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Signup
          </Link>
          <Link
            href="/about"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link
            href="/products"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Product
          </Link>
          <Link
            href="/pricing"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Pricing
          </Link>
          <Link
            href="/support"
            className="block hover:text-blue-600 dark:hover:text-blue-400"
          >
            Support
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
