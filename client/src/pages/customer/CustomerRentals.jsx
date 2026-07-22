// ─── CUSTOMER RENTALS ───────────────────────────────────────────────────────
// Shows the customer's active and past equipment rentals. Uses RENTAL_ORDERS
// mock data; replace with an API call when the backend endpoint is ready.
import { RENTAL_ORDERS } from "../../constants/mockData";
import { STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge from "../../components/ui/Badge";

export default function CustomerRentals() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
        Equipment Rentals
      </h1>
      <p style={{ fontSize: "15px", color: "#888", marginBottom: "28px" }}>
        Manage your rented sports equipment and deposits.
      </p>

      {/* Rental cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
        {RENTAL_ORDERS.map((rental) => (
          <div
            key={rental.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #f0ede6",
              padding: "20px",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#08060d" }}>{rental.id}</span>
              <Badge color={STATUS_COLOR[rental.status]} bg={STATUS_BG[rental.status]}>
                {rental.status}
              </Badge>
            </div>

            {/* Items list */}
            <div style={{ marginBottom: "14px" }}>
              {rental.items.map((item, i) => (
                <div key={i} style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}>
                  • {item}
                </div>
              ))}
            </div>

            {/* Slot + price */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "14px", borderTop: "1px solid #f0ede6" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#888" }}>{rental.slot}</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#08060d" }}>₹{rental.total}</div>
              </div>
              {rental.deposit > 0 && (
                <div style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
                  Deposit<br />
                  <span style={{ fontWeight: 700, color: "#BA7517" }}>₹{rental.deposit}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
