import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, Search } from "lucide-react";

const DashboardNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToProfile = () => {
    if (!user) return;

    if (user.role === "Admin") navigate("/admin/profile");
    else if (user.role === "Faculty") navigate("/faculty/profile");
    else navigate("/student/profile");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* SEARCH BAR */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* NOTIFICATION BELL */}
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition relative">
          <Bell size={23} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* USER PROFILE */}
        <div
          onClick={goToProfile}
          className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-transparent hover:bg-gray-50 cursor-pointer transition"
        >
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700 leading-tight">{user?.name}</p>
            <p className="text-[11px] text-gray-500 leading-tight">{user?.role}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
