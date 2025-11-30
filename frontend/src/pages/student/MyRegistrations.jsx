import React, { useEffect, useState } from "react";
import { getMyRegistrations, dropCourse } from "../../api/registrations";
import { useAuth } from "../../context/AuthContext";

const MyRegistrations = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [droppingId, setDroppingId] = useState(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await getMyRegistrations();
            setRegistrations(response.data || []);
        } catch (err) {
            setError("Failed to load registrations");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDropCourse = async (registrationId, courseName) => {
        if (!window.confirm(`Are you sure you want to drop "${courseName}"? This action cannot be undone.`)) {
            return;
        }

        setDroppingId(registrationId);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await dropCourse(registrationId);

            // Show success message
            let message = "Course dropped successfully!";
            if (response.promotedStudent) {
                message += ` ${response.promotedStudent.name} has been promoted from the waitlist.`;
            }
            setSuccessMessage(message);

            // Refresh registrations
            await fetchRegistrations();

            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to drop course");
            console.error(err);
        } finally {
            setDroppingId(null);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">My Registrations</h1>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">Loading...</div>
            ) : registrations.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Registrations Yet</h3>
                    <p className="text-gray-500">You haven't enrolled in any courses yet. Browse courses to get started!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {registrations.map((reg) => (
                        <div key={reg.id} className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {reg.course?.code}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Section {reg.section?.sectionCode}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                        {reg.course?.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {reg.course?.creditHours} Credits • {reg.term?.semester} {reg.term?.year}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDropCourse(reg.id, reg.course?.title)}
                                    disabled={droppingId === reg.id}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                                >
                                    {droppingId === reg.id ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Dropping...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Drop Course
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Faculty</h4>
                                        <p className="text-gray-900">{reg.faculty?.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">Schedule</h4>
                                        <div className="space-y-1">
                                            {reg.schedules && reg.schedules.length > 0 ? (
                                                reg.schedules.map((sch) => (
                                                    <div key={sch.id} className="text-sm text-gray-900">
                                                        <span className="font-medium">{sch.day}</span> {formatTime(sch.startTime)} - {formatTime(sch.endTime)}
                                                        <span className="text-gray-500 ml-2">({sch.room})</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-500">Schedule TBA</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
