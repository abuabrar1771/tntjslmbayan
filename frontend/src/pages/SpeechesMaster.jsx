import React, { useState, useEffect } from "react";

export default function SpeechSchedule() {
  // Helper function to dynamically generate today's date in 'YYYY-MM-DD' format
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Set it as the initial default state value
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [detectedDay, setDetectedDay] = useState("");
  const [dailyTimeSlots, setDailyTimeSlots] = useState([]);

  // Speakers list state from backend
  const [speakers, setSpeakers] = useState([]);

  // User dropdown selections state (Tracks indices to capture both id and text)
  const [selectedSpeakerIndex, setSelectedSpeakerIndex] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");

  // Helper map to convert JavaScript day indexes (0-6) into your Tamil backend keys
  const dayIndexToTamil = {
    0: "ஞாயிறு",
    1: "திங்கள்",
    2: "செவ்வாய்",
    3: "புதன்",
    4: "வியாழன்",
    5: "வெள்ளி",
    6: "சனி",
  };

  // Step A: Load your speaker lists immediately when the page mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/speakers")
      .then((res) => res.json())
      .then((data) => {
        setSpeakers(Array.isArray(data) ? data : data.rows || []);
      })
      .catch((err) =>
        console.error("Error loading speakers from backend routes:", err)
      );
  }, []);

  // Step B: Watch the date picker value and compute matching schedules
  useEffect(() => {
    if (!selectedDate) {
      setDetectedDay("");
      setDailyTimeSlots([]);
      return;
    }

    const dateObj = new Date(selectedDate.replace(/-/g, '\/'));
    const dayIndex = dateObj.getDay();
    const tamilDayString = dayIndexToTamil[dayIndex];

    setDetectedDay(tamilDayString);
    setSelectedTime("");
    setSelectedPlace("");

    fetch(
      `http://localhost:5000/api/speech/slots/${encodeURIComponent(tamilDayString)}`
    )
      .then((res) => res.json())
      .then((data) => setDailyTimeSlots(data))
      .catch((err) =>
        console.error("Error loading schedule slots matching date:", err)
      );
  }, [selectedDate]);

  // Handle inner cascading values for location arrays
  const activeTimeObject = dailyTimeSlots.find(
    (slot) => slot.time === selectedTime
  );
  const availablePlaces = activeTimeObject ? activeTimeObject.place : [];

  // Get the currently selected speaker object based on index mapping selection
  const chosenSpeakerObj = speakers[selectedSpeakerIndex] || null;

  // 🎯 STEP C: Save handler function to submit data to your database table
  const handleSaveSchedule = async () => {
    if (!chosenSpeakerObj || !selectedDate || !detectedDay || !selectedTime || !selectedPlace) {
      alert("தயவுசெய்து அனைத்து விவரங்களையும் தேர்ந்தெடுக்கவும்! (Please select all details before saving)");
      return;
    }

    const payload = {
      speakerId: chosenSpeakerObj.speaker_id,
      speakerNameTa: chosenSpeakerObj.speakerna_ta, // Explicit Tamil script representation forwarded
      speakerNameEng: chosenSpeakerObj.speakerna_eng,
      bayanDay: detectedDay,
      bayanPlace: selectedPlace,
      bayanTime: selectedTime,
      scheduleDate: selectedDate
    };

    try {
      const response = await fetch('http://localhost:5000/api/speech/save-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Bayan Schedule saved successfully into PostgreSQL!");
        // Clear selections for the next input entry
        setSelectedSpeakerIndex("");
        setSelectedTime("");
        setSelectedPlace("");
      } else {
        alert("Error saving schedule: " + data.message);
      }
    } catch (error) {
      console.error("Network error saving schedule:", error);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-100 space-y-5 my-8">
      <h2 className="text-2xl font-bold text-center text-indigo-950 border-b pb-3 tracking-wide font-serif">
        Speech Schedule
      </h2>

      {/* 1. Speaker Selection Dropdown (Configured strictly for Tamil Name references) */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          பேச்சாளர் (Select Speaker)
        </label>
        <select
          value={selectedSpeakerIndex}
          onChange={(e) => setSelectedSpeakerIndex(e.target.value)}
          className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-base"
        >
          <option value="">-- பேச்சாளரை தேர்வு செய்யவும் --</option>
          {speakers.map((speaker, index) => (
            <option
              key={speaker.speaker_id || index}
              value={index} // Track via array index key pointers for data isolation stability
            >
              {/* ⭐ CHANGED: Renders the primary name option fields using Tamil text layout format */}
              {speaker.speakerna_ta ? `${speaker.speakerna_ta} (${speaker.speakerna_eng})` : (typeof speaker === "string" ? speaker : "Unknown")}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Date Picker Box */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">
          தேதி (Select Date)
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-2.5 border rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
        />
      </div>

      {/* Day Found UI Notification Card */}
      {detectedDay && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 text-left">
          <p className="text-sm font-semibold text-indigo-900">
            நாள்:{" "}
            <span className="font-bold underline text-indigo-700">
              {detectedDay}
            </span>
          </p>
        </div>
      )}

      {/* 3. Time Selection Dropdown */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          நேரம் (Select Time)
        </label>
        <select
          value={selectedTime}
          onChange={(e) => {
            setSelectedTime(e.target.value);
            setSelectedPlace("");
          }}
          disabled={!selectedDate || dailyTimeSlots.length === 0}
          className="w-full p-2.5 border rounded-lg bg-slate-50 disabled:bg-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
        >
          <option value="">
            {dailyTimeSlots.length === 0 && selectedDate
              ? "-- இந்த நாளில் நேரம் இல்லை --"
              : "-- நேரம் தேர்வு செய்யவும் --"}
          </option>
          {dailyTimeSlots.map((slot, index) => (
            <option key={index} value={slot.time}>
              {slot.time}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Place Selection Dropdown */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">
          இடம் (Select Place)
        </label>
        <select
          value={selectedPlace}
          onChange={(e) => setSelectedPlace(e.target.value)}
          disabled={!selectedTime}
          className="w-full p-2.5 border rounded-lg bg-emerald-50 border-emerald-200 disabled:bg-slate-200 text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">-- இடம் தேர்வு செய்யவும் --</option>
          {availablePlaces.map((placeName, index) => (
            <option key={index} value={placeName}>
              {placeName}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Save Action Button */}
      <button
        onClick={handleSaveSchedule}
        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg shadow transition duration-200 uppercase tracking-wide cursor-pointer active:scale-[0.98]"
      >
        Save Schedule (அட்டவணையைச் சேமி)
      </button>
    </div>
  );
}