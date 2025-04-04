import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react"; // ✅ Icons for feedback

const VDOT_FORMULAS = {
  "800m": { factor: 7795.8, exponent: -0.997 },
  "1600m": { factor: 11270, exponent: -0.889 },
  "3200m": { factor: 22848, exponent: -0.876 },
  "5K": { factor: 33687, exponent: -0.854 },
  "10K": { factor: 70600, exponent: -0.856 },
  "Half Marathon": { factor: 9596.4, exponent: -0.806 },
  "Marathon": { factor: 11614, exponent: -0.84 },
};

function parseTime(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || parts.length > 3 || parts.some(isNaN)) return null;
  const [min, sec] = parts.slice(-2);
  const hours = parts.length === 3 ? parts[0] : 0;
  return hours * 3600 + min * 60 + sec;
}

function calculateVDOT(event, seconds) {
  const { factor, exponent } = VDOT_FORMULAS[event];
  const distance = event === "Half Marathon" ? 13.1094 :
                   event === "Marathon" ? 26.2188 : 1;

  const perMile = (event === "Half Marathon" || event === "Marathon")
    ? seconds / distance
    : seconds;

  return Math.pow(perMile / factor, 1 / exponent);
}

export default function PRInput({ setVdot, setEvent, setInputSeconds }) {
  const [event, updateEvent] = useState("1600m");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(null); // ✨ for live feedback

  const handleTimeChange = (e) => {
    const input = e.target.value;
    setTime(input);
    const parsed = parseTime(input);
    setIsValid(parsed !== null && parsed > 0);
  };

  const handleCalculate = () => {
    const seconds = parseTime(time);
    if (seconds === null || seconds <= 0) {
      setError("Please enter a valid time in HH:MM:SS or MM:SS format.");
      return;
    }

    const vdot = calculateVDOT(event, seconds);
    if (!vdot || isNaN(vdot)) {
      setError("Could not calculate VDOT. Check input.");
      return;
    }

    setVdot(Math.round(vdot * 10) / 10);
    setEvent(event);
    setInputSeconds(seconds);
    setError("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Event:
        </label>
        <select
          value={event}
          onChange={(e) => updateEvent(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2"
        >
          <option value="800m">800m</option>
          <option value="1600m">1600m</option>
          <option value="3200m">3200m</option>
          <option value="5K">5K</option>
          <option value="10K">10K</option>
          <option value="Half Marathon">Half Marathon</option>
          <option value="Marathon">Marathon</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          PR Time:
        </label>
        <div className="relative">
          <input
            type="text"
            value={time}
            onChange={handleTimeChange}
            placeholder="MM:SS or HH:MM:SS"
            className={`w-full rounded-md border p-2 pr-10 ${
              isValid === null
                ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                : isValid
                ? "border-green-500 bg-green-50 dark:bg-green-900"
                : "border-red-500 bg-red-50 dark:bg-red-900"
            } text-gray-900 dark:text-gray-100`}
          />
          {isValid === true && (
            <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
          )}
          {isValid === false && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 w-5 h-5" />
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Format: MM:SS or HH:MM:SS (e.g. 4:32 or 1:03:15)
        </p>
      </div>

      <button
        onClick={handleCalculate}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Calculate
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
