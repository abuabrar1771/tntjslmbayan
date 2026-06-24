import React from 'react';

export default function Contact() {
  return (
    <div className="w-full max-w-5xl mx-auto my-4 sm:my-6 px-4 font-sans text-left">
      
      {/* 1. Breadcrumb Navigation */}
      <div className="text-xs sm:text-sm text-slate-400 font-medium mb-1 flex items-center gap-1 select-none">
        <span>Home</span>
        <span className="text-slate-300 text-[10px]">➔</span>
        <span className="text-[#581c44] font-semibold">தொடர்புகொள்ள</span>
      </div>

      {/* 2. Main Title Header Section */}
      <div className="space-y-3 mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          தொடர்புகொள்ள
        </h1>
        <p className="text-sm sm:text-base text-slate-700 font-medium tracking-wide">
          தமிழ்நாடு தவ்ஹீத் ஜமாஅத், சேலம் மாவட்ட மேலாண்மை மற்றும் பயான் அட்டவணை தொடர்பான சந்தேகங்களுக்கு எங்களைத் தொடர்பு கொள்ளவும்.
        </p>
      </div>

      {/* 3. Main Content Container Layout */}
      {/* 🎨 BACKGROUND: Mild Purple (#fff1f6) | BORDER: Strong Purple (#581c44) */}
      <div className="w-full bg-[#fff1f6]/60 border-2 border-[#581c44] rounded-2xl shadow-md p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: Contact Information Cards (7 Columns) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Main Head Office Card */}
          <div className="bg-white border border-[#581c44]/10 rounded-xl p-5 shadow-sm">
            <h3 className="text-[#581c44] font-black text-base sm:text-lg border-b pb-2 mb-3">
              📍 மாவட்ட தலைமையகம் (District HQ)
            </h3>
            <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
              தமிழ்நாடு தவ்ஹீத் ஜமாஅத் (TNTJ),<br />
              சேலம் மாவட்ட அலுவலகம்,<br />
              சேலம், தமிழ்நாடு.
            </p>
          </div>

          {/* Quick Support Phone Numbers Card */}
          <div className="bg-white border border-[#581c44]/10 rounded-xl p-5 shadow-sm">
            <h3 className="text-[#581c44] font-black text-base sm:text-lg border-b pb-2 mb-3">
              📞 அவசர உதவி எண்கள் (Support Team)
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-600">மாவட்ட துணைச் செயலாளர்</span>
                <span className="font-mono font-black text-slate-900">8344331824</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-600">மாவட்ட தலைவர்</span>
                <span className="font-mono font-black text-slate-900">9865244482</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="font-semibold text-slate-600">பொது சந்தேகங்கள்</span>
                <span className="font-mono font-black text-slate-900">8344331824</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Quick Message / Query Form (5 Columns) */}
        <div className="md:col-span-5 bg-white border border-[#581c44]/10 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[#581c44] font-black text-base sm:text-lg border-b pb-2 mb-4">
              ✉️ உங்கள் கருத்துக்களை அனுப்ப
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1 tracking-wide">பெயர் (Name)</label>
                <input 
                  type="text" 
                  placeholder="உங்கள் பெயர்"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-[#581c44]/20 font-medium"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1 tracking-wide">மொபைல் எண் (Mobile)</label>
                <input 
                  type="tel" 
                  placeholder="9876543210"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-[#581c44]/20 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-1 tracking-wide">செய்தி (Message)</label>
                <textarea 
                  rows="3"
                  placeholder="உங்கள் கருத்து அல்லது சந்தேகங்களை இங்கே எழுதவும்..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-[#581c44]/20 font-medium resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="w-full mt-4 py-2.5 bg-[#581c44] text-white font-bold text-xs rounded-lg uppercase tracking-wider hover:bg-[#2d112b] transition-all cursor-pointer shadow-sm border-none"
          >
            அனுப்பு (Send Message)
          </button>
        </div>

      </div>

    </div>
  );
}