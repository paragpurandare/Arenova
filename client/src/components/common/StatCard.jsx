export default function StatCard({ label, value, icon: Icon, color = "#1D9E75", bg = "#E1F5EE" }) {
  return (
    <div className="bg-white rounded-2xl border border-[#f0ede6] p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-500">{label}</span>
        {Icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: bg }}
          >
            <Icon size={18} color={color} />
          </div>
        )}
      </div>
      <div className="text-2xl font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
