import { STATUS_BG, STATUS_COLOR } from "../../constants/sports";

/**
 * SlotGrid — renders a grid of time-slot buttons.
 *
 * Accepts two formats:
 *   1. Array of SlotsResponseDTO objects from the backend:
 *      [{ id, courtId, slotDate, startTime, endTime, status }]
 *      `selected` should be the slot id (number).
 *
 *   2. Legacy map format { "06:00": "available", ... }
 *      `selected` is the time string.
 */
export default function SlotGrid({ slots, onSelect, selected }) {
  // Normalise to a flat list of { key, label, status }
  const items = Array.isArray(slots)
    ? slots.map((s) => ({
        key: s.id,
        label: fmtTime(s.startTime) + "–" + fmtTime(s.endTime),
        status: (s.status || "").toLowerCase(),
        raw: s,
      }))
    : Object.entries(slots || {}).map(([time, status]) => ({
        key: time,
        label: time,
        status: status,
        raw: null,
      }));

  if (items.length === 0) {
    return (
      <p style={{ color: "#888", fontSize: "13px", textAlign: "center", padding: "16px" }}>
        No slots available for this date.
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "8px",
      }}
    >
      {items.map(({ key, label, status, raw }) => {
        const isAvailable = status === "available";
        const isSelected  = selected === key || selected?.id === key;
        return (
          <button
            key={key}
            disabled={!isAvailable}
            onClick={() => onSelect?.(raw || key)}
            style={{
              padding: "10px 6px",
              borderRadius: "8px",
              border: isSelected
                ? "2px solid #1D9E75"
                : "1px solid transparent",
              background: STATUS_BG[status] || STATUS_BG[status?.toUpperCase()] || "#f0f0f0",
              color:      STATUS_COLOR[status] || STATUS_COLOR[status?.toUpperCase()] || "#888",
              fontSize: "12px",
              fontWeight: 600,
              cursor: isAvailable ? "pointer" : "not-allowed",
              opacity: isAvailable ? 1 : 0.7,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              textAlign: "center",
              lineHeight: 1.4,
            }}
            onMouseDown={(e) => isAvailable && (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e)   => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

/** Format "HH:MM:SS" or "HH:MM" → "HH:MM" */
function fmtTime(t) {
  if (!t) return "";
  return String(t).substring(0, 5);
}
