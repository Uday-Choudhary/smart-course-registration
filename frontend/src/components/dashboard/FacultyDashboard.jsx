import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarAdmin from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import DashboardNavbar from "../common/DashboardNavbar";
import StatCard from "./StatCard";
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";
import { apiClient } from "../../api/client";

const FacultyDashboard = ({ children }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log("=== FRONTEND: Fetching faculty dashboard data ===");
        const data = await apiClient.get("/api/academic/faculty/dashboard-stats", { auth: true });
        console.log("=== FRONTEND: Received data ===", data);
        if (data.success) {
          console.log("=== FRONTEND: Dashboard data ===", data.data);
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch faculty dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Sections",
      value: dashboardData?.totalSections?.toString() || "0",
      icon: BookOpen,
      color: "blue",
      trend: { value: 0, positive: true, label: "this term" },
    },
    {
      title: "Total Students",
      value: dashboardData?.totalStudents?.toString() || "0",
      icon: Users,
      color: "green",
      trend: { value: 0, positive: true, label: "across sections" },
    },
    {
      title: "Upcoming Classes",
      value: dashboardData?.upcomingClasses?.length?.toString() || "0",
      icon: Clock,
      color: "amber",
      trend: {
        value: dashboardData?.upcomingClasses?.[0]
          ? `Next: ${new Date(dashboardData.upcomingClasses[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : "No classes today",
        positive: true,
        label: ""
      },
    },
  ];

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
        <DashboardNavbar showSearch={true} />

        {/* MAIN CONTENT */}
        <main className="rounded-2xl shadow-sm flex-1 bg-[#F7F7F7] p-8 overflow-y-auto">
          {children || (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assigned Courses */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Assigned Courses</h3>
                    <Link
                      to="/faculty/sections"
                      className="text-sm text-indigo-600 font-medium hover:text-indigo-700"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {dashboardData?.mySections?.length > 0 ? (
                      dashboardData.mySections.slice(0, 5).map((section) => (
                        <div
                          key={section.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                              {section.courseCode.substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {section.courseCode} - {section.sectionCode}
                              </p>
                              <p className="text-xs text-gray-500">{section.courseTitle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-700">
                              {section.enrolledCount}/{section.capacity}
                            </p>
                            <p className="text-xs text-gray-500">Students</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No assigned courses</p>
                    )}
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Today's Schedule</h3>
                  <div className="space-y-4">
                    {dashboardData?.upcomingClasses?.length > 0 ? (
                      dashboardData.upcomingClasses.map((cls) => (
                        <div key={cls.id} className="p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-50/50">
                          <p className="text-xs font-semibold text-indigo-600 mb-1">
                            {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                            {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <h4 className="font-bold text-gray-800">{cls.courseCode}</h4>
                          <p className="text-sm text-gray-500">
                            {cls.sectionCode} • Room {cls.room}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {cls.enrolledCount} students
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No classes today</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
