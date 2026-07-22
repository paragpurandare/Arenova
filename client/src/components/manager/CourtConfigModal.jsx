import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Field from "../ui/Field";
import Input from "../ui/Input";
import { DEF_CONFIG } from "../../constants/sports";

export default function CourtConfigModal({ open, onClose, court, onSave }) {
  const [config, setConfig] = useState(court?.config || DEF_CONFIG);

  const handleSave = () => {
    onSave?.(court, config);
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Configure ${court?.name || "Court"}`} size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Open Time">
            <Input
              type="time"
              value={config.openTime}
              onChange={(e) => setConfig({ ...config, openTime: e.target.value })}
            />
          </Field>
          <Field label="Close Time">
            <Input
              type="time"
              value={config.closeTime}
              onChange={(e) => setConfig({ ...config, closeTime: e.target.value })}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Slot Duration (min)">
            <Input
              type="number"
              value={config.slotDuration}
              onChange={(e) => setConfig({ ...config, slotDuration: Number(e.target.value) })}
            />
          </Field>
          <Field label="Buffer Time (min)">
            <Input
              type="number"
              value={config.bufferTime}
              onChange={(e) => setConfig({ ...config, bufferTime: Number(e.target.value) })}
            />
          </Field>
        </div>
        <Field label="Max Players">
          <Input
            type="number"
            value={config.maxPlayers}
            onChange={(e) => setConfig({ ...config, maxPlayers: Number(e.target.value) })}
          />
        </Field>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#3a3a3a]">
            <input
              type="checkbox"
              checked={config.active}
              onChange={(e) => setConfig({ ...config, active: e.target.checked })}
              className="w-4 h-4 accent-[#1D9E75]"
            />
            Court Active
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#f0ede6]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Config</Button>
        </div>
      </div>
    </Modal>
  );
}
