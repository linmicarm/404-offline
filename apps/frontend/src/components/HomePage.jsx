import { useState, useEffect } from "react";
import { getSideQuests, getSpawnPoints } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import SpawnPointCard from "./SpawnPointCard.jsx";
import MapView from "./MapView.jsx";

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

  function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const filteredQuests = sideQuests.filter((q) =>
  normalize(q.name).includes(normalize(search)) ||
  normalize(q.category).includes(normalize(search)) ||
  (q.spawn_point?.name && normalize(q.spawn_point.name).includes(normalize(search))) ||
  (q.tags && normalize(q.tags).includes(normalize(search)))
);

const filteredSpawns = spawnPoints.filter((s) =>
  normalize(s.name).includes(normalize(search)) ||
  normalize(s.category).includes(normalize(search)) ||
  normalize(s.neighborhood).includes(normalize(search))
);

  if (loading) return <div className="loading">Loading... 🍑</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Atlanta, GA · 404</div>
        <h1 className="page-title">Your next side quest.</h1>
        <p className="page-sub">
          Game bars, boba, card shops, kawaii finds — everything between con season.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "480px", marginBottom: "1.5rem", background: "#FFF8F1", border: "1.5px solid #EAD9C8", borderRadius: "100px", padding: "8px 8px 8px 16px" }}>
        <span style={{ color: "#B89880", fontSize: "16px" }}>🔍</span>
        <input
          style={{ flex: 1, border: "none", background: "transparent", fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#2C1810", outline: "none" }}
          placeholder="Search spawn points, side quests, neighborhoods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#B89880", fontSize: "14px", padding: "0 8px" }}
          >
            ✕
          </button>
        )}
      </div>

      {!search && spawnPoints.length > 0 && (
        <MapView
          spawnPoints={spawnPoints}
          onSelectSpawnPoint={(s) => {
            setSelectedSpawnPoint(s);
            setCurrentPage("spawn-point-detail");
          }}
        />
      )}

      {search ? (
        <>
          <div className="section-label">
            Side quests matching "{search}" ({filteredQuests.length})
          </div>
          {filteredQuests.length === 0 ? (
            <div className="empty" style={{ marginBottom: "1.5rem" }}>No side quests found.</div>
          ) : (
            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              {filteredQuests.map((quest) => (
                <SideQuestCard
                  key={quest.id}
                  sideQuest={quest}
                  onClick={(q) => {
                    setSelectedSideQuest(q);
                    setCurrentPage("side-quest-detail");
                  }}
                />
              ))}
            </div>
          )}

          <div className="section-label">
            Spawn points matching "{search}" ({filteredSpawns.length})
          </div>
          {filteredSpawns.length === 0 ? (
            <div className="empty">No spawn points found.</div>
          ) : (
            <div className="grid-2">
              {filteredSpawns.map((spawn) => (
                <SpawnPointCard
                  key={spawn.id}
                  spawnPoint={spawn}
                  onClick={(s) => {
                    setSelectedSpawnPoint(s);
                    setCurrentPage("spawn-point-detail");
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="section-label">Happening soon</div>
          {sideQuests.length === 0 ? (
            <div className="empty">No side quests yet — add one!</div>
          ) : (
            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              {sideQuests.slice(0, 4).map((quest) => (
                <SideQuestCard
                  key={quest.id}
                  sideQuest={quest}
                  onClick={(q) => {
                    setSelectedSideQuest(q);
                    setCurrentPage("side-quest-detail");
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ marginBottom: "1rem", textAlign: "right" }}>
            <button className="btn-secondary" onClick={() => setCurrentPage("side-quests")}>
              View all side quests →
            </button>
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
                  onClick={(s) => {
                    setSelectedSpawnPoint(s);
                    setCurrentPage("spawn-point-detail");
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <button className="btn-secondary" onClick={() => setCurrentPage("spawn-points")}>
              View all spawn points →
            </button>
          </div>
        </>
      )}
    </div>
  );
}