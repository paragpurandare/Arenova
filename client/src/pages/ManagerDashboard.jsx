import { useState } from "react";
import { CalendarCheck, Backpack, Clock, IndianRupee, Settings, Ban } from "lucide-react";
import { MOCK_BOOKINGS, RENTAL_ORDERS, EQUIPMENT_CATALOG, INIT_CLUBS } from "../constants/mockData";
import { getSport, STATUS_BG, STATUS_COLOR } from "../constants/sports";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TabBar from "../components/ui/TabBar";
import StatCard from "../components/common/StatCard";
import CourtConfigModal from "../components/manager/CourtConfigModal";
import InventoryTable from "../components/manager/InventoryTable";
import SlotBlockerModal from "../components/manager/SlotBlockerModal";
import RentalReturnModal from "../components/manager/RentalReturnModal";

export default function ManagerDashboard() {
  const [tab, setTab] = useState("overview");
  const [configCourt, setConfigCourt] = useState(null);
  const [blockCourt, setBlockCourt] = useState(null);
  const [returnRental, setReturnRental] = useState(null);
  const [inventory, setInventory] = useState(EQUIPMENT_CATALOG);

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "bookings", label: "Bookings", icon: "📅" },
    { key: "courts", label: "Courts", icon: "🏸" },
    { key: "equipment", label: "Equipment", icon: "🎒" },
    { key: "rentals", label: "Rentals", icon: "🔄" },
  ];

  const todayBookings = MOCK_BOOKINGS.filter((b) => b.status === "confirmed");

  const handleRestock = (id, delta) => {
    setInventory((prev) => prev.map((e) => e.id === id ? { ...e, stock: Math.max(0, e.stock + delta) } : e));
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#08060d] m-0">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">Manage bookings, courts, and equipment for your club.</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div>
          <div className="grid gap-4 mb-7" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            <StatCard label="Today's Bookings" value={todayBookings.length} icon={CalendarCheck} color="#1D9E75" bg="#E1F5EE" />
            <StatCard label="Active Rentals" value={RENTAL_ORDERS.filter((r) => r.status === "active").length} icon={Backpack} color="#185FA5" bg="#E6F1FB" />
            <StatCard label="Pending Approvals" value={MOCK_BOOKINGS.filter((b) => b.status === "pending").length} icon={Clock} color="#BA7517" bg="#FAEEDA" />
            <StatCard label="Revenue Today" value="₹3,200" icon={IndianRupee} color="#993556" bg="#FBEAF0" />
          </div>
          <div className="bg-white rounded-2xl border border-[#f0ede6] p-5">
            <h3 className="font-bold text-base text-[#08060d] mb-4">Today's Bookings</h3>
            {todayBookings.map((b) => (
              <div key={b.id} className="flex justify-between items-center py-3 border-b border-[#f0ede6] last:border-0">
                <div><div className="font-semibold text-sm text-[#08060d]">{b.user} · {b.sport}</div><div className="text-xs text-gray-500">{b.court} · {b.time}</div></div>
                <Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>{b.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 bg-[#faf9f6] border-b-[1.5px] border-[#f0ede6]">
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">ID</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Customer</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Sport</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Court</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Time</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Status</th>
              <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Action</th>
            </tr></thead>
            <tbody>
              {MOCK_BOOKINGS.map((b) => (
                <tr key={b.id} className="border-b border-[#f0ede6] hover:bg-[#faf9f6] transition-colors">
                  <td className="p-3.5 font-bold text-[#08060d]">{b.id}</td>
                  <td className="p-3.5 text-gray-600">{b.user}</td>
                  <td className="p-3.5 text-gray-600">{b.sport}</td>
                  <td className="p-3.5 text-gray-600">{b.court}</td>
                  <td className="p-3.5 text-gray-600">{b.time}</td>
                  <td className="p-3.5"><Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>{b.status}</Badge></td>
                  <td className="p-3.5">{b.status === "pending" ? (<div className="flex gap-1.5"><Button size="sm">Approve</Button><Button size="sm" variant="outline" color="#A32D2D" bg="#FCEBEB">Reject</Button></div>) : <span className="text-xs text-gray-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "courts" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {INIT_CLUBS[0].courts.map((court) => { const sport = getSport(court.sportId); return (
            <div key={court.id} className="bg-white rounded-2xl border border-[#f0ede6] p-4.5">
              <div className="flex justify-between items-center mb-2.5"><div className="text-3xl">{sport?.icon}</div>
                <Badge color={court.config.active ? "#0F6E56" : "#888"} bg={court.config.active ? "#E1F5EE" : "#f0ede6"}>{court.config.active ? "Active" : "Inactive"}</Badge>
              </div>
              <h4 className="font-bold text-sm text-[#08060d] m-0">{court.name}</h4>
              <p className="text-sm text-gray-500 mt-1 mb-3">{sport?.name}</p>
              <div className="text-xs text-gray-500 mb-3.5 flex items-center gap-1"><Clock size={12} /> {court.config.openTime}–{court.config.closeTime} · {court.config.slotDuration}min slots</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" fullWidth onClick={() => setConfigCourt(court)}><Settings size={14} /> Configure</Button>
                <Button size="sm" variant="ghost" fullWidth onClick={() => setBlockCourt(court)}><Ban size={14} /> Block</Button>
              </div>
            </div>
          ); })}
        </div>
      )}

      {tab === "equipment" && <InventoryTable items={inventory} onAdd={() => {}} onRestock={handleRestock} onDelete={() => {}} />}

      {tab === "rentals" && (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
          {RENTAL_ORDERS.map((rental) => (
            <div key={rental.id} className="bg-white rounded-2xl border border-[#f0ede6] p-5">
              <div className="flex justify-between items-center mb-3.5"><span className="text-base font-bold text-[#08060d]">{rental.id}</span><Badge color={STATUS_COLOR[rental.status]} bg={STATUS_BG[rental.status]}>{rental.status}</Badge></div>
              <div className="mb-3.5"><div className="text-xs text-gray-500 mb-1">Customer: <span className="font-semibold text-[#08060d]">{rental.user}</span></div>{rental.items.map((item, i) => (<div key={i} className="text-sm text-gray-600 mb-0.5">• {item}</div>))}</div>
              <div className="flex justify-between items-center pt-3.5 border-t border-[#f0ede6]">
                <div><div className="text-xs text-gray-500">{rental.slot}</div><div className="text-lg font-extrabold text-[#08060d]">₹{rental.total}</div></div>
                {rental.status === "active" && <Button size="sm" variant="outline" onClick={() => setReturnRental(rental)}>Return</Button>}
              </div>
            </div>
          ))}
        </div>
      )}

      <CourtConfigModal open={!!configCourt} onClose={() => setConfigCourt(null)} court={configCourt} onSave={() => {}} />
      <SlotBlockerModal open={!!blockCourt} onClose={() => setBlockCourt(null)} court={blockCourt} onBlock={() => {}} />
      <RentalReturnModal open={!!returnRental} onClose={() => setReturnRental(null)} rental={returnRental} onReturn={() => {}} />
    </div>
  );
}
