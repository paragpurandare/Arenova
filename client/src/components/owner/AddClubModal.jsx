import Modal from "../ui/Modal";

export default function AddClubModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose} title="Register New Club" size="lg">
      {children}
    </Modal>
  );
}
