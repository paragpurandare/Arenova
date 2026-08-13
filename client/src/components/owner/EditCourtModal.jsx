import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { SPORTS_LIST, SPORTS_ID_TO_TYPE } from "../../constants/sports";
import { updateCourt } from "../../services/courtService";

const SPORTS_OPTIONS = SPORTS_LIST.map((s) => ({
  value: SPORTS_ID_TO_TYPE[s.id],
  label: `${s.icon} ${s.name}`,
}));

function toHHMM(t) {
  if (!t) return "";
  return String(t).substring(0, 5); // "HH:MM:SS" → "HH:MM"
}

export default function EditCourtModal({ open, onClose, court, onSuccess }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    if (court) {
      setForm({
        name:        court.name        || "",
        sportsType:  court.sportsType  || "BADMINTON",
        active:      court.active !== undefined ? court.active : true,
        openTime:    toHHMM(court.openTime)  || "06:00",
        closeTime:   toHHMM(court.closeTime) || "22:00",
        slotDuration: court.slotDuration  || 60,
        bufferTime:   court.bufferTime    || 0,
        maxPlayers:   court.maxPlayers    || 4,
      });
      setError(null);
    }
  }, [court]);

  if (!form) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateCourt(court.id, {
        name:         form.name.trim(),
        sportsType:   form.sportsType,
        clubId:       court.clubId,
        openTime:     form.openTime,
        closeTime:    form.closeTime,
        slotDuration: Number(form.slotDuration),
        bufferTime:   Number(form.bufferTime),
        maxPlayers:   Number(form.maxPlayers),
        active:       form.active,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update court.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: "1.5px solid #e0ddd7", fontSize: "14px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <Modal open={open} onClose={onClose} title={`Edit Court — ${court?.name}`} size="md">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: "#FCEBEB", color: "#A32D2D", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {/* Name */}
        <Row label="Court Name *">
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} required style={inputStyle} />
        </Row>

        {/* Sport */}
        <Row label="Sport Type *">
          <select value={form.sportsType} onChange={(e) => set("sportsType", e.target.value)} style={{ ...inputStyle, background: "#fff", cursor: "pointer" }}>
            {SPORTS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Row>

        {/* Times */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <Row label="Open Time">
            <input type="time" value={form.openTime} onChange={(e) => set("openTime", e.target.value)} style={inputStyle} />
          </Row>
          <Row label="Close Time">
            <input type="time" value={form.closeTime} onChange={(e) => set("closeTime", e.target.value)} style={inputStyle} />
          </Row>
        </div>

        {/* Slot config */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <Row label="Slot Duration (min)">
            <input type="number" min="15" max="240" value={form.slotDuration} onChange={(e) => set("slotDuration", e.target.value)} style={inputStyle} />
          </Row>
          <Row label="Buffer Time (min)">
            <input type="number" min="0" max="60" value={form.bufferTime} onChange={(e) => set("bufferTime", e.target.value)} style={inputStyle} />
          </Row>
          <Row label="Max Players">
            <input type="number" min="1" max="50" value={form.maxPlayers} onChange={(e) => set("maxPlayers", e.target.value)} style={inputStyle} />
          </Row>
        </div>

        {/* Active toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "16px 0 24px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "#3a3a3a" }}>Status:</label>
          <button
            type="button"
            onClick={() => set("active", !form.active)}
            style={{
              padding: "6px 14px", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "13px",
              background: form.active ? "#E1F5EE" : "#f0ede6",
              color:      form.active ? "#0F6E56" : "#888",
            }}
          >
            {form.active ? "✓ Active" : "✗ Inactive"}
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "5px" }}>{label}</label>
      {children}
    </div>
  );
}
