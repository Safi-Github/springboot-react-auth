import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./EditUser.css";

const EditUser = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const navigate = useNavigate();
  const toast = useRef(null);

  // State for user data
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // Fetch user details if editing
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (id) {
        // Update existing user
        await axios.put(`http://localhost:8080/api/user/${id}`, user, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new user
        await axios.post("http://localhost:8080/register/user", user, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate("/users");
    } catch (err) {
      console.error("Error saving user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="edit-user-card">
        <h2>{id ? "Edit User" : "Create User"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="p-field">
            <label>Username</label>
            <InputText
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>

          {!id && ( // Show password field only when creating a new user
            <div className="p-field">
              <label>Password</label>
              <InputText
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="p-field">
            <label>Role</label>
            <InputText
              name="role"
              value={user.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="button-group">
            <Button
              label={id ? "Update" : "Create"}
              icon="pi pi-save"
              className="p-button-success"
              type="submit"
              loading={loading}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate("/users")}
            />
          </div>
        </form>
      </Card>
    </>
  );
};

export default EditUser;
