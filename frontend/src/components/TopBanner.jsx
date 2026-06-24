import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; 
import { toast } from "react-toastify";
import pbBanner from "../assets/pb_banner.png";

const TopBanner = ({ onLogout, currentUser }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const currentPath = location.pathname;

  // 🛡️ Admin Verification Check Parameter
  const isAdmin = currentUser && currentUser.phoneNumber === '+919087795074';

  const handleLogoutClick = () => {
    if (window.confirm("⚠️ வெளியேற வேண்டுமா? Are you sure you want to log out?")) {
      setIsMobileMenuOpen(false);
      onLogout(); 
      toast.info("🔒 Session terminated safely.");
    }
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-slate-100 relative">
      {/* 1. Header Logo Banner Row */}
      <div className="w-full max-w-4xl mx-auto pt-4 pb-2 px-4 flex justify-between items-center relative">
        <div className="w-8 md:hidden"></div>

        <img
          src={pbBanner}
          alt="TNTJ Pennangal Bayan Banner"
          className="h-[60px] sm:h-[100px] md:h-[120px] w-auto object-contain block mx-auto"
        />

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-emerald-600 focus:outline-none text-2xl transition cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 2. DESKTOP NAVIGATION MENU BAR */}
      <div className="w-full border-t border-slate-100 bg-white hidden md:block">
        <nav className="max-w-6xl mx-auto px-4">
          <ul className="flex items-center justify-center space-x-8 py-3.5 text-slate-800 whitespace-nowrap text-sm font-bold tracking-wide">
            
            <li>
              <Link 
                to="/" 
                className={`transition ${currentPath === "/" ? "text-emerald-600 underline underline-offset-4" : "hover:text-emerald-600"}`}
              >
                முகப்பு
              </Link>
            </li>

            <li className="flex items-center gap-1 hover:text-emerald-600 cursor-pointer transition">
              <Link to="/management" className={currentPath === "/management" ? "text-emerald-600" : ""}>
                நிர்வாகம்
              </Link>
              <span className="text-[10px]">▼</span>
            </li>
            {/* 👑 STRICTLY ADMIN ONLY LINK */}
            {isAdmin && (
              <li>
                <Link 
                  to="/speaches" 
                  className={`transition ${currentPath === "/speaches" ? "text-emerald-600 underline underline-offset-4" : "hover:text-emerald-600"}`}
                >
                  பாயான் அட்டவணை தயாரிக்க
                </Link>
              </li>
            )}

            {/* 👥 OPEN VIEW LINK FOR ALL LOGGED-IN USERS (Admin & Speakers) */}
            <li>
              <Link 
                to="/bayan-schedule" 
                className={`transition ${currentPath === "/bayan-schedule" ? "text-emerald-600 underline underline-offset-4" : "hover:text-emerald-600"}`}
              >
                பாயான் அட்டவணை பார்க்க
              </Link>
            </li>

            <li className="hover:text-emerald-600 cursor-pointer transition">
              <Link 
                to="/contact" 
                className={`transition ${currentPath === "/contact" ? "text-emerald-600 underline underline-offset-4" : "hover:text-emerald-600"}`}
              >
              தொடர்புக்கு
              </Link>
            </li>

            <li>
              <button 
                type="button"
                onClick={handleLogoutClick}
                className="transition text-slate-700 hover:text-rose-600 font-bold tracking-wide cursor-pointer outline-none border-none bg-transparent"
              >
                வெளியேறு ➔
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* 3. MOBILE DROPDOWN HAMBURGER MENU */}
      {isMobileMenuOpen && (
        <div className="w-full bg-white border-t border-slate-100 absolute left-0 right-0 z-50 shadow-lg md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="px-4 py-3">
            <ul className="flex flex-col space-y-3.5 text-slate-800 text-base font-bold tracking-wide">
              
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link 
                  to="/" 
                  className={`block py-1.5 border-b border-slate-50 ${currentPath === "/" ? "text-emerald-600 pl-1" : ""}`}
                >
                  முகப்பு
                </Link>
              </li>

              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link 
                  to="/management" 
                  className={`py-1.5 border-b border-slate-50 flex justify-between items-center ${currentPath === "/management" ? "text-emerald-600 pl-1" : ""}`}
                >
                  <span>நிர்வாகம்</span>
                  <span className="text-xs">▼</span>
                </Link>
              </li>

              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link 
                  to="/speakers" 
                  className={`block py-1.5 border-b border-slate-50 ${currentPath === "/speakers" ? "text-emerald-600 pl-1" : ""}`}
                >
                  பேச்சாளர்களை சேர்க்க
                </Link>
              </li>

              {/* 👑 STRICTLY ADMIN ONLY MOBILE LINK */}
              {isAdmin && (
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link 
                    to="/speaches" 
                    className={`block py-1.5 border-b border-slate-50 ${currentPath === "/speaches" ? "text-emerald-600 pl-1" : ""}`}
                  >
                    பாயான் அட்டவணை தயாரிக்க
                  </Link>
                </li>
              )}

              {/* 👥 OPEN MOBILE VIEW LINK FOR ALL LOGGED-IN USERS (Admin & Speakers) */}
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link 
                  to="/bayan-schedule" 
                  className={`block py-1.5 border-b border-slate-50 ${currentPath === "/bayan-schedule" ? "text-emerald-600 pl-1" : ""}`}
                >
                  பாயான் அட்டவணை பார்க்க
                </Link>
              </li>

              <li className="py-1.5 cursor-pointer hover:text-emerald-600 border-b border-slate-50" onClick={() => setIsMobileMenuOpen(false)}>
                தொடர்புக்கு
              </li>

              <li className="py-1.5 text-rose-600 cursor-pointer hover:text-rose-700" onClick={handleLogoutClick}>
                வெளியேறு ➔
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopBanner;