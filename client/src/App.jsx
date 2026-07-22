// ─── APP ROOT ───────────────────────────────────────────────────────────────
// Top-level application component. Wraps everything in AuthProvider and
// BrowserRouter, then defines all routes. Protected routes redirect to /login
// if no user is logged in; role-specific routes check the user's role.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import CustomerDiscover from "./pages/customer/CustomerDiscover";
import CustomerBookings from "./pages/customer/CustomerBookings";
import CustomerRentals from "./pages/customer/CustomerRentals";
import CustomerRecommendations from "./pages/customer/CustomerRecommendations";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import SuperDashboard from "./pages/super/SuperDashboard";

// ─── Sidebar nav definitions per role ──────────────────────────────────────
const CUSTOMER_NAV = [
  { to: "/customer", label: "Discover", icon: "🔍", end: true },
  { to: "/customer/bookings", label: "My Bookings", icon: "📅" },
  { to: "/customer/rentals", label: "Rentals", icon: "🎒" },
  { to: "/customer/recommendations", label: "For You", icon: "⭐" },
];

const MANAGER_NAV = [
  { to: "/manager", label: "Dashboard", icon: "📊", end: true },
];

const OWNER_NAV = [
  { to: "/owner", label: "Dashboard", icon: "📊", end: true },
];

const SUPER_NAV = [
  { to: "/super", label: "Dashboard", icon: "🛡️", end: true },
];

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ─── Public route ─── */}
          <Route path="/login" element={<Login />} />

          {/* ─── Customer routes ─── */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute roles={["customer"]}>
                <DashboardLayout nav={CUSTOMER_NAV} title="Customer" />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDiscover />} />
            <Route path="bookings" element={<CustomerBookings />} />
            <Route path="rentals" element={<CustomerRentals />} />
            <Route path="recommendations" element={<CustomerRecommendations />} />
          </Route>

          {/* ─── Manager routes ─── */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={["manager"]}>
                <DashboardLayout nav={MANAGER_NAV} title="Manager" />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
          </Route>

          {/* ─── Owner routes ─── */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute roles={["owner"]}>
                <DashboardLayout nav={OWNER_NAV} title="Owner" />
              </ProtectedRoute>
            }
          >
            <Route index element={<OwnerDashboard />} />
          </Route>

          {/* ─── Super Admin routes ─── */}
          <Route
            path="/super"
            element={
              <ProtectedRoute roles={["super"]}>
                <DashboardLayout nav={SUPER_NAV} title="Super Admin" />
              </ProtectedRoute>
            }
          >
            <Route index element={<SuperDashboard />} />
          </Route>

          {/* ─── Fallback redirect ─── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
