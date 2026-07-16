export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="navbar">
      <div>
        <div className="navbar-logo-title">
          404 <span>Offline</span>
        </div>
        <div className="navbar-logo-sub">Atlanta's nerd scene, found</div>
      </div>
      <div className="navbar-links">
        <button
          className={`navbar-link ${currentPage === "home" ? "active" : ""}`}
          onClick={() => setCurrentPage("home")}
        >
          Home
        </button>
        <button
          className={`navbar-link ${currentPage === "spawn-points" ? "active" : ""}`}
          onClick={() => setCurrentPage("spawn-points")}
        >
          Spawn Points
        </button>
        <button
          className={`navbar-link ${currentPage === "side-quests" ? "active" : ""}`}
          onClick={() => setCurrentPage("side-quests")}
        >
          Side Quests
        </button>
        <button
          className={`navbar-link ${currentPage === "neighborhoods" ? "active" : ""}`}
          onClick={() => setCurrentPage("neighborhoods")}
        >
          Neighborhoods
        </button>
        <button
          className={`navbar-link ${currentPage === "cons" ? "active" : ""}`}
          onClick={() => setCurrentPage("cons")}
        >
          Con Calendar
        </button>
      </div>
    </nav>
  );
}
