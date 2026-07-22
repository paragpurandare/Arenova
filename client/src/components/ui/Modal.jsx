// ─── MODAL ─────────────────────────────────────────────────────────────────
// Accessible-ish modal dialog. Renders a backdrop overlay and a centered
// panel. Closes on backdrop click and Escape key. `size` controls max-width.
import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  // Close on Escape key press for keyboard accessibility.
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const maxW = { sm: "420px", md: "560px", lg: "760px", xl: "960px" }[size];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(8, 6, 13, 0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          width: "100%",
          maxWidth: maxW,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "modalIn 0.25s ease",
        }}
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              borderBottom: "1px solid #f0ede6",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#08060d" }}>
              {title}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                color: "#888",
                lineHeight: 1,
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}
