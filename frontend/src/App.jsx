import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import TopBanner from "./components/TopBanner"; 
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";

// Context & Toastify
import ShopContextProvider from "./context/ShopContext"; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from "./pages/Home";
import SpeakerDashboard from "./pages/SpeakerDashboard"; 
import SpeakersMaster from "./pages/SpeakersMaster";
import SpeechesMaster from "./pages/SpeechesMaster";
import BayanSchedule from "./pages/BayanSchedule";
import Management from "./pages/Management";
import Contact from "./pages/Contact";

export const categoryMap = {
  "திங்கள்": [{ time: "இரவு 7.00", place: ["கரீம் காம்பவுண்ட்", "லுக்மான் மெடிக்கல்"] }],
  "செவ்வாய்": [{ time: "காலை 11.00", place: ["அஸ்தம்பட்டி"] }],
  "புதன்": [{ time: "காலை 11.00", place: ["அஷ்ரப் பாய் வீடு"] }, { time: "இரவு 7.00", place: ["லுக்மான் மெடிக்கல்"] }],
  "வியாழன்": [{ time: "காலை 11.00", place: ["சிட்டி ஹோட்டல் எதிரில்"] }],
  "வெள்ளி": [{ time: "மாலை 5.00", place: ["ஆஷிப் பாய் வீடு", "திப்பு நகர்"] }],
  "சனி": [{ time: "காலை 11.00", place: ["ஜங்ஷன்"] }, { time: "மாலை 5.00", place: ["திப்பு இஸ்லாமியா"] }],
  "ஞாயிறு": [{ time: "மாலை 4.00", place: ["மணியனூர்"] }]
};

const App = () => {
  // ⚡ ⭐ STEP 1: Read session state from temporary sessionStorage instead of localStorage
  const [speakerUser, setSpeakerUser] = useState(() => {
    const info = sessionStorage.getItem('speakerInfo');
    try {
      return info ? JSON.parse(info) : null;
    } catch (e) {
      console.error("Session restoration parsing exception:", e);
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = sessionStorage.getItem('speakerToken');
    const info = sessionStorage.getItem('speakerInfo');
    return !!(token && info); // Resolves explicitly to true if session tokens are active
  });

  // Background mount lifecycle state synchronizer 
  useEffect(() => {
    const token = sessionStorage.getItem('speakerToken');
    const info = sessionStorage.getItem('speakerInfo');
    if (token && info) {
      setIsAuthenticated(true);
      setSpeakerUser(JSON.parse(info));
    } else {
      handleLogout();
    }
  }, []);

  const handleLoginSuccess = (speakerData) => {
    setSpeakerUser(speakerData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // ⚡ ⭐ STEP 2: Wipe session properties instantly on deliberate or automated closeouts
    sessionStorage.removeItem('speakerToken');
    sessionStorage.removeItem('speakerInfo');
    setIsAuthenticated(false);
    setSpeakerUser(null);
  };

  // 🚪 Instant gate-drop verification boundary condition
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ShopContextProvider>
      <div className="min-h-screen w-full bg-[#e7edeb] flex flex-col">
        
        {/* Top Banner Control Header Bar */}
        <TopBanner onLogout={handleLogout} currentUser={speakerUser} /> 

        {/* Bottom Split Layout Frame */}
        <div className="flex flex-1 w-full">
          
          {/* Left Side: Sidebar Panel (Uncomment if needed) */}
          {/* <Sidebar />  */}
          
          {/* Toast Notification Container Wrapper */}
          <ToastContainer autoClose={1000} />
          
          <main className="flex-1 p-6">
            <Routes>
              {/* 🎯 CHANGED: Root path now renders your beautiful Home Page directly */}
              <Route path="/" element={<Home currentUser={speakerUser} />} />
              
              <Route path="/speaker-dashboard" element={<SpeakerDashboard currentUser={speakerUser} />} />
              <Route path="/speakers" element={<SpeakersMaster />} />
              <Route path="/speaches" element={<SpeechesMaster />} />
              
              {/* 👥 Injects active user to filter name matching profiles on schedule rows */}
              <Route path="/bayan-schedule" element={<BayanSchedule currentUser={speakerUser} />} />
              
              {/* 🎯 CHANGED: Catch-all fallback route now routes unrecognized paths back to "/" Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/management" element={<Management />} />
              <Route path="/contact" element={<Contact />} /> 
            </Routes>
          </main>
          
          <Footer />
        </div>
      </div>
    </ShopContextProvider>
  );
};

export default App;