import AddClub from "../AddClub";
import Modal from "../ui/Modal";

export default function AddClubModal({ open, onClose, onSuccess }) {
  return (
    <Modal open={open} onClose={onClose} title="Register New Club" size="lg">
      <AddClub embedded onSuccess={onSuccess} />
    </Modal>
  );
}
