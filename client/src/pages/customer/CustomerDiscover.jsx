import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchNearbyClubs } from "../../services/clubService";
import { fetchActiveCourts } from "../../services/courtService";
import { fetchSlots } from "../../services/slotService";
import { SPORTS_LIST, getSport, getSportByType } from "../../constants/sports";
import { INIT_CLUBS } from "../../constants/mockData";

import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SlotGrid from "../../components/ui/SlotGrid";
import EquipmentPicker from "../../components/ui/EquipmentPicker";
import BookingSummaryModal from "../../components/customer/BookingSummaryModal";

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
      isToday: i === 0
    });
  }
  return days;
}

export default function CustomerDiscover() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState(null);

  // Booking Modal State
  const [bookingClub, setBookingClub] = useState(null);
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

  // Open modal and immediately load active court & real-time slots
  const handleOpenBooking = async (club) => {
    setBookingClub(club);
    setLoadCourts(true);
    setSelectedSlot(null);
    setEquipment([]);
    const defaultDate = calendarDays[0].isoDate;
    setSelectedDate(defaultDate);

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
  const handleSelectDate = (isoDate) => {
    setSelectedDate(isoDate);
    if (selectedCourt) {
      getSlots(selectedCourt.id, isoDate);
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

  const filteredClubs = clubs.filter((club) => {
    if (!activeSport) return true;
    if (!club.courts?.length) return true;
    return club.courts.some((c) => (c.sportsType || c.sportId) === activeSport);
  });

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
          Discover Nearby Clubs
        </h1>
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          Live court availability starting from today.
        </p>
      </div>

      {/* Sport Categories */}
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

      {/* Interactive Booking Modal */}
      <Modal open={!!bookingClub} onClose={handleCloseBooking} title="Select Date & Time Slot" size="lg">
        {bookingClub && (
          <div>
            {/* Header */}
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700 }}>{bookingClub.name}</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
                📍 {bookingClub.location || bookingClub.address || "Pune"}
              </p>
            </div>

            {/* Active Courts Selection */}
            {loadCourts ? (
              <p style={{ color: "#888", fontSize: "13px" }}>Loading active courts…</p>
            ) : (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {courts.map((court) => {
                  const sport = getSportByType(court.sportsType) || getSport(court.sportId);
                  const isSel = selectedCourt?.id === court.id;
                  return (
                    <button
                      key={court.id}
                      onClick={() => handleSelectCourt(court)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "1px solid " + (isSel ? "#1D9E75" : "#e2e8f0"),
                        background: isSel ? "#1D9E75" : "#f8fafc",
                        color: isSel ? "#fff" : "#334155",
                        fontWeight: 600,
                        fontSize: "13px",
                      }}
                    >
                      {sport?.icon || "🏸"} {court.name || court.type}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Dynamic Date Calendar */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>
                Select Booking Date
              </div>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                {calendarDays.map((d) => {
                  const isSelected = selectedDate === d.isoDate;
                  return (
                    <button
                      key={d.isoDate}
                      onClick={() => handleSelectDate(d.isoDate)}
                      style={{
                        flex: "0 0 auto",
                        minWidth: "60px",
                        padding: "8px 10px",
                        borderRadius: "10px",
                        border: isSelected ? "2px solid #1D9E75" : "1px solid #e2e8f0",
                        background: isSelected ? "#E1F5EE" : "#fff",
                        color: isSelected ? "#0F6E56" : "#334155",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "10px", fontWeight: 700, opacity: 0.8 }}>
                        {d.isToday ? "TODAY" : d.dayName.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: 800, margin: "2px 0" }}>{d.dayNumber}</div>
                      <div style={{ fontSize: "10px", opacity: 0.8 }}>{d.monthName}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Matrix Display */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "8px" }}>
                Available Slots for {selectedDate}
              </div>
              {loadSlots ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                  Fetching live slots from API...
                </div>
              ) : slots.length === 0 ? (
                <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "8px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
                  No open slots found for this date/court.
                </div>
              ) : (
                <SlotGrid slots={slots} selected={selectedSlot} onSelect={setSelectedSlot} />
              )}
            </div>

            {/* Selected Equipment Indicator */}
            {equipment.length > 0 && (
              <div style={{ background: "#E1F5EE", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F6E56" }}>
                  Equipment Add-ons ({equipment.length})
                </div>
                {equipment.map((e) => (
                  <div key={e.id} style={{ fontSize: "12px", color: "#334155" }}>
                    {e.name} (x{e.qty}) — ₹{e.pricePerHour * e.qty}/hr
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <Button variant="outline" onClick={() => setEquipOpen(true)}>
                + Equipment
              </Button>
              <Button fullWidth disabled={!selectedSlot} onClick={() => setSummaryOpen(true)}>
                {selectedSlot ? `Confirm Booking (₹${selectedSlot.price || bookingClub.price || 350})` : "Select a Time Slot"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Equipment Modal */}
      <EquipmentPicker
        open={equipOpen}
        onClose={() => setEquipOpen(false)}
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
          onSuccess={() => {
            setSummaryOpen(false);
            handleCloseBooking();
          }}
        />
      )}
    </div>
  );
}

// ─── Auxiliary UI Components ────────────────────────────────────────────────
function ClubCard({ club, onView }) {
  return (
    <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
      <div style={{ height: "100px", background: "linear-gradient(135deg, #185FA5, #1D9E75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
        🏟️
      </div>
      <div style={{ padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700 }}>{club.name}</h3>
          <Badge color="#993556" bg="#FBEAF0">★ {club.rating || "4.5"}</Badge>
        </div>
        <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#64748b" }}>{club.location || club.address || "Pune"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: 800 }}>₹{club.price || club.basePrice || "350"}<span style={{ fontSize: "12px", fontWeight: 400, color: "#64748b" }}>/hr</span></span>
          <Button size="sm" onClick={onView}>Book</Button>
        </div>
      </div>
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