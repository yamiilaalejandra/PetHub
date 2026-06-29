import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Success from "./pages/Success";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AppointmentDetail from "./pages/AppointmentDetail";
import AppointmentHistory from "./pages/AppointmentHistory";
import AppointmentEdit from "./pages/AppointmentEdit";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTurnos from "./pages/AdminTurnos";
import AccessDenied from "./pages/AccessDenied";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/reservar"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-reservas"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute>
              <AppointmentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/history"
          element={
            <ProtectedRoute>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/edit/:id"
          element={
            <ProtectedRoute>
              <AppointmentEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/turnos"
          element={
            <ProtectedRoute requireAdmin>
              <AdminTurnos />
            </ProtectedRoute>
          }
        />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;
