import { ShieldCheck, Loader as Loader2 } from "lucide-react";

export default function RazorpayCheckout({ amount, breakdown, onPay, loading }) {
  return (
    <div className="space-y-4">
      {breakdown && (
        <div className="bg-[#faf9f6] rounded-xl p-4 space-y-2">
          {breakdown.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-semibold text-[#08060d]">₹{item.amount}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-[#f0ede6]">
            <span className="font-bold text-[#08060d]">Total</span>
            <span className="font-extrabold text-[#1D9E75]">₹{amount}</span>
          </div>
        </div>
      )}
      <button
        onClick={onPay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: "#1D9E75" }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        {loading ? "Processing…" : `Pay ₹${amount} with Razorpay`}
      </button>
      <p className="text-center text-xs text-gray-400">Secured by Razorpay · Test Mode</p>
    </div>
  );
}
