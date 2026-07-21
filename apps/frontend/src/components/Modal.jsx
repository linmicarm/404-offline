import { useEffect } from "react";

export default function Modal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onConfirm, onCancel]);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(28,16,8,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "1rem" }}
      onClick={onCancel}
    >
      <div
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "2rem", maxWidth: "420px", width: "100%", boxShadow: "0 24px 64px rgba(28,16,8,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--ink)", marginBottom: "0.75rem" }}>{title}</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button className="btn-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm}>{confirmLabel}</button>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textAlign: "center", marginTop: "1rem" }}>
          Press Enter to confirm · Esc to cancel
        </div>
      </div>
    </div>
  );
}