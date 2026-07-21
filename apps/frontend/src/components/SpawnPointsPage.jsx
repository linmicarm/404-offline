import { useState, useEffect } from "react";
import { getSpawnPoints, deleteSpawnPoint } from "../api/index.js";
import SpawnPointCard from "./SpawnPointCard.jsx";
import { SkeletonGrid } from "./Skeleton.jsx";

const CATEGORIES = ["All", "Gaming venue", "Comics & cards", "Boba & matcha", "Cute cafe", "Kawaii shop"];

function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function SpawnPointsPage({ setCurrentPage, setSelectedSpawnPoint, setEditingSpawnPoint, showModal, showToast }) {
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [martaOnly, setMartaOnly] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchSpawnPoints(); }, []);

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

  function handleNearMe() {
    if (nearMe) { setNearMe(false); setUserLocation(null); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearMe(true);
        setLocationLoading(false);
      },
      () => {
        showToast("Couldn't get your location. Please allow location access.", "error");
        setLocationLoading(false);
      }
    );
  }

  const neighborhoods = [...new Set(spawnPoints.map((s) => s.neighborhood))];

  let filtered = spawnPoints.filter((s) =>
    (activeCategory === "All" || s.category === activeCategory) &&
    (!martaOnly || s.is_marta_accessible) &&
    (normalize(s.name).includes(normalize(search)) ||
      normalize(s.neighborhood).includes(normalize(search)) ||
      normalize(s.category).includes(normalize(search)))
  );

  if (nearMe && userLocation) {
    filtered = filtered
      .filter((s) => s.latitude && s.longitude)
      .map((s) => ({ ...s, distance: getDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude) }))
      .sort((a, b) => a.distance - b.distance);
  }

  const grouped = nearMe && userLocation
    ? { "Nearest to you": filtered }
    : neighborhoods.reduce((acc, hood) => {
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
        <button className={`filter-pill ${martaOnly ? "active" : ""}`} onClick={() => setMartaOnly(!martaOnly)}>🚇 MARTA</button>
        <button
          className={`filter-pill ${nearMe ? "active" : ""}`}
          onClick={handleNearMe}
          disabled={locationLoading}
        >
          {locationLoading ? "Locating..." : nearMe ? "📍 Near me ✓" : "📍 Near me"}
        </button>
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
            {spots.map((spawn, i) => (
              <div key={spawn.id} className="fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <SpawnPointCard
                  spawnPoint={spawn}
                  onClick={(s) => { setSelectedSpawnPoint(s); setCurrentPage("spawn-point-detail"); }}
                />
                {nearMe && spawn.distance && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)", marginTop: "4px", textAlign: "center" }}>
                    {spawn.distance.toFixed(1)} miles away
                  </div>
                )}
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