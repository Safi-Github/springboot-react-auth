import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Users from "./Users";
import EditUser from "./EditUser";
import "primereact/resources/themes/lara-light-blue/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  return (
    <Routes>
      {authToken ? (
        <Route path="/" element={<Dashboard setAuthToken={setAuthToken} />} />
      ) : (
        <Route path="/" element={<Login setAuthToken={setAuthToken} />} />
      )}
      <Route path="/users" element={<Users setAuthToken={setAuthToken} />} />

      <Route
        path="/edit-user/:id"
        element={<EditUser setAuthToken={setAuthToken} />}
      />
      <Route
        path="/add-user"
        element={<EditUser setAuthToken={setAuthToken} />}
      />
    </Routes>
  );
};

export default App;
