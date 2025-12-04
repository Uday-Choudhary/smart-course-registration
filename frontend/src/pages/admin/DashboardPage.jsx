import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getEnrollmentTrends, getCapacityAnalytics, getCalendarEvents } from '../../api/dashboard';
import SidebarAdmin from '../../components/common/Sidebar';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import UserCard from '../../components/common/UserCard';
import CalendarWidget from '../../components/admin/dashboard/CalendarWidget';
import { BookOpen, Layers, Users, Calendar, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState([]);
    const [capacity, setCapacity] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, trendsRes, capacityRes, eventsRes] = await Promise.all([
                getDashboardStats(),
                getEnrollmentTrends(),
                getCapacityAnalytics(),
                getCalendarEvents()
            ]);

            setStats(statsRes.data);
            setTrends(trendsRes.data || []);
            setCapacity(capacityRes.data);
            setCalendarEvents(eventsRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const quickActions = [
        { label: 'Manage Courses', path: '/admin/courses', icon: <BookOpen className="w-8 h-8 text-blue-600" /> },
        { label: 'Manage Sections', path: '/admin/sections', icon: <Layers className="w-8 h-8 text-purple-600" /> },
        { label: 'View Students', path: '/admin/students', icon: <Users className="w-8 h-8 text-green-600" /> },
        { label: 'Set Deadlines', path: '/admin/deadlines', icon: <Calendar className="w-8 h-8 text-red-600" /> },
        { label: 'Manage Faculty', path: '/admin/faculty', icon: <GraduationCap className="w-8 h-8 text-orange-600" /> }
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#F7F7F7]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            {stats?.currentTerm?.semester} {stats?.currentTerm?.year}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4 justify-between flex-wrap mb-8">
                        <UserCard type="student" color="bg-[#FAE27C]" count={stats?.stats?.totalStudents} />
                        <UserCard type="course" color="bg-[#c7b8ff]" count={stats?.stats?.totalCourses} />
                        <UserCard type="registrations" color="bg-[#b9e3ff]" count={stats?.stats?.totalRegistrations} />
                        <UserCard type="waitlist" color="bg-[#ffb3b3]" count={stats?.stats?.totalWaitlists} />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Left Column - Charts and Recent Activity */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enrollment Trends Chart */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment Trends (Last 30 Days)</h3>
                                {trends.length > 0 ? (
                                    <div className="h-64 flex items-end justify-between gap-2">
                                        {trends.slice(-14).map((trend, index) => {
                                            const maxCount = Math.max(...trends.map(t => t.count));
                                            const height = (trend.count / maxCount) * 100;
                                            return (
                                                <div key={index} className="flex-1 flex flex-col items-center">
                                                    <div
                                                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                                                        style={{ height: `${height}%` }}
                                                        title={`${trend.count} registrations`}
                                                    />
                                                    <span className="text-xs text-gray-500 mt-2">
                                                        {new Date(trend.date).getDate()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-12">No enrollment data available</p>
                                )}
                            </div>

                            {/* Capacity Utilization */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Capacity Utilization</h3>
                                {capacity && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="text-center p-4 bg-red-50 rounded-lg">
                                            <div className="text-3xl font-bold text-red-600">{capacity.full}</div>
                                            <div className="text-sm text-gray-600 mt-1">Full (100%)</div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <div className="text-3xl font-bold text-orange-600">{capacity.high}</div>
                                            <div className="text-sm text-gray-600 mt-1">High (80-99%)</div>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                            <div className="text-3xl font-bold text-yellow-600">{capacity.medium}</div>
                                            <div className="text-sm text-gray-600 mt-1">Medium (50-79%)</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-3xl font-bold text-green-600">{capacity.low}</div>
                                            <div className="text-sm text-gray-600 mt-1">Low (&lt;50%)</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recent Registrations */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Registrations</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Student</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Course</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Section</th>
                                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats?.recentRegistrations?.slice(0, 5).map((reg, index) => (
                                                <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-900">{reg.studentName}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-900">{reg.courseCode}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{reg.sectionCode}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-500">{formatDate(reg.registeredAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(!stats?.recentRegistrations || stats.recentRegistrations.length === 0) && (
                                        <p className="text-gray-500 text-center py-8">No recent registrations</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Calendar */}
                        <div className="lg:col-span-1">
                            <CalendarWidget events={calendarEvents} />
                        </div>
                    </div>

                    {/* Sections with Waitlists - Detailed Table */}
                    {stats?.oversubscribedSections?.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Sections with Waitlists</h3>
                                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                    {stats.oversubscribedSections.length} section(s)
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Section</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Course</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Enrolled</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Waitlisted</th>
                                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.oversubscribedSections.map((section, index) => (
                                            <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <span className="font-medium text-gray-900">{section.sectionCode}</span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-gray-900">{section.courseCode}</div>
                                                    <div className="text-xs text-gray-500">{section.courseTitle}</div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="text-gray-700">{section.capacity}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="font-semibold text-green-600">{section.enrolled}</span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                                                        {section.waitlisted}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {section.enrolled >= section.capacity ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            Full
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Available
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => navigate(action.path)}
                                    className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                                >
                                    <span className="mb-2">{action.icon}</span>
                                    <span className="text-sm text-gray-700 group-hover:text-blue-600 text-center">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
};

export default DashboardPage;
