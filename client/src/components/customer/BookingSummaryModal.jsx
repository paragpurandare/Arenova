import { Calendar, Clock, Dumbbell } from "lucide-react";
import Modal from "../ui/Modal";
import RazorpayCheckout from "./RazorpayCheckout";

export default function BookingSummaryModal({
  open,
  onClose,
  club,
  court,
  slot,
  equipment = [],
  date,
  onConfirm,
  loading,
}) {
  const courtPrice = Number(court?.pricePerHour || court?.price || club?.basePrice || club?.price || 350);
  const equipTotal = equipment.reduce(
    (sum, e) => sum + Number(e.qty || e.quantity || 1) * Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 50),
    0
  );
  const totalAmount = courtPrice + equipTotal;

  const breakdown = [
    { label: `${court?.name || "Court Slot"} (${club?.name || "Club"})`, amount: courtPrice },
    ...equipment.map((e) => {
      const q = Number(e.qty || e.quantity || 1);
      const unitPrice = Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 50);
      return {
        label: `${e.name || "Equipment"} × ${q}`,
        amount: q * unitPrice,
      };
    }),
  ];

  const slotTimeStr = slot?.startTime && slot?.endTime
    ? `${String(slot.startTime).substring(0, 5)} - ${String(slot.endTime).substring(0, 5)}`
    : typeof slot === "string" ? slot : "Selected Slot";

  return (
    <Modal open={open} onClose={onClose} title="Booking Summary & Checkout" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0ede6]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #1D9E75, #185FA5)" }}>
            🏟️
          </div>
          <div>
            <h4 className="font-bold text-[#08060d] m-0">{club?.name}</h4>
            <p className="text-sm text-gray-500 m-0">{court?.name ? `${court.name} · ` : ""}{club?.location || club?.address || "Pune"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} color="#1D9E75" />
            <span>{date || slot?.slotDate || "Today"}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} color="#1D9E75" />
            <span>{slotTimeStr}</span>
          </div>
        </div>

        {equipment?.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-600 bg-[#E1F5EE] p-3 rounded-lg">
            <Dumbbell size={16} color="#1D9E75" className="mt-0.5" />
            <div>
              <div className="font-semibold text-[#0F6E56]">Equipment Add-ons:</div>
              <div>
                {equipment
                  .map((e) => {
                    const q = Number(e.qty || e.quantity || 1);
                    const unitPrice = Number(e.pricePerHour || e.pricePerSlot || e.pricePerUnit || e.price || 50);
                    return `${e.name || "Equipment"} × ${q} (₹${q * unitPrice})`;
                  })
                  .join(", ")}
              </div>
            </div>
          </div>
        )}

        <RazorpayCheckout amount={totalAmount} breakdown={breakdown} onPay={onConfirm} loading={loading} />
      </div>
    </Modal>
  );
}
