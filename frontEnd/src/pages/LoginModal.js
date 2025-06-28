import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function LoginModal({ role: propRole, closeModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  const queryRole = propRole || new URLSearchParams(location.search).get("role") || "STUDENT";
  const role = queryRole.toUpperCase();

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/authenticate",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
  
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("role", role);
  
      // First Navigate
      if (role === "ADMIN") {
        navigate("/admin-dashboard");
      } else {
        navigate("/mycourses");
      }
  
      // Then Reload once to refresh session
      window.location.reload();
  
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/students/register",
        null,
        {
          params: {
            fullName,
            email: username,
            password,
          },
          withCredentials: true,
        }
      );

      alert("Registration successful! Please login.");
      setIsRegistering(false);

      if (closeModal) closeModal();
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  const close = () => {
    if (closeModal) {
      closeModal();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="modal-backdrop show d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px", zIndex: 999 }}>
        <h4 className="text-center mb-3">
          {isRegistering
            ? "Student Registration"
            : `${role.charAt(0)}${role.slice(1).toLowerCase()} Login`}
        </h4>

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username (email)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              {isRegistering ? "Register" : "Login"}
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={close}>
              Cancel
            </button>
          </div>
        </form>

        {role === "STUDENT" && (
          <p className="mt-3 text-center">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsRegistering(false)}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                New student?{" "}
                <span
                  className="text-success"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsRegistering(true)}
                >
                  Register
                </span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
