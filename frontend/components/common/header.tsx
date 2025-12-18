"use client";

import React, { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/">
          <img src="/media/images/logo.svg" alt="Logo" className="w-32" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <a href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </a>
          <a href="/signup" className="hover:text-blue-600">
            Signup
          </a>
          <a href="/about" className="hover:text-blue-600">
            About
          </a>
          <a href="/products" className="hover:text-blue-600">
            Product
          </a>
          <a href="/pricing" className="hover:text-blue-600">
            Pricing
          </a>
          <a href="/support" className="hover:text-blue-600">
            Support
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-4 text-sm">
          <a href="/dashboard" className="block hover:text-blue-600">
            Dashboard
          </a>
          <a href="/signup" className="block hover:text-blue-600">
            Signup
          </a>
          <a href="/about" className="block hover:text-blue-600">
            About
          </a>
          <a href="/products" className="block hover:text-blue-600">
            Product
          </a>
          <a href="/pricing" className="block hover:text-blue-600">
            Pricing
          </a>
          <a href="/support" className="block hover:text-blue-600">
            Support
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
