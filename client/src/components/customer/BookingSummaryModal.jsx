import { Calendar, Clock, Dumbbell } from "lucide-react";
import Modal from "../ui/Modal";
import RazorpayCheckout from "./RazorpayCheckout";

export default function BookingSummaryModal({ open, onClose, club, court, slot, equipment, totalAmount, onConfirm, loading }) {
  const breakdown = [
    { label: `${court?.name || "Court"} · ${slot}`, amount: club?.price || 0 },
    ...(equipment || []).map((e) => ({ label: `${e.name} × ${e.qty}`, amount: e.qty * e.pricePerHour })),
  ];

  return (
    <Modal open={open} onClose={onClose} title="Booking Summary" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0ede6]">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "linear-gradient(135deg, #1D9E75, #185FA5)" }}>🏟️</div>
          <div>
            <h4 className="font-bold text-[#08060d] m-0">{club?.name}</h4>
            <p className="text-sm text-gray-500 m-0">{club?.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600"><Calendar size={16} color="#1D9E75" />{court?.name}</div>
          <div className="flex items-center gap-2 text-gray-600"><Clock size={16} color="#1D9E75" />{slot}</div>
        </div>
        {equipment?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600"><Dumbbell size={16} color="#1D9E75" />{equipment.map((e) => `${e.name} ×${e.qty}`).join(", ")}</div>
        )}
        <RazorpayCheckout amount={totalAmount} breakdown={breakdown} onPay={onConfirm} loading={loading} />
      </div>
    </Modal>
  );
}
