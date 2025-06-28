import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisterCourse() {
  const [registeredCourses, setRegisteredCourses] = useState([]);

  useEffect(() => {
    fetchRegisteredCourses();
  }, []);

  const fetchRegisteredCourses = async () => {
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

  const unregisterCourse = async (courseId) => {
    try {
      await axios.delete(
        `http://localhost:8080/students/unregister/${courseId}`,
        { withCredentials: true }
      );
      fetchRegisteredCourses(); // Refresh after unregister
    } catch (error) {
      console.error("Error unregistering course:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Registered Courses</h2>

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
          {registeredCourses.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                You are not registered for any courses.
              </td>
            </tr>
          ) : (
            registeredCourses.map((course, index) => (
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>{course.courseName}</td>
                <td>{course.instructor}</td>
                <td>{course.day}</td>
                <td>{course.startTime}</td>
                <td>{course.endTime}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => unregisterCourse(course.id)}
                  >
                    Unregister
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
