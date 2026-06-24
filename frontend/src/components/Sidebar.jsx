import React from "react";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlinePlusCircle,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineCurrencyRupee,
  HiOutlineSparkles,
  HiOutlineUserGroup, 
  HiOutlineClipboardList,
  HiOutlineExclamationCircle, // ⚠️ Added for your Low Stock Warning indicator
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [

    { name: "Speaker Dashboard", path: "/speaker-dashboard", icon: <HiOutlineUserGroup /> }, 
    { name: "Speakers Master 🧾", path: "/speakers", icon: <HiOutlineSparkles /> },
    { name: "Speaches Master", path: "/speaches", icon: <HiOutlineCurrencyRupee /> },
    { name: "Bayan Schedule", path: "/bayan-schedule", icon: <HiOutlinePlusCircle /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#e39aad] text-slate-900 flex flex-col p-4 shadow-lg sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2 mt-3 border-b border-[#360210] pb-4">
        <h1 className="text-xl font-bold text-[#360210] tracking-tight">
          TNTJ
சேலம் மாவட்டம் 
        </h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#f26f92] text-white shadow-lg translate-x-2"
                  : "text-slate-800 hover:bg-[#f26f92] hover:text-white"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-[#360210] text-[10px] uppercase tracking-widest text-center text-slate-600 font-bold">
        Admin Console v1.0.4
      </div>
    </div>
  );
};

export default Sidebar;