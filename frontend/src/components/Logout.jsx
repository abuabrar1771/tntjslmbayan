import React from 'react';
import { toast } from 'react-toastify';

const Logout = ({ onLogout }) => {
  const handleAction = () => {
    // 1. Double check confirmation parameters with user
    if (window.confirm("⚠️ Operational Confirmation: Are you sure you want to log out of the scheduling matrix portal?")) {
      
      // 2. Clear state caches via parent app context controller
      onLogout();
      
      // 3. Issue success toast notification alert metric
      toast.info("🔒 Session terminated. Access credentials revoked safely.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleAction}
      className="px-4 py-2 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-700 bg-white hover:bg-rose-50/20 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-2 active:scale-[0.98] select-none"
    >
      <span>🔒</span>
      <span>Terminate Session</span>
    </button>
  );
};

export default Logout;