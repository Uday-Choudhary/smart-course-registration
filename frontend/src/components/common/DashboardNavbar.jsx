import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

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
    <nav className="flex items-center justify-end px-6 py-3 bg-white rounded-2xl shadow-sm border border-gray-100">

      <div className="flex items-center gap-4">
        {/* NOTIFICATION BELL */}
        <NotificationDropdown />

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
