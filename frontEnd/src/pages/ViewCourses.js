import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ViewCourses() {
  const [courses, setCourses] = useState([]);
  const role = sessionStorage.getItem("role");

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const result = await axios.get("http://localhost:8080/courses", { withCredentials: true });
      setCourses(result.data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:8080/courses/${id}`, { withCredentials: true });
        loadCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">All Courses</h2>

      <table className="table table-bordered shadow">
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Day</th>
            <th>Start Time</th>
            <th>End Time</th>
            {role === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course.id}>
              <td>{index + 1}</td>
              <td>{course.courseName}</td>
              <td>{course.instructor}</td>
              <td>{course.day}</td>
              <td>{course.startTime}</td>
              <td>{course.endTime}</td>
              {role === "ADMIN" && (
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteCourse(course.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {role === "ADMIN" && (
        <div className="text-center mt-4">
          <Link className="btn btn-primary" to="/addcourse">
            Add New Course
          </Link>
        </div>
      )}
    </div>
  );
}
