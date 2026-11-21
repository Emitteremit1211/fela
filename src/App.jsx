
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Exhibition from "./pages/Exhibition";
import Gallery from "./pages/Gallery";
import Visit from "./pages/Visit";
import WhatsOn from "./pages/WhatsOn";
import Credits from "./pages/Credits";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AcceptInvitation from "./pages/admin/AcceptInvitation";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          {/* Public website */}
          <Route path="/" element={<Home />} />
          <Route path="/exhibition" element={<Exhibition />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/whats-on" element={<WhatsOn />} />
          <Route path="/credits" element={<Credits />} />

          {/* Admin authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/accept-invitation"
            element={<AcceptInvitation />}
          />

          <Route
            path="/admin/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/admin/reset-password"
            element={<ResetPassword />}
          />

          {/* Protected admin dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
