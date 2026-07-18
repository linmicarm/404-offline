import { useState } from "react";
import { updateGoingCount } from "../api/index.js";
import { formatDateShort } from "../utils/formatDate.js";
import { highlight } from "../utils/highlight.jsx";

const RECURRENCE_LABELS = {
  weekly: "🔁 Weekly",
  biweekly: "🔁 Biweekly",
  monthly: "🔁 Monthly",
};

const SAGE_CATEGORIES = ["Social", "Language"];

const CATEGORY_GRADIENTS = {
  Gaming: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
  Social: "linear-gradient(135deg, #1A2E1A 0%, #2D5A3D 100%)",
  Cosplay: "linear-gradient(135deg, #2E1A2E 0%, #6B3A6B 100%)",
  Language: "linear-gradient(135deg, #1A2A2E 0%, #2D4A5A 100%)",
  Tabletop: "linear-gradient(135deg, #2A1A10 0%, #5A3A20 100%)",
  Other: "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
};

export default function SideQuestCard({ sideQuest, onClick, onTagClick, searchQuery }) {
  const storageKey = `going-${sideQuest.id}`;
  const [goingCount, setGoingCount] = useState(sideQuest.going_count || 0);
  const [isGoing, setIsGoing] = useState(() => !!localStorage.getItem(storageKey));
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const gradient = CATEGORY_GRADIENTS[sideQuest.category] || CATEGORY_GRADIENTS.Other;

  async function handleGoing(e) {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const action = isGoing ? "decrement" : "increment";
      const result = await updateGoingCount(sideQuest.id, action);
      setGoingCount(result.data.going_count);
      if (isGoing) {
        localStorage.removeItem(storageKey);
        setIsGoing(false);
      } else {
        localStorage.setItem(storageKey, "true");
        setIsGoing(true);
      }
    } catch (err) {
      console.error("Failed to update going count");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`card ${SAGE_CATEGORIES.includes(sideQuest.category) ? "sage-card" : ""}`}
      onClick={() => onClick && onClick(sideQuest)}
      style={{ padding: 0, overflow: "hidden" }}
    >
      <div style={{ height: "160px", position: "relative", display: "flex", alignItems: "flex-end", padding: "0.75rem", overflow: "hidden" }}>
        {/* Gradient placeholder — always visible, image fades in over it */}
        <div style={{ position: "absolute", inset: 0, background: gradient }} />
        {sideQuest.image_url && (
          <img
            src={sideQuest.image_url}
            alt={sideQuest.name}
            onLoad={() => setImageLoaded(true)}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: imageLoaded ? 1 : 0, transition: "opacity 0.3s ease" }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.0) 60%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.7)", textTransform: "uppercase", letterSpacing: "2px" }}>
            {sideQuest.category}
          </div>
        </div>
        {sideQuest.is_recurring && sideQuest.recurrence && (
          <span style={{ position: "absolute", top: "10px", right: "10px", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: "rgba(255,170,127,0.9)", color: "#6B3218", padding: "4px 10px", borderRadius: "100px", zIndex: 1 }}>
            {RECURRENCE_LABELS[sideQuest.recurrence]}
          </span>
        )}
      </div>

      <div style={{ padding: "1.125rem" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--ink)", marginBottom: "8px", lineHeight: 1.3 }}>
          {searchQuery ? highlight(sideQuest.name, searchQuery) : sideQuest.name}
        </div>

        <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--ink-2)", marginBottom: "12px", lineHeight: "1.6" }}>
          {searchQuery ? highlight(sideQuest.description, searchQuery) : sideQuest.description}
        </div>

        {sideQuest.spawn_point && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)", marginBottom: "8px" }}>
            📍 {searchQuery ? highlight(sideQuest.spawn_point.name, searchQuery) : sideQuest.spawn_point.name} · {sideQuest.spawn_point.neighborhood}
          </div>
        )}

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)", marginBottom: "14px" }}>
          🗓 {formatDateShort(sideQuest.date)} · {sideQuest.time}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span className={`tag ${sideQuest.is_free ? "tag-sage" : "tag-neutral"}`}>
              {sideQuest.is_free ? "Free" : `$${sideQuest.cost}`}
            </span>
            {sideQuest.is_beginner_friendly && <span className="tag tag-sage">Beginner ok</span>}
            {sideQuest.tags && sideQuest.tags.split(",").slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="tag tag-neutral"
                style={{ cursor: "pointer" }}
                onClick={(e) => { e.stopPropagation(); onTagClick && onTagClick(tag.trim()); }}
              >
                {searchQuery ? highlight(tag.trim(), searchQuery) : tag.trim()}
              </span>
            ))}
          </div>

          <button
            onClick={handleGoing}
            disabled={loading}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: "700",
              background: isGoing ? "var(--sage-light)" : "var(--peach-light)",
              color: isGoing ? "var(--sage-dark)" : "var(--peach-dark)",
              border: `1.5px solid ${isGoing ? "var(--sage)" : "var(--peach)"}`,
              padding: "6px 14px",
              borderRadius: "100px",
              cursor: loading ? "default" : "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}
          >
            {isGoing ? `✓ Going (${goingCount})` : `${goingCount} going`}
          </button>
        </div>
      </div>
    </div>
  );
}