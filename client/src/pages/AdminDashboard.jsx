import { useState } from "react";
import { Building2, Users, IndianRupee, Clock } from "lucide-react";
import { INIT_CLUBS, MANAGERS_POOL, REVENUE_DATA, MONTHS } from "../constants/mockData";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TabBar from "../components/ui/TabBar";
import StatCard from "../components/common/StatCard";

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { key: "overview", label: "Platform Overview", icon: "🌐" },
    { key: "approvals", label: "Club Approvals", icon: "✅" },
    { key: "users", label: "Users", icon: "👥" },
  ];

  const pendingClubs = [
    { id: 201, name: "PowerPlay Arena", location: "Hadapsar, Pune", owner: "Vikram Singh", submitted: "Jun 08" },
    { id: 202, name: "Champions Court", location: "Kothrud, Pune", owner: "Meera Desai", submitted: "Jun 09" },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#08060d] m-0">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">Platform-wide oversight and club approval management.</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div>
          <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            <StatCard label="Total Clubs" value={INIT_CLUBS.length} icon={Building2} color="#1D9E75" bg="#E1F5EE" />
            <StatCard label="Total Users" value={1248} icon={Users} color="#185FA5" bg="#E6F1FB" />
            <StatCard label="Monthly Revenue" value="₹4.8L" icon={IndianRupee} color="#993556" bg="#FBEAF0" />
            <StatCard label="Pending Approvals" value={pendingClubs.length} icon={Clock} color="#BA7517" bg="#FAEEDA" />
          </div>
          <div className="bg-white rounded-2xl border border-[#f0ede6] p-6 mb-6">
            <h3 className="font-bold text-base text-[#08060d] mb-5">Platform Revenue (₹k)</h3>
            <div className="flex items-end gap-2 h-44">
              {REVENUE_DATA.map((val, i) => { const maxRev = Math.max(...REVENUE_DATA); return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full max-w-[32px] rounded-t-md transition-all duration-300" style={{ height: `${(val / maxRev) * 100}%`, background: "linear-gradient(180deg, #993556, #FBEAF0)" }} />
                  <span className="text-[10px] text-gray-500">{MONTHS[i]}</span>
                </div>
              ); })}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
            <div className="p-4.5 border-b-[1.5px] border-[#f0ede6]"><h3 className="font-bold text-base m-0">All Clubs</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 bg-[#faf9f6] border-b-[1.5px] border-[#f0ede6]">
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Club</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Location</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Rating</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Courts</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Status</th>
              </tr></thead>
              <tbody>
                {INIT_CLUBS.map((club) => (
                  <tr key={club.id} className="border-b border-[#f0ede6] hover:bg-[#faf9f6] transition-colors">
                    <td className="p-3.5 font-bold text-[#08060d]">{club.name}</td>
                    <td className="p-3.5 text-gray-600">{club.location}</td>
                    <td className="p-3.5 text-gray-600">★ {club.rating}</td>
                    <td className="p-3.5 text-gray-600">{club.courts.length}</td>
                    <td className="p-3.5"><Badge color="#0F6E56" bg="#E1F5EE">Active</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "approvals" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {pendingClubs.map((club) => (
            <div key={club.id} className="bg-white rounded-2xl border border-[#f0ede6] p-5">
              <div className="flex justify-between items-center mb-3"><h4 className="font-bold text-base m-0">{club.name}</h4><Badge color="#BA7517" bg="#FAEEDA">Pending</Badge></div>
              <div className="text-sm text-gray-500 mb-1.5">📍 {club.location}</div>
              <div className="text-sm text-gray-500 mb-1.5">👤 Owner: {club.owner}</div>
              <div className="text-sm text-gray-500 mb-4">📅 Submitted: {club.submitted}</div>
              <div className="flex gap-2"><Button size="sm">Approve</Button><Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB">Reject</Button></div>
            </div>
          ))}
        </div>
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
