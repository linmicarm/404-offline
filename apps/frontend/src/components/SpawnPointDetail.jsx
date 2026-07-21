import { useState, useEffect } from "react";
import { getSpawnPointById } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import MapView from "./MapView.jsx";
import StarRating from "./StarRating.jsx";
import CheckInButton from "./CheckInButton.jsx";
import SuggestEdit from "./SuggestEdit.jsx";

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

const CATEGORY_GRADIENTS = {
  "Gaming venue": "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
  "Comics & cards": "linear-gradient(135deg, #1A1A2E 0%, #4A3060 100%)",
  "Kawaii shop": "linear-gradient(135deg, #3D1A2E 0%, #8B4069 100%)",
  "Boba & matcha": "linear-gradient(135deg, #1A2E1A 0%, #2D5A3D 100%)",
  "Cute cafe": "linear-gradient(135deg, #2E1A1A 0%, #6B3A3A 100%)",
  "Asian eats": "linear-gradient(135deg, #1A2A1A 0%, #3A5A3A 100%)",
  "Other": "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
};

export default function SpawnPointDetail({ spawnPoint, setCurrentPage, setSelectedSideQuest, setEditingSpawnPoint, showModal, showToast }) {
  const [spawn, setSpawn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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

  function handleShare() {
    const text = `Check out ${spawn.name} on 404 Offline — ${spawn.address}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <div className="loading">Loading... 🍑</div>;
  if (error) return <div className="error">{error}</div>;
  if (!spawn) return <div className="error">Spawn point not found.</div>;

  const openStatus = isOpenNow(spawn.hours);
  const gradient = CATEGORY_GRADIENTS[spawn.category] || CATEGORY_GRADIENTS.Other;

  return (
    <div>
      {/* Hero */}
      <div style={{
        height: "380px",
        background: spawn.image_url ? `url(${spawn.image_url}) center/cover` : gradient,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.98) 0%, rgba(28,16,8,0.5) 50%, rgba(28,16,8,0.1) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "2rem 2.5rem", maxWidth: "1400px", width: "100%" }}>
          <button
            onClick={() => setCurrentPage("spawn-points")}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(255,252,247,0.12)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,252,247,0.2)", color: "#FFFCF7", padding: "6px 14px", borderRadius: "100px", cursor: "pointer", marginBottom: "1.25rem", display: "inline-block" }}
          >
            ← Back to spawn points
          </button>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,252,247,0.5)", marginBottom: "8px" }}>
            {spawn.category}
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", color: "#FFFCF7", lineHeight: 1.05, marginBottom: "6px" }}>
            {spawn.name}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "rgba(255,252,247,0.65)" }}>
            {spawn.neighborhood} · {spawn.address}
          </p>
        </div>
      </div>

      <div className="page">
        {/* Status + share */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {openStatus === true && <span className="tag tag-sage">🟢 Open now</span>}
            {openStatus === false && <span className="tag tag-neutral">🔴 Closed</span>}
            {spawn.is_marta_accessible && <span className="tag tag-sage">🚇 MARTA accessible</span>}
          </div>
          <button
            onClick={handleShare}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "var(--surface)", color: copied ? "var(--sage-dark)" : "var(--ink-2)", border: `1.5px solid ${copied ? "var(--sage)" : "var(--border)"}`, padding: "8px 16px", borderRadius: "100px", cursor: "pointer", transition: "all 0.2s" }}
          >
            {copied ? "✓ Copied!" : "Share this spot"}
          </button>
        </div>

        {/* Description */}
        {spawn.description && (
          <div style={{ marginBottom: "2rem" }}>
            <div className="section-label">About this place</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "var(--ink-2)", lineHeight: 1.8 }}>
              {spawn.description}
            </p>
          </div>
        )}

        {/* Three cards: hours, rating, check-in */}
        <div className="three-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
          <div className="card" style={{ cursor: "default" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Hours</div>
            {spawn.hours ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                {spawn.hours.split(", ").map((segment, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderBottom: i < spawn.hours.split(", ").length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-2)" }}>{segment.split(" ")[0]}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink)", fontWeight: "700" }}>{segment.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>Hours not listed</div>
            )}
          </div>

          <div className="card" style={{ cursor: "default" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Community Rating</div>
            <StarRating spawnPoint={spawn} onRated={(updated) => setSpawn({ ...spawn, ...updated })} />
          </div>

          <div className="card" style={{ cursor: "default" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Check In</div>
            <CheckInButton spawnPoint={spawn} onCheckedIn={(updated) => setSpawn({ ...spawn, ...updated })} />
          </div>
        </div>

        {/* Side quests */}
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
          <div className="empty" style={{ marginBottom: "1.5rem" }}>No side quests here yet. Know of an event at this spot? Add it.</div>
        )}

        {/* Map — after side quests */}
        {spawn.latitude && spawn.longitude && (
          <>
            <div className="section-label">Find it</div>
            <div style={{ height: "320px", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "1.5rem", border: "1.5px solid var(--border)" }}>
              <MapView spawnPoints={[spawn]} onSelectSpawnPoint={() => {}} singlePin />
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "0.5rem" }}>
          <button className="btn-secondary" onClick={() => { setEditingSpawnPoint(spawn); setCurrentPage("spawn-point-form"); }}>
            Edit spawn point
          </button>
        </div>
        <SuggestEdit spawnPoint={spawn} showToast={showToast} />
      </div>
    </div>
  );
}