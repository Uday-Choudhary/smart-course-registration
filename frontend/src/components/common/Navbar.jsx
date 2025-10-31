// src/components/common/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/70 shadow-sm text-slate-800 text-sm">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-indigo-700">
        🎓 SmartReg
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
        <a href="#features" className="hover:text-indigo-600 transition">Features</a>
        <a href="#workflow" className="hover:text-indigo-600 transition">Workflow</a>
        <a href="#roles" className="hover:text-indigo-600 transition">Roles</a>
        <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          to="/login"
          className="px-5 py-2 border border-indigo-600 rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
        >
          Register
        </Link>
      </div>

      {/* Mobile Menu Placeholder (optional) */}
      <button id="open-menu" className="md:hidden active:scale-90 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 5h16M4 12h16M4 19h16" />
        </svg>
      </button>
    </nav>
  );
};

export default Navbar;
