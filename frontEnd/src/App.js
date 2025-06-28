import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from './layout/Navbar';
import LandingPage from './layout/LandingPage';
import LoginModal from './pages/LoginModal';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AddCourse from './pages/AddCourse';
import ViewCourses from './pages/ViewCourses';
import RegisterStudent from './pages/RegisterStudent';
import AllStudents from './pages/AllStudents';
import BrowseCourses from './pages/BrowseCourses';
import RegisterCourse from './pages/RegisterCourse';
import { useEffect, useState } from 'react';

function App() {
  const [role, setRole] = useState(sessionStorage.getItem("role"));

  useEffect(() => {
    const checkRole = () => {
      const storedRole = sessionStorage.getItem("role");
      if (storedRole !== role) {
        setRole(storedRole);
      }
    };
    window.addEventListener('storage', checkRole);
    return () => window.removeEventListener('storage', checkRole);
  }, [role]);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginModal />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={role === "ADMIN" ? <AdminDashboard /> : <Navigate to="/login?role=ADMIN" />}
          />
          <Route
            path="/addcourse"
            element={role === "ADMIN" ? <AddCourse /> : <Navigate to="/login?role=ADMIN" />}
          />
          <Route
            path="/students"
            element={role === "ADMIN" ? <AllStudents /> : <Navigate to="/login?role=ADMIN" />}
          />
          <Route
            path="/registerstudent"
            element={role === "ADMIN" ? <RegisterStudent /> : <Navigate to="/login?role=ADMIN" />}
          />
          <Route
            path="/courses"
            element={role === "ADMIN" ? <ViewCourses /> : <Navigate to="/login?role=ADMIN" />}
          />

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={role === "STUDENT" ? <StudentDashboard /> : <Navigate to="/login?role=STUDENT" />}
          />
          <Route
            path="/browse"
            element={role === "STUDENT" ? <BrowseCourses /> : <Navigate to="/login?role=STUDENT" />}
          />
          <Route
            path="/mycourses"
            element={role === "STUDENT" ? <RegisterCourse /> : <Navigate to="/login?role=STUDENT" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
