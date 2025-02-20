import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import external CSS

const Login = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/authenticate", {
        username,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data); // Save token
        setAuthToken(response.data);
      } else if (response.status === 401) {
        console.log(response.data);
        setError(response.data);
      }
    } catch (err) {
      if (err.response) {
        // Backend responded with a status code outside the range of 2xx
        if (err.response.status === 401) {
          setError(err.response.data || "Invalid credentials");
        } else {
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Server is not responding. Please try again later.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <i className="fa fa-user"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>

        <div className="form-group">
          <i className="fa fa-lock"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
