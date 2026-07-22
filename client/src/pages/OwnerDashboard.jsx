import { useState } from "react";
import { Building2, IndianRupee, Users, Trophy } from "lucide-react";
import { INIT_CLUBS, MANAGERS_POOL } from "../constants/mockData";
import { getSport } from "../constants/sports";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TabBar from "../components/ui/TabBar";
import StatCard from "../components/common/StatCard";
import RevenueChart from "../components/owner/RevenueChart";
import AssignManagerModal from "../components/owner/AssignManagerModal";

export default function OwnerDashboard() {
  const [tab, setTab] = useState("overview");
  const [assignFor, setAssignFor] = useState(null);

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "clubs", label: "My Clubs", icon: "🏟️" },
    { key: "managers", label: "Managers", icon: "👥" },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div><h1 className="text-3xl font-extrabold text-[#08060d] m-0">Owner Dashboard</h1><p className="text-sm text-gray-500 mt-1.5">Manage your clubs, revenue, and manager assignments.</p></div>
        <Button>+ Add New Club</Button>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div>
          <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            <StatCard label="Total Clubs" value={INIT_CLUBS.length} icon={Building2} color="#1D9E75" bg="#E1F5EE" />
            <StatCard label="Monthly Revenue" value="₹1,24,000" icon={IndianRupee} color="#993556" bg="#FBEAF0" />
            <StatCard label="Active Managers" value={MANAGERS_POOL.length} icon={Users} color="#185FA5" bg="#E6F1FB" />
            <StatCard label="Total Courts" value={INIT_CLUBS.reduce((a, c) => a + c.courts.length, 0)} icon={Trophy} color="#BA7517" bg="#FAEEDA" />
          </div>
          <RevenueChart />
        </div>
      )}

      {tab === "clubs" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {INIT_CLUBS.map((club) => (
            <div key={club.id} className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
              <div className="h-24 flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #1D9E75, #185FA5)" }}>🏟️</div>
              <div className="p-4.5">
                <h4 className="font-bold text-base text-[#08060d] m-0">{club.name}</h4>
                <p className="text-sm text-gray-500 mt-1 mb-3">{club.location}</p>
                <div className="flex gap-1.5 flex-wrap mb-3.5">{club.courts.map((c) => { const s = getSport(c.sportId); return <Badge key={c.id} color={s?.color} bg={s?.bg}>{s?.icon} {s?.name}</Badge>; })}</div>
                <div className="flex justify-between items-center pt-3.5 border-t border-[#f0ede6]">
                  <div className="text-sm text-gray-500">Manager: <strong className={club.managerId ? "text-[#08060d]" : "text-[#A32D2D]"}>{club.managerId ? MANAGERS_POOL.find((m) => m.id === club.managerId)?.name : "Unassigned"}</strong></div>
                  <Button size="sm" variant="outline" onClick={() => setAssignFor(club)}>{club.managerId ? "Reassign" : "Assign"}</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "managers" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {MANAGERS_POOL.map((m) => { const assignedClub = INIT_CLUBS.find((c) => c.managerId === m.id); return (
            <div key={m.id} className="bg-white rounded-2xl border border-[#f0ede6] p-5">
              <div className="flex items-center gap-3 mb-3.5">
                <div className="w-11 h-11 rounded-full bg-[#E1F5EE] flex items-center justify-center text-lg font-bold text-[#1D9E75]">{m.name.charAt(0)}</div>
                <div><div className="font-bold text-sm text-[#08060d]">{m.name}</div><div className="text-xs text-gray-500">{m.email}</div></div>
              </div>
              <div className="text-sm text-gray-500 mb-1">Phone: {m.phone}</div>
              <div className="text-sm text-gray-500">Assigned to: <Badge color={assignedClub ? "#1D9E75" : "#A32D2D"} bg={assignedClub ? "#E1F5EE" : "#FCEBEB"}>{assignedClub ? assignedClub.name : "No club"}</Badge></div>
            </div>
          ); })}
        </div>
      )}

      <AssignManagerModal open={!!assignFor} onClose={() => setAssignFor(null)} club={assignFor} onAssign={() => {}} />
    </div>
  );
}
