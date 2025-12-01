import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { BookOpen, GraduationCap, Clock, Award } from "lucide-react";
import { getStudentDashboardStats } from "../api/students";

const StudentDashboard = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getStudentDashboardStats();
                if (response.success) {
                    setStatsData(response.data);
                } else {
                    setError("Failed to load dashboard data");
                }
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const stats = [
        {
            title: "GPA",
            value: statsData?.gpa || "N/A",
            icon: Award,
            color: "indigo",
            // trend: { value: 0.2, positive: true, label: "this semester" },
        },
        {
            title: "Credits Earned",
            value: statsData?.creditsEarned || "0",
            icon: GraduationCap,
            color: "green",
            // trend: { value: 12, positive: true, label: "this year" },
        },
        {
            title: "Enrolled Courses",
            value: statsData?.enrolledCourses || "0",
            icon: BookOpen,
            color: "blue",
        },
        {
            title: "Upcoming Classes",
            value: statsData?.upcomingClasses?.length || "0",
            icon: Clock,
            color: "amber",
            trend: statsData?.upcomingClasses?.length > 0
                ? { value: `Next: ${new Date(statsData.upcomingClasses[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, positive: true, label: "" }
                : null,
        },
    ];

    if (loading) {
        return (
            <DashboardLayout title="Dashboard" subtitle="Welcome back, Student">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout title="Dashboard" subtitle="Welcome back, Student">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Dashboard" subtitle="Welcome back, Student">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                        {/* <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                            View All
                        </button> */}
                    </div>
                    <div className="space-y-4">
                        {statsData?.recentActivity?.length > 0 ? (
                            statsData.recentActivity.map((item) => (
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
                        {statsData?.upcomingClasses?.length > 0 ? (
                            statsData.upcomingClasses.map((cls) => (
                                <div key={cls.id} className="p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-50/50">
                                    <p className="text-xs font-semibold text-indigo-600 mb-1">
                                        {new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
        </DashboardLayout>
    );
};

export default StudentDashboard;
