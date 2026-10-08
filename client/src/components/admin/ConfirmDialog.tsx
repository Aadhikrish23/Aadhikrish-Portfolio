import { useState } from "react";
import Modal from "../common/Modal";
import { Button } from "./ui";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

// Replaces window.confirm: matches the theme, keeps the button busy while the request runs,
// and stays open if the action fails so the caller can show the error.
export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }: Props) {
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={busy ? () => {} : onCancel} title={title} size="md">
      <p className="text-muted">{message}</p>
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm} loading={busy}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
