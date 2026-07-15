import { useState, useEffect } from "react";
import { createSideQuest, updateSideQuest, getSpawnPoints } from "../api/index.js";

const CATEGORIES = ["Gaming", "Social", "Cosplay", "Language", "Tabletop", "Other"];

export default function SideQuestForm({ editingSideQuest, setCurrentPage }) {
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    spawn_point_id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    cost: "",
    is_free: true,
    is_beginner_friendly: false,
    category: "Gaming",
    tags: "",
  });

  useEffect(() => {
    async function fetchSpawnPoints() {
      try {
        const data = await getSpawnPoints();
        setSpawnPoints(data);
      } catch (err) {
        setError("Failed to load spawn points.");
      }
    }
    fetchSpawnPoints();

    if (editingSideQuest) {
      setForm({
        spawn_point_id: editingSideQuest.spawn_point_id || "",
        name: editingSideQuest.name || "",
        description: editingSideQuest.description || "",
        date: editingSideQuest.date || "",
        time: editingSideQuest.time || "",
        cost: editingSideQuest.cost || "",
        is_free: editingSideQuest.is_free ?? true,
        is_beginner_friendly: editingSideQuest.is_beginner_friendly ?? false,
        category: editingSideQuest.category || "Gaming",
        tags: editingSideQuest.tags || "",
      });
    }
  }, [editingSideQuest]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.spawn_point_id || !form.name || !form.description || !form.date || !form.time || !form.category) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (editingSideQuest) {
        await updateSideQuest(editingSideQuest.id, form);
      } else {
        await createSideQuest(form);
      }
      setCurrentPage("side-quests");
    } catch (err) {
      setError("Failed to save side quest.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => setCurrentPage("side-quests")}
      >
        ← Back
      </button>

      <div className="page-header">
        <div className="page-eyebrow">404 Offline</div>
        <h1 className="page-title">{editingSideQuest ? "Edit Side Quest" : "New Side Quest"}</h1>
      </div>

      {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Spawn Point *</label>
          <select className="form-select" name="spawn_point_id" value={form.spawn_point_id} onChange={handleChange}>
            <option value="">Select a spawn point...</option>
            {spawnPoints.map((s) => (
              <option key={s.id} value={s.id}>{s.name} — {s.neighborhood}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Name *</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Friday Night Magic" />
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="What's this side quest about?" rows={3} style={{ resize: "vertical" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Time *</label>
            <input className="form-input" name="time" value={form.time} onChange={handleChange} placeholder="e.g. 7:00 PM" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <select className="form-select" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tags (comma separated)</label>
          <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. MTG,cards,tournament" />
        </div>

        <div className="form-group">
          <label className="form-label">Cost ($)</label>
          <input className="form-input" name="cost" type="number" value={form.cost} onChange={handleChange} placeholder="Leave blank if free" />
        </div>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" name="is_free" checked={form.is_free} onChange={handleChange} />
            <span className="form-label" style={{ margin: 0 }}>Free event</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" name="is_beginner_friendly" checked={form.is_beginner_friendly} onChange={handleChange} />
            <span className="form-label" style={{ margin: 0 }}>Beginner friendly</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingSideQuest ? "Update side quest" : "Create side quest"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("side-quests")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}