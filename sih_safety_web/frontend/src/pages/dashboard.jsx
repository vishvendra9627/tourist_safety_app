import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import PanicButton from "../components/PanicButton";

function Dashboard() {
  const navigate = useNavigate();

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

          <div className="w-full h-96 rounded-xl overflow-hidden shadow-inner border border-blue-300">
            <img
              src="/map.png"
              alt="Map"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Panic Button */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            <PanicButton />
          </motion.div>
        </motion.div>

        {/* Right Panel (empty now) */}
        <div className="flex-1 hidden md:flex"></div>
      </div>
    </div>
  );
}

export default Dashboard;
