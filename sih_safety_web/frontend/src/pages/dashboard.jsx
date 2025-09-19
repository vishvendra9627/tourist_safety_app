// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { useJsApiLoader } from "@react-google-maps/api";
import LeftPanel from "../components/left_dashboard";
import TripPlanner from "../components/right_dashboard";

const libraries = ["places"];

function Dashboard() {
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [startLocation, setStartLocation] = useState(
    () => JSON.parse(localStorage.getItem("startLocation")) || null
  );
  const [currentLocation, setCurrentLocation] = useState(
    () => JSON.parse(localStorage.getItem("currentLocation")) || null
  );
  const [tripPlan, setTripPlan] = useState(
    () => JSON.parse(localStorage.getItem("tripPlan")) || []
  );

  useEffect(() => {
    localStorage.setItem("startLocation", JSON.stringify(startLocation));
  }, [startLocation]);

  useEffect(() => {
    localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem("tripPlan", JSON.stringify(tripPlan));
  }, [tripPlan]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading Map...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-blue-800">
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div className="text-2xl font-extrabold tracking-wide drop-shadow">
          ⚡ Smart Tourist Safety
        </div>

        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle className="text-4xl" />
          <span className="text-xs mt-1">Profile</span>
        </motion.div>
      </div>

      <div className="flex flex-1 p-6 gap-6">
        <LeftPanel
          setStartLocation={setStartLocation}
          setCurrentLocation={setCurrentLocation}
          currentLocation={currentLocation}
        />

        <div className="flex-1 hidden md:flex">
          <TripPlanner tripPlan={tripPlan} setTripPlan={setTripPlan} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
