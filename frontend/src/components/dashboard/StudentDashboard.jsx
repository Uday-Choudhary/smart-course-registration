import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarAdmin from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import DashboardNavbar from "../common/DashboardNavbar";
import StatCard from "./StatCard";
import { BookOpen, GraduationCap, Clock, Award } from "lucide-react";
import { apiClient } from "../../api/client";

const StudentDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [waitlists, setWaitlists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("=== FRONTEND: Fetching dashboard data ===");
        
        const data = await apiClient.get("/api/students/dashboard-stats", { auth: true });
        console.log("=== FRONTEND: Received data ===", data);
        
        if (data.success) {
          console.log("=== FRONTEND: Dashboard data ===", data.data);
          console.log("Enrolled Courses:", data.data.enrolledCourses);
          console.log("Credits Earned:", data.data.creditsEarned);
          setDashboardData(data.data);
        }

        // Fetch waitlists
        const waitlistData = await apiClient.get("/api/enroll/waitlists", { auth: true });
        console.log("=== FRONTEND: Waitlist data ===", waitlistData);
        if (waitlistData.success) {
          setWaitlists(waitlistData.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Credits Earned",
      value: dashboardData?.creditsEarned?.toString() || "0",
      icon: GraduationCap,
      color: "green",
      trend: { value: 0, positive: true, label: "total" },
    },
    {
      title: "Enrolled Courses",
      value: dashboardData?.enrolledCourses?.toString() || "0",
      icon: BookOpen,
      color: "blue",
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
        <DashboardNavbar showSearch={location.pathname === '/student/browse-courses'} />

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

              {/* Recent Activity & Schedule Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {dashboardData?.recentActivity?.length > 0 ? (
                      dashboardData.recentActivity.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Schedule */}
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
                          <h4 className="font-bold text-gray-800">{cls.courseTitle}</h4>
                          <p className="text-sm text-gray-500">Room {cls.room} • {cls.courseCode}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No classes today</p>
                    )}
                  </div>
                </div>
              </div>

              {/* My Waitlists Section */}
              {waitlists.length > 0 && (
                <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">My Waitlists</h3>
                    <span className="text-sm text-gray-500">{waitlists.length} course{waitlists.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-4">
                    {waitlists.map((waitlist) => (
                      <div
                        key={waitlist.id}
                        className="p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-800">
                                {waitlist.course.code} - {waitlist.course.title}
                              </h4>
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                                Position #{waitlist.position}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>Section: {waitlist.section.sectionCode}</span>
                              <span>•</span>
                              <span>Credits: {waitlist.course.creditHours}</span>
                              <span>•</span>
                              <span>Faculty: {waitlist.faculty.name}</span>
                            </div>
                            {waitlist.schedules && waitlist.schedules.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {waitlist.schedules.map((schedule, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700"
                                  >
                                    {schedule.day}: {new Date(`2000-01-01T${schedule.startTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(`2000-01-01T${schedule.endTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({schedule.room})
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            Joined: {new Date(waitlist.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
