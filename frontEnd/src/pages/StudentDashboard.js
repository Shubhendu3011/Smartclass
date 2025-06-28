import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function StudentDashboard() {
  const username = sessionStorage.getItem("username");

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students/timetable/pdf", {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "timetable.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("Download failed. Please ensure you're logged in.");
    }
  };

  const handleEmailPdf = async () => {
    try {
      const response = await axios.get("http://localhost:8080/students/email-timetable", {
        withCredentials: true,
      });

      alert(response.data); // Optional: show success message
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Email failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Welcome, {username} 👋</h2>

      <div className="row justify-content-center gap-4">
        <div className="col-md-4 text-center">
          <div className="border rounded p-4 shadow bg-light">
            <h5>View Available Courses</h5>
            <Link className="btn btn-primary mt-3" to="/browse">
              Browse Courses
            </Link>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="border rounded p-4 shadow bg-light">
            <h5>My Registered Courses</h5>
            <Link className="btn btn-success mt-3" to="/mycourses">
              My Courses
            </Link>
            <button className="btn btn-outline-secondary mt-3" onClick={handleDownloadPdf}>
              Download Timetable
            </button>
            <button className="btn btn-outline-info mt-2" onClick={handleEmailPdf}>
              Email Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
