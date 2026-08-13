import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ROLES } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy-loaded pages for optimized chunking and fast initial port load
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const ROLE_NAV = {
  customer: [
    { key: "discover", label: "Discover", icon: "🔍" },
    { key: "bookings", label: "My Bookings", icon: "📅" },
    { key: "rentals", label: "Rentals", icon: "🎒" },
    { key: "recommended", label: "For You", icon: "✨" },
  ],
  manager: [
    { key: "overview", label: "Dashboard", icon: "📊" },
    { key: "bookings", label: "Bookings", icon: "📅" },
    { key: "courts", label: "Courts", icon: "🏸" },
    { key: "equipment", label: "Equipment", icon: "🎒" },
  ],
  owner: [
    { key: "overview", label: "Dashboard", icon: "📊" },
    { key: "clubs", label: "My Clubs", icon: "🏟️" },
    { key: "managers", label: "Managers", icon: "👥" },
  ],
  super: [
    { key: "overview", label: "Dashboard", icon: "📊" },
    { key: "approvals", label: "Club Approvals", icon: "✅" },
    { key: "users", label: "Users", icon: "👥" },
  ],
};

const ROLE_TITLES = {
  customer: "Customer Portal",
  manager: "Manager Portal",
  owner: "Owner Portal",
  super: "Admin Portal",
};

function RoleDashboard({ role, Page, defaultTab }) {
  const [tab, setTab] = useState(defaultTab);

  return (
    <DashboardLayout nav={ROLE_NAV[role]} title={ROLE_TITLES[role]} activeTab={tab} onNavClick={setTab}>
      <Page tab={tab} setTab={setTab} />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#faf9f6]"><LoadingSpinner /></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              <Route path="/customer" element={
                <ProtectedRoute roles={[ROLES.CUSTOMER]}>
                  <RoleDashboard role="customer" Page={CustomerDashboard} defaultTab="discover" />
                </ProtectedRoute>
              } />

              <Route path="/manager" element={
                <ProtectedRoute roles={[ROLES.MANAGER]}>
                  <RoleDashboard role="manager" Page={ManagerDashboard} defaultTab="overview" />
                </ProtectedRoute>
              } />

              <Route path="/owner" element={
                <ProtectedRoute roles={[ROLES.OWNER]}>
                  <RoleDashboard role="owner" Page={OwnerDashboard} defaultTab="overview" />
                </ProtectedRoute>
              } />

              <Route path="/super" element={
                <ProtectedRoute roles={[ROLES.SUPER]}>
                  <RoleDashboard role="super" Page={AdminDashboard} defaultTab="overview" />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PaymentProvider>
    </AuthProvider>
  );
}
