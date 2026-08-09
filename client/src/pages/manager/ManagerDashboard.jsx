// ─── MANAGER DASHBOARD ──────────────────────────────────────────────────────
// On mount, fetches the authenticated manager's assigned club from the backend
// (GET /api/clubs/manager-club). If the manager hasn't been assigned to a
// club yet, shows a clear empty state instead of faking data.
import { useState, useEffect, useCallback } from "react";
import { fetchManagerClub }                   from "../../services/clubService";
import { fetchCourts }                        from "../../services/courtService";
import { fetchSlots, blockSlot, unblockSlot } from "../../services/slotService";
import { getSportByType, STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import { MOCK_BOOKINGS, RENTAL_ORDERS, EQUIPMENT_CATALOG } from "../../constants/mockData";
import Badge    from "../../components/ui/Badge";
import Button   from "../../components/ui/Button";
import TabBar   from "../../components/ui/TabBar";
import Modal    from "../../components/ui/Modal";

const TABS = [
  { key: "overview",  label: "Overview",  icon: "📊" },
  { key: "bookings",  label: "Bookings",  icon: "📅" },
  { key: "courts",    label: "Courts",    icon: "🏸" },
  { key: "equipment", label: "Equipment", icon: "🎒" },
];

export default function ManagerDashboard({ tab: activeTab, setTab }) {
  // club comes from the backend (authenticated manager's assignment)
  const [club,        setClub]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [notAssigned,  setNotAssigned]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchManagerClub()
      .then((data) => {
        if (!cancelled) { setClub(data); setLoading(false); }
      })
      .catch(() => {
        // Most likely: this manager hasn't been assigned to a club yet.
        if (!cancelled) { setNotAssigned(true); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div style={{ padding: "60px", textAlign: "center", color: "#888" }}>Fetching your club assignment…</div>;
  }

  if (notAssigned) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#888" }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏟️</div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#08060d", margin: "0 0 8px" }}>
          You haven't been assigned to a club yet
        </h2>
        <p style={{ fontSize: "14px", maxWidth: "360px", margin: "0 auto" }}>
          Ask your club owner to assign you as a manager from their Owner Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
          Manager Dashboard
        </h1>
        <p style={{ fontSize: "15px", color: "#888" }}>
          Managing <strong style={{ color: "#08060d" }}>{club.name}</strong>
        </p>
      </div>

      <TabBar tabs={TABS} active={activeTab} onChange={setTab} />

      {activeTab === "overview"  && <OverviewTab />}
      {activeTab === "bookings"  && <BookingsTab />}
      {activeTab === "courts"    && <CourtsTab clubId={club?.id} />}
      {activeTab === "equipment" && <EquipmentTab />}
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
function OverviewTab() {
  const todayBookings = MOCK_BOOKINGS.filter((b) => b.status === "confirmed");
  const stats = [
    { label: "Today's Bookings",  value: todayBookings.length,                                      icon: "📅", color: "#1D9E75", bg: "#E1F5EE" },
    { label: "Active Rentals",    value: RENTAL_ORDERS.filter((r) => r.status === "active").length,  icon: "🎒", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Pending Approvals", value: MOCK_BOOKINGS.filter((b) => b.status === "pending").length, icon: "⏳", color: "#BA7517", bg: "#FAEEDA" },
    { label: "Revenue Today",     value: "₹3,200",                                                  icon: "💰", color: "#993556", bg: "#FBEAF0" },
  ];
  return (
    <div>
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
function BookingsTab() {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
            {["ID","Customer","Sport","Court","Time","Status","Action"].map((h) => <Th key={h}>{h}</Th>)}
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
                    <Button size="sm" variant="outline">Reject</Button>
                  </div>
                ) : <span style={{ fontSize: "12px", color: "#888" }}>—</span>}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── COURTS TAB ────────────────────────────────────────────────────────────
function CourtsTab({ clubId }) {
  const [courts,    setCourts]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [slotModal, setSlotModal] = useState(null);

  const load = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourts(Number(clubId));
      setCourts(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courts.");
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox msg={error} onRetry={load} />;
  if (courts.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No courts found for this club.</div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {courts.map((court) => {
          const sport = getSportByType(court.sportsType);
          return (
            <div key={court.id} style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <div style={{ fontSize: "28px" }}>{sport?.icon || "🏸"}</div>
                <Badge color={court.active ? "#0F6E56" : "#888"} bg={court.active ? "#E1F5EE" : "#f0ede6"}>
                  {court.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 700 }}>{court.name}</h4>
              <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#888" }}>{sport?.name}</p>
              <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#888" }}>
                {fmtTime(court.openTime)}–{fmtTime(court.closeTime)} · {court.slotDuration}min slots
              </p>
              <Button size="sm" variant="outline" fullWidth onClick={() => setSlotModal({ court })}>
                Manage Slots
              </Button>
            </div>
          );
        })}
      </div>

      {slotModal && (
        <SlotManageModal court={slotModal.court} onClose={() => setSlotModal(null)} />
      )}
    </>
  );
}

// ─── SLOT MANAGE MODAL ──────────────────────────────────────────────────────
function SlotManageModal({ court, onClose }) {
  const today = isoToday();
  const [date,     setDate]     = useState(today);
  const [slots,    setSlots]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchSlots(court.id, date);
      setSlots(data || []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [court.id, date]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (slot) => {
    setActingId(slot.id);
    try {
      if (slot.status === "AVAILABLE") await blockSlot(slot.id);
      else if (slot.status === "BLOCKED") await unblockSlot(slot.id);
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Slots — ${court.name}`} size="lg">
      <div style={{ marginBottom: "16px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label style={{ fontSize: "13px", fontWeight: 600, color: "#3a3a3a" }}>Date:</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #e0ddd7", fontSize: "14px" }}
        />
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ fontSize: "12px", color: "#888", marginBottom: "12px" }}>
            Click <strong>AVAILABLE</strong> to block · Click <strong>BLOCKED</strong> to unblock
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
            {slots.length === 0 ? (
              <p style={{ gridColumn: "1/-1", color: "#888", fontSize: "13px" }}>No slots for this date.</p>
            ) : slots.map((slot) => {
              const isAvail   = slot.status === "AVAILABLE";
              const isBlocked = slot.status === "BLOCKED";
              const canToggle = isAvail || isBlocked;
              const acting    = actingId === slot.id;
              return (
                <button
                  key={slot.id}
                  disabled={!canToggle || acting}
                  onClick={() => toggle(slot)}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "8px",
                    border: "1.5px solid",
                    borderColor: isAvail ? "#1D9E75" : isBlocked ? "#888" : "transparent",
                    background: STATUS_BG[slot.status] || STATUS_BG[slot.status?.toLowerCase()] || "#f0f0f0",
                    color:      STATUS_COLOR[slot.status] || STATUS_COLOR[slot.status?.toLowerCase()] || "#555",
                    fontSize: "12px", fontWeight: 600, cursor: canToggle ? "pointer" : "default",
                    opacity: acting ? 0.6 : 1, textAlign: "center",
                  }}
                >
                  <div>{fmtTime(slot.startTime)}–{fmtTime(slot.endTime)}</div>
                  <div style={{ fontSize: "10px", marginTop: "3px" }}>{acting ? "…" : slot.status}</div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── EQUIPMENT TAB ─────────────────────────────────────────────────────────
function EquipmentTab() {
  return (
    <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
            {["ID","Item","Price/hr","Stock","Available","Condition"].map((h) => <Th key={h}>{h}</Th>)}
          </tr>
        </thead>
        <tbody>
          {EQUIPMENT_CATALOG.map((e) => (
            <tr key={e.id} style={{ borderBottom: "1px solid #f0ede6" }}>
              <Td style={{ fontWeight: 700 }}>{e.id}</Td>
              <Td>{e.icon} {e.name}</Td>
              <Td>₹{e.pricePerHour}</Td>
              <Td>{e.stock}</Td>
              <Td>
                <Badge color={e.available > 0 ? "#0F6E56" : "#A32D2D"} bg={e.available > 0 ? "#E1F5EE" : "#FCEBEB"}>
                  {e.available} left
                </Badge>
              </Td>
              <Td>{e.condition}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────
function Th({ children }) {
  return <th style={{ textAlign: "left", padding: "14px 18px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#888" }}>{children}</th>;
}
function Td({ children, style }) {
  return <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555", ...style }}>{children}</td>;
}
function Spinner() {
  return <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading…</div>;
}
function ErrorBox({ msg, onRetry }) {
  return (
    <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "16px", borderRadius: "12px" }}>
      {msg} {onRetry && <button onClick={onRetry} style={{ marginLeft: "8px", textDecoration: "underline", background: "none", border: "none", color: "#A32D2D", cursor: "pointer" }}>Retry</button>}
    </div>
  );
}
function fmtTime(t) {
  if (!t) return "";
  return String(t).substring(0, 5);
}
function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
