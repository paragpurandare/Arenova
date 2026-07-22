// ─── MANAGER DASHBOARD ──────────────────────────────────────────────────────
// Main dashboard for club managers. Shows overview stats, today's bookings,
// court management, and equipment inventory. Uses mock data; swap to API calls
// when backend endpoints are ready.
import { useState } from "react";
import { MOCK_BOOKINGS, RENTAL_ORDERS, EQUIPMENT_CATALOG, INIT_CLUBS } from "../../constants/mockData";
import { getSport, STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import TabBar from "../../components/ui/TabBar";

export default function ManagerDashboard() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "bookings", label: "Bookings", icon: "📅" },
    { key: "courts", label: "Courts", icon: "🏸" },
    { key: "equipment", label: "Equipment", icon: "🎒" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
        Manager Dashboard
      </h1>
      <p style={{ fontSize: "15px", color: "#888", marginBottom: "24px" }}>
        Manage bookings, courts, and equipment for your club.
      </p>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && <OverviewTab />}
      {tab === "bookings" && <BookingsTab />}
      {tab === "courts" && <CourtsTab />}
      {tab === "equipment" && <EquipmentTab />}
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
// Quick stats cards + today's booking summary.
function OverviewTab() {
  const todayBookings = MOCK_BOOKINGS.filter((b) => b.status === "confirmed");
  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: "📅", color: "#1D9E75", bg: "#E1F5EE" },
    { label: "Active Rentals", value: RENTAL_ORDERS.filter((r) => r.status === "active").length, icon: "🎒", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Pending Approvals", value: MOCK_BOOKINGS.filter((b) => b.status === "pending").length, icon: "⏳", color: "#BA7517", bg: "#FAEEDA" },
    { label: "Revenue Today", value: "₹3,200", icon: "💰", color: "#993556", bg: "#FBEAF0" },
  ];

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#888" }}>{s.label}</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Today's bookings list */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>Today's Bookings</h3>
        {todayBookings.map((b) => (
          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0ede6" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#08060d" }}>{b.user} · {b.sport}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{b.court} · {b.time}</div>
            </div>
            <Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>{b.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BOOKINGS TAB ──────────────────────────────────────────────────────────
// Full booking table with approve/reject actions for pending bookings.
function BookingsTab() {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
            <Th>ID</Th><Th>Customer</Th><Th>Sport</Th><Th>Court</Th><Th>Time</Th><Th>Status</Th><Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {MOCK_BOOKINGS.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid #f0ede6" }}>
              <Td style={{ fontWeight: 700 }}>{b.id}</Td>
              <Td>{b.user}</Td>
              <Td>{b.sport}</Td>
              <Td>{b.court}</Td>
              <Td>{b.time}</Td>
              <Td><Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>{b.status}</Badge></Td>
              <Td>
                {b.status === "pending" ? (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB">Reject</Button>
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", color: "#888" }}>—</span>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── COURTS TAB ────────────────────────────────────────────────────────────
// Court management grid with toggle active/inactive.
function CourtsTab() {
  const club = INIT_CLUBS[0]; // Manager's club
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
      {club.courts.map((court) => {
        const sport = getSport(court.sportId);
        return (
          <div key={court.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ fontSize: "28px" }}>{sport?.icon}</div>
              <Badge color={court.config.active ? "#0F6E56" : "#888"} bg={court.config.active ? "#E1F5EE" : "#f0ede6"}>
                {court.config.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}>{court.name}</h4>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#888" }}>{sport?.name}</p>
            <div style={{ fontSize: "12px", color: "#888", marginBottom: "14px" }}>
              {court.config.openTime}–{court.config.closeTime} · {court.config.slotDuration}min slots
            </div>
            <Button size="sm" variant="outline" fullWidth>{court.config.active ? "Deactivate" : "Activate"}</Button>
          </div>
        );
      })}
    </div>
  );
}

// ─── EQUIPMENT TAB ─────────────────────────────────────────────────────────
// Equipment inventory table with stock and availability counts.
function EquipmentTab() {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
            <Th>ID</Th><Th>Item</Th><Th>Sport</Th><Th>Price/hr</Th><Th>Stock</Th><Th>Available</Th><Th>Condition</Th>
          </tr>
        </thead>
        <tbody>
          {EQUIPMENT_CATALOG.map((e) => {
            const sport = getSport(e.sportId);
            return (
              <tr key={e.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                <Td style={{ fontWeight: 700 }}>{e.id}</Td>
                <Td>{e.icon} {e.name}</Td>
                <Td><Badge color={sport?.color} bg={sport?.bg}>{sport?.name}</Badge></Td>
                <Td>₹{e.pricePerHour}</Td>
                <Td>{e.stock}</Td>
                <Td>
                  <Badge color={e.available > 0 ? "#0F6E56" : "#A32D2D"} bg={e.available > 0 ? "#E1F5EE" : "#FCEBEB"}>
                    {e.available} left
                  </Badge>
                </Td>
                <Td>{e.condition}</Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Shared table helpers ───────────────────────────────────────────────────
function Th({ children }) {
  return <th style={{ textAlign: "left", padding: "14px 18px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#888" }}>{children}</th>;
}
function Td({ children, style }) {
  return <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555", ...style }}>{children}</td>;
}
