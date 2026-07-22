// ─── CUSTOMER BOOKINGS ──────────────────────────────────────────────────────
// Shows the logged-in customer's booking history in a table with status
// badges. Uses MOCK_BOOKINGS for now; swap to an API call when the endpoint
// is ready.
import { MOCK_BOOKINGS } from "../../constants/mockData";
import { STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge from "../../components/ui/Badge";

export default function CustomerBookings() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
        My Bookings
      </h1>
      <p style={{ fontSize: "15px", color: "#888", marginBottom: "28px" }}>
        Track and manage your court reservations.
      </p>

      {/* Bookings table */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
              <Th>Booking ID</Th>
              <Th>Sport</Th>
              <Th>Court</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BOOKINGS.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                <Td style={{ fontWeight: 700, color: "#08060d" }}>{b.id}</Td>
                <Td>{b.sport}</Td>
                <Td>{b.court}</Td>
                <Td>{b.date}</Td>
                <Td>{b.time}</Td>
                <Td>₹{b.amount}</Td>
                <Td>
                  <Badge color={STATUS_COLOR[b.status]} bg={STATUS_BG[b.status]}>
                    {b.status}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Table helpers ──────────────────────────────────────────────────────────
function Th({ children }) {
  return (
    <th style={{ textAlign: "left", padding: "14px 18px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#888" }}>
      {children}
    </th>
  );
}

function Td({ children, style }) {
  return (
    <td style={{ padding: "14px 18px", fontSize: "14px", color: "#555", ...style }}>
      {children}
    </td>
  );
}
