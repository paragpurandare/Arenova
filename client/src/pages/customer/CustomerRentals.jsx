import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserRentals } from "../../services/bookingService";
import { STATUS_BG, STATUS_COLOR, getEquipmentEmoji } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function CustomerRentals() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRentals = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserRentals(user.id);
      setRentals(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load rentals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, [user?.id]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
            Equipment Rentals
          </h1>
          <p style={{ fontSize: "15px", color: "#888", margin: 0 }}>
            Manage your rented sports equipment.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={loadRentals}>Refresh</Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading rentals…</div>
      ) : error ? (
        <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "16px", borderRadius: "12px" }}>{error}</div>
      ) : rentals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No equipment rentals found. Add equipment when booking a court!</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {rentals.map((rental) => {
            const statusKey = rental.status?.toLowerCase() || "pending";
            return (
              <div
                key={rental.id}
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  border: "1px solid #f0ede6",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#08060d" }}>Rental Order #{rental.id}</span>
                  <Badge color={STATUS_COLOR[statusKey] || "#1D9E75"} bg={STATUS_BG[statusKey] || "#E1F5EE"}>
                    {rental.status}
                  </Badge>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  {rental.items?.map((item) => (
                    <div key={item.id} style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}>
                      {getEquipmentEmoji(item.equipmentName, item.sportType)} {item.equipmentName} × {item.quantity} (₹{item.pricePerUnit}/slot)
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #f0ede6" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#888" }}>Rental Date: {rental.rentalDate}</div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#08060d" }}>₹{rental.totalAmount}</div>
                  </div>
                  {rental.pickedUpAt && (
                    <div style={{ fontSize: "11px", color: "#0F6E56", textAlign: "right" }}>
                      Picked up:<br />
                      {String(rental.pickedUpAt).substring(0, 10)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
