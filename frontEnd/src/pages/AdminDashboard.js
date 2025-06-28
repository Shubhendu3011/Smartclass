import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:8080/students", { withCredentials: true }),
        axios.get("http://localhost:8080/courses", { withCredentials: true }),
      ]);
      setStudentsCount(studentsRes.data.length);
      setCoursesCount(coursesRes.data.length);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome Admin, {username} 👋</h2>

      <div className="row mb-4 text-center">
        <div className="col-md-6">
          <div className="border rounded p-4 shadow bg-light">
            <h4>Total Students</h4>
            <h2>{studentsCount}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border rounded p-4 shadow bg-light">
            <h4>Total Courses</h4>
            <h2>{coursesCount}</h2>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap justify-content-center gap-3">
        <Link className="btn btn-primary" to="/addcourse">Add Course</Link>
        <Link className="btn btn-secondary" to="/registerstudent">Register Student</Link>
        <Link className="btn btn-outline-dark" to="/students">View Students</Link>
        <Link className="btn btn-outline-dark" to="/courses">View Courses</Link>
      </div>
    </div>
  );
}
