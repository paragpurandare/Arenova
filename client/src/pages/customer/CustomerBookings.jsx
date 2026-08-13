import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchUserBookings, cancelBooking } from "../../services/bookingService";
import { STATUS_BG, STATUS_COLOR } from "../../constants/sports";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { QrCode, Ticket, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeQrModal, setActiveQrModal] = useState(null);

  const loadBookings = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserBookings(user.id);
      setBookings(data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user?.id]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(id);
    try {
      await cancelBooking(id);
      await loadBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Cancellation failed.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#08060d", margin: "0 0 6px" }}>
            My Bookings & QR Passes
          </h1>
          <p style={{ fontSize: "15px", color: "#888", margin: 0 }}>
            Track reservations, present QR entry passes, and manage bookings.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={loadBookings}>Refresh</Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading your bookings…</div>
      ) : error ? (
        <div style={{ background: "#FCEBEB", color: "#A32D2D", padding: "16px", borderRadius: "12px" }}>{error}</div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>No bookings found yet. Discover a club and book a slot!</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #f0ede6", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#faf9f6", borderBottom: "1.5px solid #f0ede6" }}>
                <Th>Booking ID</Th>
                <Th>Club & Court</Th>
                <Th>Date & Time</Th>
                <Th>Total</Th>
                <Th>QR Entry Pass</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const statusKey = b.status?.toLowerCase() || "pending";
                const isPending = b.status === "PENDING" || b.status === "CONFIRMED";
                const isCancelling = cancellingId === b.id;
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f0ede6" }}>
                    <Td style={{ fontWeight: 700, color: "#08060d" }}>#{b.id}</Td>
                    <Td>
                      <div style={{ fontWeight: 600, color: "#08060d" }}>{b.clubName || "Club"}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{b.courtName} ({b.sportsType || "Sports"})</div>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 600 }}>{b.slotDate}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {b.startTime ? String(b.startTime).substring(0, 5) : ""} - {b.endTime ? String(b.endTime).substring(0, 5) : ""}
                      </div>
                    </Td>
                    <Td style={{ fontWeight: 700 }}>₹{b.totalPayable || b.courtAmount}</Td>
                    <Td>
                      <button
                        onClick={() => setActiveQrModal(b)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E1F5EE] text-[#0F6E56] font-bold text-xs hover:bg-[#d0efe3] transition-all border border-[#9FE1CB] cursor-pointer"
                      >
                        <QrCode size={14} /> View Pass
                      </button>
                    </Td>
                    <Td>
                      <Badge color={STATUS_COLOR[statusKey] || "#1D9E75"} bg={STATUS_BG[statusKey] || "#E1F5EE"}>
                        {b.status}
                      </Badge>
                    </Td>
                    <Td>
                      {isPending ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isCancelling}
                          onClick={() => handleCancel(b.id)}
                        >
                          {isCancelling ? "…" : "Cancel"}
                        </Button>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#888" }}>—</span>
                      )}
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Code Entry Pass Modal */}
      {activeQrModal && (
        <Modal open={!!activeQrModal} onClose={() => setActiveQrModal(null)} title="Entry & Verification Pass" size="sm">
          <div className="text-center p-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E1F5EE] text-[#0F6E56] mb-3">
              <Ticket size={32} />
            </div>
            <h3 className="font-bold text-lg text-[#08060d] m-0">{activeQrModal.clubName || "Arenova Club"}</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">{activeQrModal.courtName} · {activeQrModal.slotDate}</p>

            {/* Generated QR Code Card */}
            <div className="bg-[#faf9f6] border-2 border-dashed border-[#1D9E75]/40 rounded-2xl p-6 mb-4 flex flex-col items-center justify-center">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(activeQrModal.qrCode || `ARENOVA-BK-${activeQrModal.id}`)}`}
                  alt="Entry QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 font-mono font-bold text-sm tracking-wider text-[#08060d]">
                {activeQrModal.qrCode || `ARENOVA-BK-${activeQrModal.id}`}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-gray-50 p-3 rounded-lg text-gray-600 mb-4">
              <span>Status: <strong className="text-[#0F6E56]">{activeQrModal.status}</strong></span>
              <span>Total Paid: <strong>₹{activeQrModal.totalPayable || activeQrModal.courtAmount}</strong></span>
            </div>

            <p className="text-[11px] text-gray-400 m-0">
              Present this QR code to the club manager at the check-in desk for entry & equipment pickup.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

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
