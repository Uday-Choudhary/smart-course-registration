import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../api/courses";
import { enrollStudent } from "../../api/enroll";
import { useAuth } from "../../context/AuthContext"; // Assuming this hook exists
import SidebarAdmin from "../../components/common/Sidebar";
import DashboardNavbar from "../../components/common/DashboardNavbar";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from context
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(null); // Track enrolling state per section
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                setCourse(data);
            } catch (err) {
                setError("Failed to load course details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleEnroll = async (sectionId) => {
        if (!user || !user.id) {
            setError("You must be logged in to enroll.");
            return;
        }

        setEnrolling(sectionId);
        setMessage(null);
        try {
            await enrollStudent(user.id, sectionId);
            setMessage({ type: "success", text: "Successfully enrolled!" });
            // Optional: Refresh course data or redirect
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: err.response?.data?.error || "Failed to enroll." });
        } finally {
            setEnrolling(null);
        }
    };

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
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                    >
                        ← Back to Courses
                    </button>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center mt-10">{error}</div>
                    ) : !course ? (
                        <div className="text-center mt-10">Course not found</div>
                    ) : (
                        <div className="max-w-4xl">
                            <div className="bg-white shadow-sm rounded-lg mb-8 p-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {course.code}: {course.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    {course.creditHours} Credits • Term: {course.term?.semester} {course.term?.year}
                                </p>
                                <div className="border-t border-gray-100 pt-4">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {course.description || "No description available."}
                                    </p>
                                </div>
                            </div>

                            <h4 className="text-xl font-bold text-gray-900 mb-4">Available Sections</h4>

                            {message && (
                                <div className={`mb-4 p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="space-y-4">
                                {course.sectionCourses && course.sectionCourses.length > 0 ? (
                                    course.sectionCourses.map((sc) => (
                                        <div key={sc.id} className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h5 className="text-lg font-medium text-gray-900">
                                                        Section {sc.section?.sectionCode}
                                                    </h5>
                                                    <p className="text-sm text-gray-500">
                                                        Faculty: {sc.faculty?.full_name || "TBA"}
                                                    </p>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        {sc.schedules && sc.schedules.length > 0 ? (
                                                            sc.schedules.map((sch) => (
                                                                <div key={sch.id}>
                                                                    {sch.dayOfWeek} {new Date(sch.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({sch.room?.roomCode})
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span>Schedule TBA</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => handleEnroll(sc.section?.id)}
                                                        disabled={enrolling === sc.section?.id}
                                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                                                            ${enrolling === sc.section?.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
                                                    >
                                                        {enrolling === sc.section?.id ? 'Enrolling...' : 'Enroll'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No sections available for this course.</p>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CourseDetails;
