import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PRInput from "./components/PRInput";
import PaceTable from "./components/PaceTable";
import VDOTTablePage from "./components/VDOTTablePage";

function App() {
  const [vdot, setVdot] = useState(null);
  const [event, setEvent] = useState(null);
  const [inputSeconds, setInputSeconds] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 dark:bg-gray-900 dark:text-gray-100">
        <nav className="mb-8 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-3">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400">VDOT Calculator Z5</h1>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="text-purple-500 dark:text-purple-300 hover:underline">Home</Link>
            <Link to="/table" className="text-purple-500 dark:text-purple-300 hover:underline">VDOT Table</Link>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="ml-4 px-3 py-1 border rounded text-sm border-purple-500 text-purple-500 dark:border-purple-300 dark:text-purple-300"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <PRInput
                  setVdot={setVdot}
                  setEvent={setEvent}
                  setInputSeconds={setInputSeconds}
                />
                {vdot !== null && (
                  <div className="mt-6">
                    <p className="text-lg text-center text-purple-600 dark:text-purple-300 font-semibold mb-4">
                      Calculated VDOT: {vdot}
                    </p>
                    <PaceTable
                      vdot={vdot}
                      event={event}
                      inputTime={inputSeconds}
                    />
                  </div>
                )}
              </div>
            }
          />
          <Route path="/table" element={<VDOTTablePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
