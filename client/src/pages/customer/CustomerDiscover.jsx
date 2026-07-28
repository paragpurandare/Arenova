// ─── CUSTOMER DISCOVER ──────────────────────────────────────────────────────
// Landing page for customers. Shows nearby clubs fetched from the backend
// nearby-clubs endpoint (Haversine distance), a sport filter bar, and a club
// card grid. Clicking a club opens the booking modal with slot grid + equipment.
import { useEffect, useState } from "react";
import api from "../../services/api";
import { SPORTS_LIST, getSport } from "../../constants/sports";
import { INIT_CLUBS, SLOT_MAP, DAYS, DATES, MONTHS } from "../../constants/mockData";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SlotGrid from "../../components/ui/SlotGrid";
import EquipmentPicker from "../../components/ui/EquipmentPicker";



export default function CustomerDiscover() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSport, setActiveSport] = useState(null);
  const [bookingClub, setBookingClub] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [equipOpen, setEquipOpen] = useState(false);
  const [equipment, setEquipment] = useState([]);

  // Request browser geolocation and fetch nearby clubs only when the user
  // grants permission. If permission is denied or geolocation is unavailable
  // we fall back to mock data so the UI remains usable.
  useEffect(() => {
    const requestLocationAndFetch = () => {
      setLoading(true);
      if (!navigator?.geolocation) {
        console.warn("Geolocation not available - using mock data");
        setClubs(INIT_CLUBS);
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          try {
            const params = { lat, lng, radiusKm: 10 };
            console.debug("fetchNearbyClubs: calling", "/clubs/nearby", "params:", params);
            const { data } = await api.get("/clubs/nearby", { params });
            console.debug("fetchNearbyClubs: response data:", data);
            setClubs(data);
          } catch (err) {
            console.error("fetchNearbyClubs: request failed — using mock data", err);
            setClubs(INIT_CLUBS);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.warn("Geolocation permission denied or error - using mock data", err);
          setClubs(INIT_CLUBS);
          setLoading(false);
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };

    requestLocationAndFetch();
  }, []);

  // Filter clubs by selected sport (if any).
  const filteredClubs = activeSport
    ? clubs.filter((c) => c.courts?.some((court) => court.sportId === activeSport))
    : clubs;

  return (
    <div>
      {/* ─── Page header ─── */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
          Discover Nearby Clubs
        </h1>
        <p style={{ fontSize: "15px", color: "#888" }}>
          Find and book sports facilities around you in seconds.
        </p>
      </div>

      {/* ─── Sport filter bar ─── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
        <button
          onClick={() => setActiveSport(null)}
          style={{
            padding: "8px 16px", borderRadius: "999px", border: "none",
            background: activeSport === null ? "#08060d" : "#fff",
            color: activeSport === null ? "#fff" : "#555",
            fontWeight: 600, fontSize: "13px", cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)", whiteSpace: "nowrap",
          }}
        >
          All Sports
        </button>
        {SPORTS_LIST.map((sport) => {
          const isActive = activeSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setActiveSport(isActive ? null : sport.id)}
              style={{
                padding: "8px 16px", borderRadius: "999px",
                border: isActive ? "none" : `1.5px solid ${sport.color}33`,
                background: isActive ? sport.color : sport.bg,
                color: isActive ? "#fff" : sport.color,
                fontWeight: 600, fontSize: "13px", cursor: "pointer",
                whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "6px",
              }}
            >
              <span>{sport.icon}</span> {sport.name}
            </button>
          );
        })}
      </div>

      {/* ─── Club grid ─── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading clubs…</div>
      ) : filteredClubs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No clubs found for this filter.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredClubs.map((club) => (
            <ClubCard key={club.id} club={club} onBook={() => { setBookingClub(club); setSelectedSlot(null); }} />
          ))}
        </div>
      )}

      {/* ─── Booking modal ─── */}
      <Modal open={!!bookingClub} onClose={() => setBookingClub(null)} title="Book a Slot" size="lg">
        {bookingClub && (
          <div>
            {/* Club summary */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700 }}>{bookingClub.name}</h3>
              <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#888" }}>
                {bookingClub.location || bookingClub.address} · ₹{bookingClub.price || bookingClub.basePrice}/hr
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {bookingClub.courts?.map((court) => {
                  const sport = getSport(court.sportId);
                  return (
                    <Badge key={court.id} color={sport?.color} bg={sport?.bg}>
                      {sport?.icon} {court.name}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Day selector */}
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px", overflowX: "auto" }}>
              {DAYS.map((day, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  style={{
                    flex: "0 0 auto", padding: "10px 14px", borderRadius: "10px",
                    border: selectedDay === i ? "2px solid #1D9E75" : "1.5px solid #f0ede6",
                    background: selectedDay === i ? "#E1F5EE" : "#fff",
                    color: selectedDay === i ? "#1D9E75" : "#555",
                    fontWeight: 600, fontSize: "13px", cursor: "pointer", textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "11px", opacity: 0.7 }}>{day}</div>
                  <div style={{ fontSize: "16px" }}>{DATES[i]}</div>
                </button>
              ))}
            </div>

            {/* Slot grid */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "10px" }}>
                Available Time Slots · {MONTHS[5]} {DATES[selectedDay]}
              </div>
              <SlotGrid slots={SLOT_MAP} selected={selectedSlot} onSelect={setSelectedSlot} />
            </div>

            {/* Equipment summary */}
            {equipment.length > 0 && (
              <div style={{ background: "#E1F5EE", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#0F6E56", marginBottom: "6px" }}>
                  Equipment Added ({equipment.length})
                </div>
                {equipment.map((e) => (
                  <div key={e.id} style={{ fontSize: "13px", color: "#555" }}>
                    {e.name} ×{e.qty} — ₹{e.pricePerHour * e.qty}/hr
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <Button variant="outline" onClick={() => setEquipOpen(true)}>
                + Add Equipment
              </Button>
              <Button fullWidth disabled={!selectedSlot} onClick={() => { alert(`Booking confirmed at ${selectedSlot}!`); setBookingClub(null); setEquipment([]); }}>
                {selectedSlot ? `Confirm Booking · ${selectedSlot}` : "Select a slot"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Equipment picker overlay */}
      <EquipmentPicker open={equipOpen} onClose={() => setEquipOpen(false)} onConfirm={(items) => { setEquipment(items); setEquipOpen(false); }} />
    </div>
  );
}

// ─── CLUB CARD ──────────────────────────────────────────────────────────────
// Presentational card for a single club in the discover grid.
function ClubCard({ club, onBook }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #f0ede6",
        transition: "box-shadow 0.25s ease, transform 0.25s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image banner */}
      <div
        style={{
          height: "140px",
          background: "linear-gradient(135deg, #1D9E75, #185FA5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}
      >
        🏟️
      </div>

      {/* Body */}
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
          <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 700, color: "#08060d" }}>{club.name}</h3>
          <Badge color="#BA7517" bg="#FAEEDA">★ {club.rating || "4.5"}</Badge>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#888" }}>
          {club.location || club.address}
        </p>

        {/* Sport tags */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
          {club.courts?.slice(0, 3).map((court) => {
            const sport = getSport(court.sportId);
            return (
              <Badge key={court.id} color={sport?.color} bg={sport?.bg}>
                {sport?.icon} {sport?.name}
              </Badge>
            );
          })}
        </div>

        {/* Footer row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: 800, color: "#08060d" }}>
              ₹{club.price || club.basePrice}
            </span>
            <span style={{ fontSize: "13px", color: "#888" }}> /hr</span>
          </div>
          <Button size="sm" onClick={onBook}>Book Now</Button>
        </div>
      </div>
    </div>
  );
}
