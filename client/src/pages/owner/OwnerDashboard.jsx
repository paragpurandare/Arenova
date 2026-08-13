// ─── OWNER DASHBOARD ───────────────────────────────────────────────────────
// Fetches clubs from the backend (GET /api/clubs?ownerId=).
// Each club card has court management: view/add/edit courts.
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchOwnerClubs, assignManager } from "../../services/clubService";
import { fetchCourts } from "../../services/courtService";
import { getManagers } from "../../services/authService";
import { getSportByType } from "../../constants/sports";
import { REVENUE_DATA, MONTHS } from "../../constants/mockData";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import TabBar from "../../components/ui/TabBar";
import Modal from "../../components/ui/Modal";
import AddClub from "../../components/AddClub";
import AddCourtModal from "../../components/owner/AddCourtModal";
import EditCourtModal from "../../components/owner/EditCourtModal";
import AssignManagerModal from "../../components/owner/AssignManagerModal";

const TABS = [
  { key: "overview", label: "Overview", icon: "📊" },
  { key: "clubs", label: "My Clubs", icon: "🏟️" },
  { key: "managers", label: "Managers", icon: "👥" },
];

export default function OwnerDashboard({ tab: activeTab, setTab }) {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(false);
  const [clubError, setClubError] = useState(null);
  const [showAddClub, setShowAddClub] = useState(false);
  const [assignFor, setAssignFor] = useState(null);

  const loadClubs = useCallback(async () => {
    if (!user?.id) return;
    setLoadingClubs(true);
    setClubError(null);
    try {
      const data = await fetchOwnerClubs(user.id);
      setClubs(data || []);
    } catch (err) {
      setClubError(err.response?.data?.message || "Failed to load clubs.");
    } finally {
      setLoadingClubs(false);
    }
  }, [user?.id]);

  useEffect(() => { loadClubs(); }, [loadClubs]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
            Owner Dashboard
          </h1>
          <p style={{ fontSize: "15px", color: "#888" }}>
            Manage your clubs, courts, and managers.
          </p>
        </div>
        <Button onClick={() => setShowAddClub(true)}>+ Add New Club</Button>
      </div>

      <TabBar tabs={TABS} active={activeTab} onChange={setTab} />

      {activeTab === "overview" && <OverviewTab clubs={clubs} />}
      {activeTab === "clubs" && (
        <ClubsTab
          clubs={clubs}
          loading={loadingClubs}
          error={clubError}
          onRefresh={loadClubs}
          onAssign={(club) => setAssignFor(club)}
        />
      )}
      {activeTab === "managers" && <ManagersTab clubs={clubs} />}

      {/* Add Club modal */}
      <Modal open={showAddClub} onClose={() => setShowAddClub(false)} title="Register New Club" size="lg">
        <AddClub embedded />
      </Modal>

      {/* Assign Manager modal */}
      <AssignManagerModal
        club={assignFor}
        onClose={() => setAssignFor(null)}
        onAssigned={loadClubs}
      />
    </div>
  );
}

