import React from 'react';

export default function Management() {
  // Salem District Executive Team Dataset matching your previous record format
  const managementTeam = [
    { role: "மாவட்ட தலைவர்", name: "பாதுஷா மைதீன்", phone: "9865244482" },
    { role: "மாவட்ட செயலாளர்", name: "தமிமுன் அன்சாரி", phone: "8344331824" },
    { role: "மாவட்ட பொருளாளர்", name: "ஜாபர் சாதிக்", phone: "9884434855" },
    { role: "மாவட்ட துணைத் தலைவர்", name: "அமீர் காஜா", phone: "9994493499" },
    { role: "மாவட்ட துணைச் செயலாளர்", name: "முஹம்மது ஃபைசல்", phone: "9087795074" },
    { role: "மாவட்ட துணைச் செயலாளர்", name: "பர்கத்", phone: "9566303983" },
    { role: "மாவட்ட துணைச் செயலாளர்", name: "அஸ்லாம்", phone: "9500356690" }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-4 font-sans text-left">
      
      {/* 1. Breadcrumb Navigation (Home > மாவட்ட நிர்வாகம்) */}
      <div className="text-xs sm:text-sm text-slate-400 font-medium mb-1 flex items-center gap-1 select-none">
        <span>Home</span>
        <span className="text-slate-300 text-[10px]">➔</span>
        <span className="text-[#581c44] font-semibold">மாவட்ட நிர்வாகம்</span>
      </div>

      {/* 2. Main Title Header Section */}
      <div className="space-y-3 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          மாவட்ட நிர்வாகம்
        </h1>
        <p className="text-sm sm:text-base text-slate-700 font-medium tracking-wide">
          தமிழ்நாடு தவ்ஹீத் ஜமாஅத் மாவட்ட நிர்வாகிகள் பெயர் மற்றும் தொடர்பு எண்கள்
        </p>
      </div>

      {/* 3. Table Container Layout */}
      {/* 🎨 BACKGROUND: Mild Purple (#fff1f6) | BORDER: Strong Purple (#581c44) */}
      <div className="w-full bg-[#fff1f6]/60 border-2 border-[#581c44] rounded-2xl shadow-md overflow-hidden p-2 sm:p-4">
        <div className="w-full overflow-x-auto rounded-xl border border-[#581c44]/20 bg-white">
          
          <table className="w-full border-collapse bg-white text-left text-xs sm:text-sm text-slate-800">
            
            {/* 🎯 TABLE HEADER: Sky Blue tint matching the screenshot pattern exactly */}
            <thead>
              <tr className="bg-[#f0c8c8]/60 text-slate-900 font-black text-sm sm:text-base border-b border-slate-200">
                <th className="py-3.5 px-4 sm:px-6 font-black tracking-wide min-w-[150px]">
                  பொறுப்பு
                </th>
                <th className="py-3.5 px-4 sm:px-6 font-black tracking-wide min-w-[150px]">
                  பெயர்
                </th>
                <th className="py-3.5 px-4 sm:px-6 font-black tracking-wide min-w-[150px]">
                  மொபைல் எண்
                </th>
              </tr>
            </thead>

            {/* TABLE BODY CONTAINER */}
            <tbody className="divide-y divide-[#fef0e7]font-bold text-slate-800 text-xs sm:text-[14px]">
              
              {managementTeam.map((member, index) => (
                <tr 
                  key={index} 
                  className={`transition hover:bg-[#fef0e7]/30 ${index % 2 === 1 ? 'bg-slate-50/30' : 'bg-[#fef0e7]'}`}
                >
                  {/* Position Profile */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-600 font-semibold">
                    {member.role}
                  </td>
                  
                  {/* Executive Name */}
                  <td className="py-3.5 px-4 sm:px-6 text-slate-900 font-black">
                    {member.name}
                  </td>
                  
                  {/* Contact Phone */}
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-slate-700 tracking-wide">
                    {member.phone}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}