export default function Footer({ setCurrentPage }) {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <footer className="footer">
        <div className="footer-logo">
          <span>[</span>404<span>]</span> Offline
        </div>
        <div className="footer-logo">
          Logged off. Went outside.
        </div>
        <div className="footer-logo" style={{ display: "flex", gap: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={() => setCurrentPage("home")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.4)" }}>Home</button>
          <button onClick={() => setCurrentPage("spawn-points")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.4)" }}>Spawn Points</button>
          <button onClick={() => setCurrentPage("cons")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.4)" }}>Con Calendar</button>
          <button onClick={() => setCurrentPage("suggestions")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.4)" }}>Suggestions</button>
        </div>
      </footer>

      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "var(--ink)",
          color: "var(--peach)",
          border: "1.5px solid var(--border)",
          cursor: "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(44,24,16,0.15)",
          transition: "transform 0.15s",
          zIndex: 50,
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
      >
        ↑
      </button>
    </>
  );
}