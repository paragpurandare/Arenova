import { useState } from "react";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import { MANAGERS_POOL } from "../../constants/mockData";

export default function AssignManagerModal({ open, onClose, club, onAssign }) {
  const [selected, setSelected] = useState(null);

  const handleConfirm = () => {
    if (selected) {
      onAssign?.(club, selected);
      setSelected(null);
      onClose?.();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign Manager" size="sm">
      <div className="space-y-3">
        <p className="text-sm text-gray-500">Select a manager for <strong className="text-[#08060d]">{club?.name}</strong></p>
        {MANAGERS_POOL.map((m) => {
          const isSel = selected?.id === m.id;
          return (
            <div key={m.id} onClick={() => setSelected(m)} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSel ? "border-[#1D9E75] bg-[#E1F5EE]" : "border-[#f0ede6] hover:border-[#1D9E75]/40"}`}>
              <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center text-lg font-bold text-[#1D9E75]">{m.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-[#08060d]">{m.name}</div>
                <div className="text-xs text-gray-500">{m.email}</div>
              </div>
              {isSel && <Badge color="#1D9E75" bg="#E1F5EE">Selected</Badge>}
            </div>
          );
        })}
        <div className="flex justify-end gap-2 pt-3 border-t border-[#f0ede6]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-semibold text-gray-500 hover:bg-[#f0ede6] transition-colors text-sm">Cancel</button>
          <button onClick={handleConfirm} disabled={!selected} className="px-4 py-2 rounded-lg font-semibold text-white bg-[#1D9E75] hover:opacity-90 disabled:opacity-50 transition-opacity text-sm">Confirm Assignment</button>
        </div>
      </div>
    </Modal>
  );
}
