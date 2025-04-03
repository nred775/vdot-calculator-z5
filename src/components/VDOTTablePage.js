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

function VDOTTablePage() {
  const vdotList = [];
  for (let v = 75.0; v >= 30.0; v -= 0.1) {
    vdotList.push(Number(v.toFixed(1)));
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-6 text-purple-700 dark:text-purple-300">Full VDOT Table</h2>
      <div className="overflow-x-auto rounded-xl shadow border border-gray-300 dark:border-gray-700">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <tr>
              {[
                "VDOT",
                "800m",
                "1600m",
                "3200m",
                "5K",
                "10K",
                "Half Marathon",
                "Marathon",
                "Tempo",
                "Steady State",
                "Easy Pace",
              ].map((heading) => (
                <th
                  key={heading}
                  className="text-center px-2 py-2 border border-gray-300 dark:border-gray-600"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vdotList.map((v) => {
              const p = calculatePaces(v);
              const tempoSec = PACE_FORMULAS["Tempo"].factor * Math.pow(v, PACE_FORMULAS["Tempo"].exponent);
              const steadySec = PACE_FORMULAS["Steady State"].factor * Math.pow(v, PACE_FORMULAS["Steady State"].exponent);
              const halfMarathonTime = tempoSec * 13.1094;
              const marathonTime = steadySec * 26.2188;

              return (
                <tr
                  key={v}
                  className="even:bg-gray-50 dark:even:bg-gray-900 hover:bg-purple-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{v.toFixed(1)}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["800m"].time}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["1600m"].time}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["3200m"].time}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["5K"].time}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["10K"].time}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{formatTime(halfMarathonTime)}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{formatTime(marathonTime)}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["Tempo"].perMile}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">{p["Steady State"].perMile}</td>
                  <td className="px-2 py-1 text-center border border-gray-200 dark:border-gray-700">
                    {p["Easy Pace (Fast)"].perMile}–{p["Easy Pace (Slow)"].perMile}
                  </td>
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
