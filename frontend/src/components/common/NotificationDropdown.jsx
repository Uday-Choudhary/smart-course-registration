import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import moment from "moment";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const NotificationDropdown = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/notifications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter((n) => !n.read).length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_URL}/api/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${API_URL}/api/notifications/read-all`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition relative ${isOpen ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100 text-gray-600"
                    }`}
            >
                <Bell size={23} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition"
                                title="Mark all as read"
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Inbox size={24} className="opacity-50" />
                                </div>
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                                        className={`p-4 hover:bg-gray-50 transition cursor-pointer group relative ${!notification.read ? "bg-indigo-50/30" : ""
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!notification.read ? "bg-indigo-500" : "bg-transparent"
                                                }`} />
                                            <div className="flex-1">
                                                <p className={`text-sm leading-relaxed ${!notification.read ? "font-medium text-gray-800" : "text-gray-600"
                                                    }`}>
                                                    {notification.message}
                                                </p>
                                                <span className="text-xs text-gray-400 mt-1.5 block font-medium">
                                                    {moment(notification.createdAt).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                        <button className="text-xs text-gray-500 hover:text-gray-700 font-medium transition">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
