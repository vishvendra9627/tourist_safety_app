// src/components/PanicButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PanicButton() {
  const navigate = useNavigate();

  const handlePanic = () => {
    // Check if user profile is completed (replace with your logic)
    const profileCompleted = sessionStorage.getItem("profileCompleted");
    if (!profileCompleted) {
      navigate("/Profile"); // redirect to profile page
    } else {
      navigate("/security"); // redirect to security/panic page
    }
  };

  return (
    <motion.button
      onClick={handlePanic}
      className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg"
      whileHover={{
        scale: 1.1,
        boxShadow: "0 0 20px 5px rgba(255,0,0,0.8)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      PANIC
    </motion.button>
  );
}

export default PanicButton;
