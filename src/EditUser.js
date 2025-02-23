import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import "./EditUser.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    nid: "",
    phone: "",
    literacyLevel: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [literacyLevels, setLiteracyLevels] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (id) fetchUser();
    fetchEnums();
  }, [id]);

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

  const fetchEnums = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch literacy levels
      const literacyResponse = await axios.get(
        "http://localhost:8080/api/enums/literacy-levels",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Transform literacy levels to match Dropdown format
      const formattedLiteracyLevels = literacyResponse.data.map((item) => ({
        label: item.name, // "Primary", "Secondary", etc.
        value: item.value, // "PRIMARY", "SECONDARY", etc.
      }));

      console.log("the literacy data ", formattedLiteracyLevels);
      setLiteracyLevels(formattedLiteracyLevels);

      // Fetch roles
      const roleResponse = await axios.get(
        "http://localhost:8080/api/enums/roles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Transform roles to match Dropdown format
      const formattedRoles = roleResponse.data.map((item) => ({
        label: item.name, // "User", "Admin", "Manager"
        value: item.value, // "USER", "ADMIN", "MANAGER"
      }));

      console.log("the role data ", formattedRoles);
      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching enums:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (id) {
        await axios.put(`http://localhost:8080/api/user/${id}`, user, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
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
    <Card className="edit-user-card">
      <h2>{id ? "Edit User" : "Create User"}</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        {/* Left Column */}
        <div className="form-column">
          <div className="form-item">
            <label>First Name</label>
            <InputText
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label>Last Name</label>
            <InputText
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label>Father's Name</label>
            <InputText
              name="fathername"
              value={user.fathername}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label>National ID (NID)</label>
            <InputText
              name="nid"
              value={user.nid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label>Phone</label>
            <InputText
              name="phone"
              value={user.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-item">
            <label>Literacy Level</label>
            <Dropdown
              name="literacyLevel"
              value={user.literacyLevel}
              options={literacyLevels}
              onChange={handleChange}
              placeholder="Select Literacy Level"
              className="w-full"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="form-column">
          <div className="form-item">
            <label>Email</label>
            <InputText
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <label>Username</label>
            <InputText
              name="username"
              value={user.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <label>Password</label>
            <InputText
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-item">
            <label>Role</label>
            <Dropdown
              name="role"
              value={user.role}
              options={roles}
              onChange={handleChange}
              placeholder="Select Role"
              className="w-full"
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
        </div>
      </form>
    </Card>
  );
};

export default EditUser;