// ─── OVERVIEW TAB ───────────────────────────────────────────────────────────
function OverviewTab({ clubs }) {
  const maxRev = Math.max(...REVENUE_DATA);
  const stats = [
    { label: "Total Clubs", value: clubs.length, icon: "🏟️", color: "#1D9E75", bg: "#E1F5EE" },
    { label: "Monthly Revenue", value: "₹1,24,000", icon: "💰", color: "#993556", bg: "#FBEAF0" },
    { label: "Active Clubs", value: clubs.filter((c) => c.status === "ACTIVE").length, icon: "✅", color: "#185FA5", bg: "#E6F1FB" },
    { label: "Status", value: clubs[0]?.status || "—", icon: "📊", color: "#BA7517", bg: "#FAEEDA" },
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
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", padding: "24px" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "16px", fontWeight: 700 }}>Monthly Revenue (₹k)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "180px" }}>
          {REVENUE_DATA.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "100%", maxWidth: "32px", borderRadius: "6px 6px 0 0", height: `${(val / maxRev) * 100}%`, background: "linear-gradient(180deg, #1D9E75, #E1F5EE)", transition: "height 0.3s ease" }} />
              <span style={{ fontSize: "10px", color: "#888" }}>{MONTHS[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CLUBS TAB ──────────────────────────────────────────────────────────────
function ClubsTab({ clubs, loading, error, onRefresh, onAssign }) {
  const [expandedClub, setExpandedClub] = useState(null);
  const [courts, setCourts] = useState({});
  const [loadingCourt, setLoadingCourt] = useState({});
  const [addCourtFor, setAddCourtFor] = useState(null);
  const [editCourt, setEditCourt] = useState(null);

  const toggleClub = async (clubId) => {
    if (expandedClub === clubId) {
      setExpandedClub(null);
      return;
    }
    setExpandedClub(clubId);
    if (!courts[clubId]) loadCourtsForClub(clubId);
  };

  const loadCourtsForClub = async (clubId) => {
    setLoadingCourt((p) => ({ ...p, [clubId]: true }));
    try {
      const data = await fetchCourts(clubId);
      setCourts((p) => ({ ...p, [clubId]: data || [] }));
    } catch {
      setCourts((p) => ({ ...p, [clubId]: [] }));
    } finally {
      setLoadingCourt((p) => ({ ...p, [clubId]: false }));
    }
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} onRetry={onRefresh} />;
  if (clubs.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
        No clubs yet. Click <strong>+ Add New Club</strong> to register one.
      </div>
    );
  }

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
        {clubs.map((club) => {
          const isOpen = expandedClub === club.id;
          const clubCourts = courts[club.id] || club.courts || [];
          const compactLocation = club.location || (club.address ? club.address.split(",")[0] + ", " + (club.city || "") : "Pune");

          // Extract unique sport icons for courts present in this club
          const sportTypesList = clubCourts.map((c) => c.sportsType).filter(Boolean);
          const uniqueSportTypes = [...new Set(sportTypesList)];
          const sportIcons = uniqueSportTypes.map((type) => getSportByType(type)?.icon).filter(Boolean);

          return (
            <div key={club.id} style={{ background: "#fff", borderRadius: "16px", border: "1.5px solid #f0ede6", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
              {/* Header Gradient & Sports Badges */}
              <div style={{ height: "100px", background: "linear-gradient(135deg, #1D9E75, #185FA5)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "36px" }}>🏟️</span>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {sportIcons.length > 0 ? (
                    sportIcons.map((icon, i) => (
                      <span key={i} style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: "8px", fontSize: "14px" }}>
                        {icon}
                      </span>
                    ))
                  ) : (
                    <span style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(4px)", padding: "4px 8px", borderRadius: "8px", fontSize: "12px", color: "#fff", fontWeight: 600 }}>
                      🏸 Sports Complex
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <h4 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 800, color: "#08060d" }}>{club.name}</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>
                      📍 {compactLocation}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#1D9E75" }}>₹{club.basePrice || 350}</span>
                    <span style={{ fontSize: "11px", color: "#888" }}> /hr</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", margin: "10px 0 16px" }}>
                  <Badge color={club.status === "ACTIVE" ? "#0F6E56" : "#854F0B"} bg={club.status === "ACTIVE" ? "#E1F5EE" : "#FAEEDA"}>
                    {club.status || "ACTIVE"}
                  </Badge>
                  <span style={{ fontSize: "12px", color: "#666", fontWeight: 500 }}>
                    Manager: <strong style={{ color: "#08060d" }}>{club.managerName || "Unassigned"}</strong>
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingTop: "12px", borderTop: "1px solid #f0ede6" }}>
                  <Button size="sm" variant="outline" onClick={() => toggleClub(club.id)}>
                    {isOpen ? "▲ Hide Courts" : "▼ View Courts"}
                  </Button>
                  <Button size="sm" onClick={() => { setAddCourtFor(club); if (!courts[club.id]) loadCourtsForClub(club.id); }}>
                    + Add Court
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onAssign(club)}>
                    👤 Assign Manager
                  </Button>
                </div>

                {/* Courts panel */}
                {isOpen && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #f0ede6" }}>
                    {loadingCourt[club.id] ? (
                      <p style={{ fontSize: "13px", color: "#888" }}>Loading courts…</p>
                    ) : clubCourts.length === 0 ? (
                      <p style={{ fontSize: "13px", color: "#888" }}>No courts yet. Click + Add Court.</p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {clubCourts.map((court) => {
                          const sport = getSportByType(court.sportsType);
                          return (
                            <div key={court.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", background: "#faf9f6", border: "1px solid #f0ede6" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "20px" }}>{sport?.icon || "🏸"}</span>
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{court.name}</div>
                                  <div style={{ fontSize: "11px", color: "#888" }}>
                                    {sport?.name || court.sportsType} · {court.slotDuration || 60}min slots
                                  </div>
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                <Badge color={court.active !== false ? "#0F6E56" : "#888"} bg={court.active !== false ? "#E1F5EE" : "#f0ede6"}>
                                  {court.active !== false ? "Active" : "Inactive"}
                                </Badge>
                                <Button size="sm" variant="outline" onClick={() => setEditCourt(court)}>Edit</Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Court Modal */}
      <AddCourtModal
        open={!!addCourtFor}
        clubId={addCourtFor?.id}
        onClose={() => setAddCourtFor(null)}
        onSuccess={() => {
          if (addCourtFor?.id) loadCourtsForClub(addCourtFor.id);
        }}
      />

      {/* Edit Court Modal */}
      <EditCourtModal
        open={!!editCourt}
        court={editCourt}
        onClose={() => setEditCourt(null)}
        onSuccess={() => {
          if (editCourt?.clubId) loadCourtsForClub(editCourt.clubId);
        }}
      />
    </>
  );
}

// ─── MANAGERS TAB ───────────────────────────────────────────────────────────
function ManagersTab() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getManagers()
      .then((data) => setManagers(data || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load managers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} />;
  if (managers.length === 0) {
    return <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No manager accounts registered yet.</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
      {managers.map((m) => (
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
          <div style={{ fontSize: "13px", color: "#888" }}>Phone: {m.phone || "—"}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
