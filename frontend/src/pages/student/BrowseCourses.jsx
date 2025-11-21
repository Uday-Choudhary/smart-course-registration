import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../api/courses";
import SidebarAdmin from "../../components/common/Sidebar";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import { useAuth } from "../../context/AuthContext";

const BrowseCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses();
                setCourses(data);
            } catch (err) {
                setError("Failed to load courses");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
            {/* LEFT - SIDEBAR */}
            <div className="w-[18%] p-4 bg-[#F7F7F7] rounded-2xl">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                    <img src="/logo.png" alt="logo" width={32} height={32} />
                    <span className="hidden lg:block font-bold text-gray-800">SchooLama</span>
                </div>
                <SidebarAdmin role={user?.role} />
            </div>

            {/* RIGHT - MAIN CONTENT */}
            <div className="w-[82%] flex flex-col gap-4">
                {/* NAVBAR */}
                <div className="bg-white rounded-2xl shadow-sm">
                    <DashboardNavbar />
                </div>
                {/* MAIN */}
                <main className="bg-[#F7F7F7] rounded-2xl flex-1 p-8 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Browse Courses</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center mt-10">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    onClick={() => navigate(`/student/courses/${course.id}`)}
                                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {course.code}
                                        </span>
                                        <span className="text-sm text-gray-500">{course.creditHours} Credits</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                                        {course.description || "No description available."}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span>Term: {course.term?.semester} {course.term?.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BrowseCourses;
