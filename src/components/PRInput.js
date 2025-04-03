import React, { useState } from "react";

const VDOT_FORMULAS = {
  "800m": { factor: 7795.8, exponent: -0.997 },
  "1600m": { factor: 11270, exponent: -0.889 },
  "3200m": { factor: 22848, exponent: -0.876 },
  "5k": { factor: 33687, exponent: -0.854 },
  "10k": { factor: 70600, exponent: -0.856 },
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
    <div>
      <label>
        Event:
        <select value={event} onChange={(e) => updateEvent(e.target.value)}>
          <option value="800m">800m</option>
          <option value="1600m">1600m</option>
          <option value="3200m">3200m</option>
          <option value="5k">5K</option>
          <option value="10k">10K</option>
          <option value="Half Marathon">Half Marathon</option>
          <option value="Marathon">Marathon</option>
        </select>
      </label>
      <br />
      <label>
        PR (HH:MM:SS or MM:SS):
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="e.g. 2:30:00"
        />
      </label>
      <br />
      <button onClick={handleCalculate}>Calculate</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
