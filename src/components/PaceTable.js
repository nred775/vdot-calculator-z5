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
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
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
      <tr key={label}>
        <td>{label}</td>
        <td>{formatTime(totalSec)}</td>
        <td>{formatTime(perMile)} / mile</td>
        <td>{split400}</td>
      </tr>
    );
  }

  const tempoPerMile = PACE_FORMULAS["Tempo"].factor * Math.pow(vdot, PACE_FORMULAS["Tempo"].exponent);
  const steadyPerMile = PACE_FORMULAS["Steady State"].factor * Math.pow(vdot, PACE_FORMULAS["Steady State"].exponent);

  // Half Marathon
  if (event === "Half Marathon" && inputTime) {
    const pace = inputTime / 13.1094;
    rows.push(
      <tr key="Half Marathon">
        <td>Half Marathon</td>
        <td>{formatTime(inputTime)}</td>
        <td>{formatTime(pace)} / mile (tempo)</td>
        <td>{get400mSplit(pace)}</td>
      </tr>
    );
  } else {
    const halfTime = tempoPerMile * 13.1094;
    rows.push(
      <tr key="Half Marathon">
        <td>Half Marathon</td>
        <td>{formatTime(halfTime)}</td>
        <td>{formatTime(tempoPerMile)} / mile (tempo)</td>
        <td>{get400mSplit(tempoPerMile)}</td>
      </tr>
    );
  }

  // Marathon
  if (event === "Marathon" && inputTime) {
    const pace = inputTime / 26.2188;
    rows.push(
      <tr key="Marathon">
        <td>Marathon</td>
        <td>{formatTime(inputTime)}</td>
        <td>{formatTime(pace)} / mile (steady state)</td>
        <td>{get400mSplit(pace)}</td>
      </tr>
    );
  } else {
    const fullTime = steadyPerMile * 26.2188;
    rows.push(
      <tr key="Marathon">
        <td>Marathon</td>
        <td>{formatTime(fullTime)}</td>
        <td>{formatTime(steadyPerMile)} / mile (steady state)</td>
        <td>{get400mSplit(steadyPerMile)}</td>
      </tr>
    );
  }

  // Easy Pace Range (moved up)
  const easyFast = PACE_FORMULAS["Easy Pace (Fast)"].factor * Math.pow(vdot, PACE_FORMULAS["Easy Pace (Fast)"].exponent);
  const easySlow = PACE_FORMULAS["Easy Pace (Slow)"].factor * Math.pow(vdot, PACE_FORMULAS["Easy Pace (Slow)"].exponent);
  const easyRange = `${formatTime(easyFast)}–${formatTime(easySlow)} / mile`;

  rows.push(
    <tr key="Easy Pace">
      <td>Easy Pace</td>
      <td></td>
      <td>{easyRange}</td>
      <td></td>
    </tr>
  );

  return (
    <div>
      <h2>Pace Equivalents</h2>
      <table style={{ width: "100%", maxWidth: "700px", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Event / Pace Type</th>
            <th>Total Time</th>
            <th>Pace Per Mile</th>
            <th>400m Pace</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
