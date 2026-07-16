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
        const [spawns, quests] = await Promise.all([
          getSpawnPoints(),
          getSideQuests(),
        ]);
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
    if (hood && neighborhoods[hood]) {
      neighborhoods[hood].sideQuests.push(quest);
    }
  });

  const sorted = Object.entries(neighborhoods).sort((a, b) => {
    if (sortBy === "alpha") return a[0].localeCompare(b[0]);
    return b[1].spawnPoints.length + b[1].sideQuests.length - (a[1].spawnPoints.length + a[1].sideQuests.length);
  });

  if (loading) return <div className="loading">Loading neighborhoods... 🍑</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Atlanta, GA · 404</div>
        <h1 className="page-title">Neighborhoods</h1>
        <p className="page-sub">Discover which Atlanta neighborhoods have the most going on.</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        <button className={`filter-pill ${sortBy === "activity" ? "active" : ""}`} onClick={() => setSortBy("activity")}>Most active</button>
        <button className={`filter-pill ${sortBy === "alpha" ? "active" : ""}`} onClick={() => setSortBy("alpha")}>A–Z</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {sorted.map(([neighborhood, data], index) => (
          <div key={neighborhood} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "14px", padding: "1.125rem", cursor: "pointer" }}
              onClick={() => setExpanded(expanded === neighborhood ? null : neighborhood)}
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "18px", fontWeight: "700", color: sortBy === "activity" && index < 3 ? "var(--peach)" : "var(--border)", minWidth: "32px" }}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)", marginBottom: "4px" }}>{neighborhood}</div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="tag tag-peach">{data.spawnPoints.length} spawn point{data.spawnPoints.length !== 1 ? "s" : ""}</span>
                  <span className="tag tag-sage">{data.sideQuests.length} side quest{data.sideQuests.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "20px", color: "var(--ink-3)", transition: "transform 0.2s", transform: expanded === neighborhood ? "rotate(180deg)" : "rotate(0deg)" }}>
                ↓
              </div>
            </div>

            {expanded === neighborhood && (
              <div style={{ borderTop: "1.5px solid var(--border)", padding: "1.125rem", background: "var(--surface2)" }}>
                <div className="section-label" style={{ marginBottom: "0.75rem" }}>Spawn Points</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "1rem" }}>
                  {data.spawnPoints.map((spawn) => (
                    <div
                      key={spawn.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", cursor: "pointer" }}
                      onClick={() => { setSelectedSpawnPoint(spawn); setCurrentPage("spawn-point-detail"); }}
                    >
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>{spawn.name}</div>
                        <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>{spawn.category}</div>
                      </div>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "var(--ink-3)" }}>→</span>
                    </div>
                  ))}
                </div>

                {data.sideQuests.length > 0 && (
                  <>
                    <div className="section-label" style={{ marginBottom: "0.75rem" }}>Upcoming Side Quests</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {data.sideQuests.slice(0, 3).map((quest) => (
                        <div
                          key={quest.id}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", cursor: "pointer" }}
                          onClick={() => { setSelectedSideQuest(quest); setCurrentPage("side-quest-detail"); }}
                        >
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink)" }}>{quest.name}</div>
                            <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>{formatDateShort(quest.date)} · {quest.time}</div>
                          </div>
                          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "var(--ink-3)" }}>→</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}