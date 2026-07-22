import { MONTHS, REVENUE_DATA } from "../../constants/mockData";

export default function RevenueChart({ data = REVENUE_DATA, months = MONTHS }) {
  const maxRev = Math.max(...data);
  return (
    <div className="bg-white rounded-2xl border border-[#f0ede6] p-6">
      <h3 className="font-bold text-base text-[#08060d] mb-5">Monthly Revenue (₹k)</h3>
      <div className="flex items-end gap-2 h-44">
        {data.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div className="w-full max-w-[32px] rounded-t-md transition-all duration-300 hover:opacity-80" style={{ height: `${(val / maxRev) * 100}%`, background: "linear-gradient(180deg, #1D9E75, #E1F5EE)" }} />
            <span className="text-[10px] text-gray-500">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
