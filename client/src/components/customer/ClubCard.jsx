import { MapPin, Star } from "lucide-react";
import Badge from "../ui/Badge";
import { getSport } from "../../constants/sports";

export default function ClubCard({ club, onSelect }) {
  return (
    <div
      onClick={() => onSelect?.(club)}
      className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:border-[#1D9E75]/30"
      style={{ animation: "slideUp 0.3s ease" }}
    >
      <div className="h-28 flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg, #1D9E75, #185FA5)" }}>
        🏟️
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h4 className="text-base font-bold text-[#08060d] m-0">{club.name}</h4>
          <div className="flex items-center gap-1 text-sm font-semibold text-[#BA7517]">
            <Star size={14} fill="#BA7517" />
            {club.rating}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin size={13} />
          {club.location} · {club.distance}
        </div>
        <div className="flex gap-1.5 flex-wrap mb-3">
          {club.courts.map((c) => {
            const s = getSport(c.sportId);
            return <Badge key={c.id} color={s?.color} bg={s?.bg}>{s?.icon} {s?.name}</Badge>;
          })}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#f0ede6]">
          <span className="text-sm font-bold text-[#1D9E75]">₹{club.price}/hr</span>
          <span className="text-xs text-gray-500">{club.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}
