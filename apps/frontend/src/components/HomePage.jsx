import { useState, useEffect } from "react";
import { getSideQuests, getSpawnPoints } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import SpawnPointCard from "./SpawnPointCard.jsx";
import MapView from "./MapView.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";
import { formatDateShort } from "../utils/formatDate.js";

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function HomePage({ setCurrentPage, setSelectedSideQuest, setSelectedSpawnPoint }) {
  const [sideQuests, setSideQuests] = useState([]);
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [quests, spawns] = await Promise.all([
          getSideQuests(),
          getSpawnPoints(),
        ]);
        setSideQuests(quests);
        setSpawnPoints(spawns);
      } catch (err) {
        setError("Failed to load data. Is the server running?");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredQuest = sideQuests.find((q) => q.is_featured);

  const filteredQuests = sideQuests.filter((q) =>
    normalize(q.name).includes(normalize(search)) ||
    normalize(q.category).includes(normalize(search)) ||
    (q.spawn_point?.name && normalize(q.spawn_point.name).includes(normalize(search)))
  );

  const filteredSpawns = spawnPoints.filter((s) =>
    normalize(s.name).includes(normalize(search)) ||
    normalize(s.category).includes(normalize(search)) ||
    normalize(s.neighborhood).includes(normalize(search))
  );

  if (loading) return (
    <div>
      <div className="hero">
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", color: "var(--ink)", lineHeight: "1.05", letterSpacing: "-1.5px" }}>
            Your next side quest.
          </h1>
        </div>
      </div>
      <div className="page"><SkeletonGrid count={4} /></div>
    </div>
  );

  if (error) return <div className="error" style={{ margin: "2rem" }}>{error}</div>;

  return (
    <div>
      <div className="hero">
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", color: "var(--ink)", lineHeight: "1.05", letterSpacing: "-1.5px", marginBottom: "0.75rem" }}>
            Your next<br />side quest.
          </h1>
          <p style={{ fontSize: "15px", color: "var(--ink-2)", lineHeight: "1.7", marginBottom: "1.5rem", maxWidth: "480px" }}>
            Game bars, boba, card shops, kawaii finds — the Atlanta nerd scene, between con season.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "520px", background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "100px", padding: "8px 8px 8px 16px" }}>
            <span style={{ color: "var(--ink-3)", fontSize: "16px" }}>🔍</span>
            <input
              style={{ flex: 1, border: "none", background: "transparent", fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "var(--ink)", outline: "none" }}
              placeholder="Search spawn points, side quests, neighborhoods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: "14px", padding: "0 8px" }}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="page">
        {!search && spawnPoints.length > 0 && (
          <div style={{ width: "100%", marginBottom: "2rem", marginTop: "0.5rem" }}>
            <MapView
              spawnPoints={spawnPoints}
              onSelectSpawnPoint={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
            />
          </div>
        )}

        {search ? (
          <>
            <div className="section-label">Side quests matching "{search}" ({filteredQuests.length})</div>
            {filteredQuests.length === 0 ? (
              <div className="empty" style={{ marginBottom: "1.5rem" }}>No side quests found.</div>
            ) : (
              <div className="grid-2" style={{ marginBottom: "2rem" }}>
                {filteredQuests.map((quest) => (
                  <SideQuestCard
                    key={quest.id}
                    sideQuest={quest}
                    onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }}
                    searchQuery={search}
                  />
                ))}
              </div>
            )}
            <div className="section-label">Spawn points matching "{search}" ({filteredSpawns.length})</div>
            {filteredSpawns.length === 0 ? (
              <div className="empty">No spawn points found.</div>
            ) : (
              <div className="grid-2">
                {filteredSpawns.map((spawn) => (
                  <SpawnPointCard
                    key={spawn.id}
                    spawnPoint={spawn}
                    onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
                    searchQuery={search}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {featuredQuest && (
              <div style={{ marginBottom: "2rem" }}>
                <div className="section-label">Featured</div>
                <div
                  style={{ background: "linear-gradient(135deg, var(--peach-light) 0%, var(--bg) 100%)", border: "2px solid var(--peach)", borderRadius: "var(--radius-xl)", padding: "1.75rem", position: "relative", cursor: "pointer", transition: "box-shadow 0.15s" }}
                  onClick={() => { setSelectedSideQuest(featuredQuest); setCurrentPage("side-quest-detail"); }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,170,127,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", fontSize: "20px", color: "var(--peach)" }}>★</div>
                  <div className="mono" style={{ fontSize: "9px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "8px" }}>
                    {featuredQuest.category}
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: "900", color: "var(--ink)", letterSpacing: "-0.5px", marginBottom: "8px" }}>
                    {featuredQuest.name}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--ink-2)", marginBottom: "14px", lineHeight: "1.6", maxWidth: "560px" }}>
                    {featuredQuest.description}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag tag-peach">{featuredQuest.is_free ? "Free" : `$${featuredQuest.cost}`}</span>
                    {featuredQuest.spawn_point && (
                      <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
                        📍 {featuredQuest.spawn_point.name} · {featuredQuest.spawn_point.neighborhood}
                      </span>
                    )}
                    <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
                      🗓 {formatDateShort(featuredQuest.date)} · {featuredQuest.time}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="section-label">Happening soon</div>
            {sideQuests.length === 0 ? (
              <div className="empty">No side quests yet — add one!</div>
            ) : (
              <div className="grid-2" style={{ marginBottom: "2rem" }}>
                {sideQuests.slice(0, 4).map((quest) => (
                  <SideQuestCard
                    key={quest.id}
                    sideQuest={quest}
                    onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }}
                  />
                ))}
              </div>
            )}

            <div style={{ marginBottom: "1rem", textAlign: "right" }}>
              <button className="btn-secondary" onClick={() => setCurrentPage("side-quests")}>View all side quests →</button>
            </div>

            <div className="section-label">Spawn Points</div>
            {spawnPoints.length === 0 ? (
              <div className="empty">No spawn points yet — add one!</div>
            ) : (
              <div className="grid-2">
                {spawnPoints.slice(0, 4).map((spawn) => (
                  <SpawnPointCard
                    key={spawn.id}
                    spawnPoint={spawn}
                    onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
                  />
                ))}
              </div>
            )}

            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <button className="btn-secondary" onClick={() => setCurrentPage("spawn-points")}>View all spawn points →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}