import React, { useEffect, useState } from "react";
import { getMyRegistrations } from "../../api/registrations";
import SidebarAdmin from "../../components/common/Sidebar";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import { useAuth } from "../../context/AuthContext";

const MyRegistrations = () => {
    const { user } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
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
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">My Registrations</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">Loading...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center mt-10">{error}</div>
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
                </main>
            </div>
        </div>
    );
};

export default MyRegistrations;
