import { useState } from "react";
import { updateGoingCount } from "../api/index.js";

const RECURRENCE_LABELS = {
  weekly: "🔁 Weekly",
  biweekly: "🔁 Biweekly",
  monthly: "🔁 Monthly",
};

export default function SideQuestCard({ sideQuest, onClick, onTagClick }) {
  const [goingCount, setGoingCount] = useState(sideQuest.going_count || 0);
  const [isGoing, setIsGoing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoing(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const action = isGoing ? "decrement" : "increment";
      const result = await updateGoingCount(sideQuest.id, action);
      setGoingCount(result.data.going_count);
      setIsGoing(!isGoing);
    } catch (err) {
      console.error("Failed to update going count");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" onClick={() => onClick && onClick(sideQuest)}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--ink)", flex: 1, marginRight: "10px" }}>
          {sideQuest.name}
        </div>
        <span className="tag tag-peach">{sideQuest.category}</span>
      </div>

      <div style={{ fontSize: "13px", color: "var(--ink-2)", marginBottom: "10px", lineHeight: "1.5" }}>
        {sideQuest.description}
      </div>

      {sideQuest.spawn_point && (
        <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "8px" }}>
          📍 {sideQuest.spawn_point.name} · {sideQuest.spawn_point.neighborhood}
        </div>
      )}

      <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "10px" }}>
        🗓 {sideQuest.date} · {sideQuest.time}
        {sideQuest.is_recurring && sideQuest.recurrence && (
          <span style={{ marginLeft: "8px", color: "var(--peach-dark)", background: "var(--peach-light)", border: "1.5px solid var(--peach)", borderRadius: "100px", padding: "1px 8px", fontSize: "9px" }}>
            {RECURRENCE_LABELS[sideQuest.recurrence] || "🔁 Recurring"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span className={`tag ${sideQuest.is_free ? "tag-sage" : "tag-neutral"}`}>
            {sideQuest.is_free ? "Free" : `$${sideQuest.cost}`}
          </span>
          {sideQuest.is_beginner_friendly && (
            <span className="tag tag-sage">Beginner ok</span>
          )}
          {sideQuest.tags && sideQuest.tags.split(",").slice(0, 2).map((tag) => (
            <span key={tag} className="tag tag-neutral" style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onTagClick && onTagClick(tag.trim()); }}>
              {tag.trim()}
            </span>
          ))}
        </div>

        <button
          onClick={handleGoing}
          disabled={loading}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            fontWeight: "700",
            background: isGoing ? "var(--sage-light)" : "var(--peach-light)",
            color: isGoing ? "var(--sage-dark)" : "var(--peach-dark)",
            border: `1.5px solid ${isGoing ? "var(--sage)" : "var(--peach)"}`,
            padding: "5px 12px",
            borderRadius: "100px",
            cursor: loading ? "default" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isGoing ? `✓ Going (${goingCount})` : `${goingCount} going`}
        </button>
      </div>
    </div>
  );
}