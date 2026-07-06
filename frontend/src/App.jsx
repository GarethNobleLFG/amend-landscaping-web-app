import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Booking from './pages/booking/Booking';
import AdminDash from './pages/admin-dashboard/AdminDashboard';
import AdminLogin from './pages/admin-dashboard/AdminLogin';
import Commercial from './pages/commercial/Commercial';
import About from './pages/landing/AboutUs';
import Footer from './components/Footer';
import Pricing from './pages/landing/Pricing';
import Policies from './pages/landing/Policies';
import Privacy from './pages/Privacy'; 
import Terms from './pages/Terms';  

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/commercial" element={<Commercial />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>      
      {!isAdminPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;