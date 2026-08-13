import { useState, useEffect } from "react";
import { fetchEquipmentByClub, fetchEquipmentAvailability } from "../../services/equipmentService";
import { EQUIPMENT_CATALOG } from "../../constants/mockData";
import { getSport, getEquipmentEmoji } from "../../constants/sports";
import Badge from "./Badge";
import Button from "./Button";

export default function EquipmentPicker({ open, onClose, onConfirm, clubId, date }) {
  const [qty, setQty] = useState({});
  const [itemsList, setItemsList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    async function loadEquipment() {
      if (!clubId) {
        setItemsList(EQUIPMENT_CATALOG);
        return;
      }
      setLoading(true);
      try {
        let data = [];
        if (date) {
          data = await fetchEquipmentAvailability(clubId, date);
        } else {
          data = await fetchEquipmentByClub(clubId);
        }

        if (isMounted) {
          if (data && data.length > 0) {
            setItemsList(
              data.map((item) => ({
                id: item.equipmentId || item.id,
                name: item.equipmentName || item.name,
                pricePerHour: item.pricePerSlot || 50,
                available: item.availableUnits !== undefined ? item.availableUnits : (item.totalStock || 10),
                sportType: item.sportType || "BADMINTON",
                icon: getEquipmentEmoji(item.equipmentName || item.name, item.sportType),
              }))
            );
          } else {
            setItemsList(EQUIPMENT_CATALOG);
          }
        }
      } catch {
        if (isMounted) setItemsList(EQUIPMENT_CATALOG);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEquipment();
    return () => { isMounted = false; };
  }, [open, clubId, date]);

  const setQuantity = (id, delta, maxAvail = 10) => {
    setQty((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(maxAvail, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const handleConfirm = () => {
    const selected = Object.entries(qty)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => {
        const item = itemsList.find((e) => String(e.id) === String(id));
        return {
          id: item?.id || id,
          name: item?.name || "Equipment",
          qty: q,
          pricePerHour: item?.pricePerHour || 50,
        };
      });
    onConfirm?.(selected);
    setQty({});
  };

  if (!open) return null;

  return (
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #f0ede6" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Add Equipment</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>Fetching equipment availability…</div>
        ) : (
          <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
            {itemsList.map((item) => {
              const sport = getSport(item.sportId) || { name: item.sportType || "Equipment", color: "#1D9E75", bg: "#E1F5EE" };
              const q = qty[item.id] || 0;
              const avail = item.available !== undefined ? item.available : 10;
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
                  <div style={{ fontSize: "28px", marginBottom: "6px" }}>{item.icon || "🎒"}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#08060d", marginBottom: "4px" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <Badge color={sport?.color} bg={sport?.bg}>{sport?.name}</Badge>
                    <span style={{ fontSize: "12px", color: "#888" }}>₹{item.pricePerHour}/slot</span>
                  </div>
                  <div style={{ fontSize: "11px", color: avail > 0 ? "#0F6E56" : "#A32D2D", marginBottom: "8px" }}>
                    {avail > 0 ? `${avail} available` : "Out of stock"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button
                      onClick={() => setQuantity(item.id, -1, avail)}
                      disabled={q === 0}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        border: "1.5px solid #e5e4e7", background: "#fff",
                        fontSize: "16px", cursor: q === 0 ? "not-allowed" : "pointer", color: "#555",
                      }}
                    >−</button>
                    <span style={{ fontWeight: 700, fontSize: "15px", minWidth: "30px", textAlign: "center" }}>{q}</span>
                    <button
                      onClick={() => setQuantity(item.id, 1, avail)}
                      disabled={q >= avail || avail === 0}
                      style={{
                        width: "30px", height: "30px", borderRadius: "8px",
                        border: "1.5px solid #1D9E75", background: "#1D9E75", color: "#fff",
                        fontSize: "16px", cursor: (q >= avail || avail === 0) ? "not-allowed" : "pointer",
                      }}
                    >+</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "16px 24px", borderTop: "1px solid #f0ede6" }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Equipment</Button>
        </div>
      </div>
    </div>
  );
}
