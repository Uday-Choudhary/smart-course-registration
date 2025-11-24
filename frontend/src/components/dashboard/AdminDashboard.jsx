import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarAdmin from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import DashboardNavbar from "../common/DashboardNavbar";
import UserCard from "../common/UserCard";
import axios from "axios";

const AdminDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    student: 0,
    faculty: 0,
    course: 0,
    section: 0,
    room: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    if (user?.role === "Admin") {
      fetchStats();
    }
  }, [user]);

  // Pages that should have full-width layout (no padding)
  const noPaddingPaths = [
    "/admin/students",
    "/admin/faculty",
    "/admin/courses",
    "/admin/sections",
    "/admin/terms",
    "/admin/deadlines",
    "/admin/rooms",
    "/admin/schedules"
  ];

  // Allow dynamic routes like /admin/terms/1/courses
  const isTermCoursesPage = /^\/admin\/terms\/\d+\/courses$/.test(location.pathname);

  const isNoPaddingPage =
    noPaddingPaths.includes(location.pathname) || isTermCoursesPage;

  return (
    <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
      {/* LEFT - SIDEBAR */}
      <div className="w-[18%] p-4 bg-[#F7F7F7] rounded-3xl shadow-sm h-full overflow-y-auto flex flex-col">
        <Link
          to="/"
          className="flex items-center justify-center lg:justify-start gap-2 mb-8 shrink-0"
        >
          <img src="/logo.png" alt="logo" width={32} height={32} />
          <span className="hidden lg:block font-bold text-gray-800">
            SchooLama
          </span>
        </Link>
        <SidebarAdmin role={user?.role} />
      </div>

      {/* RIGHT - MAIN CONTENT */}
      <div className="w-[82%] flex flex-col gap-4">
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* MAIN CONTENT */}
        <main
          className={`rounded-2xl shadow-sm flex-1 bg-[#F7F7F7] ${isNoPaddingPage ? "" : "p-8"}`}
        >
          {children || (
            <>
              <div className="flex gap-4 justify-between flex-wrap">
                <UserCard type="student" color="bg-[#FAE27C]" count={stats.student} />
                <UserCard type="teacher" color="bg-[#c7b8ff]" count={stats.faculty} />
                <UserCard type="course" color="bg-[#b9e3ff]" count={stats.course} />
                <UserCard type="section" color="bg-[#ffd6e0]" count={stats.section} />
                <UserCard type="room" color="bg-[#ffe3b3]" count={stats.room} />
                <UserCard type="parent" color="bg-[#b8f2b6]" count={0} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
