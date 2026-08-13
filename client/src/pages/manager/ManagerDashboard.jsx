// ─── MANAGER DASHBOARD ──────────────────────────────────────────────────────
// On mount, fetches the authenticated manager's assigned club from the backend
// (GET /api/clubs/manager-club). All tabs use real backend data — no mock data.
import { useState, useEffect, useCallback } from "react";
import { fetchManagerClub }                   from "../../services/clubService";
import { fetchCourts, createCourt, updateCourt } from "../../services/courtService";
import { fetchSlots, blockSlot, unblockSlot } from "../../services/slotService";
import { fetchEquipmentByClub, deactivateEquipment } from "../../services/equipmentService";
import { fetchClubBookings, markRentalPickup, markRentalReturn } from "../../services/bookingService";
import { getSportByType, STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge    from "../../components/ui/Badge";
import Button   from "../../components/ui/Button";
import TabBar   from "../../components/ui/TabBar";
import Modal    from "../../components/ui/Modal";
import CourtConfigModal from "../../components/manager/CourtConfigModal";
import AddCourtModal from "../../components/owner/AddCourtModal";
import AddEquipmentModal from "../../components/manager/AddEquipmentModal";

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
          Managing <strong style={{ color: "#08060d" }}>{club.name}</strong> · {club.location || club.address || "Pune"}
        </p>
      </div>

      <TabBar tabs={TABS} active={activeTab} onChange={setTab} />

      {activeTab === "overview"  && <OverviewTab clubId={club?.id} />}
      {activeTab === "bookings"  && <BookingsTab clubId={club?.id} />}
      {activeTab === "courts"    && <CourtsTab clubId={club?.id} />}
      {activeTab === "equipment" && <EquipmentTab clubId={club?.id} />}
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
function OverviewTab({ clubId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) return;
    let cancelled = false;
    fetchClubBookings(clubId)
      .then((data) => { if (!cancelled) setBookings(data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [clubId]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.slotDate === todayStr);
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const revenue = bookings
    .filter((b) => b.status === "CONFIRMED" && b.slotDate === todayStr)
    .reduce((sum, b) => sum + (b.totalPayable || b.courtAmount || 0), 0);

  const stats = [
    { label: "Today's Bookings", value: todayBookings.length, icon: "📅", color: "#1D9E75", bg: "#E1F5EE" },
    { label: "Confirmed Total",  value: confirmed,            icon: "✅", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Pending",          value: pending,               icon: "⏳", color: "#BA7517", bg: "#FAEEDA" },
    { label: "Revenue Today",    value: `₹${revenue}`,        icon: "💰", color: "#993556", bg: "#FBEAF0" },
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
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>Loading…</div>
        ) : todayBookings.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>No bookings for today.</div>
        ) : todayBookings.map((b) => {
          const statusKey = b.status?.toLowerCase() || "pending";
          return (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0ede6" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#08060d" }}>{b.userName || "Customer"} · {b.sportsType || "Sports"}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>{b.courtName} · {fmtTime(b.startTime)}–{fmtTime(b.endTime)}</div>
              </div>
              <Badge color={STATUS_COLOR[statusKey] || "#1D9E75"} bg={STATUS_BG[statusKey] || "#E1F5EE"}>{b.status}</Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── BOOKINGS TAB ──────────────────────────────────────────────────────────
function BookingsTab({ clubId }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const [rentalAction, setRentalAction] = useState(null);

  const load = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClubBookings(clubId);
      setBookings(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => { load(); }, [load]);

  const handleRentalAction = async (rentalId, action) => {
    setRentalAction(rentalId);
    try {
      if (action === "pickup") await markRentalPickup(rentalId);
      else if (action === "return") await markRentalReturn(rentalId);
      alert(`Rental ${action === "pickup" ? "picked up" : "returned"} successfully!`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || `Failed to ${action} rental.`);
    } finally {
      setRentalAction(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} onRetry={load} />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>All Club Bookings ({bookings.length})</h3>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      {bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No bookings yet for this club.</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
                {["ID","Customer","Court","Date & Time","Amount","QR Code","Status","Rental"].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const statusKey = b.status?.toLowerCase() || "pending";
                const rental = b.rentalOrder;
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                    <Td style={{ fontWeight: 700, color: "#08060d" }}>#{b.id}</Td>
                    <Td>{b.userName || "Customer"}</Td>
                    <Td>
                      <div style={{ fontWeight: 600 }}>{b.courtName}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{b.sportsType}</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 600 }}>{b.slotDate}</div>
                      <div style={{ fontSize: "11px", color: "#888" }}>{fmtTime(b.startTime)}–{fmtTime(b.endTime)}</div>
                    </Td>
                    <Td style={{ fontWeight: 700 }}>₹{b.totalPayable || b.courtAmount}</Td>
                    <Td>
                      <button
                        onClick={() => setQrModal(b)}
                        style={{
                          background: "#E1F5EE", color: "#0F6E56", border: "1px solid #9FE1CB",
                          borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        🔍 Verify
                      </button>
                    </Td>
                    <Td>
                      <Badge color={STATUS_COLOR[statusKey] || "#1D9E75"} bg={STATUS_BG[statusKey] || "#E1F5EE"}>{b.status}</Badge>
                    </Td>
                    <Td>
                      {rental ? (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {rental.status === "PENDING" && (
                            <Button size="sm" disabled={rentalAction === rental.id} onClick={() => handleRentalAction(rental.id, "pickup")}>
                              {rentalAction === rental.id ? "…" : "Mark Pickup"}
                            </Button>
                          )}
                          {rental.status === "ACTIVE" && (
                            <Button size="sm" variant="outline" disabled={rentalAction === rental.id} onClick={() => handleRentalAction(rental.id, "return")}>
                              {rentalAction === rental.id ? "…" : "Mark Return"}
                            </Button>
                          )}
                          {rental.status === "RETURNED" && (
                            <span style={{ fontSize: "11px", color: "#0F6E56", fontWeight: 600 }}>✅ Returned</span>
                          )}
                          {!["PENDING","ACTIVE","RETURNED"].includes(rental.status) && (
                            <span style={{ fontSize: "11px", color: "#888" }}>{rental.status}</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#888" }}>—</span>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Verification Modal */}
      {qrModal && (
        <Modal open={!!qrModal} onClose={() => setQrModal(null)} title="Booking & QR Verification" size="sm">
          <div style={{ textAlign: "center", padding: "8px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "16px", background: "#E1F5EE", color: "#0F6E56",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "28px", marginBottom: "12px"
            }}>🎟️</div>
            <h3 style={{ fontWeight: 700, fontSize: "18px", color: "#08060d", margin: "0 0 4px" }}>{qrModal.clubName || "Arenova Club"}</h3>
            <p style={{ fontSize: "12px", color: "#888", margin: "0 0 16px" }}>{qrModal.courtName} · {qrModal.slotDate}</p>

            <div style={{
              background: "#faf9f6", border: "2px dashed rgba(29,158,117,0.4)", borderRadius: "16px",
              padding: "24px", marginBottom: "16px", display: "flex", flexDirection: "column", alignItems: "center"
            }}>
              <div style={{
                width: "176px", height: "176px", background: "#fff", padding: "12px", borderRadius: "12px",
                border: "1px solid #e0e0e0", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrModal.qrCode || `ARENOVA-BK-${qrModal.id}`)}`}
                  alt="Booking QR Code"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ marginTop: "12px", fontFamily: "monospace", fontWeight: 700, fontSize: "14px", letterSpacing: "1.5px", color: "#08060d" }}>
                {qrModal.qrCode || `ARENOVA-BK-${qrModal.id}`}
              </div>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between", fontSize: "12px", background: "#f8f8f8",
              padding: "12px", borderRadius: "8px", color: "#555", marginBottom: "16px"
            }}>
              <span>Customer: <strong>{qrModal.userName || "—"}</strong></span>
              <span>Status: <strong style={{ color: "#0F6E56" }}>{qrModal.status}</strong></span>
              <span>Paid: <strong>₹{qrModal.totalPayable || qrModal.courtAmount}</strong></span>
            </div>

            {qrModal.rentalOrder && (
              <div style={{ background: "#E6F1FB", borderRadius: "8px", padding: "10px", fontSize: "12px", color: "#185FA5", marginBottom: "12px", textAlign: "left" }}>
                <strong>🎒 Equipment Rental:</strong>
                {qrModal.rentalOrder.items?.map((item, i) => (
                  <div key={i} style={{ marginTop: "2px" }}>• {item.equipmentName} × {item.quantity}</div>
                ))}
                <div style={{ marginTop: "4px" }}>Rental Status: <strong>{qrModal.rentalOrder.status}</strong></div>
              </div>
            )}

            <p style={{ fontSize: "11px", color: "#aaa", margin: 0 }}>
              Scan or verify this QR code to check in the customer for entry & equipment pickup.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}

// ─── COURTS TAB ────────────────────────────────────────────────────────────
function CourtsTab({ clubId }) {
  const [courts,       setCourts]       = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [slotModal,    setSlotModal]    = useState(null);
  const [configModal,  setConfigModal]  = useState(null);
  const [addCourtOpen, setAddCourtOpen] = useState(false);

  const load = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourts(Number(clubId));
      setCourts(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load courts.");
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => { load(); }, [load]);

  const handleSaveConfig = async (court, updatedConfig) => {
    try {
      const payload = {
        name: court.name,
        sportsType: court.sportsType,
        openTime: updatedConfig.openTime,
        closeTime: updatedConfig.closeTime,
        slotDuration: Number(updatedConfig.slotDuration),
        bufferTime: Number(updatedConfig.bufferTime),
        maxPlayers: Number(updatedConfig.maxPlayers),
        active: updatedConfig.active,
      };
      await updateCourt(court.id, payload);
      alert("Court configuration updated successfully!");
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update court configuration.");
    }
  };

  if (loading) return <Spinner />;
  if (error)   return <ErrorBox msg={error} onRetry={load} />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Courts Managed ({courts.length})</h3>
        <Button size="sm" onClick={() => setAddCourtOpen(true)}>+ Add New Court</Button>
      </div>

      {courts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No courts found for this club. Click + Add New Court to add one.</div>
      ) : (
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
                <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#888" }}>{sport?.name || court.sportsType}</p>
                <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#888" }}>
                  {fmtTime(court.openTime)}–{fmtTime(court.closeTime)} · {court.slotDuration}min slots
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button size="sm" variant="outline" style={{ flex: 1 }} onClick={() => setSlotModal({ court })}>
                    Manage Slots
                  </Button>
                  <Button size="sm" variant="outline" style={{ flex: 1 }} onClick={() => setConfigModal(court)}>
                    Edit Config
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {slotModal && (
        <SlotManageModal court={slotModal.court} onClose={() => setSlotModal(null)} />
      )}

      {configModal && (
        <CourtConfigModal
          open={!!configModal}
          court={configModal}
          onClose={() => setConfigModal(null)}
          onSave={handleSaveConfig}
        />
      )}

      <AddCourtModal
        open={addCourtOpen}
        clubId={clubId}
        onClose={() => setAddCourtOpen(false)}
        onSuccess={load}
      />
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
              const bg = isAvail ? "#E1F5EE" : isBlocked ? "#FAEEDA" : slot.status === "BOOKED" ? "#FBEAF0" : "#f0ede6";
              const color = isAvail ? "#0F6E56" : isBlocked ? "#BA7517" : slot.status === "BOOKED" ? "#993556" : "#888";
              return (
                <button
                  key={slot.id}
                  disabled={!canToggle || acting}
                  onClick={() => toggle(slot)}
                  style={{
                    padding: "10px 8px", borderRadius: "10px", border: "1.5px solid " + color + "33",
                    background: bg, cursor: canToggle ? "pointer" : "not-allowed", opacity: acting ? 0.5 : 1,
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: 700, color }}>{fmtTime(slot.startTime)}–{fmtTime(slot.endTime)}</div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color, marginTop: "2px" }}>{slot.status}</div>
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
function EquipmentTab({ clubId }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addEquipOpen, setAddEquipOpen] = useState(false);

  const loadEquipment = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEquipmentByClub(clubId);
      setEquipmentList(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load equipment catalog.");
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this equipment item?")) return;
    try {
      await deactivateEquipment(id);
      await loadEquipment();
    } catch (err) {
      alert(err?.response?.data?.message || "Deactivation failed.");
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} onRetry={loadEquipment} />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>Rental Catalog & Inventory ({equipmentList.length})</h3>
        <Button size="sm" onClick={() => setAddEquipOpen(true)}>+ Add Equipment</Button>
      </div>

      {equipmentList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No equipment configured for this club yet. Click + Add Equipment to list items.</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
                {["ID","Item","Sport Type","Price/Slot","Total Stock","Status","Action"].map((h) => <Th key={h}>{h}</Th>)}
              </tr>
            </thead>
            <tbody>
              {equipmentList.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                  <Td style={{ fontWeight: 700 }}>#{e.id}</Td>
                  <Td>🎒 {e.name}</Td>
                  <Td>{e.sportType || "General"}</Td>
                  <Td>₹{e.pricePerSlot}</Td>
                  <Td>{e.totalStock}</Td>
                  <Td>
                    <Badge color={e.isActive ? "#0F6E56" : "#A32D2D"} bg={e.isActive ? "#E1F5EE" : "#FCEBEB"}>
                      {e.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </Td>
                  <Td>
                    {e.isActive ? (
                      <Button size="sm" variant="outline" onClick={() => handleDeactivate(e.id)}>Deactivate</Button>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#888" }}>—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddEquipmentModal
        open={addEquipOpen}
        clubId={clubId}
        onClose={() => setAddEquipOpen(false)}
        onSuccess={loadEquipment}
      />
    </>
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
