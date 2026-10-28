import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ConfigProvider } from './context/ConfigContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import AtelierChatbot from './components/AtelierChatbot';
import HomePage from './pages/HomePage';
import CategoryGridPage from './pages/CategoryGridPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BulkOrdersPage from './pages/BulkOrdersPage';
import EthnicWearPage from './pages/EthnicWearPage';
import BespokeTailoringPage from './pages/BespokeTailoringPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Protected Route Guard for Admin Area
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

// Main App Layout Wrapper to hide public Navbar/Footer on Admin screens
function AppLayout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EC] text-[#2B211D] font-sans selection:bg-[#5C1A21] selection:text-[#FBF6EC]">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ethnic-wear" element={<EthnicWearPage />} />
          <Route path="/bespoke-tailoring" element={<BespokeTailoringPage />} />
          <Route path="/category/:categoryId" element={<CategoryGridPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/bespoke-process" element={<Navigate to="/bespoke-tailoring" replace />} />
          <Route path="/bulk-orders" element={<BulkOrdersPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <AppointmentModal />
      <AtelierChatbot />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </AdminAuthProvider>
    </ConfigProvider>
  );
}
