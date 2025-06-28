import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterStudent() {
  const [student, setStudent] = useState({
    studentName: "",
    email: ""
  });

  const navigate = useNavigate();

  const onInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/students", student, { withCredentials: true });
      alert("Student added successfully by Admin!");
      navigate("/students");  // ✅ after adding, go back to view students
    } catch (err) {
      console.error("Error registering student:", err);
      alert("Student registration failed.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="col-md-6 offset-md-3 border rounded p-4 shadow">
        <h2 className="text-center">Register New Student (Admin Panel)</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="studentName"
              value={student.studentName}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email (Username)</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={student.email}
              onChange={onInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
