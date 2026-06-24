import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home({ currentUser }) {
  const navigate = useNavigate();
  const isAdmin = currentUser && currentUser.phoneNumber === '+919087795074';

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="bg-[#fef0e7] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#40012b] text-center sm:text-left">
        {/* Welcome Banner */}
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[#581c44] font-serif">
            அஸ்ஸலாமு அலைக்கும், {currentUser?.nameTa || 'வரவேற்கிறோம்'}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome to the Spiritual Speech Scheduler platform.
          </p>
        </div>

        {/* Dynamic Action Cards Based on Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 border border-[#40012b] rounded-xl bg-[#f0c8c8]/60 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">பாயான் அட்டவணை பார்க்க</h3>
              <p className="text-xs text-slate-500 mt-1">View your assigned weekly speech schedules and interactive report flyer layouts.</p>
            </div>
            <button 
              onClick={() => navigate('/bayan-schedule')}
              className="mt-4 w-full py-2 bg-[#581c44] text-white font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-black transition-all"
            >
              Open Flyer (அறிக்கை பார்க்க)
            </button>
          </div>

          {isAdmin ? (
            <div className="p-5 border border-emerald-100 rounded-xl bg-emerald-50/30 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-emerald-900 text-base">பாயான் அட்டவணை தயாரிக்க</h3>
                <p className="text-xs text-emerald-600 mt-1">Admin Panel: Allocate new speech slots, pick locations, and assign speakers.</p>
              </div>
              <button 
                onClick={() => navigate('/speaches')}
                className="mt-4 w-full py-2 bg-emerald-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-emerald-800 transition-all"
              >
                Create Slots (அட்டவணை தயாரிக்க)
              </button>
            </div>
          ) : (
            <div className="p-5 border border-indigo-100 rounded-xl bg-[#f0c8c8]/60 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-indigo-900 text-base">தனிப்பட்ட விவரங்கள்</h3>
                <p className="text-xs text-slate-500 mt-1">Registered Phone: {currentUser?.phoneNumber || 'N/A'}</p>
                <p className="text-xs text-slate-500">Language Profile: Tamil Script Transliterated Active</p>
              </div>
              <div className="mt-4 text-[11px] text-indigo-700 font-mono font-bold uppercase tracking-wider bg-indigo-50 px-2 py-1 rounded text-center">
                ✓ Speaker Account Verified
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}