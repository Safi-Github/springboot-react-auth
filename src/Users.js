import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Users.css"; // Import custom styles
import { useNavigate } from "react-router-dom";

const Users = ({ setAuthToken }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("users data :", response.data);
      setUsers(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          setError("You Are Not Authorized");
        } else {
          setError(`Error: ${err.response.status} - ${err.response.data}`);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user.id !== id)); // Update state after deletion
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  const handleEdit = (id) => {
    const token = localStorage.getItem("token");
    navigate(`/edit-user/${id}`, {
      state: { headers: { Authorization: `Bearer ${token}` } },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    navigate("/");
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning p-mr-2"
          onClick={() => handleEdit(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  return (
    <div className="users-container">
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {!error ? (
        <Card className="users-card">
          <div>
            <Button
              label="Create New User"
              icon="pi pi-plus"
              className="p-button-success add-user"
              onClick={() => navigate("/add-user")} // Navigate without ID
            />

            {/* Your existing user list goes here */}
          </div>
          <h2 className="users-title">User List</h2>

          {loading ? (
            <div className="spinner-container">
              <ProgressSpinner />
            </div>
          ) : (
            <DataTable
              value={users}
              paginator
              rows={10}
              stripedRows
              scrollable
              responsiveLayout="scroll"
              className="p-datatable-lg full-width-table custom-table"
            >
              <Column
                field="id"
                header="ID"
                sortable
                bodyClassName="table-cell"
              ></Column>
              <Column
                field="username"
                header="Username"
                sortable
                bodyClassName="table-cell"
              ></Column>
              <Column
                field="password"
                header="Password"
                sortable
                bodyClassName="table-cell"
              ></Column>
              <Column
                field="role"
                header="roles"
                sortable
                bodyClassName="table-cell"
              ></Column>
              <Column
                header="Actions"
                body={actionBodyTemplate}
                bodyClassName="table-cell"
              ></Column>
            </DataTable>
          )}
        </Card>
      ) : (
        <div style={{ color: "red", fontWeight: "bold", marginTop: "5px" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Users;
