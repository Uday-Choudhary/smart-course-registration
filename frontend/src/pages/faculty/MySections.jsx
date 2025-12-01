import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";
import { BookOpen, Users, Calendar, Clock } from "lucide-react";
import { useSearch } from "../../context/SearchContext";

const MySections = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { searchQuery } = useSearch();

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const data = await apiClient.get("/api/faculty/dashboard-stats", { auth: true });
                if (data.success) {
                    setSections(data.data.mySections || []);
                }
            } catch (err) {
                setError("Failed to load assigned courses");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSections();
    }, []);

    // Filter sections based on search query
    const filteredSections = sections.filter(section =>
        section.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.sectionCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Assigned Courses</h1>
                <span className="text-sm text-gray-500">
                    {filteredSections.length} of {sections.length} section{sections.length !== 1 ? 's' : ''}
                </span>
            </div>

            {filteredSections.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                        {sections.length === 0 ? "No courses assigned yet" : "No courses match your search"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                            {section.courseCode}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {section.sectionCode}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        {section.courseTitle}
                                    </h3>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span>
                                        <span className="font-semibold text-gray-900">{section.enrolledCount}</span>
                                        {" / "}
                                        <span className="text-gray-500">{section.capacity}</span>
                                        {" students"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${section.enrolledCount >= section.capacity
                                                    ? "bg-red-500"
                                                    : section.enrolledCount >= section.capacity * 0.8
                                                        ? "bg-amber-500"
                                                        : "bg-green-500"
                                                    }`}
                                                style={{
                                                    width: `${Math.min((section.enrolledCount / section.capacity) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium">
                                        {Math.round((section.enrolledCount / section.capacity) * 100)}%
                                    </span>
                                </div>

                                {section.enrolledCount >= section.capacity && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                            Full
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySections;
