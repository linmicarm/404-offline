import { useState, useEffect } from "react";
import { getSpawnPointById } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import MapView from "./MapView.jsx";
import StarRating from "./StarRating.jsx";
import CheckInButton from "./CheckInButton.jsx";
import { formatDateShort } from "../utils/formatDate.js";

function isOpenNow(hoursStr) {
  if (!hoursStr) return null;
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const segments = hoursStr.split(", ");

  for (const segment of segments) {
    const [daysPart, timePart] = segment.split(" ");
    if (!daysPart || !timePart) continue;
    const days = daysPart.split("-");
    const startIdx = dayNames.indexOf(days[0]);
    const endIdx = dayNames.indexOf(days[1] || days[0]);
    let inRange = startIdx <= endIdx ? day >= startIdx && day <= endIdx : day >= startIdx || day <= endIdx;
    if (!inRange) continue;
    const times = timePart.split("-");
    if (times.length < 2) continue;
    function parseTime(t) {
      const isPM = t.includes("pm");
      const clean = t.replace("pm", "").replace("am", "");
      const [h, m] = clean.split(":").map(Number);
      let hours = h;
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours * 60 + (m || 0);
    }
    const openMin = parseTime(times[0]);
    const closeMin = parseTime(times[1]);
    if (closeMin < openMin) {
      if (currentMinutes >= openMin || currentMinutes < closeMin) return true;
    } else {
      if (currentMinutes >= openMin && currentMinutes < closeMin) return true;
    }
  }
  return false;
}

export default function SpawnPointDetail({ spawnPoint, setCurrentPage, setSelectedSideQuest, setEditingSpawnPoint, showModal, showToast }) {
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

  const openStatus = isOpenNow(spawn.hours);

  return (
    <div className="page">
      <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setCurrentPage("spawn-points")}>
        ← Back to spawn points
      </button>

      <div className="page-header">
        <div className="page-eyebrow">{spawn.category}</div>
        <h1 className="page-title">{spawn.name}</h1>
        <p className="page-sub">{spawn.neighborhood} · {spawn.address}</p>
      </div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span className="tag tag-peach">{spawn.category}</span>
        {openStatus === true && <span className="tag tag-sage">🟢 Open now</span>}
        {openStatus === false && <span className="tag tag-neutral">🔴 Closed</span>}
        {spawn.is_marta_accessible && <span className="tag tag-sage">🚇 MARTA accessible</span>}
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>
          Community Rating
        </div>
        <StarRating
          spawnPoint={spawn}
          onRated={(updated) => setSpawn({ ...spawn, ...updated })}
        />
      </div>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>
          Check In
        </div>
        <CheckInButton
          spawnPoint={spawn}
          onCheckedIn={(updated) => setSpawn({ ...spawn, ...updated })}
        />
      </div>

      {spawn.latitude && spawn.longitude && (
        <>
          <div className="section-label">Find it</div>
          <MapView spawnPoints={[spawn]} onSelectSpawnPoint={() => {}} singlePin />
        </>
      )}

      {spawn.hours && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Hours</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {spawn.hours.split(", ").map((segment, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < spawn.hours.split(", ").length - 1 ? "1px solid var(--border)" : "none" }}>
                <span className="mono" style={{ fontSize: "11px", color: "var(--ink-2)" }}>{segment.split(" ")[0]}</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--ink)", fontWeight: "700" }}>{segment.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {spawn.side_quests && spawn.side_quests.length > 0 && (
        <>
          <div className="section-label">Side quests here</div>
          <div className="grid-2" style={{ marginBottom: "1.5rem" }}>
            {spawn.side_quests.map((quest) => (
              <SideQuestCard
                key={quest.id}
                sideQuest={{ ...quest, spawn_point: spawn }}
                onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }}
              />
            ))}
          </div>
        </>
      )}

      {spawn.side_quests && spawn.side_quests.length === 0 && (
        <div className="empty" style={{ marginBottom: "1.5rem" }}>No side quests at this spawn point yet.</div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button className="btn-secondary" onClick={() => { setEditingSpawnPoint(spawn); setCurrentPage("spawn-point-form"); }}>
          Edit spawn point
        </button>
      </div>
    </div>
  );
}