import { RotateCcw } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function RentalReturnModal({ open, onClose, rental, onReturn }) {
  if (!rental) return null;

  return (
    <Modal open={open} onClose={onClose} title="Return Rental" size="sm">
      <div className="space-y-4">
        <div className="bg-[#faf9f6] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Rental ID</span>
            <span className="font-semibold text-[#08060d]">{rental.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Customer</span>
            <span className="font-semibold text-[#08060d]">{rental.user}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Items</span>
            <span className="font-semibold text-[#08060d] text-right">{rental.items.join(", ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deposit</span>
            <span className="font-semibold text-[#1D9E75]">₹{rental.deposit}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#f0ede6]">
            <span className="text-gray-500 text-sm">Status</span>
            <Badge color="#854F0B" bg="#FAEEDA">{rental.status}</Badge>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#f0ede6]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onReturn?.(rental); onClose?.(); }}>
            <RotateCcw size={16} /> Confirm Return
          </Button>
        </div>
      </div>
    </Modal>
  );
}
