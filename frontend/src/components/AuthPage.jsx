import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState("LOGIN"); // 'LOGIN' or 'SIGNUP'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nameEng: "",
    nameTa: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    address: "",
    roleName: "Speaker", // Default signup role
  });

  // Automatically reset fields when switching tabs to maintain a clean slate
  useEffect(() => {
    setFormData({
      nameEng: "",
      nameTa: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      address: "",
      roleName: "Speaker",
    });
  }, [authMode]);

  // 🔄 English to Tamil Auto-Transliteration Logic (600ms Type Debounce Delay)
  useEffect(() => {
    if (authMode === "LOGIN" || !formData.nameEng.trim()) {
      setFormData((prev) => ({ ...prev, nameTa: "" }));
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(formData.nameEng)}&itc=ta-t-i0-und&num=1`,
        );
        const data = await response.json();

        if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]?.[0]) {
          const tamilTransliteration = data[1][0][1][0];
          setFormData((prev) => ({ ...prev, nameTa: tamilTransliteration }));
        }
      } catch (err) {
        console.error("Transliteration service infrastructure warning:", err);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.nameEng, authMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Integrity pass checking for configuration passwords
    if (
      authMode === "SIGNUP" &&
      formData.password !== formData.confirmPassword
    ) {
      toast.error("⚠️ Security check failed: Passwords do not match.");
      return;
    }

    setLoading(true);

    // 📱 Normalizing Phone Numbers: Automatically prepend +91 if missing
    let cleanPhone = formData.phoneNumber.trim().replace(/\s+/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = `+91${cleanPhone}`;
    }

    const endpoint =
      authMode === "LOGIN" ? "/api/speakers/login" : "/api/speakers/signup";

    const payload =
      authMode === "LOGIN"
        ? { phoneNumber: cleanPhone, password: formData.password }
        : {
            nameEng: formData.nameEng,
            nameTa: formData.nameTa, 
            phoneNumber: cleanPhone,
            password: formData.password,
            address: formData.address,
            roleName: formData.roleName,
          };

    try {
      // Direct connection utilizing your backend structural architecture port 5000
      const response = await axios.post(
        `http://localhost:5000${endpoint}`,
        payload,
      );

      if (response.data.success) {
        toast.success(`🎉 ${response.data.message}`);

        if (response.data.token) {
          // ⚡ ⭐ CHANGED: Saving parameters directly into temporary sessionStorage 
          sessionStorage.setItem("speakerToken", response.data.token);

          // Construct speaker tracking information schema objects safely
          const userPayload = {
            id: response.data.speaker.id,
            nameEng: response.data.speaker.nameEng,
            nameTa: response.data.speaker.nameTa || formData.nameTa, // Cache Tamil text string fallback
            phoneNumber: response.data.speaker.phoneNumber,
          };

          // ⚡ ⭐ CHANGED: Saving user profile dataset into temporary sessionStorage
          sessionStorage.setItem("speakerInfo", JSON.stringify(userPayload));

          setTimeout(() => {
            // 🎯 Lifiting state context cleanly. 
            // Since your Route path="/" renders <Home/> inside App.jsx, this instantly reveals the Home view page!
            onLoginSuccess(userPayload);
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Internal server connection barrier.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 h-fit min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-auto">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6 font-serif">
          Spiritual Speech Scheduler
        </h2>

        {/* Dynamic Dual Tab Swapping Toggle Switch */}
        <div className="flex p-1 bg-slate-200 rounded-xl mb-8 w-fit mx-auto select-none">
          <button
            type="button"
            onClick={() => setAuthMode("LOGIN")}
            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${authMode === "LOGIN" ? "bg-white shadow-md text-cyan-600" : "text-slate-600"}`}
          >
            Speaker LogIn
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("SIGNUP")}
            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${authMode === "SIGNUP" ? "bg-white shadow-md text-cyan-600" : "text-slate-600"}`}
          >
            Add New Speaker / User
          </button>
        </div>

        {/* Unified Authentication Matrix Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-5"
        >
          {authMode === "SIGNUP" && (
            <>
              {/* Role Selection Dropdown Field */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 mb-2 tracking-wide">
                  Select Role
                </label>
                <select
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-mono text-sm font-bold bg-slate-50 cursor-pointer"
                >
                  <option value="Speaker">SPEAKER </option>
                  <option value="User">STANDARD USER</option>
                </select>
              </div>

              {/* English Name Input Field */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                  Speaker Full Name (English Reference Script)
                </label>
                <input
                  type="text"
                  name="nameEng"
                  value={formData.nameEng}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nazimunisha"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-sans font-medium text-slate-800 bg-slate-50/10"
                />
              </div>

              {/* Live Run-Time Automated Tamil Transliteration Indicator Box */}
              {formData.nameEng && (
                <div className="p-3 rounded-xl border flex justify-between items-center font-mono text-xs font-bold transition-all bg-emerald-50 border-emerald-200 text-emerald-800">
                  <span>AUTOMATED TAMIL SCRIPT:</span>
                  <span className="font-black text-sm tracking-wide bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {formData.nameTa || "Processing Phonetics..."}
                  </span>
                </div>
              )}

              {/* Address Area Field */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full physical structural address details"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-sans font-medium text-slate-800 bg-slate-50/10"
                />
              </div>
            </>
          )}

          {/* Core Login/Identity Column Target Matrix: Phone Number */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold font-mono">
                📱
              </span>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="e.g. 9876543210"
                className="w-full p-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-mono font-bold text-slate-700 bg-slate-50/10"
              />
            </div>
          </div>

          {/* Cryptographic Key Entry: Password */}
          <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-bold font-mono">
                🔑
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-mono font-bold text-slate-700 bg-slate-50/10"
              />
            </div>
          </div>

          {authMode === "SIGNUP" && (
            /* Verify Password Confirmation Gate Field */
            <div>
              <label className="block text-xs font-black uppercase text-slate-600 mb-2 tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400 font-bold font-mono">
                  🔒
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={authMode === "SIGNUP"}
                  placeholder="••••••••"
                  className="w-full p-3 pl-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none font-mono font-bold text-slate-700 bg-slate-50/10"
                />
              </div>
            </div>
          )}

          <p className="text-[11px] text-slate-400 italic text-center select-none pt-2">
            {authMode === "LOGIN"
              ? "Access portals establish safe credential matching metrics."
              : "Registering records sets up explicit permissions across future schedules."}
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all disabled:bg-slate-400 shadow-md active:scale-[0.99] cursor-pointer"
          >
            {loading
              ? "Validating Identity Record Parameters..."
              : authMode === "LOGIN"
                ? "Authorize & Initialize Dashboard"
                : "Commit Registration Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;