import { useState, useEffect } from "react";
import { getSpawnPoints, getSideQuests } from "../api/index.js";
import { formatDateShort } from "../utils/formatDate.js";

export default function NeighborhoodPage({ setCurrentPage, setSelectedSpawnPoint, setSelectedSideQuest }) {
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [sideQuests, setSideQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [sortBy, setSortBy] = useState("activity");

  useEffect(() => {
    async function fetchData() {
      try {
        const [spawns, quests] = await Promise.all([getSpawnPoints(), getSideQuests()]);
        setSpawnPoints(spawns);
        setSideQuests(quests);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const neighborhoods = spawnPoints.reduce((acc, spawn) => {
    const hood = spawn.neighborhood;
    if (!acc[hood]) acc[hood] = { spawnPoints: [], sideQuests: [] };
    acc[hood].spawnPoints.push(spawn);
    return acc;
  }, {});

  sideQuests.forEach((quest) => {
    const hood = quest.spawn_point?.neighborhood;
    if (hood && neighborhoods[hood]) neighborhoods[hood].sideQuests.push(quest);
  });

  const sorted = Object.entries(neighborhoods).sort((a, b) => {
    if (sortBy === "alpha") return a[0].localeCompare(b[0]);
    return b[1].spawnPoints.length + b[1].sideQuests.length - (a[1].spawnPoints.length + a[1].sideQuests.length);
  });

  if (loading) return <div className="loading">Loading neighborhoods... 🍑</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <h1 className="page-title">Neighborhoods</h1>
          <p className="page-sub">Every neighborhood has its own story. Explore the places, events, and communities that make each corner of Atlanta uniquely nerdy.</p>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem" }}>
          <button className={`filter-pill ${sortBy === "activity" ? "active" : ""}`} onClick={() => setSortBy("activity")}>Most active</button>
          <button className={`filter-pill ${sortBy === "alpha" ? "active" : ""}`} onClick={() => setSortBy("alpha")}>A–Z</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sorted.map(([neighborhood, data], index) => {
          const heroImage = data.spawnPoints.find((s) => s.image_url)?.image_url;
          const isExpanded = expanded === neighborhood;

          return (
            <div key={neighborhood} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--surface)" }}>
              <div
                style={{
                  position: "relative",
                  height: isExpanded ? "180px" : "110px",
                  background: heroImage ? `url(${heroImage}) center/cover` : "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
                  cursor: "pointer",
                  transition: "height 0.3s ease",
                  display: "flex",
                  alignItems: "flex-end",
                }}
                onClick={() => setExpanded(isExpanded ? null : neighborhood)}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.95) 0%, rgba(28,16,8,0.5) 60%, rgba(28,16,8,0.15) 100%)" }} />
                <div style={{ position: "relative", zIndex: 1, padding: "1rem 1.25rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {sortBy === "activity" && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "22px", fontWeight: "700", color: index < 3 ? "var(--peach)" : "rgba(255,252,247,0.2)", minWidth: "40px" }}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    )}
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#FFFCF7", marginBottom: "6px" }}>{neighborhood}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "rgba(255,170,127,0.25)", color: "#FFCBA4", border: "1px solid rgba(255,170,127,0.4)", padding: "2px 10px", borderRadius: "100px" }}>
                          {data.spawnPoints.length} spawn point{data.spawnPoints.length !== 1 ? "s" : ""}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "rgba(133,201,160,0.25)", color: "#A8E4BC", border: "1px solid rgba(133,201,160,0.4)", padding: "2px 10px", borderRadius: "100px" }}>
                          {data.sideQuests.length} side quest{data.sideQuests.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "20px", color: "rgba(255,252,247,0.5)", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>↓</div>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: "1.25rem", background: "var(--surface2)" }}>
                  {data.spawnPoints.some((s) => s.image_url) && (
                    <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", overflowX: "auto", paddingBottom: "4px" }}>
                      {data.spawnPoints.filter((s) => s.image_url).map((spawn) => (
                        <div
                          key={spawn.id}
                          onClick={() => { setSelectedSpawnPoint(spawn); setCurrentPage("spawn-point-detail"); }}
                          style={{ flexShrink: 0, width: "160px", height: "100px", borderRadius: "var(--radius-md)", overflow: "hidden", cursor: "pointer", position: "relative", border: "1.5px solid var(--border)" }}
                        >
                          <img src={spawn.image_url} alt={spawn.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.85) 0%, transparent 50%)" }} />
                          <div style={{ position: "absolute", bottom: "6px", left: "8px", fontFamily: "var(--font-display)", fontSize: "12px", color: "#FFFCF7", lineHeight: 1.2 }}>{spawn.name}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="section-label" style={{ marginBottom: "0.75rem" }}>Spawn Points</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px", marginBottom: "1.25rem" }}>
                    {data.spawnPoints.map((spawn) => (
                      <div
                        key={spawn.id}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", cursor: "pointer" }}
                        onClick={() => { setSelectedSpawnPoint(spawn); setCurrentPage("spawn-point-detail"); }}
                      >
                        <div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--ink)" }}>{spawn.name}</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>{spawn.category}</div>
                        </div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--peach)" }}>→</span>
                      </div>
                    ))}
                  </div>

                  {data.sideQuests.length > 0 && (
                    <>
                      <div className="section-label" style={{ marginBottom: "0.75rem" }}>Upcoming Side Quests</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "8px" }}>
                        {data.sideQuests.slice(0, 4).map((quest) => (
                          <div
                            key={quest.id}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", cursor: "pointer" }}
                            onClick={() => { setSelectedSideQuest(quest); setCurrentPage("side-quest-detail"); }}
                          >
                            <div>
                              <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--ink)" }}>{quest.name}</div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>{formatDateShort(quest.date)} · {quest.time}</div>
                            </div>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", color: "var(--peach)" }}>→</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}