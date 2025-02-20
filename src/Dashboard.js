import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import the CSS

const Dashboard = ({ setAuthToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  // const fetchData = async () => {
  //   const token = localStorage.getItem("token");
  //   const response = await axios.get("http://localhost:8080/protected", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   console.log(response.data);
  // };

  const fetchData = () => {
    navigate("/users"); // Navigate to Users page
  };

  return (
    <div className="dashboard-container">
      {/* Logout Button on the Left */}
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Fetch Data Button at the Center */}
      <div className="fetch-container">
        <h2>Welcome to Dashboard</h2>
        <button className="fetch-btn" onClick={fetchData}>
          Fetch Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
