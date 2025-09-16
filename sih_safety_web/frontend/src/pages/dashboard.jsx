import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import PanicButton from "../components/PanicButton";
import MapComponent from "../components/MapComponent"; // adjust path if needed

function Dashboard() {
  const navigate = useNavigate();

  const [showMap, setShowMap] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-white text-blue-800">
      {/* Top Navigation */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white shadow-md">
        {/* Back */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="text-2xl mr-2" />
          <span className="font-semibold">Back</span>
        </motion.div>

        {/* App Name */}
        <div className="text-2xl font-extrabold tracking-wide drop-shadow">
          ⚡ Smart Tourist Safety
        </div>

        {/* Profile */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle className="text-4xl" />
          <span className="text-xs mt-1">Profile</span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Map Container */}
        <motion.div
          className="flex-1 max-w-3xl mx-auto bg-blue-50 rounded-2xl shadow-xl p-6 border border-blue-200"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
        >
          <h2 className="text-blue-700 font-bold mb-3 text-lg flex items-center">
            🗺️ Your Location
          </h2>

          <div className="w-full h-110 rounded-xl overflow-hidden shadow-inner border border-blue-300">
            {showMap ? (
              <MapComponent
                setStartLocation={setStartLocation}
                setCurrentLocation={setCurrentLocation}
              />
            ) : (
              <img
                src="/map.png"
                alt="Map"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Start Live Tracking Button */}
          {!showMap && (
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={() => setShowMap(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Start Live Tracking
              </button>
            </motion.div>
          )}

          {/* Panic Button */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <PanicButton />
          </motion.div>

          {/* Optional: Display location details */}
          {currentLocation && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow border text-sm">
              <h3 className="font-bold text-blue-700 mb-2">📍 Current Location</h3>
              <p><strong>Address:</strong> {currentLocation.displayName}</p>
              <p><strong>City:</strong> {currentLocation.city}</p>
              <p><strong>District:</strong> {currentLocation.district}</p>
              <p><strong>State:</strong> {currentLocation.state}</p>
              <p><strong>Postal Code:</strong> {currentLocation.postcode}</p>
            </div>
          )}
        </motion.div>

        {/* Right Panel (empty for now) */}
        <div className="flex-1 hidden md:flex"></div>
      </div>
    </div>
  );
}

export default Dashboard;


