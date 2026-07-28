import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ROLES } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Sidebar items per role. `key` must match the tab keys each dashboard
// page defines internally, so clicking a sidebar item switches to that tab.
const ROLE_NAV = {
  customer: [
    { key: "discover", label: "Discover", icon: "🔍" },
    { key: "bookings", label: "My Bookings", icon: "📅" },
    { key: "rentals", label: "Rentals", icon: "🎒" },
    { key: "recommended", label: "For You", icon: "✨" },
  ],
  manager: [
    { key: "overview", label: "Dashboard", icon: "🏠" },
    { key: "bookings", label: "Bookings", icon: "📅" },
    { key: "courts", label: "Courts", icon: "🏸" },
    { key: "equipment", label: "Equipment", icon: "🎒" },
  ],
  owner: [
    { key: "overview", label: "Dashboard", icon: "🏠" },
    { key: "clubs", label: "My Clubs", icon: "🏟️" },
    { key: "managers", label: "Managers", icon: "👥" },
  ],
  super: [
    { key: "overview", label: "Dashboard", icon: "🏠" },
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

// Small helper so each role route owns a single `tab` state that is shared
// between the sidebar (DashboardLayout) and the dashboard page itself.
// This keeps sidebar clicks and the page's own tab bar always in sync.
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
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
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
        </BrowserRouter>
      </PaymentProvider>
    </AuthProvider>
  );
}
