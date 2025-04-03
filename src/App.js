import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PRInput from "./components/PRInput";
import PaceTable from "./components/PaceTable";
import VDOTTablePage from "./components/VDOTTablePage";

function App() {
  const [vdot, setVdot] = useState(null);
  const [event, setEvent] = useState(null);
  const [inputSeconds, setInputSeconds] = useState(null);

  return (
    <Router>
      <div style={{ padding: "2rem" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/table">VDOT Table</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1>VDOT Calculator – Z5</h1>
                <PRInput
                  setVdot={setVdot}
                  setEvent={setEvent}
                  setInputSeconds={setInputSeconds}
                />
                {vdot !== null && (
                  <>
                    <p><strong>Calculated VDOT:</strong> {vdot}</p>
                    <PaceTable
                      vdot={vdot}
                      event={event}
                      inputTime={inputSeconds}
                    />
                  </>
                )}
              </>
            }
          />
          <Route
            path="/table"
            element={<VDOTTablePage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
