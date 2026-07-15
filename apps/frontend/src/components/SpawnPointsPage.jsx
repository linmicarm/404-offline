import { useState, useEffect } from "react";
import { getSpawnPoints, deleteSpawnPoint } from "../api/index.js";
import SpawnPointCard from "./SpawnPointCard.jsx";

const CATEGORIES = [
  "All",
  "Gaming venue",
  "Comics & cards",
  "Boba & matcha",
  "Cute cafe",
  "Kawaii shop",
];

export default function SpawnPointsPage({
  setCurrentPage,
  setSelectedSpawnPoint,
  setEditingSpawnPoint,
  showModal,
}) {
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [martaOnly, setMartaOnly] = useState(false);

  useEffect(() => {
    fetchSpawnPoints();
  }, []);

  async function fetchSpawnPoints() {
    setLoading(true);
    try {
      const data = await getSpawnPoints();
      setSpawnPoints(data);
    } catch (err) {
      setError("Failed to load spawn points.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    showModal({
      title: "Delete spawn point",
      message:
        "Are you sure you want to delete this spawn point? All side quests linked to it will also be deleted.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSpawnPoint(id);
          setSpawnPoints(spawnPoints.filter((s) => s.id !== id));
        } catch (err) {
          alert("Failed to delete spawn point.");
        }
      },
    });
  }

  const filtered = spawnPoints.filter((s) => {
    const matchesCategory =
      activeCategory === "All" || s.category === activeCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchesMarta = !martaOnly || s.is_marta_accessible;
    return matchesCategory && matchesSearch && matchesMarta;
  });

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 className="page-title">Spawn Points</h1>
          <p className="page-sub">
            Local venues, game bars, boba spots, and more.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setCurrentPage("spawn-point-form")}
        >
          + Add spawn point
        </button>
      </div>

      <input
        className="form-input"
        style={{ marginBottom: "1rem", width: "100%", maxWidth: "400px" }}
        placeholder="Search by name or neighborhood..."
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
          className={`filter-pill ${martaOnly ? "active" : ""}`}
          onClick={() => setMartaOnly(!martaOnly)}
        >
          🚇 MARTA accessible
        </button>
      </div>

      {loading && <div className="loading">Loading spawn points... 🍑</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">
          No spawn points found — try a different filter or add one!
        </div>
      )}
      {!loading && !error && (
        <div className="grid-2">
          {filtered.map((spawn) => (
            <div key={spawn.id}>
              <SpawnPointCard
                spawnPoint={spawn}
                onClick={(s) => {
                  setSelectedSpawnPoint(s);
                  setCurrentPage("spawn-point-detail");
                }}
              />
              <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setEditingSpawnPoint(spawn);
                    setCurrentPage("spawn-point-form");
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(spawn.id)}
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
