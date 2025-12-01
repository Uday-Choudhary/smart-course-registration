import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SidebarAdmin from "../common/Sidebar";
import { useAuth } from "../../context/AuthContext";
import DashboardNavbar from "../common/DashboardNavbar";
import UserCard from "../common/UserCard";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminDashboard = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    student: 0,
    faculty: 0,
    course: 0,
    section: 0,
    room: 0,
    registrations: 0,
    waitlists: 0,
    capacityUtilization: 0
  });
  const [oversubscribedSections, setOversubscribedSections] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Handle the nested response structure
        const data = response.data;
        if (data.success && data.data) {
          const { stats: apiStats, oversubscribedSections: sections, recentRegistrations: registrations } = data.data;

          setStats({
            student: apiStats.totalStudents || 0,
            faculty: apiStats.totalFaculty || 0,
            course: apiStats.totalCourses || 0,
            section: apiStats.totalSections || 0,
            room: 0, // Room count not in new API
            registrations: apiStats.totalRegistrations || 0,
            waitlists: apiStats.totalWaitlists || 0,
            capacityUtilization: apiStats.capacityUtilization || 0
          });

          setOversubscribedSections(sections || []);
          setRecentRegistrations(registrations || []);
        } else {
          // Fallback for old API format
          setStats({
            student: response.data.student || 0,
            faculty: response.data.faculty || 0,
            course: response.data.course || 0,
            section: response.data.section || 0,
            room: response.data.room || 0,
            registrations: 0,
            waitlists: 0,
            capacityUtilization: 0
          });
        }
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
        <DashboardNavbar showSearch={true} />

        {/* MAIN CONTENT */}
        <main
          className={`rounded-2xl shadow-sm flex-1 bg-[#F7F7F7] overflow-y-auto ${isNoPaddingPage ? "" : "p-8"}`}
        >
          {children || (
            <>
              <div className="flex gap-4 justify-between flex-wrap mb-6">
                <UserCard type="student" color="bg-[#FAE27C]" count={stats.student} />
                <UserCard type="teacher" color="bg-[#c7b8ff]" count={stats.faculty} />
                <UserCard type="course" color="bg-[#b9e3ff]" count={stats.course} />
                <UserCard type="section" color="bg-[#ffd6e0]" count={stats.section} />
                <UserCard type="registrations" color="bg-[#b8f2b6]" count={stats.registrations} />
                <UserCard type="waitlist" color="bg-[#ffb3b3]" count={stats.waitlists} />
              </div>

              {/* Oversubscribed Sections with Waitlists */}
              {oversubscribedSections.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Sections with Waitlists</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Section
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacity
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Enrolled
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Waitlisted
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {oversubscribedSections.map((section) => (
                          <tr key={section.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {section.sectionCode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <div className="font-medium">{section.courseCode}</div>
                              <div className="text-gray-500 text-xs">{section.courseTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {section.capacity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="font-semibold text-green-600">{section.enrolled}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="font-semibold text-amber-600">{section.waitlisted}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {section.enrolled >= section.capacity ? (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Full
                                </span>
                              ) : (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Available
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recent Registrations */}
              {recentRegistrations.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Registrations</h3>
                  <div className="space-y-3">
                    {recentRegistrations.slice(0, 5).map((reg) => (
                      <div key={reg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{reg.studentName}</div>
                          <div className="text-sm text-gray-500">
                            {reg.courseCode} - Section {reg.sectionCode}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(reg.registeredAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
