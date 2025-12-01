import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Menu = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Compute profile link dynamically based on role
  const profileLink =
    user?.role === "Admin"
      ? "/admin/profile"
      : user?.role === "Faculty"
        ? "/faculty/profile"
        : "/student/profile";

  const menuItems = [
    // === STUDENT MENU ===
    {
      title: "STUDENT",
      visible: ["Student"],
      items: [
        { icon: "/home.png", label: "Dashboard", href: "/student", visible: ["Student"] },
        { icon: "/subject.png", label: "Browse Courses", href: "/student/browse-courses", visible: ["Student"] },
        { icon: "/assignment.png", label: "My Registrations", href: "/student/my-registrations", visible: ["Student"] },
        { icon: "/calendar.png", label: "My Timetable", href: "/student/timetable", visible: ["Student"] },
        { icon: "/announcement.png", label: "Notifications", href: "/student/notifications", visible: ["Student"] },
      ],
    },

    // === FACULTY MENU ===
    {
      title: "FACULTY",
      visible: ["Faculty"],
      items: [
        { icon: "/home.png", label: "Dashboard", href: "/faculty", visible: ["Faculty"] },
        { icon: "/calendar.png", label: "My Timetable", href: "/faculty/timetable", visible: ["Faculty"] },
        { icon: "/class.png", label: "Assigned Courses", href: "/faculty/sections", visible: ["Faculty"] },
        { icon: "/announcement.png", label: "Notifications", href: "/faculty/notifications", visible: ["Faculty"] },
      ],
    },

    // === ADMIN MENU ===
    {
      title: "ADMINISTRATION",
      visible: ["Admin"],
      items: [
        { icon: "/home.png", label: "Dashboard", href: "/admin", visible: ["Admin"] },
        { icon: "/subject.png", label: "Manage Courses", href: "/admin/courses", visible: ["Admin"] },
        { icon: "/class.png", label: "Manage Sections", href: "/admin/sections", visible: ["Admin"] },
        { icon: "/teacher.png", label: "Manage Faculty", href: "/admin/faculty", visible: ["Admin"] },
        { icon: "/student.png", label: "Manage Students", href: "/admin/students", visible: ["Admin"] },
        { icon: "/calendar.png", label: "Manage Terms", href: "/admin/terms", visible: ["Admin"] },
        { icon: "/calendar.png", label: "Manage Deadlines", href: "/admin/deadlines", visible: ["Admin"] },
        { icon: "/studyroom.png", label: "Manage Rooms", href: "/admin/rooms", visible: ["Admin"] },
        { icon: "/studyroom.png", label: "Manage Schedules", href: "/admin/schedules", visible: ["Admin"] },
        { icon: "/announcement.png", label: "Notifications", href: "/admin/notifications", visible: ["Admin"] },
      ],
    },

    // === GENERAL MENU ===
    {
      title: "OTHER",
      visible: ["Admin", "Faculty", "Student"],
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: profileLink,
          visible: ["Admin", "Faculty", "Student"],
        },
        { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["Admin", "Faculty", "Student"] },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "#",
          visible: ["Admin", "Faculty", "Student"],
          logout: true,
        },
      ],
    },
  ];

  return (
    <div className="mt-8 text-sm flex flex-col gap-8">
      <p className="hidden lg:block text-gray-600">Welcome, {user?.name}!</p>

      {menuItems.map((section) => {
        // Check if role can see this section
        if (!section.visible.includes(role)) return null;

        return (
          <div key={section.title} className="flex flex-col gap-4">
            <span className="hidden lg:block text-gray-400 font-light">
              {section.title}
            </span>

            {section.items.map((item) => {
              if (!item.visible.includes(role)) return null;

              if (item.logout) {
                return (
                  <button
                    key={item.label}
                    onClick={handleLogout}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-xl hover:bg-[#E4F1FF] transition w-full"
                  >
                    <img src={item.icon} alt={item.label} width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-xl hover:bg-[#E4F1FF] transition"
                >
                  <img src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
