import React from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import { BookOpen, GraduationCap, Clock, Award } from "lucide-react";

const StudentDashboard = () => {
    const stats = [
        {
            title: "GPA",
            value: "3.8",
            icon: Award,
            color: "indigo",
            trend: { value: 0.2, positive: true, label: "this semester" },
        },
        {
            title: "Credits Earned",
            value: "84",
            icon: GraduationCap,
            color: "green",
            trend: { value: 12, positive: true, label: "this year" },
        },
        {
            title: "Enrolled Courses",
            value: "5",
            icon: BookOpen,
            color: "blue",
        },
        {
            title: "Upcoming Classes",
            value: "2",
            icon: Clock,
            color: "amber",
            trend: { value: "Next: 2PM", positive: true, label: "" },
        },
    ];

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
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        Assignment "React Basics" graded
                                    </p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Today's Schedule</h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-50/50">
                            <p className="text-xs font-semibold text-indigo-600 mb-1">
                                09:00 AM - 10:30 AM
                            </p>
                            <h4 className="font-bold text-gray-800">Web Development</h4>
                            <p className="text-sm text-gray-500">Room 304 • Dr. Smith</p>
                        </div>
                        <div className="p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-50/50">
                            <p className="text-xs font-semibold text-emerald-600 mb-1">
                                11:00 AM - 12:30 PM
                            </p>
                            <h4 className="font-bold text-gray-800">Database Systems</h4>
                            <p className="text-sm text-gray-500">Lab 2 • Prof. Johnson</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
