import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, ROLES } from "./context/AuthContext";
import { PaymentProvider } from "./context/PaymentContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const ROLE_NAV = {
  customer: [
    { to: "/customer", label: "Dashboard", icon: "🏠", end: true },
    { to: "/customer", label: "Discover", icon: "🔍" },
    { to: "/customer", label: "Bookings", icon: "📅" },
    { to: "/customer", label: "Rentals", icon: "🎒" },
  ],
  manager: [
    { to: "/manager", label: "Dashboard", icon: "🏠", end: true },
    { to: "/manager", label: "Bookings", icon: "📅" },
    { to: "/manager", label: "Courts", icon: "🏸" },
    { to: "/manager", label: "Equipment", icon: "🎒" },
  ],
  owner: [
    { to: "/owner", label: "Dashboard", icon: "🏠", end: true },
    { to: "/owner", label: "My Clubs", icon: "🏟️" },
    { to: "/owner", label: "Managers", icon: "👥" },
  ],
  super: [
    { to: "/super", label: "Dashboard", icon: "🏠", end: true },
    { to: "/super", label: "Approvals", icon: "✅" },
    { to: "/super", label: "Users", icon: "👥" },
  ],
};

const ROLE_TITLES = {
  customer: "Customer Portal",
  manager: "Manager Portal",
  owner: "Owner Portal",
  super: "Admin Portal",
};

function DashboardPage({ role, children }) {
  return (
    <DashboardLayout nav={ROLE_NAV[role] || []} title={ROLE_TITLES[role]}>
      {children}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/customer" element={
            <ProtectedRoute roles={[ROLES.CUSTOMER]}>
              <DashboardPage role="customer"><CustomerDashboard /></DashboardPage>
            </ProtectedRoute>
          } />

          <Route path="/manager" element={
            <ProtectedRoute roles={[ROLES.MANAGER]}>
              <DashboardPage role="manager"><ManagerDashboard /></DashboardPage>
            </ProtectedRoute>
          } />

          <Route path="/owner" element={
            <ProtectedRoute roles={[ROLES.OWNER]}>
              <DashboardPage role="owner"><OwnerDashboard /></DashboardPage>
            </ProtectedRoute>
          } />

          <Route path="/super" element={
            <ProtectedRoute roles={[ROLES.SUPER]}>
              <DashboardPage role="super"><AdminDashboard /></DashboardPage>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </PaymentProvider>
    </AuthProvider>
  );
}
