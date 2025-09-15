import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<Home />} />   
        <Route path="login" element={<Login />} />     {/* Landing Page */}
        <Route path="dashboard" element={<Dashboard />} />   
        <Route path="profile" element={<Profile />} />   

      </Routes>
    </Router>
  );
}

export default App;
