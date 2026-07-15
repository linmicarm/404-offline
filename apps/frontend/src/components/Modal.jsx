export default function Modal({ title, message, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel", danger = false }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(44, 24, 16, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    }}>
      <div style={{
        background: "var(--bg)",
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        maxWidth: "400px",
        width: "100%",
      }}>
        <div className="mono" style={{
          fontSize: "9px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--peach)",
          marginBottom: "0.75rem",
        }}>
          404 Offline
        </div>

        <div style={{
          fontSize: "20px",
          fontWeight: "800",
          color: "var(--ink)",
          marginBottom: "0.75rem",
        }}>
          {title}
        </div>

        <p style={{
          fontSize: "14px",
          color: "var(--ink-2)",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
        }}>
          {message}
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={danger ? "btn-danger" : "btn-primary"}
            style={{ flex: 1 }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button
            className="btn-secondary"
            style={{ flex: 1 }}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}