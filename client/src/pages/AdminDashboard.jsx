// ─── ADMIN DASHBOARD ────────────────────────────────────────────────────────
// Clubs (overview + approvals) are real, fetched from GET /api/admin/clubs.
// Approve/suspend/reactivate all go through PUT /api/admin/clubs/{id}/status.
// User counts stay illustrative for now - there's no user-listing endpoint
// yet (revenue/rentals are a later milestone too, per product scope).
import { useEffect, useState, useCallback } from "react";
import { Building2, Users, IndianRupee, Clock } from "lucide-react";
import { MANAGERS_POOL } from "../constants/mockData";
import { fetchAllClubsAdmin, updateClubStatus } from "../services/adminService";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TabBar from "../components/ui/TabBar";
import StatCard from "../components/common/StatCard";

const STATUS_STYLE = {
  ACTIVE:    { color: "#0F6E56", bg: "#E1F5EE" },
  PENDING:   { color: "#854F0B", bg: "#FAEEDA" },
  SUSPENDED: { color: "#A32D2D", bg: "#FCEBEB" },
};

export default function AdminDashboard({ tab: tabProp, setTab: setTabProp } = {}) {
  const [localTab, setLocalTab] = useState("overview");
  const tab = tabProp ?? localTab;
  const setTab = setTabProp ?? setLocalTab;

  const tabs = [
    { key: "overview", label: "Platform Overview", icon: "🌐" },
    { key: "approvals", label: "Club Approvals", icon: "✅" },
    { key: "users", label: "Users", icon: "👥" },
  ];

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  const loadClubs = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAllClubsAdmin()
      .then((data) => setClubs(data || []))
      .catch((err) => setError(err.response?.data?.message || "Failed to load clubs."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadClubs(); }, [loadClubs]);

  const handleStatusChange = async (clubId, status) => {
    setActingId(clubId);
    try {
      await updateClubStatus(clubId, status);
      await loadClubs();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update this club's status.");
    } finally {
      setActingId(null);
    }
  };

  const pendingClubs = clubs.filter((c) => c.status === "PENDING");

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#08060d] m-0">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">Platform-wide oversight and club approval management.</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading clubs…</div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-sm text-[#A32D2D] mb-3">{error}</p>
          <Button size="sm" onClick={loadClubs}>Retry</Button>
        </div>
      ) : (
        <>
          {tab === "overview" && (
            <div>
              <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
                <StatCard label="Total Clubs" value={clubs.length} icon={Building2} color="#1D9E75" bg="#E1F5EE" />
                <StatCard label="Total Users" value={1248} icon={Users} color="#185FA5" bg="#E6F1FB" />
                <StatCard label="Monthly Revenue" value="₹4.8L" icon={IndianRupee} color="#993556" bg="#FBEAF0" />
                <StatCard label="Pending Approvals" value={pendingClubs.length} icon={Clock} color="#BA7517" bg="#FAEEDA" />
              </div>
              <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
                <div className="p-4.5 border-b-[1.5px] border-[#f0ede6]"><h3 className="font-bold text-base m-0">All Clubs</h3></div>
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 bg-[#faf9f6] border-b-[1.5px] border-[#f0ede6]">
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Club</th>
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">City</th>
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Owner</th>
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Base Price</th>
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Status</th>
                    <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Action</th>
                  </tr></thead>
                  <tbody>
                    {clubs.length === 0 ? (
                      <tr><td colSpan={6} className="p-6 text-center text-gray-400">No clubs registered yet.</td></tr>
                    ) : clubs.map((club) => {
                      const style = STATUS_STYLE[club.status] || STATUS_STYLE.PENDING;
                      return (
                        <tr key={club.id} className="border-b border-[#f0ede6] hover:bg-[#faf9f6] transition-colors">
                          <td className="p-3.5 font-bold text-[#08060d]">{club.name}</td>
                          <td className="p-3.5 text-gray-600">{club.city}</td>
                          <td className="p-3.5 text-gray-600">{club.ownerFirstName}</td>
                          <td className="p-3.5 text-gray-600">₹{club.basePrice}/hr</td>
                          <td className="p-3.5"><Badge color={style.color} bg={style.bg}>{club.status}</Badge></td>
                          <td className="p-3.5">
                            {club.status === "ACTIVE" ? (
                              <Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB" disabled={actingId === club.id} onClick={() => handleStatusChange(club.id, "SUSPENDED")}>Suspend</Button>
                            ) : (
                              <Button size="sm" disabled={actingId === club.id} onClick={() => handleStatusChange(club.id, "ACTIVE")}>Activate</Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "approvals" && (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
              {pendingClubs.length === 0 ? (
                <div className="text-center py-16 text-gray-400" style={{ gridColumn: "1 / -1" }}>No clubs awaiting approval.</div>
              ) : pendingClubs.map((club) => (
                <div key={club.id} className="bg-white rounded-2xl border border-[#f0ede6] p-5">
                  <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-base m-0">{club.name}</h4><Badge color="#BA7517" bg="#FAEEDA">Pending</Badge></div>
                  <div className="text-sm text-gray-500 mb-1.5">📍 {club.address ? `${club.address}, ` : ""}{club.city}</div>
                  <div className="text-sm text-gray-500 mb-1.5">👤 Owner: {club.ownerFirstName}</div>
                  <div className="text-sm text-gray-500 mb-4">💰 ₹{club.basePrice}/hr</div>
                  <div className="flex gap-2">
                    <Button size="sm" disabled={actingId === club.id} onClick={() => handleStatusChange(club.id, "ACTIVE")}>Approve</Button>
                    <Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB" disabled={actingId === club.id} onClick={() => handleStatusChange(club.id, "SUSPENDED")}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "users" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {[
            { role: "Customers", count: 1180, color: "#185FA5", bg: "#E6F1FB" },
            { role: "Managers", count: MANAGERS_POOL.length, color: "#BA7517", bg: "#FAEEDA" },
            { role: "Owners", count: 42, color: "#1D9E75", bg: "#E1F5EE" },
            { role: "Admins", count: 3, color: "#993556", bg: "#FBEAF0" },
          ].map((r) => (
            <div key={r.role} className="bg-white rounded-2xl border border-[#f0ede6] p-6 text-center">
              <div className="text-3xl font-extrabold mb-1" style={{ color: r.color }}>{r.count}</div>
              <div className="text-sm font-semibold text-gray-500">{r.role}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
