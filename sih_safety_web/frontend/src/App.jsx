// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useJsApiLoader } from "@react-google-maps/api";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Pfile from "./pages/Pfile";
import DigitalidForm from "./components/DigitalidForm";
import { TravelProvider } from "./context/TravelContext";

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  return (
    <TravelProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard isLoaded={isLoaded} />} />
          <Route path="profile" element={<Pfile />} />
          <Route path="digitalidform" element={<DigitalidForm />} />
        </Routes>
      </Router>
    </TravelProvider>
  );
}

export default App;

