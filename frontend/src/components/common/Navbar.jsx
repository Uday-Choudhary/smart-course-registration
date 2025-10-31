import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/100 text-slate-800 text-sm">
      <Link
        to="/"
        className="flex items-center gap-2 font-semibold text-xl text-indigo-700"
      >
        🎓 SmartReg
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="hover:text-indigo-600 transition">
          Home
        </Link>
        <a href="#features" className="hover:text-indigo-600 transition">
          Features
        </a>
        <a href="#workflow" className="hover:text-indigo-600 transition">
          Workflow
        </a>
        <a href="#roles" className="hover:text-indigo-600 transition">
          Roles
        </a>
        <a href="#contact" className="hover:text-indigo-600 transition">
          Contact
        </a>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {!isAuthenticated ? (
          <>
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
          </>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-700">
              {user?.name}{" "}
              <span className="text-indigo-600 font-medium">({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

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
