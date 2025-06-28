import React, { useState } from "react";
import LoginModal from "../pages/LoginModal";
import "../App.css";

export default function LandingPage() {
  const [roleToLogin, setRoleToLogin] = useState(null);

  const handleRoleClick = (role) => {
    setRoleToLogin(role);
  };

  const pageStyle = {
    backgroundImage: roleToLogin
      ? `url("/uni-bg.jpg")`
      : `url("/uni.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    transition: "background-image 0.3s ease",
  };

  return (
    <>
      <div style={pageStyle} className="fade-in">
        <div className="background-overlay"></div>

        <h1
          className="mb-4"
          style={{
            zIndex: 1,
            color: "limegreen",
            fontWeight: "bold",
            textShadow: "1px 1px 4px black",
          }}
        >
          Welcome to SUNY Binghamton University
        </h1>

        <p
          className="mb-4"
          style={{
            zIndex: 1,
            color: "white",
            fontWeight: "bold",
            textShadow: "1px 1px 3px black",
          }}
        >
          Please choose your role to continue
        </p>

        <div className="d-flex justify-content-center gap-4" style={{ zIndex: 1 }}>
          <button
            className="btn btn-primary btn-lg glow-button"
            onClick={() => handleRoleClick("ADMIN")}
          >
            Admin
          </button>
          <button
            className="btn btn-success btn-lg glow-button"
            onClick={() => handleRoleClick("STUDENT")}
          >
            Student
          </button>
        </div>
      </div>

      {roleToLogin && (
        <div className="modal-backdrop">
          <LoginModal
            isOpen={true}
            role={roleToLogin}
            closeModal={() => setRoleToLogin(null)}
          />
        </div>
      )}
    </>
  );
}
