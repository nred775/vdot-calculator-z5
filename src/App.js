import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PRInput from "./components/PRInput";
import PaceTable from "./components/PaceTable";
import VDOTTablePage from "./components/VDOTTablePage";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react"; // 🌞🌙 icons!

function App() {
  const [vdot, setVdot] = useState(null);
  const [event, setEvent] = useState(null);
  const [inputSeconds, setInputSeconds] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
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
              className="ml-4 p-2 rounded-full border border-purple-500 dark:border-purple-300 hover:bg-purple-100 dark:hover:bg-gray-700 transition"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-purple-300" />
              ) : (
                <Moon className="w-5 h-5 text-purple-500" />
              )}
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
                <AnimatePresence>
                  {vdot !== null && (
                    <motion.div
                      key="vdot-result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="mt-6"
                    >
                      <p className="text-lg text-center text-purple-600 dark:text-purple-300 font-semibold mb-4">
                        Calculated VDOT: {vdot}
                      </p>
                      <PaceTable
                        vdot={vdot}
                        event={event}
                        inputTime={inputSeconds}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
