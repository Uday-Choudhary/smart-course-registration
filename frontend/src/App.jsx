import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ChangePassword from "./pages/Auth/ChangePassword";

import StudentDashboard from "./components/dashboard/StudentDashboard";
import BrowseCourses from "./pages/student/BrowseCourses";
import CourseDetails from "./pages/student/CourseDetails";
import MyTimetable from "./pages/student/MyTimetable";
import MyRegistrations from "./pages/student/MyRegistrations";

import FacultyDashboard from "./components/dashboard/FacultyDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// --- ADMIN PAGES ---
import StudentsPage from "./pages/admin/StudentsPage";
import FacultyPage from "./pages/admin/FacultyPage";
import CoursesPage from "./pages/admin/CoursesPage";
import SectionsPage from "./pages/admin/SectionsPage";
import TermsPage from "./pages/admin/TermsPage";
import DeadlinesPage from "./pages/admin/DeadlinePage";
import TermCoursesPage from "./pages/admin/TermCoursesPage";
import RoomsPage from "./pages/admin/RoomsPage";
import SchedulesPage from "./pages/admin/SchedulesPage";
import ReportPage from "./pages/admin/ReportPage";

// --- PROFILE PAGES ---
import AdminProfile from "./pages/admin/Profile";
import FacultyProfile from "./pages/faculty/Profile";
import FacultyTimetable from "./pages/faculty/MyTimetable";
import StudentProfile from "./pages/student/Profile";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/register",
    "/student",
    "/faculty",
    "/admin",
    "/admin/students",
    "/admin/faculty",
    "/admin/courses",
    "/admin/sections",
    "/admin/terms",
    "/admin/deadlines",
    "/admin/rooms",
    "/admin/schedules",
    "/admin/reports",
    "/student/browse-courses",
    "/student/courses",
    "/student/timetable",
    "/student/my-registrations",
    "/student/profile",
    "/admin/profile",
    "/faculty/profile",
    "/faculty/timetable",
    "/change-password",
  ];

  const isDynamicAdminRoute = /^\/admin\/terms\/\d+\/courses$/.test(
    location.pathname
  );

  const isStudentCourseDetail = /^\/student\/courses\/\d+$/.test(
    location.pathname
  );

  const shouldHideNavbar =
    hideNavbarPaths.includes(location.pathname) ||
    isDynamicAdminRoute ||
    isStudentCourseDetail;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["Student", "Faculty", "Admin"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/browse-courses"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <BrowseCourses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/courses/:id"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <CourseDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <MyTimetable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-registrations"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        {/* STUDENT PROFILE */}
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentDashboard>
                <StudentProfile />
              </StudentDashboard>
            </ProtectedRoute>
          }
        />

        {/* FACULTY */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["Faculty", "Admin"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* FACULTY PROFILE */}
        <Route
          path="/faculty/profile"
          element={
            <ProtectedRoute allowedRoles={["Faculty", "Admin"]}>
              <FacultyDashboard>
                <FacultyProfile />
              </FacultyDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty/timetable"
          element={
            <ProtectedRoute allowedRoles={["Faculty", "Admin"]}>
              <FacultyTimetable />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PROFILE */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <AdminProfile />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        {/* ADMIN SUBPAGES */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <StudentsPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faculty"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <FacultyPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <CoursesPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sections"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <SectionsPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/terms"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <TermsPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/deadlines"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <DeadlinesPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <RoomsPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/terms/:termId/courses"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <TermCoursesPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/schedules"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <SchedulesPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard>
                <ReportPage />
              </AdminDashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
