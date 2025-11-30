import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCourses } from "../../api/courses";
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Available Courses</h1>
                {/* Add filters here if needed */}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            onClick={() => navigate(`/student/courses/${course.id}`)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 transition-colors">
                                    {course.code}
                                </span>
                                <span className="text-sm text-gray-500 font-medium">{course.creditHours} Credits</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {course.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                                {course.description || "No description available."}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                                <span>Term: {course.term?.semester} {course.term?.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BrowseCourses;
