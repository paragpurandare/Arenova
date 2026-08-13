import { useState, useRef } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { SPORTS_LIST, SPORTS_ID_TO_TYPE } from "../../constants/sports";
import { createCourt } from "../../services/courtService";

const SPORTS_OPTIONS = SPORTS_LIST.map((s) => ({
  value: SPORTS_ID_TO_TYPE[s.id],
  label: `${s.icon} ${s.name}`,
}));

export default function AddCourtModal({ open, onClose, clubId, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    sportsType: "BADMINTON",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);
  const isSubmittingRef = useRef(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim() || isSubmittingRef.current || saving) return;
    isSubmittingRef.current = true;
    setSaving(true);
    setError(null);
    try {
      await createCourt({ name: form.name.trim(), sportsType: form.sportsType, clubId });
      setForm({ name: "", sportsType: "BADMINTON" });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to add court.");
    } finally {
      isSubmittingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Court" size="sm">
      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: "#FCEBEB", color: "#A32D2D", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
            Court Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Badminton Court 1"
            required
            style={{
              width: "100%", padding: "10px 12px", borderRadius: "8px",
              border: "1.5px solid #e0ddd7", fontSize: "14px",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3a3a3a", marginBottom: "6px" }}>
            Sport Type *
          </label>
          <select
            value={form.sportsType}
            onChange={(e) => set("sportsType", e.target.value)}
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

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Adding…" : "Add Court"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
