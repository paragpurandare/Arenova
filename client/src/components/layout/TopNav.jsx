import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";
import ArenovaLogo from "../common/ArenovaLogo";

const ROLE_LABELS = { customer: "Customer", manager: "Manager", owner: "Owner", super: "Super Admin" };
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
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
        <ArenovaLogo theme="light" height={38} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#08060d" }}>
            {user?.name || "Guest"}
          </div>
          <div style={{ marginTop: "2px" }}>
            <Badge color={rc.color} bg={rc.bg}>{ROLE_LABELS[user?.role] || "User"}</Badge>
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
