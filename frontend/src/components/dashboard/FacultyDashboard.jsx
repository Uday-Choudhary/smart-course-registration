import React from "react";
import SidebarAdmin from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import DashboardNavbar from "../common/DashboardNavbar";
import { Link } from "react-router-dom";

const FacultyDashboard = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
      {/* LEFT - SIDEBAR */}
      <div className="w-[18%] p-4 bg-[#F7F7F7] rounded-2xl">
        <Link
          to="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-8"
        >
          <img src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-gray-800">SchooLama</span>
        </Link>
        <SidebarAdmin role={user?.role} />
      </div>

      {/* RIGHT - MAIN CONTENT */}
      <div className="w-[82%] flex flex-col gap-4">
        {/* NAVBAR */}
        <div className="bg-white rounded-2xl shadow-sm">
          <DashboardNavbar />
        </div>

        {/* MAIN */}
        <main className="bg-[#F7F7F7] rounded-2xl flex-1 p-8">
          {children ? (
            children
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Faculty Dashboard
              </h1>
              <p className="text-gray-700">
                This is where the main content of the faculty dashboard will go.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
