import { useState, useEffect } from "react";
import { getSideQuests, deleteSideQuest } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";

const CATEGORIES = ["All", "Gaming", "Social", "Cosplay", "Language", "Tabletop"];

export default function SideQuestsPage({ setCurrentPage, setSelectedSideQuest, setEditingSideQuest, showModal }) {
  const [sideQuests, setSideQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSideQuests();
  }, [activeCategory, showFreeOnly]);

  async function fetchSideQuests() {
    setLoading(true);
    try {
      const filters = {};
      if (activeCategory !== "All") filters.category = activeCategory;
      if (showFreeOnly) filters.free = true;
      const data = await getSideQuests(filters);
      setSideQuests(data);
    } catch (err) {
      setError("Failed to load side quests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    showModal({
      title: "Delete side quest",
      message: "Are you sure you want to delete this side quest? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSideQuest(id);
          setSideQuests(sideQuests.filter((q) => q.id !== id));
        } catch (err) {
          alert("Failed to delete side quest.");
        }
      },
    });
  }

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const filtered = sideQuests.filter((q) =>
  normalize(q.name).includes(normalize(search)) ||
  normalize(q.description).includes(normalize(search)) ||
  (q.spawn_point?.name && normalize(q.spawn_point.name).includes(normalize(search))) ||
  (q.tags && normalize(q.tags).includes(normalize(search)))
);

  return (
    <div className="page">
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <div>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 className="page-title">Side Quests</h1>
          <p className="page-sub">Local events, meetups, and happenings between con season.</p>
        </div>
        <button className="btn-primary" onClick={() => setCurrentPage("side-quest-form")}>
          + Add side quest
        </button>
      </div>

      <input
        className="form-input"
        style={{ marginBottom: "1rem", width: "100%", maxWidth: "400px" }}
        placeholder="Search by name, description, or venue..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
        <button
          className={`filter-pill ${showFreeOnly ? "active" : ""}`}
          onClick={() => setShowFreeOnly(!showFreeOnly)}
        >
          Free only
        </button>
      </div>

      {loading && <div className="loading">Loading side quests... 🍑</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">No side quests found — try a different filter or add one!</div>
      )}
      {!loading && !error && (
        <div className="grid-2">
          {filtered.map((quest) => (
            <div key={quest.id} style={{ position: "relative" }}>
              <SideQuestCard
                sideQuest={quest}
                onClick={(q) => {
                  setSelectedSideQuest(q);
                  setCurrentPage("side-quest-detail");
                }}
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setEditingSideQuest(quest);
                    setCurrentPage("side-quest-form");
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(quest.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}