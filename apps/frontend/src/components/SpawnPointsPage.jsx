import { useState, useEffect } from "react";
import { getSpawnPoints, deleteSpawnPoint } from "../api/index.js";
import SpawnPointCard from "./SpawnPointCard.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";

const CATEGORIES = ["All", "Gaming venue", "Comics & cards", "Boba & matcha", "Cute cafe", "Kawaii shop"];

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function SpawnPointsPage({ setCurrentPage, setSelectedSpawnPoint, setEditingSpawnPoint, showModal, showToast }) {
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [martaOnly, setMartaOnly] = useState(false);
  const [search, setSearch] = useState("");

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
      message: "Are you sure you want to delete this spawn point? All associated side quests will also be deleted.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSpawnPoint(id);
          setSpawnPoints(spawnPoints.filter((s) => s.id !== id));
          showToast("Spawn point deleted.", "info");
        } catch (err) {
          showToast("Failed to delete spawn point.", "error");
        }
      },
    });
  }

  const neighborhoods = [...new Set(spawnPoints.map((s) => s.neighborhood))];

  const filtered = spawnPoints.filter((s) =>
    (activeCategory === "All" || s.category === activeCategory) &&
    (!martaOnly || s.is_marta_accessible) &&
    (normalize(s.name).includes(normalize(search)) ||
      normalize(s.neighborhood).includes(normalize(search)) ||
      normalize(s.category).includes(normalize(search)))
  );

  const grouped = neighborhoods.reduce((acc, hood) => {
    const spots = filtered.filter((s) => s.neighborhood === hood);
    if (spots.length > 0) acc[hood] = spots;
    return acc;
  }, {});

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
        <div>
          <h1 className="page-title">Spawn Points</h1>
          <p className="page-sub">Discover the places where Atlanta's nerd community comes together. From cozy cafés and game bars to card shops, arcades, and hidden gems, your next favorite hangout is just a click away.</p>
        </div>
        <button className="btn-primary" style={{ whiteSpace: "nowrap", marginTop: "0.5rem" }} onClick={() => { setEditingSpawnPoint(null); setCurrentPage("spawn-point-form"); }}>
          + Add spawn point
        </button>
      </div>

      <input
        className="form-input"
        style={{ marginBottom: "1rem", maxWidth: "100%" }}
        placeholder="Search by name or neighborhood..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-bar">
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`filter-pill ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
        <button className={`filter-pill ${martaOnly ? "active" : ""}`} onClick={() => setMartaOnly(!martaOnly)}>🚇 MARTA accessible</button>
      </div>

      {loading && <SkeletonGrid count={6} />}
      {error && <div className="error">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty">No spawn points found — try a different filter or add one!</div>
      )}

      {!loading && !error && Object.entries(grouped).map(([neighborhood, spots]) => (
        <div key={neighborhood} style={{ marginBottom: "2rem" }}>
          <div className="section-label">{neighborhood}</div>
          <div className="grid-2">
            {spots.map((spawn) => (
              <div key={spawn.id}>
                <SpawnPointCard
                  spawnPoint={spawn}
                  onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                  <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setEditingSpawnPoint(spawn); setCurrentPage("spawn-point-form"); }}>Edit</button>
                  <button className="btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(spawn.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}