import React from "react";

interface Props {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop confirm-modal">
      <div className="modal">
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ color: "#334155" }}>{message}</p>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            justifyContent: "flex-end",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "1px solid #e5e7eb",
              padding: ".5rem .75rem",
              borderRadius: 6,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: "linear-gradient(180deg,#FF7DB0,#FF0087)",
              border: "1px solid #FF0087",
              color: "white",
              padding: ".5rem .75rem",
              borderRadius: 6,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
