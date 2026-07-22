import { useState } from "react";
import { Ban } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Input from "../ui/Input";

export default function SlotBlockerModal({ open, onClose, court, onBlock }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleBlock = () => {
    onBlock?.(court, { date, startTime, endTime, reason });
    setDate(""); setStartTime(""); setEndTime(""); setReason("");
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Block Slots — ${court?.name || ""}`} size="sm">
      <div className="space-y-4">
        <Field label="Date" required><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Time" required><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></Field>
          <Field label="End Time" required><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></Field>
        </div>
        <Field label="Reason"><Input placeholder="Maintenance, tournament, etc." value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#f0ede6]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBlock}><Ban size={16} /> Block Slots</Button>
        </div>
      </div>
    </Modal>
  );
}
