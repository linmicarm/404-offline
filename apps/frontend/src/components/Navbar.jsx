export default function Navbar({ currentPage, setCurrentPage }) {
  function toggleDark() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  }

  return (
    <nav className="navbar">
      <div style={{ cursor: "pointer" }} onClick={() => setCurrentPage("home")}>
        <div className="navbar-logo-title">
          <span style={{ color: "var(--peach)" }}>[</span>404<span style={{ color: "var(--peach)" }}>]</span> Offline
        </div>
        <div className="navbar-logo-sub">Atlanta's nerd scene, found</div>
      </div>
      <div className="navbar-links">
        <button className={`navbar-link ${currentPage === "home" ? "active" : ""}`} onClick={() => setCurrentPage("home")}>Home</button>
        <button className={`navbar-link ${currentPage === "spawn-points" ? "active" : ""}`} onClick={() => setCurrentPage("spawn-points")}>Spawn Points</button>
        <button className={`navbar-link ${currentPage === "side-quests" ? "active" : ""}`} onClick={() => setCurrentPage("side-quests")}>Side Quests</button>
        <button className={`navbar-link ${currentPage === "neighborhoods" ? "active" : ""}`} onClick={() => setCurrentPage("neighborhoods")}>Neighborhoods</button>
        <button className={`navbar-link ${currentPage === "cons" ? "active" : ""}`} onClick={() => setCurrentPage("cons")}>Con Calendar</button>
        <button className={`navbar-link ${currentPage === "suggestions" ? "active" : ""}`} onClick={() => setCurrentPage("suggestions")} style={{ fontSize: "11px", color: currentPage === "suggestions" ? "var(--peach-dark)" : "var(--ink-3)" }}>
          Suggestions
        </button>
        <button className="btn-secondary" onClick={toggleDark} style={{ fontSize: "12px", padding: "6px 12px" }}>
          🌙 / ☀️
        </button>
      </div>
    </nav>
  );
}