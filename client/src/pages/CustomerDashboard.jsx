import { useEffect, useState } from "react";
import { Search, Dumbbell, Sparkles, MapPin } from "lucide-react";
import { SPORTS_LIST, getSport, STATUS_BG, STATUS_COLOR } from "../constants/sports";
import { INIT_CLUBS, SLOT_MAP, DAYS, DATES, MONTHS, MOCK_BOOKINGS, RENTAL_ORDERS } from "../constants/mockData";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import TabBar from "../components/ui/TabBar";
import SlotGrid from "../components/ui/SlotGrid";
import EquipmentPicker from "../components/ui/EquipmentPicker";
import ClubCard from "../components/customer/ClubCard";
import BookingSummaryModal from "../components/customer/BookingSummaryModal";
import { usePayment } from "../context/PaymentContext";
import { useAuth } from "../context/AuthContext";

export default function CustomerDashboard() {
  const [tab, setTab] = useState("discover");
  const [clubs, setClubs] = useState(INIT_CLUBS);
  const [activeSport, setActiveSport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingClub, setBookingClub] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [equipOpen, setEquipOpen] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const { startPayment } = usePayment();
  const { user } = useAuth();

  const tabs = [
    { key: "discover", label: "Discover", icon: "🔍" },
    { key: "bookings", label: "My Bookings", icon: "📅" },
    { key: "rentals", label: "Rentals", icon: "🎒" },
    { key: "recommended", label: "For You", icon: "✨" },
  ];

  const filteredClubs = clubs.filter((c) => {
    const sportMatch = activeSport ? c.courts?.some((court) => court.sportId === activeSport) : true;
    const searchMatch = searchQuery ? c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.location?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return sportMatch && searchMatch;
  });

  const handlePay = async () => {
    setPayLoading(true);
    const courtPrice = bookingClub?.price || 0;
    const equipTotal = equipment.reduce((sum, e) => sum + e.qty * e.pricePerHour, 0);
    const total = courtPrice + equipTotal;
    await startPayment({
      courtId: selectedCourt?.id, slotId: selectedSlot, equipment, amount: total,
      userDetails: { name: user?.name, email: user?.email },
      onSuccess: () => { setPayLoading(false); setSummaryOpen(false); setBookingClub(null); setEquipment([]); setSelectedSlot(null); },
      onError: () => setPayLoading(false),
    });
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#08060d] m-0">Customer Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">Find, book, and play at the best sports facilities near you.</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "discover" && (
        <div>
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search clubs or locations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-[1.5px] border-[#e5e4e7] bg-white text-sm outline-none transition-all focus:border-[#1D9E75] focus:shadow-[0_0_0_3px_rgba(29,158,117,0.12)]" />
            </div>
          </div>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            <button onClick={() => setActiveSport(null)} className={`px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${activeSport === null ? "bg-[#08060d] text-white" : "bg-white text-gray-500 shadow-sm"}`}>All Sports</button>
            {SPORTS_LIST.map((sport) => {
              const isActive = activeSport === sport.id;
              return (
                <button key={sport.id} onClick={() => setActiveSport(isActive ? null : sport.id)} className="px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap flex items-center gap-1.5 transition-all"
                  style={isActive ? { background: sport.color, color: "#fff" } : { background: sport.bg, color: sport.color, border: `1.5px solid ${sport.color}33` }}>
                  <span>{sport.icon}</span> {sport.name}
                </button>
              );
            })}
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} onSelect={() => { setBookingClub(club); setSelectedSlot(null); setSelectedCourt(club.courts?.[0]); }} />
            ))}
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div>
          <h2 className="text-xl font-bold text-[#08060d] mb-1">My Bookings</h2>
          <p className="text-sm text-gray-500 mb-7">Track and manage your court reservations.</p>
          <div className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 bg-[#faf9f6] border-b-[1.5px] border-[#f0ede6]">
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Booking ID</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Sport</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Court</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Date</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Time</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Amount</th>
                <th className="p-3.5 font-bold uppercase text-xs tracking-wide">Status</th>
              </tr></thead>
              <tbody>
                {MOCK_BOOKINGS.map((b) => (
                  <tr key={b.id} className="border-b border-[#f0ede6] hover:bg-[#faf9f6] transition-colors">
                    <td className="p-3.5 font-bold text-[#08060d]">{b.id}</td>
                    <td className="p-3.5 text-gray-600">{b.sport}</td>
                    <td className="p-3.5 text-gray-600">{b.court}</td>
                    <td className="p-3.5 text-gray-600">{b.date}</td>
                    <td className="p-3.5 text-gray-600">{b.time}</td>
                    <td className="p-3.5 text-gray-600">₹{b.amount}</td>
                    <td className="p-3.5"><Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>{b.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "rentals" && (
        <div>
          <h2 className="text-xl font-bold text-[#08060d] mb-1">Equipment Rentals</h2>
          <p className="text-sm text-gray-500 mb-7">Manage your rented sports equipment and deposits.</p>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
            {RENTAL_ORDERS.map((rental) => (
              <div key={rental.id} className="bg-white rounded-2xl border border-[#f0ede6] p-5">
                <div className="flex justify-between items-center mb-3.5">
                  <span className="text-base font-bold text-[#08060d]">{rental.id}</span>
                  <Badge color={STATUS_COLOR[rental.status]} bg={STATUS_BG[rental.status]}>{rental.status}</Badge>
                </div>
                <div className="mb-3.5">{rental.items.map((item, i) => (<div key={i} className="text-sm text-gray-600 mb-1">• {item}</div>))}</div>
                <div className="flex justify-between items-center pt-3.5 border-t border-[#f0ede6]">
                  <div><div className="text-xs text-gray-500">{rental.slot}</div><div className="text-lg font-extrabold text-[#08060d]">₹{rental.total}</div></div>
                  {rental.deposit > 0 && (<div className="text-xs text-gray-500 text-right">Deposit<br /><span className="font-bold text-[#BA7517]">₹{rental.deposit}</span></div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "recommended" && (
        <div>
          <h2 className="text-xl font-bold text-[#08060d] mb-1 flex items-center gap-2"><Sparkles size={20} color="#1D9E75" /> Recommended For You</h2>
          <p className="text-sm text-gray-500 mb-7">Clubs picked based on your booking history and preferences.</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {clubs.map((club) => (
              <div key={club.id} onClick={() => { setBookingClub(club); setSelectedSlot(null); setSelectedCourt(club.courts?.[0]); }} className="flex-none w-80 bg-white rounded-2xl border border-[#f0ede6] overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                <div className="h-28 flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #185FA5, #1D9E75)" }}>🏟️</div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1.5"><h3 className="text-base font-bold m-0">{club.name}</h3><Badge color="#993556" bg="#FBEAF0">★ {club.rating}</Badge></div>
                  <p className="text-sm text-gray-500 mb-2.5 flex items-center gap-1"><MapPin size={13} /> {club.location}</p>
                  <div className="flex gap-1 flex-wrap mb-3.5">{club.courts?.slice(0, 2).map((c) => { const s = getSport(c.sportId); return <Badge key={c.id} color={s?.color} bg={s?.bg}>{s?.icon} {s?.name}</Badge>; })}</div>
                  <div className="flex justify-between items-center"><span className="text-lg font-extrabold">₹{club.price}<span className="text-sm text-gray-500 font-normal"> /hr</span></span><Button size="sm">View</Button></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={!!bookingClub} onClose={() => setBookingClub(null)} title="Book a Slot" size="lg">
        {bookingClub && (
          <div>
            <div className="mb-5">
              <h3 className="text-lg font-bold m-0">{bookingClub.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><MapPin size={13} /> {bookingClub.location} · ₹{bookingClub.price}/hr</p>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {bookingClub.courts?.map((court) => { const sport = getSport(court.sportId); return (
                  <button key={court.id} onClick={() => setSelectedCourt(court)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCourt?.id === court.id ? "text-white" : ""}`}
                    style={selectedCourt?.id === court.id ? { background: sport?.color } : { background: sport?.bg, color: sport?.color }}>{sport?.icon} {court.name}</button>
                ); })}
              </div>
            </div>
            <div className="flex gap-1.5 mb-4 overflow-x-auto">
              {DAYS.map((day, i) => (
                <button key={i} onClick={() => setSelectedDay(i)} className={`flex-none px-3.5 py-2.5 rounded-lg text-center transition-all ${selectedDay === i ? "border-2 border-[#1D9E75] bg-[#E1F5EE] text-[#1D9E75]" : "border-[1.5px] border-[#f0ede6] text-gray-500"}`}>
                  <div className="text-[11px] opacity-70">{day}</div><div className="text-base font-bold">{DATES[i]}</div>
                </button>
              ))}
            </div>
            <div className="mb-5">
              <div className="text-sm font-semibold text-[#3a3a3a] mb-2.5">Available Time Slots · {MONTHS[5]} {DATES[selectedDay]}</div>
              <SlotGrid slots={SLOT_MAP} selected={selectedSlot} onSelect={setSelectedSlot} />
            </div>
            {equipment.length > 0 && (
              <div className="bg-[#E1F5EE] rounded-xl p-3.5 mb-4">
                <div className="text-sm font-semibold text-[#0F6E56] mb-1.5 flex items-center gap-1.5"><Dumbbell size={14} /> Equipment Added ({equipment.length})</div>
                {equipment.map((e) => (<div key={e.id} className="text-sm text-gray-600">{e.name} ×{e.qty} — ₹{e.pricePerHour * e.qty}/hr</div>))}
              </div>
            )}
            <div className="flex gap-2.5">
              <Button variant="outline" onClick={() => setEquipOpen(true)}>+ Add Equipment</Button>
              <Button fullWidth disabled={!selectedSlot} onClick={() => setSummaryOpen(true)}>{selectedSlot ? `Confirm Booking · ${selectedSlot}` : "Select a slot"}</Button>
            </div>
          </div>
        )}
      </Modal>

      <EquipmentPicker open={equipOpen} onClose={() => setEquipOpen(false)} onConfirm={(items) => { setEquipment(items); setEquipOpen(false); }} />
      <BookingSummaryModal open={summaryOpen} onClose={() => setSummaryOpen(false)} club={bookingClub} court={selectedCourt} slot={selectedSlot} equipment={equipment}
        totalAmount={(bookingClub?.price || 0) + equipment.reduce((s, e) => s + e.qty * e.pricePerHour, 0)} onConfirm={handlePay} loading={payLoading} />
    </div>
  );
}
