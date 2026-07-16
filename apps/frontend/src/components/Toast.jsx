import { useState, useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: { background: "var(--sage-light)", color: "var(--sage-dark)", border: "1.5px solid var(--sage)" },
    error: { background: "#FEF2F2", color: "#991B1B", border: "1.5px solid #FECACA" },
    info: { background: "var(--peach-light)", color: "var(--peach-dark)", border: "1.5px solid var(--peach)" },
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 18px",
      borderRadius: "100px",
      fontFamily: "'Space Mono', monospace",
      fontSize: "12px",
      fontWeight: "700",
      boxShadow: "0 4px 20px rgba(44,24,16,0.12)",
      animation: "slideUp 0.2s ease",
      ...styles[type],
    }}>
      {type === "success" && "✓"}
      {type === "error" && "✕"}
      {type === "info" && "🍑"}
      {message}
      <button
        onClick={onClose}
        style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "14px", padding: "0 0 0 4px" }}
      >
        ✕
      </button>
    </div>
  );
}