import { MapPin, Star } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { getSport, getSportByType } from "../../constants/sports";

export default function ClubCard({ club, onView }) {
  // Format location to compact area + city (e.g. "Baner, Pune")
  const area = club.address ? club.address.split(",")[0].trim() : "";
  const city = club.city || "";
  const compactLocation = club.location || (area && city ? `${area}, ${city}` : club.address || "Pune");
  const distanceStr = club.distanceKm ? `${club.distanceKm} km` : club.distance || "";

  const price = club.basePrice || club.price || 350;
  const rating = club.rating || "4.7";

  return (
    <div
      onClick={onView}
      className="bg-white rounded-2xl border border-[#f0ede6] overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 hover:border-[#1D9E75]/30 flex flex-col justify-between"
    >
      <div>
        <div
          className="h-28 flex items-center justify-center text-4xl relative"
          style={{ background: "linear-gradient(135deg, #185FA5, #1D9E75)" }}
        >
          🏟️
          {club.imageUrl && (
            <img src={club.imageUrl} alt={club.name} className="w-full h-full object-cover absolute inset-0 opacity-40" />
          )}
          {club.managerName && (
            <span className="absolute top-2 left-2 bg-[#534AB7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Manager: {club.managerName}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-1.5 gap-2">
            <h3 className="text-base font-bold text-[#08060d] m-0 line-clamp-1">{club.name}</h3>
            <Badge color="#993556" bg="#FBEAF0">
              <span className="flex items-center gap-1">
                <Star size={12} fill="#993556" /> {rating}
              </span>
            </Badge>
          </div>

          <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <MapPin size={13} className="text-[#1D9E75] shrink-0" />
            <span className="truncate">{compactLocation}</span>
            {distanceStr && <span className="font-semibold text-gray-700 shrink-0">· {distanceStr}</span>}
          </p>

          {/* Sport Badges */}
          <div className="flex gap-1 flex-wrap mb-4">
            {club.courts && club.courts.length > 0 ? (
              club.courts.slice(0, 3).map((c, i) => {
                const s = getSportByType(c.sportsType) || getSport(c.sportId);
                return (
                  <Badge key={c.id || i} color={s?.color || "#1D9E75"} bg={s?.bg || "#E1F5EE"}>
                    {s?.icon || "🏸"} {s?.name || c.name}
                  </Badge>
                );
              })
            ) : (
              <Badge color="#1D9E75" bg="#E1F5EE">🏸 Badminton</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-[#f0ede6]/60 flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-extrabold text-[#08060d]">₹{price}</span>
          <span className="text-xs text-gray-500 font-normal"> /hr</span>
        </div>
        <Button size="sm" onClick={(e) => { e.stopPropagation(); onView?.(club); }}>
          View & Book
        </Button>
      </div>
    </div>
  );
}
