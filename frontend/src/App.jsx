import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Booking from './pages/booking/Booking';
import AdminDash from './pages/admin-dashboard/AdminDashboard';
import AdminLogin from './pages/admin-dashboard/AdminLogin';
import Commercial from './pages/commercial/Commercial';
import About from './pages/landing/AboutUs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
