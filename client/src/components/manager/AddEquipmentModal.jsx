import { useState, useRef } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { SPORTS_LIST, SPORTS_ID_TO_TYPE } from "../../constants/sports";
import { createEquipment } from "../../services/equipmentService";

const SPORTS_OPTIONS = SPORTS_LIST.map((s) => ({
  value: SPORTS_ID_TO_TYPE[s.id] || "BADMINTON",
  label: `${s.icon} ${s.name}`,
}));

export default function AddEquipmentModal({ open, onClose, clubId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    sportType: "BADMINTON",
    pricePerSlot: "50",
    totalStock: "10",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isSubmittingRef = useRef(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || !clubId || isSubmittingRef.current || saving) return;
    isSubmittingRef.current = true;
    setSaving(true);
    setError(null);
    try {
      await createEquipment(clubId, {
        name: form.name.trim(),
        sportType: form.sportType,
        pricePerSlot: Number(form.pricePerSlot),
        totalStock: Number(form.totalStock),
      });
      setForm({ name: "", sportType: "BADMINTON", pricePerSlot: "50", totalStock: "10" });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add equipment.");
    } finally {
      isSubmittingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Equipment to Rental Catalog" size="sm">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: "#FCEBEB", color: "#A32D2D", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
            Equipment Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Yonex Badminton Racket"
            required
            style={{
              width: "100%", padding: "10px 12px", borderRadius: "8px",
              border: "1.5px solid #e0ddd7", fontSize: "14px",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
            Sport Category *
          </label>
          <select
            value={form.sportType}
            onChange={(e) => set("sportType", e.target.value)}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: "8px",
              border: "1.5px solid #e0ddd7", fontSize: "14px",
              background: "#fff", outline: "none", cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            {SPORTS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
              Price / Slot (₹) *
            </label>
            <input
              type="number"
              min="0"
              value={form.pricePerSlot}
              onChange={(e) => set("pricePerSlot", e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "8px",
                border: "1.5px solid #e0ddd7", fontSize: "14px",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
              Total Stock Units *
            </label>
            <input
              type="number"
              min="1"
              value={form.totalStock}
              onChange={(e) => set("totalStock", e.target.value)}
              required
              style={{
                width: "100%", padding: "10px 12px", borderRadius: "8px",
                border: "1.5px solid #e0ddd7", fontSize: "14px",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Add Equipment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
