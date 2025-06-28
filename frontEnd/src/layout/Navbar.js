import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link
        className="navbar-brand"
        to="/"
        style={{ color: "limegreen", fontWeight: "bold" }}
      >
        SUNY Binghamton University
      </Link>

      <div className="ms-auto d-flex">
        {role === "ADMIN" && (
          <>
            <Link className="btn btn-outline-light mx-2" to="/admin-dashboard">
              Admin Dashboard
            </Link>
            <Link className="btn btn-outline-light mx-2" to="/students">
              View Students
            </Link>
            <Link className="btn btn-outline-light mx-2" to="/courses">
              View Courses
            </Link>
          </>
        )}

        {role === "STUDENT" && (
          <>
            <Link className="btn btn-outline-light mx-2" to="/student-dashboard">
              Browse Courses
            </Link>
            <Link className="btn btn-outline-light mx-2" to="/mycourses">
              My Courses
            </Link>
          </>
        )}

        {username && (
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
