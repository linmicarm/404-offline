import { useState, useEffect } from "react";
import { getSpawnPointById } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import MapView from "./MapView.jsx";

export default function SpawnPointDetail({ spawnPoint, setCurrentPage, setSelectedSideQuest, setEditingSpawnPoint }) {
  const [spawn, setSpawn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!spawnPoint) return;
    async function fetchSpawn() {
      try {
        const data = await getSpawnPointById(spawnPoint.id);
        setSpawn(data);
      } catch (err) {
        setError("Failed to load spawn point.");
      } finally {
        setLoading(false);
      }
    }
    fetchSpawn();
  }, [spawnPoint]);

  if (loading) return <div className="loading">Loading... 🍑</div>;
  if (error) return <div className="error">{error}</div>;
  if (!spawn) return <div className="error">Spawn point not found.</div>;

  return (
    <div className="page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => setCurrentPage("spawn-points")}
      >
        ← Back to spawn points
      </button>

      <div className="page-header">
        <div className="page-eyebrow">{spawn.category}</div>
        <h1 className="page-title">{spawn.name}</h1>
        <p className="page-sub">{spawn.neighborhood} · {spawn.address}</p>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span className="tag tag-peach">{spawn.category}</span>
        {spawn.is_marta_accessible && (
          <span className="tag tag-sage">MARTA accessible</span>
        )}
      </div>

      {spawn.side_quests && spawn.side_quests.length > 0 && (
        <>
          <div className="section-label">Side quests here</div>
          <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
            {spawn.side_quests.map((quest) => (
              <SideQuestCard
                key={quest.id}
                sideQuest={{ ...quest, spawn_point: spawn }}
                onClick={(q) => {
                  setSelectedSideQuest(q);
                  setCurrentPage("side-quest-detail");
                }}
              />
            ))}
          </div>
        </>
      )}

      {spawn.side_quests && spawn.side_quests.length === 0 && (
        <div className="empty" style={{ marginBottom: "1.5rem" }}>
          No side quests at this spawn point yet.
        </div>
      )}

{spawn.latitude && spawn.longitude && (
  <>
    <div className="section-label">Find it</div>
    <MapView
      spawnPoints={[spawn]}
      onSelectSpawnPoint={() => {}}
      singlePin
    />
  </>
)}

      <button
        className="btn-secondary"
        onClick={() => {
          setEditingSpawnPoint(spawn);
          setCurrentPage("spawn-point-form");
        }}
      >
        Edit spawn point
      </button>
    </div>
  );
}