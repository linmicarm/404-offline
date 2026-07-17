import { useState, useEffect } from "react";
import { getSideQuestById, deleteSideQuest } from "../api/index.js";
import CommentSection from "./CommentSection.jsx";
import { formatDate } from "../utils/formatDate.js";

const CATEGORY_GRADIENTS = {
  Gaming: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
  Social: "linear-gradient(135deg, #1A2E1A 0%, #2D5A3D 100%)",
  Cosplay: "linear-gradient(135deg, #2E1A2E 0%, #6B3A6B 100%)",
  Language: "linear-gradient(135deg, #1A2A2E 0%, #2D4A5A 100%)",
  Tabletop: "linear-gradient(135deg, #2A1A10 0%, #5A3A20 100%)",
  Other: "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
};

const RECURRENCE_LABELS = {
  weekly: "🔁 Every week",
  biweekly: "🔁 Every two weeks",
  monthly: "🔁 Every month",
};

export default function SideQuestDetail({
  sideQuest,
  setCurrentPage,
  setEditingSideQuest,
  showModal,
  showToast,
}) {
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

  function handleDelete() {
    showModal({
      title: "Delete side quest",
      message:
        "Are you sure you want to delete this side quest? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSideQuest(quest.id);
          showToast("Side quest deleted.", "info");
          setCurrentPage("side-quests");
        } catch (err) {
          showToast("Failed to delete side quest.", "error");
        }
      },
    });
  }

  if (loading) return <div className="loading">Loading... 🍑</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quest) return <div className="error">Side quest not found.</div>;

  const gradient =
    CATEGORY_GRADIENTS[quest.category] || CATEGORY_GRADIENTS.Other;

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          minHeight: "320px",
          background: quest.image_url
            ? `url(${quest.image_url}) center/cover`
            : gradient,
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(44,24,16,0.95) 0%, rgba(44,24,16,0.3) 50%, rgba(44,24,16,0.0) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "2rem 2.5rem",
            maxWidth: "1400px",
            width: "100%",
          }}
        >
          <button
            onClick={() => setCurrentPage("side-quests")}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              background: "rgba(255,252,247,0.15)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,252,247,0.2)",
              color: "#FFFCF7",
              padding: "6px 14px",
              borderRadius: "100px",
              cursor: "pointer",
              marginBottom: "1rem",
              display: "block",
            }}
          >
            ← Back to side quests
          </button>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,252,247,0.6)",
              marginBottom: "8px",
            }}
          >
            {quest.category}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "48px",
              fontWeight: "900",
              color: "#FFFCF7",
              lineHeight: 1.05,
              letterSpacing: "-1px",
              marginBottom: "10px",
            }}
          >
            {quest.name}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "rgba(255,252,247,0.8)",
              lineHeight: 1.7,
              maxWidth: "600px",
              marginBottom: "1.25rem",
            }}
          >
            {quest.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(255,252,247,0.15)",
                color: "#FFFCF7",
                borderColor: "rgba(255,252,247,0.3)",
              }}
            >
              {quest.is_free ? "Free" : `$${quest.cost}`}
            </span>
            {quest.is_beginner_friendly && (
              <span
                className="tag"
                style={{
                  background: "rgba(133,201,160,0.2)",
                  color: "#A8E4BC",
                  borderColor: "rgba(133,201,160,0.4)",
                }}
              >
                Beginner ok
              </span>
            )}
            {quest.is_recurring && quest.recurrence && (
              <span
                className="tag"
                style={{
                  background: "rgba(255,170,127,0.2)",
                  color: "#FFCBA4",
                  borderColor: "rgba(255,170,127,0.4)",
                }}
              >
                {RECURRENCE_LABELS[quest.recurrence]}
              </span>
            )}
          </div>
        </div>

        {/* Date + going box */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2.5rem",
            background: "rgba(255,252,247,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,252,247,0.2)",
            borderRadius: "var(--radius-xl)",
            padding: "1.25rem",
            minWidth: "200px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "9px",
              color: "rgba(255,252,247,0.5)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "4px",
            }}
          >
            Date
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "15px",
              fontWeight: "700",
              color: "#FFFCF7",
              marginBottom: "2px",
            }}
          >
            {formatDate(quest.date)}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "rgba(255,252,247,0.7)",
              marginBottom: "1rem",
            }}
          >
            {quest.time}
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,252,247,0.15)",
              paddingTop: "1rem",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "rgba(255,252,247,0.5)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "4px",
              }}
            >
              Going
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                fontWeight: "900",
                color: "#FFAA7F",
                lineHeight: 1,
              }}
            >
              {quest.going_count}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255,252,247,0.5)",
                marginTop: "2px",
              }}
            >
              people interested
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        {quest.spawn_point && (
          <div
            className="card"
            style={{ marginBottom: "1.5rem", cursor: "default" }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              Location
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--ink)",
                marginBottom: "3px",
              }}
            >
              {quest.spawn_point.name}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--ink-3)",
                marginBottom: "8px",
              }}
            >
              {quest.spawn_point.neighborhood}
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span className="tag tag-peach">
                {quest.spawn_point.category}
              </span>
              {quest.spawn_point.is_marta_accessible && (
                <span className="tag tag-sage">🚇 MARTA accessible</span>
              )}
            </div>
          </div>
        )}

        {quest.tags && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div className="section-label">Tags</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {quest.tags.split(",").map((tag) => (
                <span key={tag} className="tag tag-neutral">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        <CommentSection sideQuestId={quest.id} showToast={showToast} />

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            className="btn-secondary"
            onClick={() => {
              setEditingSideQuest(quest);
              setCurrentPage("side-quest-form");
            }}
          >
            Edit side quest
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete side quest
          </button>
        </div>
      </div>
    </div>
  );
}
