import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BrowseCourses() {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    loadAvailableCourses();
    loadRegisteredCourses();
  }, []);

  const loadAvailableCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/students/available-courses",
        { withCredentials: true }
      );
      setAvailableCourses(response.data);
    } catch (error) {
      console.error("Error loading available courses:", error);
    }
  };

  const loadRegisteredCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/students/my-courses",
        { withCredentials: true }
      );
      setRegisteredCourses(response.data);
    } catch (error) {
      console.error("Error loading registered courses:", error);
    }
  };

  const registerCourse = async (courseId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/students/register-course/${courseId}`,
        null,
        { withCredentials: true }
      );
      alert(response.data); // show backend message (conflict or success)
      loadAvailableCourses();
      loadRegisteredCourses();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data); // display backend error message
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Courses</h2>

      <table className="table table-striped table-bordered shadow">
        <thead>
          <tr>
            <th>#</th>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableCourses.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No available courses.
              </td>
            </tr>
          ) : (
            availableCourses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td title={course.description || "No description provided"}>
                  {course.courseName}
                </td>
                <td>{course.instructor}</td>
                <td>{course.day}</td>
                <td>{course.startTime}</td>
                <td>{course.endTime}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => registerCourse(course.id)}
                  >
                    Register
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
