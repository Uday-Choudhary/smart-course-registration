import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Search,
    Calendar,
    Settings,
    LogOut,
    GraduationCap,
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/student" },
        { name: "My Courses", icon: BookOpen, path: "/student/my-registrations" },
        { name: "Browse Courses", icon: Search, path: "/student/browse-courses" },
        { name: "Timetable", icon: Calendar, path: "/student/timetable" },
        { name: "Profile", icon: Settings, path: "/student/profile" },
    ];

    const isActive = (path) => {
        if (path === "/student" && location.pathname === "/student") return true;
        if (path !== "/student" && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white/80 backdrop-blur-md border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Area */}
                    <div className="flex items-center justify-center h-16 border-b border-gray-200/50">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                            <GraduationCap className="h-8 w-8" />
                            <span>Smart Course</span>
                        </div>
                    </div>

                    {/* User Profile Summary (Mini) */}
                    <div className="p-6 text-center border-b border-gray-200/50 bg-indigo-50/30">
                        <div className="mx-auto h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold mb-3 shadow-sm">
                            S
                        </div>
                        <h3 className="font-semibold text-gray-800">Student Name</h3>
                        <span className="inline-block px-2 py-1 mt-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full">
                            Student
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive(item.path)
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                    }`}
                            >
                                <item.icon
                                    className={`h-5 w-5 transition-colors ${isActive(item.path)
                                            ? "text-white"
                                            : "text-gray-400 group-hover:text-indigo-600"
                                        }`}
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200/50">
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                window.location.href = "/login";
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
