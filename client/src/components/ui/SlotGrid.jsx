import { STATUS_BG, STATUS_COLOR } from "../../constants/sports";

export default function SlotGrid({ slots, onSelect, selected }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "8px",
      }}
    >
      {Object.entries(slots).map(([time, status]) => {
        const isAvailable = status === "available";
        const isSelected = selected === time;
        return (
          <button
            key={time}
            disabled={!isAvailable}
            onClick={() => onSelect?.(time)}
            style={{
              padding: "10px 6px",
              borderRadius: "8px",
              border: isSelected ? "2px solid #1D9E75" : "1px solid transparent",
              background: STATUS_BG[status] || "#f0f0f0",
              color: STATUS_COLOR[status] || "#888",
              fontSize: "13px",
              fontWeight: 600,
              cursor: isAvailable ? "pointer" : "not-allowed",
              opacity: isAvailable ? 1 : 0.7,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              textAlign: "center",
            }}
            onMouseDown={(e) => isAvailable && (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {time}
          </button>
        );
      })}
    </div>
  );
}
