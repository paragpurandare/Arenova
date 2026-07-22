// ─── OWNER DASHBOARD ───────────────────────────────────────────────────────
// Dashboard for club owners. Shows revenue overview, club management, and
// manager assignment. Includes the "Add Club" flow that reuses the existing
// AddClub component with map integration.
import { useState } from "react";
import { INIT_CLUBS, MANAGERS_POOL, REVENUE_DATA, MONTHS } from "../../constants/mockData";
import { getSport } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import TabBar from "../../components/ui/TabBar";
import Modal from "../../components/ui/Modal";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import AddClub from "../../components/AddClub";

export default function OwnerDashboard() {
  const [tab, setTab] = useState("overview");
  const [showAddClub, setShowAddClub] = useState(false);
  const [assignManagerFor, setAssignManagerFor] = useState(null);

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "clubs", label: "My Clubs", icon: "🏟️" },
    { key: "managers", label: "Managers", icon: "👥" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
            Owner Dashboard
          </h1>
          <p style={{ fontSize: "15px", color: "#888" }}>
            Manage your clubs, revenue, and manager assignments.
          </p>
        </div>
        <Button onClick={() => setShowAddClub(true)}>+ Add New Club</Button>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab />}
      {tab === "clubs" && <ClubsTab onAssign={(club) => setAssignManagerFor(club)} />}
      {tab === "managers" && <ManagersTab />}

      {/* Add Club modal — reuses existing AddClub component with map integration */}
      <Modal open={showAddClub} onClose={() => setShowAddClub(false)} title="Register New Club" size="lg">
        <AddClub embedded />
      </Modal>

      {/* Assign Manager modal */}
      <Modal open={!!assignManagerFor} onClose={() => setAssignManagerFor(null)} title="Assign Manager" size="sm">
        {assignManagerFor && (
          <div>
            <p style={{ fontSize: "14px", color: "#888", marginBottom: "16px" }}>
              Select a manager for <strong>{assignManagerFor.name}</strong>
            </p>
            {MANAGERS_POOL.map((m) => (
              <div
                key={m.id}
                onClick={() => setAssignManagerFor(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px", padding: "12px",
                  borderRadius: "10px", border: "1.5px solid #f0ede6", marginBottom: "8px",
                  cursor: "pointer", transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.background = "#E1F5EE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#f0ede6"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#1D9E75" }}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{m.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>{m.email}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
// Revenue chart (CSS bars) + club summary cards.
function OverviewTab() {
  const maxRev = Math.max(...REVENUE_DATA);
  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Clubs", value: INIT_CLUBS.length, icon: "🏟️", color: "#1D9E75", bg: "#E1F5EE" },
          { label: "Monthly Revenue", value: "₹1,24,000", icon: "💰", color: "#993556", bg: "#FBEAF0" },
          { label: "Active Managers", value: MANAGERS_POOL.length, icon: "👥", color: "#185FA5", bg: "#E6F1FB" },
          { label: "Total Courts", value: INIT_CLUBS.reduce((a, c) => a + c.courts.length, 0), icon: "🏸", color: "#BA7517", bg: "#FAEEDA" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#888" }}>{s.label}</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "24px" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700 }}>Monthly Revenue (₹k)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "180px" }}>
          {REVENUE_DATA.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "100%", maxWidth: "32px", borderRadius: "6px 6px 0 0",
                  height: `${(val / maxRev) * 100}%`,
                  background: "linear-gradient(180deg, #1D9E75, #E1F5EE)",
                  transition: "height 0.3s ease",
                }}
              />
              <span style={{ fontSize: "10px", color: "#888" }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CLUBS TAB ──────────────────────────────────────────────────────────────
// Owner's clubs list with manager assignment + court count.
function ClubsTab({ onAssign }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
      {INIT_CLUBS.map((club) => (
        <div key={club.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflow: "hidden" }}>
          <div style={{ height: "100px", background: "linear-gradient(135deg, #1D9E75, #185FA5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>🏟️</div>
          <div style={{ padding: "18px" }}>
            <h4 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 700 }}>{club.name}</h4>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#888" }}>{club.location}</p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
              {club.courts.map((c) => {
                const s = getSport(c.sportId);
                return <Badge key={c.id} color={s?.color} bg={s?.bg}>{s?.icon} {s?.name}</Badge>;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #f0ede6" }}>
              <div style={{ fontSize: "13px", color: "#888" }}>
                Manager: <strong style={{ color: club.managerId ? "#08060d" : "#A32D2D" }}>
                  {club.managerId ? MANAGERS_POOL.find((m) => m.id === club.managerId)?.name : "Unassigned"}
                </strong>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAssign(club)}>
                {club.managerId ? "Reassign" : "Assign"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MANAGERS TAB ───────────────────────────────────────────────────────────
// List of all managers with their assigned clubs.
function ManagersTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
      {MANAGERS_POOL.map((m) => {
        const assignedClub = INIT_CLUBS.find((c) => c.managerId === m.id);
        return (
          <div key={m.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "#1D9E75" }}>
                {m.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>{m.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{m.email}</div>
              </div>
            </div>
            <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Phone: {m.phone}</div>
            <div style={{ fontSize: "13px", color: "#888" }}>
              Assigned to: <Badge color={assignedClub ? "#1D9E75" : "#A32D2D"} bg={assignedClub ? "#E1F5EE" : "#FCEBEB"}>
                {assignedClub ? assignedClub.name : "No club"}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
