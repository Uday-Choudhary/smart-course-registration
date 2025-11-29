import React from 'react';

const CalendarWidget = ({ events = [] }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState(null);

    // Get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    // Navigate months
    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Check if date has events
    const getEventsForDate = (day) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            .toISOString().split('T')[0];

        return events.filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            return eventDate === dateStr;
        });
    };

    // Get upcoming events (next 5)
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const today = new Date();
    const isToday = (day) => {
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
                {/* Day headers */}
                {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                    </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const dayEvents = getEventsForDate(day);
                    const hasEvents = dayEvents.length > 0;

                    return (
                        <div
                            key={day}
                            className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors
                                ${isToday(day) ? 'bg-blue-500 text-white font-bold' : 'hover:bg-gray-100'}
                                ${hasEvents && !isToday(day) ? 'font-medium' : ''}
                            `}
                            onClick={() => setSelectedDate(day)}
                        >
                            <span className="text-sm">{day}</span>
                            {hasEvents && (
                                <div className="flex gap-0.5 mt-1">
                                    {dayEvents.slice(0, 3).map((event, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1 h-1 rounded-full ${event.color === 'blue' ? 'bg-blue-500' :
                                                    event.color === 'orange' ? 'bg-orange-500' :
                                                        event.color === 'red' ? 'bg-red-500' :
                                                            'bg-gray-500'
                                                } ${isToday(day) ? 'bg-white' : ''}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Upcoming Events */}
            <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Events</h4>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-2">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${event.color === 'blue' ? 'bg-blue-500' :
                                        event.color === 'orange' ? 'bg-orange-500' :
                                            event.color === 'red' ? 'bg-red-500' :
                                                'bg-gray-500'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-900 font-medium truncate">{event.title}</p>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No upcoming events</p>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;
