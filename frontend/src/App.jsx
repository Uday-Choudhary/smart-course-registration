import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import FacultyDashboard from "./components/dashboard/FacultyDashboard";
import AdminDashboard from "./components/dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
