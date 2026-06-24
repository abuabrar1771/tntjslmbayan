import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SpeakersMaster = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your actual backend URL path
      const response = await axios.post("http://localhost:5000/api/speakers/add", formData);
      
      if (response.data.success) {
        toast.success("Speaker registered successfully!");
        // Clear the form fields
        setFormData({ name: "", mobileNumber: "", password: "" });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(error.response?.data?.message || "Server error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md mt-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2 text-center">
        Speakers Master Registration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Speaker Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Speaker Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            placeholder="Enter 10-digit mobile number"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition duration-200 mt-2 shadow-sm"
        >
          Add New Speaker
        </button>
      </form>
    </div>
  );
};

export default SpeakersMaster;