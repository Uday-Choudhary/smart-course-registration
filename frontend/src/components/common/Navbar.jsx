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

  // ➤ Compute role-based profile route
  const profilePath =
    user?.role === "Admin"
      ? "/admin/profile"
      : user?.role === "Faculty"
      ? "/faculty/profile"
      : "/student/profile";

  return (
    <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur bg-white/100 text-slate-800 text-sm">
      
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2 font-semibold text-xl text-indigo-700">
        🎓 SmartReg
      </Link>

      {/* MAIN NAV LINKS */}
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
      </div>

      {/* RIGHT SIDE */}
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
          <div className="flex items-center gap-5">

            {/* USER NAME + ROLE */}
            <div className="flex flex-col text-right">
              <span className="text-sm text-slate-700 font-medium">{user?.name}</span>
              <span className="text-xs text-indigo-600">{user?.role}</span>
            </div>

            {/* PROFILE AVATAR */}
            <button
              onClick={() => navigate(profilePath)}
              className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:scale-105 transition shadow-sm"
              title="Profile"
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                : "U"}
            </button>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* MOBILE MENU ICON */}
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
