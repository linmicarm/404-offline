import { useState, useEffect } from "react";
import { createSpawnPoint, updateSpawnPoint } from "../api/index.js";

const CATEGORIES = ["Gaming venue", "Comics & cards", "Boba & matcha", "Cute cafe", "Kawaii shop", "Asian eats", "Izakaya & pocha", "Other"];

export default function SpawnPointForm({ editingSpawnPoint, setCurrentPage }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Gaming venue",
    neighborhood: "",
    address: "",
    is_marta_accessible: false,
  });

  useEffect(() => {
    if (editingSpawnPoint) {
      setForm({
        name: editingSpawnPoint.name || "",
        category: editingSpawnPoint.category || "Gaming venue",
        neighborhood: editingSpawnPoint.neighborhood || "",
        address: editingSpawnPoint.address || "",
        is_marta_accessible: editingSpawnPoint.is_marta_accessible ?? false,
      });
    }
  }, [editingSpawnPoint]);

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

    if (!form.name || !form.category || !form.neighborhood || !form.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (editingSpawnPoint) {
        await updateSpawnPoint(editingSpawnPoint.id, form);
      } else {
        await createSpawnPoint(form);
      }
      setCurrentPage("spawn-points");
    } catch (err) {
      setError("Failed to save spawn point.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => setCurrentPage("spawn-points")}
      >
        ← Back
      </button>

      <div className="page-header">
        <div className="page-eyebrow">404 Offline</div>
        <h1 className="page-title">{editingSpawnPoint ? "Edit Spawn Point" : "New Spawn Point"}</h1>
      </div>

      {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Battle & Brew" />
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
          <label className="form-label">Neighborhood *</label>
          <input className="form-input" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Old Fourth Ward" />
        </div>

        <div className="form-group">
          <label className="form-label">Address *</label>
          <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 427 Edgewood Ave SE, Atlanta, GA 30312" />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input type="checkbox" name="is_marta_accessible" checked={form.is_marta_accessible} onChange={handleChange} />
          <span className="form-label" style={{ margin: 0 }}>MARTA accessible</span>
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingSpawnPoint ? "Update spawn point" : "Create spawn point"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("spawn-points")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}