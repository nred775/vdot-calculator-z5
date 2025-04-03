import React from "react";

const PACE_FORMULAS = {
  "800m": { factor: 7795.8, exponent: -0.997, distance: 0.497 },
  "1600m": { factor: 11270, exponent: -0.889, distance: 0.994 },
  "3200m": { factor: 22848, exponent: -0.876, distance: 1.988 },
  "5K": { factor: 33687, exponent: -0.854, distance: 3.1069 },
  "10K": { factor: 70600, exponent: -0.856, distance: 6.2137 },
  "Tempo": { factor: 9596.4, exponent: -0.806 },
  "Steady State": { factor: 11614, exponent: -0.84 },
  "Easy Pace (Fast)": { factor: 8880.7, exponent: -0.741 },
  "Easy Pace (Slow)": { factor: 9444.1, exponent: -0.732 },
};

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  const adjustedMins = mins + Math.floor(secs / 60);
  const adjustedSecs = secs % 60;

  return hrs > 0
    ? `${hrs}:${adjustedMins.toString().padStart(2, "0")}:${adjustedSecs.toString().padStart(2, "0")}`
    : `${adjustedMins}:${adjustedSecs.toString().padStart(2, "0")}`;
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
    if (!distance) continue;

    let totalSec, perMile;

    if (label === event && inputTime && distance) {
      totalSec = inputTime;
      perMile = inputTime / distance;
    } else {
      totalSec = factor * Math.pow(vdot, exponent);
      perMile = totalSec / distance;
    }

    const split400 = get400mSplit(perMile);

    rows.push(
      <tr key={label} className="border-t border-gray-300 dark:border-gray-700">
        <td className="px-2 py-1 text-left">{label}</td>
        <td className="px-2 py-1 text-center">{formatTime(totalSec)}</td>
        <td className="px-2 py-1 text-center">{formatTime(perMile)} / mile</td>
        <td className="px-2 py-1 text-center">{split400}</td>
      </tr>
    );
  }

  const tempoPerMile = PACE_FORMULAS["Tempo"].factor * Math.pow(vdot, PACE_FORMULAS["Tempo"].exponent);
  const steadyPerMile = PACE_FORMULAS["Steady State"].factor * Math.pow(vdot, PACE_FORMULAS["Steady State"].exponent);

  if (event === "Half Marathon" && inputTime) {
    const pace = inputTime / 13.1094;
    rows.push(
      <tr key="Half Marathon" className="border-t border-gray-300 dark:border-gray-700">
        <td className="px-2 py-1 text-left">Half Marathon</td>
        <td className="px-2 py-1 text-center">{formatTime(inputTime)}</td>
        <td className="px-2 py-1 text-center">{formatTime(pace)} / mile (tempo)</td>
        <td className="px-2 py-1 text-center">{get400mSplit(pace)}</td>
      </tr>
    );
  } else {
    const halfTime = tempoPerMile * 13.1094;
    rows.push(
      <tr key="Half Marathon" className="border-t border-gray-300 dark:border-gray-700">
        <td className="px-2 py-1 text-left">Half Marathon</td>
        <td className="px-2 py-1 text-center">{formatTime(halfTime)}</td>
        <td className="px-2 py-1 text-center">{formatTime(tempoPerMile)} / mile (tempo)</td>
        <td className="px-2 py-1 text-center">{get400mSplit(tempoPerMile)}</td>
      </tr>
    );
  }

  if (event === "Marathon" && inputTime) {
    const pace = inputTime / 26.2188;
    rows.push(
      <tr key="Marathon" className="border-t border-gray-300 dark:border-gray-700">
        <td className="px-2 py-1 text-left">Marathon</td>
        <td className="px-2 py-1 text-center">{formatTime(inputTime)}</td>
        <td className="px-2 py-1 text-center">{formatTime(pace)} / mile (steady state)</td>
        <td className="px-2 py-1 text-center">{get400mSplit(pace)}</td>
      </tr>
    );
  } else {
    const fullTime = steadyPerMile * 26.2188;
    rows.push(
      <tr key="Marathon" className="border-t border-gray-300 dark:border-gray-700">
        <td className="px-2 py-1 text-left">Marathon</td>
        <td className="px-2 py-1 text-center">{formatTime(fullTime)}</td>
        <td className="px-2 py-1 text-center">{formatTime(steadyPerMile)} / mile (steady state)</td>
        <td className="px-2 py-1 text-center">{get400mSplit(steadyPerMile)}</td>
      </tr>
    );
  }

  const easyFast = PACE_FORMULAS["Easy Pace (Fast)"].factor * Math.pow(vdot, PACE_FORMULAS["Easy Pace (Fast)"].exponent);
  const easySlow = PACE_FORMULAS["Easy Pace (Slow)"].factor * Math.pow(vdot, PACE_FORMULAS["Easy Pace (Slow)"].exponent);
  const easyRange = `${formatTime(easyFast)}–${formatTime(easySlow)} / mile`;

  rows.push(
    <tr key="Easy Pace" className="border-t border-gray-300 dark:border-gray-700">
      <td className="px-2 py-1 text-left">Easy Pace</td>
      <td className="px-2 py-1"></td>
      <td className="px-2 py-1 text-center">{easyRange}</td>
      <td className="px-2 py-1"></td>
    </tr>
  );

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">Pace Equivalents</h2>
      <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-gray-700">
        <table className="w-full table-auto text-sm border-collapse">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              <th className="text-left px-2 py-2 border border-gray-300 dark:border-gray-600">Event / Pace Type</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">Total Time</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">Pace Per Mile</th>
              <th className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600">400m Pace</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
}
