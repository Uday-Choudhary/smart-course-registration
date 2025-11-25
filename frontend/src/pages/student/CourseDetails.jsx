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
    const [clashModal, setClashModal] = useState(null); // { clashes: [], alternatives: [] }

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
        setClashModal(null);
        try {
            await enrollStudent(user.id, sectionId);
            setMessage({ type: "success", text: "Successfully enrolled! Check 'My Registrations' to see your enrolled courses." });
            // Optional: Refresh course data or redirect
        } catch (err) {
            console.error("Enrollment error:", err);

            // Check if it's a clash error (409 status)
            // The API client throws errors with status and data directly on the error object
            if (err.status === 409) {
                const errorData = err.data;
                setClashModal({
                    clashes: errorData.clashes || [],
                    alternatives: errorData.alternatives || []
                });
            } else {
                setMessage({ type: "error", text: err.data?.error || err.message || "Failed to enroll." });
            }
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

                    {/* Clash Notification Card */}
                    {clashModal && (
                        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
                            <div className="bg-white rounded-lg shadow-2xl border-2 border-red-300">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Time Clash Detected!</h3>
                                                <p className="text-sm text-gray-600">This section conflicts with your existing schedule.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setClashModal(null)}
                                            className="text-gray-400 hover:text-gray-600 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Clash Details */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Conflicts:</h4>
                                        <div className="space-y-2">
                                            {clashModal.clashes.map((clash, idx) => (
                                                <div key={idx} className="bg-red-50 border border-red-200 rounded-md p-3">
                                                    <p className="text-sm font-medium text-red-900">
                                                        {clash.courseCode} - {clash.courseTitle}
                                                    </p>
                                                    <p className="text-xs text-red-700 mt-1">
                                                        {clash.day} at {clash.time}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Alternative Sections */}
                                    {clashModal.alternatives && clashModal.alternatives.length > 0 ? (
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Try These Alternative Times:</h4>
                                            <div className="space-y-2">
                                                {clashModal.alternatives.map((alt) => (
                                                    <div key={alt.id} className="bg-green-50 border border-green-200 rounded-md p-3">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex-1">
                                                                <h5 className="text-sm font-semibold text-gray-900">
                                                                    Section {alt.sectionCode}
                                                                </h5>
                                                                <p className="text-xs text-gray-600">Faculty: {alt.facultyName}</p>
                                                                <div className="mt-1">
                                                                    {alt.schedules.map((sch, idx) => (
                                                                        <p key={idx} className="text-xs text-gray-700">
                                                                            📅 {sch.day} {sch.time} ({sch.room})
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                                    {alt.availableSeats} seats
                                                                </span>
                                                                <button
                                                                    onClick={() => {
                                                                        setClashModal(null);
                                                                        handleEnroll(alt.id);
                                                                    }}
                                                                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-1.5 px-3 rounded-md transition"
                                                                >
                                                                    Enroll
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                            <p className="text-sm text-yellow-800">
                                                No alternative sections available at this time. Please try a different course or check back later.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CourseDetails;
