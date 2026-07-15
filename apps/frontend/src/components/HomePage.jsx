import { useState, useEffect } from "react";
import { getSideQuests, getSpawnPoints } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import SpawnPointCard from "./SpawnPointCard.jsx";

export default function HomePage({
  setCurrentPage,
  setSelectedSideQuest,
  setSelectedSpawnPoint,
}) {
  const [sideQuests, setSideQuests] = useState([]);
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [quests, spawns] = await Promise.all([
          getSideQuests(),
          getSpawnPoints(),
        ]);
        setSideQuests(quests.slice(0, 4));
        setSpawnPoints(spawns.slice(0, 4));
      } catch (err) {
        setError("Failed to load data. Is the server running?");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading side quests... 🍑</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Atlanta, GA · 404</div>
        <h1 className="page-title">Your next side quest.</h1>
        <p className="page-sub">
          Game bars, boba, card shops, kawaii finds — everything between con
          season.
        </p>
      </div>

      <div className="section-label">Happening soon</div>
      {sideQuests.length === 0 ? (
        <div className="empty">No side quests yet — add one!</div>
      ) : (
        <div className="grid-2" style={{ marginBottom: "2rem" }}>
          {sideQuests.map((quest) => (
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
        <button
          className="btn-secondary"
          onClick={() => setCurrentPage("side-quests")}
        >
          View all side quests →
        </button>
      </div>

      <div className="section-label">Spawn Points</div>
      {spawnPoints.length === 0 ? (
        <div className="empty">No spawn points yet — add one!</div>
      ) : (
        <div className="grid-2">
          {spawnPoints.map((spawn) => (
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
        <button
          className="btn-secondary"
          onClick={() => setCurrentPage("spawn-points")}
        >
          View all spawn points →
        </button>
      </div>
    </div>
  );
}
