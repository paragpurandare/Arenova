// ─── EQUIPMENT PICKER ────────────────────────────────────────────────────────
// Modal-based equipment selector used inside the booking flow. Renders the
// catalog as cards with +/- quantity steppers. Returns selected items array
// to onConfirm: [{ id, name, qty, pricePerHour }].
import { useState } from "react";
import { EQUIPMENT_CATALOG } from "../../constants/mockData";
import { getSport } from "../../constants/sports";
import Badge from "./Badge";
import Button from "./Button";

export default function EquipmentPicker({ open, onClose, onConfirm }) {
  // qty map: { equipmentId: quantity }
  const [qty, setQty] = useState({});

  const setQuantity = (id, delta) => {
    setQty((prev) => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleConfirm = () => {
    const selected = Object.entries(qty)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => {
        const item = EQUIPMENT_CATALOG.find((e) => e.id === id);
        return { id, name: item.name, qty: q, pricePerHour: item.pricePerHour };
      });
    onConfirm?.(selected);
    setQty({});
  };

  return (
    <div open={open} style={{ display: open ? "block" : "none" }}>
      {/* Inline modal — avoids nested Modal import; styled consistently */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(8,6,13,0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "40px 16px",
          overflowY: "auto",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "680px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f0ede6" }}>
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Add Equipment</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}>×</button>
          </div>

          {/* Catalog grid */}
          <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {EQUIPMENT_CATALOG.map((item) => {
              const sport = getSport(item.sportId);
              const q = qty[item.id] || 0;
              return (
                <div
                  key={item.id}
                  style={{
                    border: q > 0 ? "2px solid #1D9E75" : "1.5px solid #f0ede6",
                    borderRadius: "12px",
                    padding: "14px",
                    background: q > 0 ? "#E1F5EE" : "#fff",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>{item.icon}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#08060d", marginBottom: "4px" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <Badge color={sport?.color} bg={sport?.bg}>{sport?.name}</Badge>
                    <span style={{ fontSize: "12px", color: "#888" }}>₹{item.pricePerHour}/hr</span>
                  </div>
                  {/* Quantity stepper */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                      onClick={() => setQuantity(item.id, -1)}
                      disabled={q === 0}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        border: "1.5px solid #e5e4e7", background: "#fff",
                        fontSize: "16px", cursor: q === 0 ? "not-allowed" : "pointer", color: "#555",
                      }}
                    >−</button>
                    <span style={{ fontWeight: 700, fontSize: "15px", minWidth: "30px", textAlign: "center" }}>{q}</span>
                    <button
                      onClick={() => setQuantity(item.id, 1)}
                      disabled={q >= item.available}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        border: "1.5px solid #1D9E75", background: "#1D9E75", color: "#fff",
                        fontSize: "16px", cursor: q >= item.available ? "not-allowed" : "pointer",
                      }}
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid #f0ede6" }}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleConfirm}>Confirm Equipment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
