// ─── SUPER ADMIN DASHBOARD ──────────────────────────────────────────────────
// Platform-wide admin view. Shows total users, clubs, revenue, and a club
// approval queue. Uses mock data; swap to API calls when backend is ready.
import { useState } from "react";
import { INIT_CLUBS, MANAGERS_POOL, MOCK_BOOKINGS, REVENUE_DATA, MONTHS } from "../../constants/mockData";
import { getSport, STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import TabBar from "../../components/ui/TabBar";

export default function SuperDashboard() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Platform Overview", icon: "🌐" },
    { key: "approvals", label: "Club Approvals", icon: "✅" },
    { key: "users", label: "Users", icon: "👥" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
        Super Admin Dashboard
      </h1>
      <p style={{ fontSize: "15px", color: "#888", marginBottom: "24px" }}>
        Platform-wide oversight and club approval management.
      </p>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab />}
      {tab === "approvals" && <ApprovalsTab />}
      {tab === "users" && <UsersTab />}
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
function OverviewTab() {
  const maxRev = Math.max(...REVENUE_DATA);
  const stats = [
    { label: "Total Clubs", value: INIT_CLUBS.length, icon: "🏟️", color: "#1D9E75", bg: "#E1F5EE" },
    { label: "Total Users", value: 1248, icon: "👥", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Monthly Revenue", value: "₹4.8L", icon: "💰", color: "#993556", bg: "#FBEAF0" },
    { label: "Pending Approvals", value: 2, icon: "⏳", color: "#BA7517", bg: "#FAEEDA" },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#888" }}>{s.label}</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700 }}>Platform Revenue (₹k)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "180px" }}>
          {REVENUE_DATA.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", maxWidth: "32px", borderRadius: "6px 6px 0 0", height: `${(val / maxRev) * 100}%`, background: "linear-gradient(180deg, #993556, #FBEAF0)" }} />
              <span style={{ fontSize: "10px", color: "#888" }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All clubs table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", borderBottom: "1.5px solid #f0ede6" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>All Clubs</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
              <Th>Club</Th><Th>Location</Th><Th>Rating</Th><Th>Courts</Th><Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {INIT_CLUBS.map((club) => (
              <tr key={club.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                <Td style={{ fontWeight: 700 }}>{club.name}</Td>
                <Td>{club.location}</Td>
                <Td>★ {club.rating}</Td>
                <Td>{club.courts.length}</Td>
                <Td><Badge color="#0F6E56" bg="#E1F5EE">Active</Badge></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── APPROVALS TAB ──────────────────────────────────────────────────────────
// Pending club registrations awaiting admin approval.
function ApprovalsTab() {
  // Simulated pending clubs — in production these would come from the backend.
  const pendingClubs = [
    { id: 201, name: "PowerPlay Arena", location: "Hadapsar, Pune", owner: "Vikram Singh", submitted: "Jun 08" },
    { id: 202, name: "Champions Court", location: "Kothrud, Pune", owner: "Meera Desai", submitted: "Jun 09" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
      {pendingClubs.map((club) => (
        <div key={club.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>{club.name}</h4>
            <Badge color="#BA7517" bg="#FAEEDA">Pending</Badge>
          </div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>📍 {club.location}</div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "6px" }}>👤 Owner: {club.owner}</div>
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>📅 Submitted: {club.submitted}</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button size="sm">Approve</Button>
            <Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB">Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── USERS TAB ──────────────────────────────────────────────────────────────
// Platform user summary by role.
function UsersTab() {
  const roles = [
    { role: "Customers", count: 1180, icon: "👤", color: "#185FA5", bg: "#E6F1FB" },
    { role: "Managers", count: MANAGERS_POOL.length, icon: "👔", color: "#BA7517", bg: "#FAEEDA" },
    { role: "Owners", count: 42, icon: "🏟️", color: "#1D9E75", bg: "#E1F5EE" },
    { role: "Admins", count: 3, icon: "🛡️", color: "#993556", bg: "#FBEAF0" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
      {roles.map((r) => (
        <div key={r.role} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "24px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 14px" }}>
            {r.icon}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800, color: r.color, marginBottom: "4px" }}>{r.count}</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#888" }}>{r.role}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Shared table helpers ───────────────────────────────────────────────────
function Th({ children }) {
  return <th style={{ textAlign: "left", padding: "14px 18px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "05px", color: "#888" }}>{children}</th>;
}
function Td({ children, style }) {
  return <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555", ...style }}>{children}</td>;
}
