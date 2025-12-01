import React from "react";
import { Bell, Clock } from "lucide-react";

const Notifications = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="mb-6 relative">
                        <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                            <Bell className="h-12 w-12 text-indigo-600" />
                        </div>
                        <div className="absolute top-0 right-1/3 animate-pulse">
                            <Clock className="h-8 w-8 text-amber-500" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Coming Soon
                    </h2>

                    <p className="text-gray-600 mb-6">
                        We're working on bringing you real-time notifications for system updates,
                        enrollment alerts, and administrative announcements.
                    </p>

                    <div className="bg-indigo-50 rounded-lg p-4 text-left">
                        <h3 className="font-semibold text-indigo-900 mb-2">What to expect:</h3>
                        <ul className="text-sm text-indigo-700 space-y-1">
                            <li>• System-wide announcements</li>
                            <li>• Enrollment capacity alerts</li>
                            <li>• Waitlist notifications</li>
                            <li>• Critical system updates</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
