import { useState, useEffect } from "react";
import { getSideQuests, deleteSideQuest, toggleFeatured } from "../api/index.js";
import SideQuestCard from "./SideQuestCard.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";

const CATEGORIES = ["All", "Gaming", "Social", "Cosplay", "Language", "Tabletop"];

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function isThisWeekend(dateStr) {
  const today = new Date();
  const date = new Date(dateStr + "T00:00:00");
  const day = today.getDay();
  const daysUntilSat = (6 - day + 7) % 7;
  const daysUntilSun = (0 - day + 7) % 7 || 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSat);
  saturday.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSun);
  sunday.setHours(23, 59, 59, 999);
  return date >= saturday && date <= sunday;
}

export default function SideQuestsPage({ setCurrentPage, setSelectedSideQuest, setEditingSideQuest, showModal, showToast }) {
  const [sideQuests, setSideQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  const [activeTag, setActiveTag] = useState("");

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
          showToast("Side quest deleted.", "info");
        } catch (err) {
          showToast("Failed to delete side quest.", "error");
        }
      },
    });
  }

  async function handleFeature(id) {
    try {
      const result = await toggleFeatured(id);
      setSideQuests(sideQuests.map((q) =>
        q.id === id
          ? { ...q, is_featured: result.data.is_featured }
          : { ...q, is_featured: false }
      ));
      showToast(result.data.is_featured ? "Side quest featured! ★" : "Removed from featured.", "info");
    } catch (err) {
      showToast("Failed to update featured.", "error");
    }
  }

  const filtered = sideQuests
    .filter((q) =>
      (normalize(q.name).includes(normalize(search)) ||
      normalize(q.description).includes(normalize(search)) ||
      (q.spawn_point?.name && normalize(q.spawn_point.name).includes(normalize(search))) ||
      (q.tags && normalize(q.tags).includes(normalize(search)))) &&
      (activeTag === "" || (q.tags && q.tags.split(",").map((t) => t.trim()).includes(activeTag))) &&
      (!weekendOnly || isThisWeekend(q.date))
    )
    .sort((a, b) => {
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "free") return a.is_free === b.is_free ? 0 : a.is_free ? -1 : 1;
      return 0;
    });

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 className="page-title">Side Quests</h1>
          <p className="page-sub">Local events, meetups, and happenings between con season.</p>
        </div>
        <button className="btn-primary" onClick={() => setCurrentPage("side-quest-form")}>+ Add side quest</button>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "1rem", flexWrap: "wrap" }}>
        <input
          className="form-input"
          style={{ width: "100%", maxWidth: "340px" }}
          placeholder="Search by name, description, or venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: "180px" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-asc">Date ↑ earliest</option>
          <option value="date-desc">Date ↓ latest</option>
          <option value="name-asc">Name A–Z</option>
          <option value="free">Free first</option>
        </select>
      </div>

      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`filter-pill ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
        <button className={`filter-pill ${showFreeOnly ? "active" : ""}`} onClick={() => setShowFreeOnly(!showFreeOnly)}>Free only</button>
        <button className={`filter-pill ${weekendOnly ? "active" : ""}`} onClick={() => setWeekendOnly(!weekendOnly)}>🗓 This weekend</button>
      </div>

      {activeTag && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
          <span className="mono" style={{ fontSize: "11px", color: "var(--ink-2)" }}>Filtering by tag:</span>
          <span className="tag tag-peach">{activeTag}</span>
          <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "10px" }} onClick={() => setActiveTag("")}>✕ Clear</button>
        </div>
      )}

      {loading && <SkeletonGrid count={4} />}
      {error && <div className="error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">No side quests found — try a different filter or add one!</div>
      )}
      {!loading && !error && (
        <div className="grid-2">
          {filtered.map((quest) => (
            <div key={quest.id}>
              <SideQuestCard
                sideQuest={quest}
                onClick={(q) => { setSelectedSideQuest(q); setCurrentPage("side-quest-detail"); }}
                onTagClick={(tag) => setActiveTag(tag)}
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setEditingSideQuest(quest); setCurrentPage("side-quest-form"); }}>Edit</button>
                <button
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    background: quest.is_featured ? "var(--peach-light)" : "",
                    borderColor: quest.is_featured ? "var(--peach)" : "",
                    color: quest.is_featured ? "var(--peach-dark)" : "",
                  }}
                  onClick={() => handleFeature(quest.id)}
                >
                  {quest.is_featured ? "★ Featured" : "☆ Feature"}
                </button>
                <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(quest.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}