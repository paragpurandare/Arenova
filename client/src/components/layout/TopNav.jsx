// ─── TOP NAV ────────────────────────────────────────────────────────────────
// Top navigation bar shown on every dashboard page. Shows the Arenova logo,
// the current user's name + role badge, and a logout button.
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../../context/AuthContext";
import Badge from "../ui/Badge";

// Map role → display label
const ROLE_LABELS = {
  customer: "Customer",
  manager: "Manager",
  owner: "Owner",
  super: "Super Admin",
};

// Map role → badge color
const ROLE_COLORS = {
  customer: { color: "#185FA5", bg: "#E6F1FB" },
  manager: { color: "#BA7517", bg: "#FAEEDA" },
  owner: { color: "#1D9E75", bg: "#E1F5EE" },
  super: { color: "#993556", bg: "#FBEAF0" },
};

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const rc = ROLE_COLORS[user?.role] || { color: "#555", bg: "#f0f0f0" };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0ede6",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1D9E75, #185FA5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: "18px",
          }}
        >
          A
        </div>
        <span style={{ fontSize: "20px", fontWeight: 800, color: "#08060d", letterSpacing: "-0.5px" }}>
          Arenova
        </span>
      </div>

      {/* User info + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#08060d" }}>
            {user?.name || "Guest"}
          </div>
          <div style={{ marginTop: "2px" }}>
            <Badge color={rc.color} bg={rc.bg}>
              {ROLE_LABELS[user?.role] || "User"}
            </Badge>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "1.5px solid #e5e4e7",
            background: "#fff",
            color: "#555",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
