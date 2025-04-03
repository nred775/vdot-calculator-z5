import React from "react";

// Define the VDOT formulas for each race type
const PACE_FORMULAS = {
  "800m": { factor: 7795.8, exponent: -0.997, distance: 0.497 },
  "1600m": { factor: 11270, exponent: -0.889, distance: 0.994 },
  "3200m": { factor: 22848, exponent: -0.876, distance: 1.988 },
  "5K": { factor: 33687, exponent: -0.854, distance: 3.1069 },
  "10K": { factor: 70600, exponent: -0.856, distance: 6.2137 },
  "Tempo": { factor: 9596.4, exponent: -0.806 },  // Changed label from Half Marathon
  "Steady State": { factor: 11614, exponent: -0.84 },  // Changed label from Marathon
  "Easy Pace (Fast)": { factor: 8880.7, exponent: -0.741 },
  "Easy Pace (Slow)": { factor: 9444.1, exponent: -0.732 },
};

// Function to format time as HH:MM:SS
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}



// Calculate paces for each event
function calculatePaces(vdot) {
  const paces = {};
  for (const [label, { factor, exponent, distance }] of Object.entries(PACE_FORMULAS)) {
    const seconds = factor * Math.pow(vdot, exponent);
    if (distance) {
      const perMile = seconds / distance;
      paces[label] = {
        time: formatTime(seconds),
        perMile: formatTime(perMile),
      };
    } else {
      paces[label] = {
        perMile: formatTime(seconds),
      };
    }
  }
  return paces;
}

// VDOTTablePage component
function VDOTTablePage() {
  const vdotList = [];
  for (let v = 75.0; v >= 30.0; v -= 0.1) {
    vdotList.push(Number(v.toFixed(1)));
  }

  return (
    <div>
      <h2>Full VDOT Table</h2>
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table style={{ borderCollapse: "collapse", fontSize: "0.85rem", width: "100%" }}>
          <thead>
            <tr>
              <th>VDOT</th>
              <th>800m</th>
              <th>1600m</th>
              <th>3200m</th>
              <th>5K</th>
              <th>10K</th>
              <th>Half Marathon</th>
              <th>Marathon</th>
              <th>Tempo</th>
              <th>Steady State</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {vdotList.map((v) => {
              const p = calculatePaces(v);

              // Ensure the Tempo and Steady State values are numbers before using them
              // Recalculate raw paces in seconds for marathon/half
              const tempoSec = PACE_FORMULAS["Tempo"].factor * Math.pow(v, PACE_FORMULAS["Tempo"].exponent);
              const steadySec = PACE_FORMULAS["Steady State"].factor * Math.pow(v, PACE_FORMULAS["Steady State"].exponent);

              const halfMarathonTime = tempoSec * 13.1094;
              const marathonTime = steadySec * 26.2188;


              return (
                <tr key={v}>
                  <td>{v.toFixed(1)}</td>
                  <td>{p["800m"].time}</td>
                  <td>{p["1600m"].time}</td>
                  <td>{p["3200m"].time}</td>
                  <td>{p["5K"].time}</td>
                  <td>{p["10K"].time}</td>
                  <td>{formatTime(halfMarathonTime)}</td>   {/* moved up */}
                  <td>{formatTime(marathonTime)}</td>       {/* moved up */}
                  <td>{p["Tempo"].perMile}</td>
                  <td>{p["Steady State"].perMile}</td>
                  <td>{p["Easy Pace (Fast)"].perMile}–{p["Easy Pace (Slow)"].perMile}</td>
                </tr>
              );              
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VDOTTablePage;
