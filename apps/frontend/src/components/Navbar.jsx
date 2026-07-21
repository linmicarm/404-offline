import { useState } from "react";

export default function Navbar({ currentPage, setCurrentPage, onSearch }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  function toggleDark() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  }

  function handleSearch(e) {
    if (e.key === "Enter" && searchVal.trim()) {
      setCurrentPage("home");
      if (onSearch) onSearch(searchVal.trim());
      setSearchOpen(false);
      setSearchVal("");
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchVal("");
    }
  }

  return (
    <nav className="navbar">
      <div style={{ cursor: "pointer" }} onClick={() => setCurrentPage("home")}>
        <div className="navbar-logo-title" style={{ fontFamily: "'Space Mono', monospace", fontSize: "15px", fontWeight: "700", letterSpacing: "1px", lineHeight: 1 }}>
          <span style={{ color: "var(--peach)" }}>[</span>404<span style={{ color: "var(--peach)" }}>]</span> Offline
        </div>
        <div className="navbar-logo-sub">Atlanta's nerd scene, found</div>
      </div>

      <div className="navbar-links">
        {searchOpen ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--surface2)", border: "1.5px solid var(--peach)", borderRadius: "100px", padding: "6px 6px 6px 16px" }}>
            <input
              autoFocus
              style={{ border: "none", background: "transparent", fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink)", outline: "none", width: "220px" }}
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => { setSearchOpen(false); setSearchVal(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: "14px", padding: "0 8px" }}>✕</button>
          </div>
        ) : (
          <>
            <button className={`navbar-link ${currentPage === "home" ? "active" : ""}`} onClick={() => setCurrentPage("home")}>Home</button>
            <button className={`navbar-link ${currentPage === "spawn-points" ? "active" : ""}`} onClick={() => setCurrentPage("spawn-points")}>Spawn Points</button>
            <button className={`navbar-link ${currentPage === "side-quests" ? "active" : ""}`} onClick={() => setCurrentPage("side-quests")}>Side Quests</button>
            <button className={`navbar-link ${currentPage === "neighborhoods" ? "active" : ""}`} onClick={() => setCurrentPage("neighborhoods")}>Neighborhoods</button>
            <button className={`navbar-link ${currentPage === "cons" ? "active" : ""}`} onClick={() => setCurrentPage("cons")}>Con Calendar</button>
            <button onClick={() => setSearchOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-2)", fontSize: "16px", padding: "4px", display: "flex", alignItems: "center" }}>🔍</button>
            <button className="btn-secondary" onClick={toggleDark} style={{ fontSize: "12px", padding: "6px 12px" }}>🌙 / ☀️</button>
          </>
        )}
      </div>
    </nav>
  );
}