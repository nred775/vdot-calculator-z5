import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

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
    "1600m": "bg-[#4ade80] dark:bg-purple-900/40",       
    "3200m": "bg-[#4ade80] dark:bg-purple-900/40",
    "5K": "bg-[#4ade80] dark:bg-purple-900/40",
    "10K": "bg-[#fde047] dark:bg-indigo-900/40",          
    "Tempo": "bg-[#facc15] dark:bg-blue-900/40",         
    "Steady State": "bg-[#86efac] dark:bg-cyan-900/40",   
    "Half Marathon": "bg-[#38bdf8] dark:bg-teal-900/40",  
    "Marathon": "bg-[#38bdf8] dark:bg-teal-900/40",
    "Wheel": "bg-[#a78bfa] dark:bg-emerald-900/40",      
    "Distance": "bg-[#f9a8d4] dark:bg-gray-800/40",      
  };
  return styles[label] || "";
};

function formatTime(seconds) {
  seconds = Math.round(seconds);
  let hrs = Math.floor(seconds / 3600);
  let mins = Math.floor((seconds % 3600) / 60);
  let secs = seconds % 60;

  if (secs === 60) {
    secs = 0;
    mins += 1;
  }
  if (mins === 60) {
    mins = 0;
    hrs += 1;
  }

  return hrs > 0
    ? `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${mins}:${secs.toString().padStart(2, "0")}`;
}


function calculatePaces(vdot) {
  const paces = {};
  for (const [label, { factor, exponent, distance }] of Object.entries(PACE_FORMULAS)) {
    const seconds = factor * Math.pow(vdot, exponent);
    if (distance) {
      const perMile = seconds / distance;
      const perKm = perMile / 1.60934;
      paces[label] = {
        time: formatTime(seconds),
        perMile: formatTime(perMile),
        perKm: formatTime(perKm),
      };
    } else {
      const perMile = seconds;
      const perKm = perMile / 1.60934;
      paces[label] = {
        perMile: formatTime(perMile),
        perKm: formatTime(perKm),
      };
    }
  }
  return paces;
}

function VDOTTablePage() {
  const vdotList = [];
  for (let v = 85.0; v >= 30.0; v -= 0.1) {
    vdotList.push(Number(v.toFixed(1)));
  }

  const handleDownload = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });

    const headers = [
      "VDOT", "1600m", "3200m", "5K", "10K",
      "Half Marathon", "Marathon",
      "Tempo (mi)", "Tempo (km)",
      "Steady (mi)", "Steady (km)",
      "Wheel (mi)", "Wheel (km)",
      "Distance (mi)", "Distance (km)",
    ];

    const tableBody = vdotList.map((v) => {
      const p = calculatePaces(v);
      const tempoSec = PACE_FORMULAS["Tempo"].factor * Math.pow(v, PACE_FORMULAS["Tempo"].exponent);
      const steadySec = PACE_FORMULAS["Steady State"].factor * Math.pow(v, PACE_FORMULAS["Steady State"].exponent);
      return [
        v.toFixed(1),
        p["1600m"].time,
        p["3200m"].time,
        p["5K"].time,
        p["10K"].time,
        formatTime(tempoSec * 13.1094),
        formatTime(steadySec * 26.2188),
        p["Tempo"].perMile,
        p["Tempo"].perKm,
        p["Steady State"].perMile,
        p["Steady State"].perKm,
        p["Wheel"].perMile,
        p["Wheel"].perKm,
        `${p["Distance (Fast)"].perMile}–${p["Distance (Slow)"].perMile}`,
        `${p["Distance (Fast)"].perKm}–${p["Distance (Slow)"].perKm}`,
      ];
    });

    autoTable(doc, {
      head: [headers],
      body: tableBody,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [111, 76, 255],
        textColor: 255,
      },
      margin: { top: 40, bottom: 40, left: 30, right: 30 },
      theme: "grid",
    });

    doc.save("vdot-table.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-center mb-4 text-purple-700 dark:text-purple-300">Full VDOT Table</h2>
      <div className="text-center mb-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Download PDF
        </button>
      </div>

      <div className="overflow-x-auto max-h-[70vh] rounded-xl shadow border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 sticky top-0 z-10 shadow-md">
            <tr>
              {["VDOT", "1600m", "3200m", "5K", "10K",
                "Half Marathon", "Marathon",
                "Tempo (mi)", "Tempo (km)",
                "Steady (mi)", "Steady (km)",
                "Wheel (mi)", "Wheel (km)",
                "Distance (mi)", "Distance (km)",
              ].map((heading) => (
                <th
                  key={heading}
                  className={`text-center px-2 py-2 border border-gray-300 dark:border-gray-600 ${
                    heading === "VDOT" ? "bg-[#1e40af] text-white" : ""
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {vdotList.map((v) => {
              const p = calculatePaces(v);
              const tempoSec = PACE_FORMULAS["Tempo"].factor * Math.pow(v, PACE_FORMULAS["Tempo"].exponent);
              const steadySec = PACE_FORMULAS["Steady State"].factor * Math.pow(v, PACE_FORMULAS["Steady State"].exponent);
              const halfTime = formatTime(tempoSec * 13.1094);
              const fullTime = formatTime(steadySec * 26.2188);

              return (
                <tr key={v}>
                  <td className="px-2 py-1 text-center border font-semibold bg-[#1e40af] text-white">
                    {v.toFixed(1)}
                  </td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("1600m")}`}>{p["1600m"].time}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("3200m")}`}>{p["3200m"].time}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("5K")}`}>{p["5K"].time}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("10K")}`}>{p["10K"].time}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Half Marathon")}`}>{halfTime}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Marathon")}`}>{fullTime}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Tempo")}`}>{p["Tempo"].perMile}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Tempo")}`}>{p["Tempo"].perKm}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Steady State")}`}>{p["Steady State"].perMile}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Steady State")}`}>{p["Steady State"].perKm}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Wheel")}`}>{p["Wheel"].perMile}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Wheel")}`}>{p["Wheel"].perKm}</td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Distance")}`}>
                    {p["Distance (Fast)"].perMile}–{p["Distance (Slow)"].perMile}
                  </td>
                  <td className={`px-2 py-1 text-center border ${getRowClass("Distance")}`}>
                    {p["Distance (Fast)"].perKm}–{p["Distance (Slow)"].perKm}
                  </td>
                </tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}

export default VDOTTablePage;