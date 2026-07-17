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
        const [quests, spawns] = await Promise.all([getSideQuests(), getSpawnPoints()]);
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
  const heroSpawn = spawnPoints.find((s) => s.image_url) || spawnPoints[0];

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
      <div style={{ background: "var(--ink)", height: "560px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,252,247,0.4)", letterSpacing: "2px" }}>LOADING...</div>
      </div>
      <div className="page"><SkeletonGrid count={4} /></div>
    </div>
  );

  if (error) return <div className="error" style={{ margin: "2rem" }}>{error}</div>;

  return (
    <div>
      {/* Hero */}
      <div style={{ background: "var(--ink)", minHeight: "580px", display: "grid", gridTemplateColumns: "1fr 1fr", overflow: "hidden" }}>

        {/* Left — copy */}
        <div style={{ padding: "4rem 3rem 4rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
         
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "58px", fontWeight: "400", color: "#FFFCF7", lineHeight: 1.05, marginBottom: "0.4rem" }}>
            404:
          </h1>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "58px", fontWeight: "400", color: "#FFFCF7", lineHeight: 1.05, marginBottom: "0.4rem" }}>
            Friends not found.
          </h1>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "58px", fontWeight: "400", color: "var(--peach)", lineHeight: 1.05, marginBottom: "1rem" }}>
            We fixed that.
          </h1>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,252,247,0.35)", letterSpacing: "2px", marginBottom: "1.5rem" }}>
            CONNECTION RESTORED ✓
          </div>

          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "rgba(255,252,247,0.65)", lineHeight: 1.8, marginBottom: "2rem", maxWidth: "420px" }}>
            Discover Atlanta's nerd community through cafés, arcades, game nights, cosplay meetups, conventions, card shops, and more.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "460px", background: "rgba(255,252,247,0.08)", border: "1.5px solid rgba(255,252,247,0.15)", borderRadius: "100px", padding: "10px 10px 10px 18px" }}>
            <span style={{ color: "rgba(255,252,247,0.4)", fontSize: "16px" }}>🔍</span>
            <input
              style={{ flex: 1, border: "none", background: "transparent", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#FFFCF7", outline: "none" }}
              placeholder="Search spawn points, side quests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,252,247,0.4)", fontSize: "14px", padding: "0 8px" }}>✕</button>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
            <button className="btn-primary" onClick={() => setCurrentPage("side-quests")}>
              Find side quests
            </button>
            <button
              onClick={() => setCurrentPage("spawn-points")}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", background: "transparent", color: "rgba(255,252,247,0.6)", border: "1.5px solid rgba(255,252,247,0.2)", padding: "10px 20px", borderRadius: "100px", cursor: "pointer", transition: "border-color 0.15s" }}
            >
              Spawn Points →
            </button>
          </div>
        </div>

        {/* Right — hero image */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {heroSpawn?.image_url ? (
            <img
              src={heroSpawn.image_url}
              alt={heroSpawn.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--ink) 0%, transparent 30%)" }} />
          {heroSpawn && (
            <div style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", background: "rgba(28,16,8,0.7)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,252,247,0.15)", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,252,247,0.5)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "3px" }}>Featuring</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "#FFFCF7" }}>{heroSpawn.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.5)" }}>{heroSpawn.neighborhood}</div>
            </div>
          )}
        </div>
      </div>

      <div className="page">
        {!search && spawnPoints.length > 0 && (
  <div style={{ width: "100%", marginBottom: "2rem", marginTop: "0.5rem" }}>
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
      <div>
        <div className="section-label" style={{ marginBottom: "4px" }}>Atlanta Spawn Points</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.6 }}>
  Your next side quest starts here. Roll initiative and discover where Atlanta's nerd community comes together.
</p>
      </div>
      <button className="btn-secondary" onClick={() => setCurrentPage("spawn-points")} style={{ whiteSpace: "nowrap" }}>
        View all →
      </button>
    </div>
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
                  <SideQuestCard key={quest.id} sideQuest={quest} onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }} searchQuery={search} />
                ))}
              </div>
            )}
            <div className="section-label">Spawn points matching "{search}" ({filteredSpawns.length})</div>
            {filteredSpawns.length === 0 ? (
              <div className="empty">No spawn points found.</div>
            ) : (
              <div className="grid-2">
                {filteredSpawns.map((spawn) => (
                  <SpawnPointCard key={spawn.id} spawnPoint={spawn} onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }} searchQuery={search} />
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
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "8px" }}>
                    {featuredQuest.category}
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--ink)", marginBottom: "8px" }}>
                    {featuredQuest.name}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink-2)", marginBottom: "14px", lineHeight: "1.6", maxWidth: "560px" }}>
                    {featuredQuest.description}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag tag-peach">{featuredQuest.is_free ? "Free" : `$${featuredQuest.cost}`}</span>
                    {featuredQuest.spawn_point && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>
                        📍 {featuredQuest.spawn_point.name} · {featuredQuest.spawn_point.neighborhood}
                      </span>
                    )}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>
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
                  <SideQuestCard key={quest.id} sideQuest={quest} onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }} />
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
                  <SpawnPointCard key={spawn.id} spawnPoint={spawn} onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }} />
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