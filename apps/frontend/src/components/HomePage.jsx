import { useState, useEffect } from "react";
import { getSideQuests, getSpawnPoints, getCons } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import SpawnPointCard from "./SpawnPointCard.jsx";
import MapView from "./MapView.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";
import { formatDateShort } from "../utils/formatDate.js";

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='512' height='512' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`;

export default function HomePage({ setCurrentPage, setSelectedSideQuest, setSelectedSpawnPoint, initialSearch = "", onSearchHandled }) {
  const [sideQuests, setSideQuests] = useState([]);
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [cons, setCons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
      if (onSearchHandled) onSearchHandled();
    }
  }, [initialSearch]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [quests, spawns, conData] = await Promise.all([getSideQuests(), getSpawnPoints(), getCons()]);
        setSideQuests(quests);
        setSpawnPoints(spawns);
        setCons(conData);
      } catch (err) {
        setError("Failed to load data. Is the server running?");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredQuest = sideQuests.find((q) => q.is_featured);
  const spawnsWithImages = spawnPoints.filter((s) => s.image_url);
  const heroSpawn = spawnsWithImages.length > 0
    ? spawnsWithImages[Math.floor(Math.random() * spawnsWithImages.length)]
    : spawnPoints[0];

  const nextCon = cons
    .filter((c) => daysUntil(c.start_date) > 0)
    .sort((a, b) => daysUntil(a.start_date) - daysUntil(b.start_date))[0];

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
      <div className="grain" style={{ background: "#1C1008", height: "580px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,252,247,0.4)", letterSpacing: "2px" }}>LOADING...</div>
      </div>
      <div className="page"><SkeletonGrid count={4} /></div>
    </div>
  );

  if (error) return <div className="error" style={{ margin: "2rem" }}>{error}</div>;

  return (
    <div>
      {/* ── Hero ── */}
      <div className="hero hero-grid grain" style={{ height: "580px", display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>

        {/* Left */}
        <div style={{ background: "#1C1008", padding: "4rem 3rem 4rem 2.5rem", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 7vw, 88px)", color: "#FFFCF7", lineHeight: 0.9, letterSpacing: "-3px", marginBottom: "0.15rem" }}>
            404:
          </h1>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 7vw, 88px)", color: "#FFFCF7", lineHeight: 0.9, letterSpacing: "-3px", marginBottom: "0.15rem" }}>
            Friends
          </h1>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 7vw, 88px)", color: "#FFFCF7", lineHeight: 0.9, letterSpacing: "-3px", marginBottom: "0.15rem" }}>
            not found.
          </h1>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(52px, 7vw, 88px)", color: "var(--peach)", lineHeight: 0.9, letterSpacing: "-3px", marginBottom: "2rem" }}>
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
              style={{ flex: 1, border: "none", background: "transparent", fontFamily: "var(--font-mono)", fontSize: "14px", color: "#FFFCF7", outline: "none" }}
              placeholder="Search spawn points, side quests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,252,247,0.4)", fontSize: "14px", padding: "0 8px" }}>✕</button>}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
            <button className="btn-primary" onClick={() => setCurrentPage("side-quests")}>Find side quests</button>
            <button
              onClick={() => setCurrentPage("spawn-points")}
              style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "700", background: "transparent", color: "rgba(255,252,247,0.6)", border: "1.5px solid rgba(255,252,247,0.2)", padding: "11px 22px", borderRadius: "100px", cursor: "pointer" }}
            >
              Spawn Points →
            </button>
          </div>
        </div>

        {/* Right — image */}
        <div className="hero-image-col" style={{ position: "relative", overflow: "hidden", background: "#1C1008", height: "100%", zIndex: 1 }}>
          {heroSpawn?.image_url ? (
            <img src={heroSpawn.image_url} alt={heroSpawn.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #1C1008 0%, transparent 35%)" }} />
        </div>

        {/* Featuring card */}
        {heroSpawn && (
          <div
            style={{ position: "absolute", bottom: "1.5rem", right: "1.5rem", background: "rgba(28,16,8,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,252,247,0.15)", borderRadius: "var(--radius-md)", padding: "10px 14px", cursor: "pointer", zIndex: 10, maxWidth: "200px" }}
            onClick={() => { setSelectedSpawnPoint(heroSpawn); setCurrentPage("spawn-point-detail"); }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,252,247,0.5)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "3px" }}>Featuring</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", color: "#FFFCF7" }}>{heroSpawn.name}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.5)" }}>{heroSpawn.neighborhood}</div>
          </div>
        )}
      </div>

      <div className="page">
        
        {/* Map */}
        {!search && spawnPoints.length > 0 && (
          <div className="fade-in-up" style={{ width: "100%", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div className="section-label" style={{ marginBottom: "4px" }}>Atlanta Spawn Points</div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink-2)", lineHeight: 1.6 }}>
                  Your next side quest starts here. Roll initiative and discover where Atlanta's nerd community comes together.
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setCurrentPage("spawn-points")} style={{ whiteSpace: "nowrap" }}>View all →</button>
            </div>
            <MapView spawnPoints={spawnPoints} onSelectSpawnPoint={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }} />
          </div>
        )}

        {search ? (
          <>
            <div className="section-label">Side quests matching "{search}" ({filteredQuests.length})</div>
            {filteredQuests.length === 0 ? (
              <div className="empty" style={{ marginBottom: "1.5rem" }}>No side quests found for "{search}" — try something else.</div>
            ) : (
              <div className="grid-2" style={{ marginBottom: "2rem" }}>
                {filteredQuests.map((quest) => (
                  <SideQuestCard key={quest.id} sideQuest={quest} onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }} searchQuery={search} />
                ))}
              </div>
            )}
            <div className="section-label">Spawn points matching "{search}" ({filteredSpawns.length})</div>
            {filteredSpawns.length === 0 ? (
              <div className="empty">No spawn points found for "{search}".</div>
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
              <div className="fade-in-up" style={{ marginBottom: "2rem" }}>
                <div className="section-label">Featured</div>
                <div
                  style={{ background: "linear-gradient(135deg, var(--peach-light) 0%, var(--bg) 100%)", border: "2px solid var(--peach)", borderRadius: "var(--radius-xl)", padding: "1.75rem", position: "relative", cursor: "pointer", transition: "box-shadow 0.15s" }}
                  onClick={() => { setSelectedSideQuest(featuredQuest); setCurrentPage("side-quest-detail"); }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,170,127,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", fontSize: "20px", color: "var(--peach)" }}>★</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "3px", marginBottom: "8px" }}>{featuredQuest.category}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", color: "var(--ink)", marginBottom: "8px" }}>{featuredQuest.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "var(--ink-2)", marginBottom: "14px", lineHeight: "1.6" }}>{featuredQuest.description}</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <span className="tag tag-peach">{featuredQuest.is_free ? "Free" : `$${featuredQuest.cost}`}</span>
                    {featuredQuest.spawn_point && <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>📍 {featuredQuest.spawn_point.name} · {featuredQuest.spawn_point.neighborhood}</span>}
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>🗓 {formatDateShort(featuredQuest.date)} · {featuredQuest.time}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Happening soon — featured first card */}
            <div className="section-label">Happening soon</div>
            {sideQuests.length === 0 ? (
              <div className="empty">No quests logged yet. The adventure is out there — add the first one.</div>
            ) : (
              <>
                {/* First card — full width featured */}
                {sideQuests[0] && (
                  <div className="fade-in-up" style={{ marginBottom: "12px" }}>
                    <div
                      className={`card ${["Social","Language"].includes(sideQuests[0].category) ? "sage-card" : ""}`}
                      onClick={() => { setSelectedSideQuest(sideQuests[0]); setCurrentPage("side-quest-detail"); }}
                      style={{ padding: 0, overflow: "hidden" }}
                    >
                      <div style={{ height: "300px", position: "relative", display: "flex", alignItems: "flex-end", padding: "1.5rem", overflow: "hidden", background: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)" }}>
                        {sideQuests[0].image_url && (
                          <img src={sideQuests[0].image_url} alt={sideQuests[0].name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.92) 0%, rgba(28,16,8,0.1) 60%)" }} />
                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.6)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>{sideQuests[0].category}</div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 40px)", color: "#FFFCF7", lineHeight: 1.05, marginBottom: "6px" }}>{sideQuests[0].name}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,252,247,0.6)" }}>🗓 {formatDateShort(sideQuests[0].date)} · {sideQuests[0].time}</div>
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: "rgba(133,201,160,0.3)", color: "#A8E4BC", border: "1px solid rgba(133,201,160,0.5)", padding: "4px 12px", borderRadius: "100px" }}>
                              {sideQuests[0].is_free ? "Free" : `$${sideQuests[0].cost}`}
                            </span>
                            {sideQuests[0].spawn_point && (
                              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: "rgba(255,252,247,0.12)", color: "#FFFCF7", border: "1px solid rgba(255,252,247,0.2)", padding: "4px 12px", borderRadius: "100px" }}>
                                📍 {sideQuests[0].spawn_point.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Rest in grid */}
                {sideQuests.slice(1, 4).length > 0 && (
                  <div className="grid-2" style={{ marginBottom: "2rem" }}>
                    {sideQuests.slice(1, 4).map((quest, i) => (
                      <div key={quest.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <SideQuestCard sideQuest={quest} onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <div style={{ marginBottom: "2rem", textAlign: "right" }}>
              <button className="btn-secondary" onClick={() => setCurrentPage("side-quests")}>View all side quests →</button>
            </div>
          </>
        )}
      </div>

      {/* ── Manifesto section ── */}
      {!search && (
        <div
          className="grain manifesto-section"
          style={{ background: "#1C1008", padding: "6rem 2.5rem", margin: "0", overflow: "hidden", position: "relative" }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 2 }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 64px)", color: "#FFFCF7", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: "2rem" }}>
  The main quest may be<br />the convention.<br /><span style={{ color: "var(--peach)" }}>But the best adventures<br />happen between them.</span>
</p>
<div style={{ display: "flex", gap: "2rem", alignItems: "center", flexWrap: "wrap" }}>
  <p style={{ fontFamily: "var(--font-body)", fontSize: "18px", color: "rgba(255,252,247,0.6)", lineHeight: 1.8, maxWidth: "560px" }}>
    From local tournaments and café meetups to cosplay shoots and game nights, Atlanta's nerd community never logs off.
  </p>
              <button className="btn-primary" onClick={() => setCurrentPage("side-quests")} style={{ flexShrink: 0, fontSize: "14px", padding: "14px 28px" }}>
                Find your side quest →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Spawn Points section ── */}
      {!search && (
        <div className="page">
          <div className="section-label">Spawn Points</div>
          {spawnPoints.length === 0 ? (
            <div className="empty">No spawn points yet. Know a great spot? Add it to the map.</div>
          ) : (
            <>
              {/* First card full width */}
              {spawnPoints[0] && (
                <div className="fade-in-up" style={{ marginBottom: "12px" }}>
                  <SpawnPointCard
                    spawnPoint={spawnPoints[0]}
                    onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
                    featured
                  />
                </div>
              )}
              {/* Rest in grid */}
              {spawnPoints.slice(1, 4).length > 0 && (
                <div className="grid-2" style={{ marginBottom: "2rem" }}>
                  {spawnPoints.slice(1, 4).map((spawn, i) => (
                    <div key={spawn.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <SpawnPointCard spawnPoint={spawn} onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div style={{ textAlign: "right" }}>
            <button className="btn-secondary" onClick={() => setCurrentPage("spawn-points")}>View all spawn points →</button>
          </div>
        </div>
      )}
    </div>
  );
}