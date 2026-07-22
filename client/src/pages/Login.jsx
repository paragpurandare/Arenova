// ─── LOGIN PAGE ─────────────────────────────────────────────────────────────
// Role-selector login page. Since the backend auth isn't wired yet, this
// page lets the user pick a role and "sign in" to explore that dashboard.
// When real auth is ready, replace handleSubmit with an API call.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Input from "../components/ui/Input";

// Role options for the selector cards.
const ROLE_OPTIONS = [
  { key: ROLES.CUSTOMER, label: "Customer", icon: "👤", desc: "Book courts & rent gear", color: "#185FA5", bg: "#E6F1FB" },
  { key: ROLES.MANAGER, label: "Manager", icon: "👔", desc: "Manage daily operations", color: "#BA7517", bg: "#FAEEDA" },
  { key: ROLES.OWNER, label: "Owner", icon: "🏟️", desc: "Own & manage clubs", color: "#1D9E75", bg: "#E1F5EE" },
  { key: ROLES.SUPER, label: "Super Admin", icon: "🛡️", desc: "Platform oversight", color: "#993556", bg: "#FBEAF0" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(ROLES.CUSTOMER);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the user session and redirect to the role's dashboard.
    login({
      name: name || "Guest User",
      email,
      role: selectedRole,
    });
    navigate(`/${selectedRole}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f4f0 0%, #e8f5ef 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "480px",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #1D9E75, #185FA5)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "28px",
              marginBottom: "16px",
            }}
          >
            A
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 800, color: "#08060d" }}>
            Welcome to Arenova
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#888" }}>
            Unified Sports Arena, Rental & Player Experience Platform
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <Field label="Select your role" required>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {ROLE_OPTIONS.map((r) => {
                const isActive = selectedRole === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setSelectedRole(r.key)}
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      border: isActive ? `2px solid ${r.color}` : "1.5px solid #f0ede6",
                      background: isActive ? r.bg : "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "border-color 0.2s, background 0.2s",
                    }}
                  >
                    <div style={{ fontSize: "24px", marginBottom: "6px" }}>{r.icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: isActive ? r.color : "#08060d" }}>{r.label}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Name + email */}
          <Field label="Full Name">
            <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>

          <Button type="submit" fullWidth size="lg" style={{ marginTop: "8px" }}>
            Sign In →
          </Button>
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#888", marginTop: "20px" }}>
          Demo mode — pick any role to explore that dashboard.
        </p>
      </div>
    </div>
  );
}
