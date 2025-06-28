import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
  
      await axios.post("http://localhost:8080/api/authenticate", formData, {
        withCredentials: true,
      });
  
      const userRes = await axios.get("http://localhost:8080/api/current-user", {
        withCredentials: true,
      });
  
      const role = userRes.data.role;
      sessionStorage.setItem("role", role);
      sessionStorage.setItem("username", userRes.data.username);
  
      if (role === "ADMIN") {
        navigate("/addcourse");
      } else {
        navigate("/mycourses");
      }
    } catch (err) {
      setError("Invalid username or password");
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="col-md-4 offset-md-4 border rounded p-4 shadow">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          {error && <p className="text-danger">{error}</p>}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
