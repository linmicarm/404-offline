import { useState, useEffect } from "react";
import { getSideQuestById, deleteSideQuest } from "../api/index.js";
import CommentSection from "./CommentSection.jsx";
import { formatDate } from "../utils/formatDate.js";

const CATEGORY_COLORS = {
  Gaming: { bg: "var(--peach-light)", border: "var(--peach)", text: "var(--peach-dark)" },
  Social: { bg: "var(--sage-light)", border: "var(--sage)", text: "var(--sage-dark)" },
  Cosplay: { bg: "var(--peach-light)", border: "var(--peach)", text: "var(--peach-dark)" },
  Language: { bg: "var(--sage-light)", border: "var(--sage)", text: "var(--sage-dark)" },
  Tabletop: { bg: "var(--peach-light)", border: "var(--peach)", text: "var(--peach-dark)" },
  Other: { bg: "var(--surface2)", border: "var(--border)", text: "var(--ink-2)" },
};

const RECURRENCE_LABELS = {
  weekly: "🔁 Every week",
  biweekly: "🔁 Every two weeks",
  monthly: "🔁 Every month",
};

export default function SideQuestDetail({ sideQuest, setCurrentPage, setEditingSideQuest, showModal, showToast }) {
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
      message: "Are you sure you want to delete this side quest? This action cannot be undone.",
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

  const colors = CATEGORY_COLORS[quest.category] || CATEGORY_COLORS.Other;

  return (
    <div>
      <div style={{ background: colors.bg, borderBottom: `2px solid ${colors.border}`, padding: "2.5rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setCurrentPage("side-quests")}>
            ← Back to side quests
          </button>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: colors.text, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "20px", height: "1.5px", background: colors.border, display: "inline-block" }} />
                {quest.category}
              </div>
              <h1 style={{ fontSize: "42px", fontWeight: "800", color: "var(--ink)", lineHeight: "1.1", marginBottom: "1rem" }}>
                {quest.name}
              </h1>
              <p style={{ fontSize: "16px", color: "var(--ink-2)", lineHeight: "1.7", maxWidth: "600px", marginBottom: "1.5rem" }}>
                {quest.description}
              </p>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span className={`tag ${quest.is_free ? "tag-sage" : "tag-neutral"}`}>
                  {quest.is_free ? "Free" : `$${quest.cost}`}
                </span>
                {quest.is_beginner_friendly && <span className="tag tag-sage">Beginner ok</span>}
                {quest.is_recurring && quest.recurrence && (
                  <span className="tag tag-peach">{RECURRENCE_LABELS[quest.recurrence]}</span>
                )}
                {quest.tags && quest.tags.split(",").map((tag) => (
                  <span key={tag} className="tag tag-neutral">{tag.trim()}</span>
                ))}
              </div>
            </div>

            <div style={{ background: "var(--bg)", border: `1.5px solid ${colors.border}`, borderRadius: "var(--radius-xl)", padding: "1.5rem", minWidth: "240px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Date</div>
                <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--ink)" }}>{formatDate(quest.date)}</div>
                <div className="mono" style={{ fontSize: "12px", color: "var(--ink-2)", marginTop: "3px" }}>{quest.time}</div>
              </div>
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "1rem" }}>
                <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Going</div>
                <div style={{ fontWeight: "800", fontSize: "28px", color: colors.text, lineHeight: 1 }}>{quest.going_count}</div>
                <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginTop: "3px" }}>people interested</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page">
        {quest.spawn_point && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "8px" }}>Location</div>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "var(--ink)", marginBottom: "3px" }}>{quest.spawn_point.name}</div>
            <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "8px" }}>{quest.spawn_point.neighborhood}</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span className="tag tag-peach">{quest.spawn_point.category}</span>
              {quest.spawn_point.is_marta_accessible && <span className="tag tag-sage">🚇 MARTA accessible</span>}
            </div>
          </div>
        )}

        <CommentSection sideQuestId={quest.id} showToast={showToast} />

        <div style={{ display: "flex", gap: "10px", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <button className="btn-secondary" onClick={() => { setEditingSideQuest(quest); setCurrentPage("side-quest-form"); }}>
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