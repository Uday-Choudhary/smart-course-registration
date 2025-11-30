import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../api/courses";
import { enrollStudent } from "../../api/enroll";
import { useAuth } from "../../context/AuthContext";

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(null);
    const [message, setMessage] = useState(null);
    const [clashModal, setClashModal] = useState(null);

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
        } catch (err) {
            console.error("Enrollment error:", err);
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
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium transition-colors"
            >
                ← Back to Courses
            </button>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">{error}</div>
            ) : !course ? (
                <div className="text-center mt-10 text-gray-500">Course not found</div>
            ) : (
                <div>
                    <div className="bg-white shadow-sm rounded-2xl mb-8 p-8 border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {course.code}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {course.creditHours} Credits • Term: {course.term?.semester} {course.term?.year}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-2">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Description</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {course.description || "No description available."}
                            </p>
                        </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 mb-6">Available Sections</h4>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        {course.sectionCourses && course.sectionCourses.length > 0 ? (
                            course.sectionCourses.map((sc) => (
                                <div key={sc.id} className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 hover:border-indigo-100 transition-colors">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h5 className="text-lg font-bold text-gray-900">
                                                    Section {sc.section?.sectionCode}
                                                </h5>
                                                <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                    {sc.availableSeats || 0} seats left
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3">
                                                Faculty: <span className="font-medium text-gray-700">{sc.faculty?.full_name || "TBA"}</span>
                                            </p>
                                            <div className="space-y-1">
                                                {sc.schedules && sc.schedules.length > 0 ? (
                                                    sc.schedules.map((sch) => (
                                                        <div key={sch.id} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <span className="w-24 font-medium">{sch.dayOfWeek}</span>
                                                            <span>{new Date(sch.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            <span className="text-gray-400">({sch.room?.roomCode})</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Schedule TBA</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => handleEnroll(sc.section?.id)}
                                                disabled={enrolling === sc.section?.id}
                                                className={`inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white transition-all
                                                    ${enrolling === sc.section?.id
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95'}`}
                                            >
                                                {enrolling === sc.section?.id ? 'Enrolling...' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500">No sections available for this course yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Clash Notification Card */}
            {clashModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Time Clash Detected</h3>
                                    <p className="text-gray-500">This section conflicts with your existing schedule.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setClashModal(null)}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Clash Details */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Conflicts</h4>
                                <div className="space-y-3">
                                    {clashModal.clashes.map((clash, idx) => (
                                        <div key={idx} className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2"></div>
                                            <div>
                                                <p className="font-semibold text-red-900">
                                                    {clash.courseCode} - {clash.courseTitle}
                                                </p>
                                                <p className="text-sm text-red-700 mt-1">
                                                    {clash.day} at {clash.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alternative Sections */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Alternative Sections</h4>
                                {clashModal.alternatives && clashModal.alternatives.length > 0 ? (
                                    <div className="space-y-3">
                                        {clashModal.alternatives.map((alt) => (
                                            <div key={alt.id} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h5 className="font-bold text-gray-900">
                                                                Section {alt.sectionCode}
                                                            </h5>
                                                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                                                                {alt.availableSeats} seats
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2">Faculty: {alt.facultyName}</p>
                                                        <div className="space-y-1">
                                                            {alt.schedules.map((sch, idx) => (
                                                                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                                                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                                                    {sch.day} {sch.time} ({sch.room})
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setClashModal(null);
                                                            handleEnroll(alt.id);
                                                        }}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all"
                                                    >
                                                        Enroll
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                                        <p className="text-gray-500 text-sm">
                                            No alternative sections available at this time.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
