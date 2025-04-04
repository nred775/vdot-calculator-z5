import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PACE_FORMULAS = {
  "1600m": { factor: 11270, exponent: -0.889, distance: 0.994 },
  "3200m": { factor: 22848, exponent: -0.876, distance: 1.988 },
  "5K": { factor: 33687, exponent: -0.854, distance: 3.1069 },
  "10K": { factor: 70600, exponent: -0.856, distance: 6.2137 },
  "Tempo": { factor: 9596.4, exponent: -0.806 },
  "Steady State": { factor: 11614, exponent: -0.84 },
  "Wheel": { factor: 10076, exponent: -0.788 },
  "Distance (Fast)": { factor: 8880.7, exponent: -0.741 },
  "Distance (Slow)": { factor: 9444.1, exponent: -0.732 },
};

const getRowClass = (label) => {
    const styles = {
      "1600m": "bg-[#4ade80] dark:bg-purple-900/40",        // Green
      "3200m": "bg-[#4ade80] dark:bg-purple-900/40",
      "5K":     "bg-[#4ade80] dark:bg-purple-900/40",
  
      "10K":    "bg-[#fde047] dark:bg-indigo-900/40",       // Bright Yellow
      "Tempo":  "bg-[#facc15] dark:bg-blue-900/40",         // Golden Yellow
      "Steady State": "bg-[#86efac] dark:bg-cyan-900/40",   // Mint
  
      "Half Marathon": "bg-[#38bdf8] dark:bg-teal-900/40",  // Sky Blue
      "Marathon":      "bg-[#38bdf8] dark:bg-teal-900/40",
  
      "Wheel":    "bg-[#a78bfa] dark:bg-emerald-900/40",    // Lavender Purple
      "Distance": "bg-[#f9a8d4] dark:bg-gray-800/40",       // Pink
    };
    return styles[label] || "";
  };

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);
  return hrs > 0
    ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${mins}:${secs.toString().padStart(2, "0")}`;
}

function get400mSplit(pacePerMileSec) {
  const metersPerMile = 1609.34;
  const split = (pacePerMileSec / metersPerMile) * 400;
  const splitRounded = Math.round(split * 10) / 10;
  const minutes = Math.floor(splitRounded / 60);
  const seconds = (splitRounded % 60).toFixed(1);
  return `${minutes}:${seconds.toString().padStart(4, "0")}`;
}

export default function PaceTable({ vdot, event, inputTime }) {
  if (!vdot) return null;

  const rows = [];

  for (const [label, { factor, exponent, distance }] of Object.entries(PACE_FORMULAS)) {
    if (!distance || label === "Wheel") continue;

    let totalSec, perMile;

    if (label === event && inputTime && distance) {
      totalSec = inputTime;
      perMile = inputTime / distance;
    } else {
      totalSec = factor * Math.pow(vdot, exponent);
      perMile = totalSec / distance;
    }

    const perKm = perMile / 1.60934;
    const split400 = get400mSplit(perMile);
    const rowClass = getRowClass(label);

    rows.push(
      <motion.tr
        key={label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-t border-gray-300 dark:border-gray-700 ${rowClass}`}
      >
        <td className="px-2 py-1 text-left">{label}</td>
        <td className="px-2 py-1 text-center">{formatTime(totalSec)}</td>
        <td className="px-2 py-1 text-center">{formatTime(perMile)} / mile</td>
        <td className="px-2 py-1 text-center">{formatTime(perKm)} / km</td>
        <td className="px-2 py-1 text-center">{split400}</td>
      </motion.tr>
    );
  }

  const tempoPerMile = PACE_FORMULAS["Tempo"].factor * Math.pow(vdot, PACE_FORMULAS["Tempo"].exponent);
  const steadyPerMile = PACE_FORMULAS["Steady State"].factor * Math.pow(vdot, PACE_FORMULAS["Steady State"].exponent);

  const addSpecialRow = (label, inputTime, distanceMiles, perMileDefault, paceLabel) => {
    let totalSec = inputTime || perMileDefault * distanceMiles;
    const perMile = inputTime ? inputTime / distanceMiles : perMileDefault;
    const perKm = perMile / 1.60934;
    const split400 = get400mSplit(perMile);
    const rowClass = getRowClass(label);

    rows.push(
      <motion.tr
        key={label}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-t border-gray-300 dark:border-gray-700 ${rowClass}`}
      >
        <td className="px-2 py-1 text-left">{label}</td>
        <td className="px-2 py-1 text-center">{formatTime(totalSec)}</td>
        <td className="px-2 py-1 text-center">{formatTime(perMile)} / mile ({paceLabel})</td>
        <td className="px-2 py-1 text-center">{formatTime(perKm)} / km</td>
        <td className="px-2 py-1 text-center">{split400}</td>
      </motion.tr>
    );
  };

  addSpecialRow("Half Marathon", event === "Half Marathon" ? inputTime : null, 13.1094, tempoPerMile, "tempo");
  addSpecialRow("Marathon", event === "Marathon" ? inputTime : null, 26.2188, steadyPerMile, "steady state");

  const wheelPerMile = PACE_FORMULAS["Wheel"].factor * Math.pow(vdot, PACE_FORMULAS["Wheel"].exponent);
  const wheelPerKm = wheelPerMile / 1.60934;
  const wheel400 = get400mSplit(wheelPerMile);
  const wheelClass = getRowClass("Wheel");

  rows.push(
    <motion.tr
      key="Wheel"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-t border-gray-300 dark:border-gray-700 ${wheelClass}`}
    >
      <td className="px-2 py-1 text-left">Wheel</td>
      <td className="px-2 py-1 text-center">—</td>
      <td className="px-2 py-1 text-center">{formatTime(wheelPerMile)} / mile</td>
      <td className="px-2 py-1 text-center">{formatTime(wheelPerKm)} / km</td>
      <td className="px-2 py-1 text-center">{wheel400}</td>
    </motion.tr>
  );

  const easyFast = PACE_FORMULAS["Distance (Fast)"].factor * Math.pow(vdot, PACE_FORMULAS["Distance (Fast)"].exponent);
  const easySlow = PACE_FORMULAS["Distance (Slow)"].factor * Math.pow(vdot, PACE_FORMULAS["Distance (Slow)"].exponent);
  const easyRangeMile = `${formatTime(easyFast)}–${formatTime(easySlow)} / mile`;
  const easyRangeKm = `${formatTime(easyFast / 1.60934)}–${formatTime(easySlow / 1.60934)} / km`;
  const distanceClass = getRowClass("Distance");

  rows.push(
    <motion.tr
      key="Distance"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-t border-gray-300 dark:border-gray-700 ${distanceClass}`}
    >
      <td className="px-2 py-1 text-left">Distance</td>
      <td className="px-2 py-1"></td>
      <td className="px-2 py-1 text-center">{easyRangeMile}</td>
      <td className="px-2 py-1 text-center">{easyRangeKm}</td>
      <td className="px-2 py-1"></td>
    </motion.tr>
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Pace Equivalents</h2>
      <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-gray-700 max-h-[60vh]">
        <table className="w-full table-auto text-sm border-collapse">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 sticky top-0 z-10 shadow-md">
            <tr>
              <th className="text-left px-2 py-2 border border-gray-300 dark:border-gray-600">Event / Pace Type</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">Total Time</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">Pace / Mile</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">Pace / Km</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">400m Pace</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>{rows}</AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
