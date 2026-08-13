import { useState, useEffect } from "react";
import { Sparkles, MapPin } from "lucide-react";
import { getSport } from "../constants/sports";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import TabBar from "../components/ui/TabBar";
import CustomerDiscover from "./customer/CustomerDiscover";
import CustomerBookings from "./customer/CustomerBookings";
import CustomerRentals from "./customer/CustomerRentals";
import ClubCard from "../components/customer/ClubCard";
import api from "../services/api";

export default function CustomerDashboard({ tab: tabProp, setTab: setTabProp } = {}) {
  const [localTab, setLocalTab] = useState("discover");
  const tab = tabProp ?? localTab;
  const setTab = setTabProp ?? setLocalTab;
  const [recClubs, setRecClubs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const tabs = [
    { key: "discover", label: "Discover", icon: "🔍" },
    { key: "bookings", label: "My Bookings", icon: "📅" },
    { key: "rentals", label: "Rentals", icon: "🎒" },
    { key: "recommended", label: "For You", icon: "✨" },
  ];

  // Load recommended clubs when tab switches to "recommended"
  useEffect(() => {
    if (tab !== "recommended" || recClubs.length > 0) return;
    let cancelled = false;
    setRecLoading(true);
    api.get("/clubs").then((res) => {
      if (!cancelled) setRecClubs(res.data || []);
    }).catch(() => {}).finally(() => {
      if (!cancelled) setRecLoading(false);
    });
    return () => { cancelled = true; };
  }, [tab]);

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-[#08060d] m-0">Customer Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1.5">Find, book, and play at the best sports facilities near you.</p>
      </div>

      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "discover" && <CustomerDiscover />}
      {tab === "bookings" && <CustomerBookings />}
      {tab === "rentals" && <CustomerRentals />}

      {tab === "recommended" && (
        <div>
          <h2 className="text-xl font-bold text-[#08060d] mb-1 flex items-center gap-2"><Sparkles size={20} color="#1D9E75" /> Recommended For You</h2>
          <p className="text-sm text-gray-500 mb-7">Clubs picked based on your booking history and preferences.</p>
          {recLoading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading recommendations…</div>
          ) : recClubs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No clubs available yet.</div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recClubs.map((club) => (
                <div key={club.id || club.clubId} className="flex-none w-80">
                  <ClubCard club={{
                    id: club.id || club.clubId,
                    name: club.name || club.clubName,
                    location: club.address || club.location || "",
                    latitude: club.latitude,
                    longitude: club.longitude,
                    rating: club.rating || 4.5,
                    sportsTypes: club.sportsTypes || [],
                    pricePerHour: club.pricePerHour,
                    managerName: club.managerName,
                  }} onClick={() => setTab("discover")} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
