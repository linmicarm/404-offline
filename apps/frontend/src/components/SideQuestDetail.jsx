import { useState, useEffect } from "react";
import { getSideQuestById } from "../api/index.js";

export default function SideQuestsPage({ setCurrentPage, setSelectedSideQuest, setEditingSideQuest, showModal }) {
  const [quest, setQuest] = useState(sideQuest);
  const [loading, setLoading] = useState(!sideQuest);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sideQuest) return;
    async function fetchQuest() {
      try {
        const data = await getSideQuestById(sideQuest.id);
        setQuest(data);
      } catch (err) {
        setError("Failed to load side quest.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuest();
  }, [sideQuest]);

  if (loading) return <div className="loading">Loading... 🍑</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quest) return <div className="error">Side quest not found.</div>;

  return (
    <div className="page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => setCurrentPage("side-quests")}
      >
        ← Back to side quests
      </button>

      <div className="page-header">
        <div className="page-eyebrow">{quest.category}</div>
        <h1 className="page-title">{quest.name}</h1>
        <p className="page-sub">{quest.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.5rem" }}>
        <div className="card">
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" }}>Date & Time</div>
          <div style={{ fontWeight: "700", color: "var(--ink)" }}>{quest.date}</div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--ink-2)" }}>{quest.time}</div>
        </div>
        <div className="card">
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "5px" }}>Cost</div>
          <div style={{ fontWeight: "700", color: "var(--ink)" }}>
            {quest.is_free ? "Free" : `$${quest.cost}`}
          </div>
          <div className="mono" style={{ fontSize: "11px", color: "var(--ink-2)" }}>
            {quest.is_beginner_friendly ? "Beginner friendly" : "Some experience helpful"}
          </div>
        </div>
      </div>

      {quest.spawn_point && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Spawn Point</div>
          <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--ink)", marginBottom: "3px" }}>{quest.spawn_point.name}</div>
          <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "6px" }}>{quest.spawn_point.neighborhood}</div>
          <span className="tag tag-peach">{quest.spawn_point.category}</span>
          {quest.spawn_point.is_marta_accessible && (
            <span className="tag tag-sage" style={{ marginLeft: "6px" }}>MARTA accessible</span>
          )}
        </div>
      )}

      {quest.tags && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div className="section-label">Tags</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {quest.tags.split(",").map((tag) => (
              <span key={tag} className="tag tag-neutral">{tag.trim()}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          className="btn-secondary"
          onClick={() => {
            setEditingSideQuest(quest);
            setCurrentPage("side-quest-form");
          }}
        >
          Edit side quest
        </button>
      </div>
    </div>
  );
}