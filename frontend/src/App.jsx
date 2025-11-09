import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import FacultyDashboard from "./components/dashboard/FacultyDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Admin Pages
import StudentsPage from "./pages/admin/StudentsPage";
import FacultyPage from "./pages/admin/FacultyPage";
import CoursesPage from "./pages/admin/CoursesPage";
import SectionsPage from "./pages/admin/SectionsPage";
import TermsPage from "./pages/admin/TermsPage";
import DeadlinesPage from "./pages/admin/DeadlinePage";
import TermCoursesPage from "./pages/admin/TermCoursesPage";
import RoomsPage from "./pages/admin/RoomsPage";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  // Static paths where Navbar should be hidden
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
  ];

  // ✅ Detect dynamic routes like `/admin/terms/1/courses`
  const isDynamicAdminRoute = /^\/admin\/terms\/\d+\/courses$/.test(location.pathname);

  // ✅ Hide Navbar for admin dashboard and dynamic admin routes
  const shouldHideNavbar =
    hideNavbarPaths.includes(location.pathname) || isDynamicAdminRoute;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ===== STUDENT DASHBOARD ===== */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== FACULTY DASHBOARD ===== */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={["Faculty", "Admin"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN DASHBOARD & PAGES ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Students */}
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

        {/* Faculty */}
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

        {/* Courses */}
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

        {/* Sections */}
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

        {/* Terms */}
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

        {/* Deadlines */}
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

        {/* Term Courses (Dynamic Route) */}
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

        {/* Redirect unknown routes */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </>
  );
}

export default App;
