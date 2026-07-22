// ─── CUSTOMER RECOMMENDATIONS ──────────────────────────────────────────────
// "For You" page showing recommended clubs based on past bookings. For now
// uses the same mock club list with a "Recommended" badge. When the backend
// recommendation engine is ready, swap fetchRecommended() to call the API.
import { useEffect, useState } from "react";
import { INIT_CLUBS } from "../../constants/mockData";
import { getSport } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function CustomerRecommendations() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    // Simulate an API call — in production this would hit a /api/recommendations
    // endpoint that analyzes the user's booking history.
    setClubs(INIT_CLUBS);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
        Recommended For You
      </h1>
      <p style={{ fontSize: "15px", color: "#888", marginBottom: "28px" }}>
        Clubs picked based on your booking history and preferences.
      </p>

      {/* Horizontal scroll row of recommendation cards */}
      <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
        {clubs.map((club) => (
          <div
            key={club.id}
            style={{
              flex: "0 0 320px",
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #f0ede6",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "120px", background: "linear-gradient(135deg, #185FA5, #1D9E75)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
              🏟️
            </div>
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>{club.name}</h3>
                <Badge color="#993556" bg="#FBEAF0">★ {club.rating}</Badge>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#888" }}>{club.location}</p>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "14px" }}>
                {club.courts?.slice(0, 2).map((c) => {
                  const s = getSport(c.sportId);
                  return <Badge key={c.id} color={s?.color} bg={s?.bg}>{s?.icon} {s?.name}</Badge>;
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: 800 }}>₹{club.price}<span style={{ fontSize: "13px", color: "#888", fontWeight: 400 }}> /hr</span></span>
                <Button size="sm">View</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
