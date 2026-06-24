import React, { useState, useEffect } from 'react';

export default function BayanSchedule({ currentUser }) {
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [pivotDate, setPivotDate] = useState(getTodayDateString());
  const [weekRangeText, setWeekRangeText] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser && currentUser.phoneNumber === '+919087795074';

  const calculateWeeklyRange = (inputDate) => {
    const dateObj = new Date(inputDate.replace(/-/g, '\/'));
    const dayOfWeek = dateObj.getDay(); 
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(dateObj);
    monday.setDate(dateObj.getDate() + distanceToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const pad = (num) => String(num).padStart(2, '0');
    const formatLabel = (d) => `${pad(d.getDate())}:${pad(d.getMonth() + 1)}:${d.getFullYear()}`;
    const formatQuery = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

    return {
      displayLabel: `${formatLabel(monday)} முதல் ${formatLabel(sunday)}`,
      queryStart: formatQuery(monday),
      queryEnd: formatQuery(sunday)
    };
  };

  useEffect(() => {
    if (!pivotDate) return;

    const range = calculateWeeklyRange(pivotDate);
    setWeekRangeText(range.displayLabel);
    setLoading(true);

    fetch(`http://localhost:5000/api/speech/weekly-report?startDate=${range.queryStart}&endDate=${range.queryEnd}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setSchedules(resData.data);
        }
      })
      .catch((err) => console.error("Error building report layout view:", err))
      .finally(() => setLoading(false));

  }, [pivotDate]);

  const visibleSchedules = schedules.filter((row) => {
    if (isAdmin) return true;
    if (!currentUser) return false;

    const matchesId = currentUser.id && Number(row.speaker_id) === Number(currentUser.id);
    const matchesTamilName = currentUser.nameTa && row.speakerna_ta?.trim() === currentUser.nameTa.trim();
    const matchesEnglishName = currentUser.nameEng && row.speakerna_eng?.toUpperCase().trim() === currentUser.nameEng.toUpperCase().trim();

    return matchesId || matchesTamilName || matchesEnglishName;
  });

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 px-1 sm:px-4">
      {/* Main Poster Frame Container */}
      <div className="w-full bg-[#fdf6f8] border-2 border-amber-900/20 rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-md font-sans relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#dfad6c]/10 to-transparent pointer-events-none rounded-br-full" />
        
        {/* Banner Section Headers */}
        <div className="text-center space-y-1 mb-4 sm:mb-6 relative z-10">
          <h1 className="text-xl sm:text-3xl font-black text-[#105a35] tracking-wide">தமிழ்நாடு தவ்ஹீத் ஜமாஅத்,</h1>
          <h2 className="text-[11px] sm:text-sm font-bold text-[#dfad6c] bg-[#581c44] px-3 sm:px-4 py-1 rounded-md inline-block shadow-sm">❖ சேலம் மாவட்டம் ❖ <span className="text-white font-normal text-[10px] sm:text-[11px] block sm:inline sm:ml-1">சார்பாக</span></h2>
          <div className="text-3xl sm:text-5xl font-extrabold text-[#581c44] py-1 sm:py-2 font-serif tracking-wide">பெண்கள் பயான்</div>
        </div>

        {/* Dynamic Date Range Display Bar */}
        <div className="bg-[#2d112b] border border-[#dfad6c]/30 text-white text-center py-2 px-4 sm:px-6 rounded-xl text-xs sm:text-base font-bold flex items-center justify-center gap-2 shadow-md mb-4 sm:mb-6 max-w-xl mx-auto">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#dfad6c] hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2.5"/>
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2.5"/>
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2.5"/>
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2.5"/>
          </svg>
          <span className="tracking-widest font-mono mx-1">{weekRangeText || "Calculating..."}</span>
        </div>

        {/* Data Report Layout Container */}
        <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl border-2 border-[#581c44] shadow-md bg-white">
          
          {/* 🎯 HEADER ROW: Desktop receives icons and left-alignment, Mobile remains centered without icons */}
          <div className="grid grid-cols-12 bg-[#581c44] text-white font-bold text-xs sm:text-sm py-2.5 px-2 sm:px-5 border-b-2 border-[#581c44] select-none text-center sm:text-left">
            <div className="col-span-2 flex items-center justify-center sm:justify-start gap-2 border-r border-white/20 pr-1 sm:pr-2">
              <svg className="w-4 h-4 text-[#dfad6c] hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>நாள்</span>
            </div>
            <div className="col-span-3 sm:col-span-2 flex items-center justify-center sm:justify-start gap-2 border-r border-white/20 px-1 sm:px-2">
              <svg className="w-4 h-4 text-[#dfad6c] hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>நேரம்</span>
            </div>
            <div className="col-span-4 flex items-center justify-center sm:justify-start gap-2 border-r border-white/20 px-1 sm:px-2">
              <svg className="w-4 h-4 text-[#dfad6c] hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>இடம்</span>
            </div>
            <div className="col-span-3 sm:col-span-4 flex items-center justify-center sm:justify-start gap-2 px-1 sm:px-2">
              <svg className="w-4 h-4 text-[#dfad6c] hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>தாயி</span>
            </div>
          </div>

          {/* Table Content Rows */}
          {loading ? (
            <div className="text-center py-10 text-slate-400 font-medium text-xs">தரவுகள் ஏற்றப்படுகின்றன...</div>
          ) : visibleSchedules.length === 0 ? (
            <div className="text-center py-14 text-[#581c44]/60 font-bold text-xs sm:text-sm bg-[#fff1f6]">
              ❌ இந்த வாரத்தில் தங்களுக்கு எந்த பாயானும் ஒதுக்கப்படவில்லை!
            </div>
          ) : (
            <div className="divide-y divide-[#581c44]/10">
              {visibleSchedules.map((row, idx) => (
                <div 
                  key={row.schedule_id || idx} 
                  className={`grid grid-cols-12 items-center text-[11px] sm:text-sm py-2 px-2 sm:py-2 sm:px-5 font-bold transition text-slate-900 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff1f6]/40'}`}
                >
                  {/* 1. Day Column */}
                  <div className="col-span-2 font-black text-[#581c44] text-[11px] sm:text-[15px] flex items-center justify-center sm:justify-start gap-2 border-r border-[#581c44]/10 pr-1 sm:pr-2 h-full py-1">
                    {/* 🖥️ Big Screen Icon, Mobile view automatically clears it */}
                    <svg className="w-4 h-4 text-[#581c44]/70 shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{row.bayan_day}</span>
                  </div>
                  
                  {/* 2. Time Column */}
                  <div className="col-span-3 sm:col-span-2 text-slate-700 flex items-center justify-center sm:justify-start gap-2 border-r border-[#581c44]/10 px-1 sm:px-2 h-full py-1 text-center sm:text-left">
                    {/* 🖥️ Big Screen Icon, Mobile view automatically clears it */}
                    <svg className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{row.bayan_time}</span>
                  </div>
                  
                  {/* 3. Location Place Column */}
                  <div className="col-span-4 text-slate-800 break-words flex items-center gap-2 justify-center sm:justify-start sm:text-[14px] border-r border-[#581c44]/10 h-full px-1 sm:px-2 py-1">
                    {/* 🖥️ Big Screen Icon, Mobile view automatically clears it */}
                    <svg className="w-4 h-4 text-[#105a35] shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate sm:whitespace-normal max-w-full">{row.bayan_place}</span>
                  </div>
                  
                  {/* 4. Speaker Name Column */}
                  <div className="col-span-3 sm:col-span-4 text-[#581c44] flex items-center gap-2 justify-center sm:justify-start sm:text-[14px] h-full pl-1 sm:pl-2 py-1">
                    {/* 🖥️ Big Screen Icon, Mobile view automatically clears it */}
                    <svg className="w-4 h-4 text-[#581c44] shrink-0 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="flex flex-col items-center sm:items-start justify-center leading-tight text-center sm:text-left w-full">
                      <span className="text-slate-900 font-black tracking-wide truncate max-w-full">{row.speakerna_ta}</span>
                      {row.speakerna_eng && (
                        <span className="text-[10px] text-slate-400 font-mono font-normal hidden sm:block">
                          ({row.speakerna_eng})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Motivational Slogan Bar */}
        <div className="mt-6 text-center space-y-2 pt-4">
          <div className="bg-[#2d112b] text-[#dfad6c] text-xs sm:text-sm font-black py-2 px-6 sm:px-8 rounded-xl inline-block shadow-md border border-[#dfad6c]/20 tracking-wider">
            நன்மையை ஏவி தீமையை தடுப்போம்
          </div>
          <p className="text-xs sm:text-sm text-[#581c44] font-black tracking-wide">
            அனைத்து பெண்களும் தவறாமல் கலந்துகொள்ளுங்கள்!
          </p>
        </div>

      </div>
    </div>
  );
}