import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchNearbyClubs, getClubManager } from "../../services/clubService";
import { fetchActiveCourts } from "../../services/courtService";
import { fetchSlots } from "../../services/slotService";
import { fetchEquipmentByClub, fetchEquipmentAvailability } from "../../services/equipmentService";
import { SPORTS_LIST, getSport, getSportByType } from "../../constants/sports";
import { INIT_CLUBS, EQUIPMENT_CATALOG } from "../../constants/mockData";
import { usePayment } from "../../context/PaymentContext";
import { useAuth } from "../../context/AuthContext";

import ClubCard from "../../components/customer/ClubCard";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SlotGrid from "../../components/ui/SlotGrid";
import EquipmentPicker from "../../components/ui/EquipmentPicker";
import BookingSummaryModal from "../../components/customer/BookingSummaryModal";
import OlaMap from "../../components/OlaMap";
import { MapPin, UserCheck, Dumbbell, Sparkles, Navigation, Compass, Search, X } from "lucide-react";

// Generate rolling 14-day calendar starting strictly from current moment
function generateCalendarDays() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");

    days.push({
      isoDate: `${year}-${month}-${date}`,
      dayName: d.toLocaleDateString("en-IN", { weekday: "short" }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString("en-IN", { month: "short" }),
      isToday: i === 0,
    });
  }
  return days;
}

