import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  let navigate = useNavigate();

  const [course, setCourse] = useState({
    courseName: "",
    instructor: "",
    day: "",
    startTime: "",
    endTime: "",
    description: "", // ✅ new field
  });

  const { courseName, instructor, day, startTime, endTime, description } = course;

  const onInputChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/courses", course, {
        withCredentials: true,
      });
      alert("✅ Course added successfully!");
      navigate("/courses");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("❌ Failed to add course.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3 border rounded p-4 shadow">
        <h2 className="text-center">Register a New Course</h2>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Course Name</label>
            <input
              type="text"
              className="form-control"
              name="courseName"
              value={courseName}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Instructor</label>
            <input
              type="text"
              className="form-control"
              name="instructor"
              value={instructor}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Day</label>
            <input
              type="text"
              className="form-control"
              name="day"
              value={day}
              onChange={onInputChange}
              placeholder="e.g., Monday"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-control"
              name="startTime"
              value={startTime}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-control"
              name="endTime"
              value={endTime}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Course Description (Optional)</label>
            <textarea
              className="form-control"
              name="description"
              value={description}
              onChange={onInputChange}
              placeholder="Enter a short description about the course..."
              rows="3"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
}
