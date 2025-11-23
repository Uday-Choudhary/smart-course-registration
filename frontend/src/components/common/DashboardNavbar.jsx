import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <nav className="flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

      {/* TOP RIGHT USER BUTTON */}
      <div
        onClick={goToProfile}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center font-bold text-indigo-700">
          {user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>

        <div className="hidden md:block text-left">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
