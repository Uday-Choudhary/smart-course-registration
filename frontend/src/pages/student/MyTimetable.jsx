import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import toast from "react-hot-toast";
import SidebarAdmin from "../../components/common/Sidebar";
import DashboardNavbar from "../../components/common/DashboardNavbar";
import { useAuth } from "../../context/AuthContext";

const localizer = momentLocalizer(moment);

const styles = `
/* Modern Calendar Styles - Clean & Professional */
.timetable-container {
  height: 100%;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Calendar Toolbar */
.rbc-toolbar {
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 16px 16px 0 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rbc-toolbar button {
  color: #4b5563;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.rbc-toolbar button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.rbc-toolbar button:active,
.rbc-toolbar button.rbc-active {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #111827;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.rbc-toolbar-label {
  color: #111827;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: -0.025em;
}

/* Calendar Grid */
.rbc-calendar {
  border-radius: 0 0 16px 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
}

.rbc-header {
  padding: 1rem 0.5rem;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  color: #6b7280;
}

.rbc-header + .rbc-header {
  border-left: 1px solid #e5e7eb;
}

/* Time Slots */
.rbc-time-slot {
  border-top: 1px solid #f3f4f6;
}

.rbc-time-header-content {
  border-left: 1px solid #e5e7eb;
}

.rbc-time-content {
  border-top: 1px solid #e5e7eb;
}

.rbc-day-slot .rbc-time-slot {
  border-top: 1px solid #f3f4f6;
}

.rbc-timeslot-group {
  min-height: 60px; /* Slightly taller slots */
  border-left: 1px solid #e5e7eb;
  border-bottom: 1px solid #f3f4f6;
}

.rbc-time-header-gutter {
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
}

.rbc-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #9ca3af;
  padding: 0 0.5rem;
}

/* Events - Modern Card Style */
.rbc-event {
  border-radius: 6px;
  border: none !important;
  padding: 2px; /* Minimal padding for the container */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  background: transparent; /* Background handled by inner div */
  overflow: hidden;
}

.rbc-event:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 20;
}

.rbc-event-label {
  display: none; /* Hide default label */
}

.rbc-selected {
  background-color: inherit !important;
}

/* Current Time Indicator */
.rbc-current-time-indicator {
  background-color: #ef4444;
  height: 2px;
  z-index: 30;
}

.rbc-current-time-indicator::before {
  content: '';
  position: absolute;
  left: -5px;
  top: -4px;
  width: 10px;
  height: 10px;
  background-color: #ef4444;
  border-radius: 50%;
}

/* Today Highlight */
.rbc-today {
  background-color: #fcfaff; /* Very subtle tint */
}

.rbc-off-range-bg {
  background: #f9fafb;
}

/* Scrollbar Styling */
.rbc-time-content::-webkit-scrollbar {
  width: 6px;
}

.rbc-time-content::-webkit-scrollbar-track {
  background: transparent;
}

.rbc-time-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.rbc-time-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
`;

const MyTimetable = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4000/api/students/timetable", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch timetable");
            }

            const data = await response.json();
            const formattedEvents = data.map((item) => {
                const start = getDateFromDayAndTime(item.day, item.startTime);
                const end = getDateFromDayAndTime(item.day, item.endTime);

                return {
                    id: item.id,
                    title: `${item.courseCode} - ${item.courseTitle}`,
                    start,
                    end,
                    resource: {
                        ...item,
                        color: getEnhancedColor(item.courseCode),
                    },
                };
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching timetable:", error);
            toast.error("Failed to load timetable");
        } finally {
            setLoading(false);
        }
    };

    const getDateFromDayAndTime = (dayName, timeString) => {
        const date = moment().day(dayName);
        const time = moment(timeString);

        date.hour(time.hour());
        date.minute(time.minute());
        date.second(0);

        return date.toDate();
    };

    // Enhanced color palette - User Requested
    const getEnhancedColor = (str) => {
        const colors = [
            { bg: '#FAE27C', border: '#eab308', text: '#854d0e' }, // Yellow
            { bg: '#c7b8ff', border: '#8b5cf6', text: '#5b21b6' }, // Purple
            { bg: '#b9e3ff', border: '#3b82f6', text: '#1e40af' }, // Blue
            { bg: '#ffd6e0', border: '#f43f5e', text: '#9f1239' }, // Pink
            { bg: '#ffe3b3', border: '#f97316', text: '#9a3412' }, // Orange
            { bg: '#b8f2b6', border: '#22c55e', text: '#166534' }, // Green
        ];

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: 'transparent',
                padding: 0,
                border: 'none',
            },
        };
    };

    const EventComponent = ({ event }) => {
        const colors = event.resource.color;
        return (
            <div
                className="h-full w-full flex flex-col p-2 rounded-md border-l-4 transition-all hover:brightness-95"
                style={{
                    backgroundColor: colors.bg,
                    borderLeftColor: colors.border,
                    color: colors.text
                }}
            >
                <div className="font-bold text-xs leading-tight mb-1">
                    {event.resource.courseCode}
                </div>
                <div className="text-[10px] font-medium opacity-90 truncate">
                    {event.resource.courseTitle}
                </div>
                <div className="mt-auto flex items-center gap-1 text-[10px] opacity-75">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {event.resource.room}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#ffffff] p-4 gap-4">
            <style>{styles}</style>
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
                <main className="bg-[#F7F7F7] rounded-2xl flex-1 p-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">My Timetable</h1>
                            <p className="text-gray-600 mt-1">View your class schedule at a glance</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">
                                {events.length} {events.length === 1 ? 'Class' : 'Classes'}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-xl shadow-lg h-[calc(100%-5rem)] flex items-center justify-center">
                            <div className="text-center">
                                <div className="loading-skeleton w-64 h-64 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium">Loading your timetable...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg h-[calc(100%-5rem)] overflow-hidden timetable-container">
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: "100%" }}
                                defaultView="week"
                                views={["week", "day", "agenda"]}
                                min={new Date(0, 0, 0, 8, 0, 0)}
                                max={new Date(0, 0, 0, 20, 0, 0)}
                                eventPropGetter={eventStyleGetter}
                                components={{
                                    event: EventComponent,
                                }}
                                step={30}
                                timeslots={2}
                                showMultiDayTimes
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default MyTimetable;
