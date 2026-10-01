import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MedicalDocuments from "./pages/MedicalDocuments";
import MedicationHistory from "./pages/MedicationHistory";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Registration */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Main application */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/medication-history"
          element={<MedicationHistory />}
        />
        <Route
        path="/medical-documents"
        element={
          <MedicalDocuments />
        }
        
        />
        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;