export default function CustomerDiscover() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  // Booking Modal State
  const [bookingClub, setBookingClub] = useState(null);
  const [clubManagerName, setClubManagerName] = useState(null);
  const [clubEquipment, setClubEquipment] = useState([]);
  const [showOlaMap, setShowOlaMap] = useState(false);
  const [courts, setCourts] = useState([]);
  const [loadCourts, setLoadCourts] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Date Calendar
  const calendarDays = useMemo(() => generateCalendarDays(), []);
  const [selectedDate, setSelectedDate] = useState(calendarDays[0].isoDate);

  // Slot Management State
  const [slots, setSlots] = useState([]);
  const [loadSlots, setLoadSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Equipment & Payment
  const [equipOpen, setEquipOpen] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const { startPayment } = usePayment();
  const { user } = useAuth();

  // Load nearby clubs on mount
  useEffect(() => {
    let isMounted = true;

    async function loadClubs() {
      if (!navigator?.geolocation) {
        if (isMounted) {
          setClubs(INIT_CLUBS);
          setLoading(false);
        }
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const data = await fetchNearbyClubs(coords.latitude, coords.longitude, 10);
            if (isMounted) setClubs(data?.length ? data : INIT_CLUBS);
          } catch {
            if (isMounted) setClubs(INIT_CLUBS);
          } finally {
            if (isMounted) setLoading(false);
          }
        },
        () => {
          if (isMounted) {
            setClubs(INIT_CLUBS);
            setLoading(false);
          }
        }
      );
    }

    loadClubs();
    return () => { isMounted = false; };
  }, []);

  // Direct Slot Fetcher
  const getSlots = useCallback(async (courtId, dateStr) => {
    if (!courtId || !dateStr) return;
    setLoadSlots(true);
    setSelectedSlot(null);

    try {
      const response = await fetchSlots(courtId, dateStr);
      setSlots(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("API Slot Fetch Error:", err);
      setSlots([]);
    } finally {
      setLoadSlots(false);
    }
  }, []);

  // Open modal and load club manager, active courts, available equipment, and slots
  const handleOpenBooking = async (club) => {
    setBookingClub(club);
    setLoadCourts(true);
    setSelectedSlot(null);
    setEquipment([]);
    setClubManagerName(null);
    setClubEquipment([]);

    const defaultDate = calendarDays[0].isoDate;
    setSelectedDate(defaultDate);

    // 1. Fetch manager details
    try {
      const mgr = await getClubManager(club.id);
      if (mgr?.firstName || mgr?.name) {
        setClubManagerName(`${mgr.firstName || ""} ${mgr.lastName || ""}`.trim() || mgr.name);
      }
    } catch {
      setClubManagerName(null);
    }

    // 2. Fetch club active equipment with quantities
    try {
      const equipData = await fetchEquipmentAvailability(club.id, defaultDate);
      if (equipData && equipData.length > 0) {
        setClubEquipment(equipData);
      } else {
        const catData = await fetchEquipmentByClub(club.id);
        setClubEquipment(catData || []);
      }
    } catch {
      setClubEquipment([]);
    }

    // 3. Fetch active courts
    try {
      const activeCourts = await fetchActiveCourts(club.id);
      const courtList = activeCourts?.length ? activeCourts : club.courts || [];
      setCourts(courtList);

      if (courtList.length > 0) {
        const firstCourt = courtList[0];
        setSelectedCourt(firstCourt);
        getSlots(firstCourt.id, defaultDate);
      }
    } catch (err) {
      console.error("Court load failed:", err);
      const fallbackList = club.courts || [];
      setCourts(fallbackList);
      if (fallbackList.length > 0) {
        setSelectedCourt(fallbackList[0]);
        getSlots(fallbackList[0].id, defaultDate);
      }
    } finally {
      setLoadCourts(false);
    }
  };

  // Switch Court
  const handleSelectCourt = (court) => {
    setSelectedCourt(court);
    getSlots(court.id, selectedDate);
  };

  // Switch Calendar Date
  const handleSelectDate = async (isoDate) => {
    setSelectedDate(isoDate);
    if (selectedCourt) {
      getSlots(selectedCourt.id, isoDate);
    }

    // Refresh equipment availability for date
    if (bookingClub?.id) {
      try {
        const equipData = await fetchEquipmentAvailability(bookingClub.id, isoDate);
        if (equipData && equipData.length > 0) {
          setClubEquipment(equipData);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleCloseBooking = () => {
    setBookingClub(null);
    setCourts([]);
    setSelectedCourt(null);
    setSlots([]);
    setSelectedSlot(null);
    setEquipment([]);
  };

  const handlePay = async () => {
    const targetSlotId = typeof selectedSlot === "object" ? selectedSlot?.id : selectedSlot;
    if (!targetSlotId || !user?.id) {
      alert("Please select a slot and ensure you are logged in.");
      return;
    }
    const realCourtPrice = selectedCourt?.pricePerHour || bookingClub?.basePrice || bookingClub?.price || 350;

    setPayLoading(true);
    await startPayment({
      slotId: Number(targetSlotId),
      userId: user.id,
      courtId: selectedCourt?.id,
      courtName: selectedCourt?.name || "Court",
      courtAmount: Number(realCourtPrice),
      sportsType: selectedCourt?.sportsType || bookingClub?.sportsType || "General",
      clubId: bookingClub?.id,
      clubName: bookingClub?.name,
      slotDate: selectedDate,
      startTime: selectedSlot?.startTime,
      endTime: selectedSlot?.endTime,
      paymentMethod: "UPI",
      equipmentItems: equipment,
      userDetails: { name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name, email: user.email },
      onSuccess: (booking) => {
        setPayLoading(false);
        setSummaryOpen(false);
        handleCloseBooking();
        alert(`🎉 Booking #${booking.id} confirmed successfully! Total: ₹${booking.totalAmount || booking.totalPayable || realCourtPrice}`);
      },
      onError: (err) => {
        setPayLoading(false);
        alert(err || "Booking failed.");
      },
    });
  };

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      // 1. Keyword search (case-insensitive substring match on name, location, address, city)
      if (searchLocation.trim()) {
        const query = searchLocation.trim().toLowerCase();
        const fullText = `${club.name || ""} ${club.location || ""} ${club.address || ""} ${club.city || ""}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      // 2. Dynamic Sport filter
      if (activeSport) {
        const sportObj = SPORTS_LIST.find((s) => s.id === activeSport);
        const targetName = (sportObj?.name || "").toUpperCase();

        const clubCourts = club.courts || [];
        const hasMatchingCourt = clubCourts.some((court) => {
          const cType = (court.sportsType || "").toUpperCase();
          const cId = court.sportId;
          return cId === activeSport || cType.includes(targetName) || targetName.includes(cType);
        });

        if (!hasMatchingCourt && clubCourts.length > 0) return false;
      }

      return true;
    });
  }, [clubs, searchLocation, activeSport]);

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
          Discover Nearby Clubs
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Live court availability & equipment rentals near you.
        </p>
      </div>

      {/* Location Keyword Search Bar (No OlaMaps API tokens hit) */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ position: "relative", maxWidth: "600px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
          <input
            type="text"
            placeholder="Search by city, area, or arena name (e.g. Pune, Ravet, Baner)..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            style={{
              width: "100%",
              paddingLeft: "42px",
              paddingRight: searchLocation ? "36px" : "16px",
              paddingTop: "12px",
              paddingBottom: "12px",
              borderRadius: "12px",
              border: "1.5px solid #f0ede6",
              fontSize: "14px",
              background: "#fff",
              outline: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            }}
          />
          {searchLocation && (
            <button
              onClick={() => setSearchLocation("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Sport Categories Filter Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
        <Pill active={activeSport === null} color="#08060d" onClick={() => setActiveSport(null)}>
          All Sports
        </Pill>
        {SPORTS_LIST.map((sport) => (
          <Pill
            key={sport.id}
            active={activeSport === sport.id}
            color={sport.color}
            bg={sport.bg}
            onClick={() => setActiveSport(activeSport === sport.id ? null : sport.id)}
          >
            {sport.icon} {sport.name}
          </Pill>
        ))}
      </div>

      {/* Club Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading venues…</div>
      ) : filteredClubs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No active courts found.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} onView={() => handleOpenBooking(club)} />
          ))}
        </div>
      )}

      {/* Interactive Booking & Detailed Information Modal */}
      <Modal open={!!bookingClub} onClose={handleCloseBooking} title="Club Information & Slot Booking" size="lg">
        {bookingClub && (
          <div>
            {/* Header info with compact location and manager name */}
            <div className="bg-[#faf9f6] rounded-xl p-4 mb-5 border border-[#f0ede6]">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-[#08060d] m-0">{bookingClub.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={13} className="text-[#1D9E75]" />
                    {bookingClub.location || (bookingClub.address ? bookingClub.address.split(",")[0] + ", " + (bookingClub.city || "") : "Pune")}
                    {bookingClub.distanceKm && <span className="font-bold text-gray-700">· {bookingClub.distanceKm} km</span>}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#1D9E75]">₹{bookingClub.basePrice || bookingClub.price || 350}</span>
                  <span className="text-xs text-gray-500 font-normal"> /hr</span>
                </div>
              </div>

              {/* Manager Badge & Navigation Buttons */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#f0ede6] text-xs flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#534AB7]" />
                  <span className="text-gray-600">
                    Manager: <strong className="text-[#08060d]">{clubManagerName || bookingClub.managerName || "Self-Managed (Owner)"}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOlaMap((prev) => !prev)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E6F1FB] text-[#185FA5] font-semibold hover:bg-[#d5e7f9] transition-all cursor-pointer"
                  >
                    <Compass size={13} /> {showOlaMap ? "Hide Map" : "OlaMap"}
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${
                      bookingClub.latitude && bookingClub.longitude
                        ? `${bookingClub.latitude},${bookingClub.longitude}`
                        : encodeURIComponent(`${bookingClub.name}, ${bookingClub.location || bookingClub.address || "Pune"}`)
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1D9E75] text-white font-semibold hover:bg-[#157a5a] transition-all no-underline cursor-pointer"
                  >
                    <Navigation size={13} /> Get Directions
                  </a>
                </div>
              </div>

              {/* OlaMap Inline View */}
              {showOlaMap && (
                <div className="mt-3 pt-3 border-t border-[#f0ede6]">
                  <OlaMap
                    initialLat={bookingClub.latitude || 18.5204}
                    initialLng={bookingClub.longitude || 73.8567}
                  />
                </div>
              )}
            </div>

            {/* Equipment Available Displayed with Qty */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#534AB7] mb-2">
                <Dumbbell size={14} /> Equipment Available for Rent
              </div>
              {clubEquipment.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {clubEquipment.map((eq) => {
                    const avail = eq.availableUnits !== undefined ? eq.availableUnits : (eq.totalStock || 10);
                    return (
                      <div key={eq.equipmentId || eq.id} className="bg-white border border-[#f0ede6] rounded-lg p-2.5 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-[#08060d]">{eq.equipmentName || eq.name}</div>
                          <div className="text-gray-500">₹{eq.pricePerSlot || 50}/slot</div>
                        </div>
                        <Badge color={avail > 0 ? "#0F6E56" : "#A32D2D"} bg={avail > 0 ? "#E1F5EE" : "#FCEBEB"}>
                          {avail} left
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-gray-400 bg-white p-3 rounded-lg border border-[#f0ede6]">
                  Equipment rental items are loaded via catalog during checkout.
                </div>
              )}
            </div>

            {/* Active Courts Selection */}
            <div className="mb-4">
              <div className="text-xs font-bold uppercase text-gray-500 mb-2">Courts Managed</div>
              {loadCourts ? (
                <p className="text-xs text-gray-400">Loading active courts…</p>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {courts.map((court) => {
                    const sport = getSportByType(court.sportsType) || getSport(court.sportId);
                    const isSel = selectedCourt?.id === court.id;
                    return (
                      <button
                        key={court.id}
                        onClick={() => handleSelectCourt(court)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSel ? "bg-[#1D9E75] text-white border-[#1D9E75]" : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        {sport?.icon || "🏸"} {court.name || court.type}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dynamic Date Calendar */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase text-gray-500 mb-2">Select Booking Date</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {calendarDays.map((d) => {
                  const isSelected = selectedDate === d.isoDate;
                  return (
                    <button
                      key={d.isoDate}
                      onClick={() => handleSelectDate(d.isoDate)}
                      className={`flex-none min-w-[64px] px-2.5 py-2 rounded-xl text-center border transition-all ${
                        isSelected ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56] font-bold" : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <div className="text-[10px] font-bold opacity-80">{d.isToday ? "TODAY" : d.dayName.toUpperCase()}</div>
                      <div className="text-base font-extrabold my-0.5">{d.dayNumber}</div>
                      <div className="text-[10px] opacity-80">{d.monthName}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Matrix Display */}
            <div className="mb-5">
              <div className="text-xs font-bold uppercase text-gray-500 mb-2">
                Available Slots for {selectedDate}
              </div>
              {loadSlots ? (
                <div className="p-6 text-center text-xs text-gray-500">Fetching live slots from API...</div>
              ) : slots.length === 0 ? (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-xs text-gray-500">
                  No open slots found for this court on this date.
                </div>
              ) : (
                <SlotGrid slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
              )}
            </div>

            {/* Selected Equipment Indicator */}
            {equipment.length > 0 && (
              <div className="bg-[#E1F5EE] rounded-xl p-3.5 mb-4">
                <div className="text-xs font-bold text-[#0F6E56] mb-1">Equipment Add-ons ({equipment.length})</div>
                {equipment.map((e) => {
                  const unitPrice = Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 50);
                  const q = Number(e.qty || e.quantity || 1);
                  return (
                    <div key={e.id} className="text-xs text-gray-600">
                      {e.name} (x{q}) — ₹{unitPrice * q}/slot
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex gap-3 mt-5">
              <Button variant="outline" onClick={() => setEquipOpen(true)}>
                + Add Equipment
              </Button>
              {(() => {
                const courtVal = Number(selectedCourt?.pricePerHour || bookingClub?.basePrice || bookingClub?.price || 350);
                const eqVal = equipment.reduce(
                  (sum, e) => sum + Number(e.qty || e.quantity || 1) * Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 50),
                  0
                );
                const grandTotal = courtVal + eqVal;
                return (
                  <Button fullWidth disabled={!selectedSlot} onClick={() => setSummaryOpen(true)}>
                    {selectedSlot ? `Confirm Booking (₹${grandTotal})` : "Select a Time Slot"}
                  </Button>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Equipment Modal */}
      <EquipmentPicker
        open={equipOpen}
        onClose={() => setEquipOpen(false)}
        clubId={bookingClub?.id}
        date={selectedDate}
        onConfirm={(items) => {
          setEquipment(items);
          setEquipOpen(false);
        }}
      />

      {/* Booking Confirmation & Payment Modal */}
      {summaryOpen && (
        <BookingSummaryModal
          open={summaryOpen}
          onClose={() => setSummaryOpen(false)}
          club={bookingClub}
          court={selectedCourt}
          slot={selectedSlot}
          equipment={equipment}
          date={selectedDate}
          onConfirm={handlePay}
          loading={payLoading}
        />
      )}
    </div>
  );
}

function Pill({ children, active, color, bg, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: "999px",
        border: active ? "none" : `1px solid ${color}33`,
        background: active ? color || "#08060d" : bg || "#fff",
        color: active ? "#fff" : color || "#555",
        fontWeight: 600,
        fontSize: "12px",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}