import { useState, useEffect } from "react";
import { createSpawnPoint, updateSpawnPoint } from "../api/index.js";

const CATEGORIES = ["Gaming venue", "Comics & cards", "Boba & matcha", "Cute cafe", "Kawaii shop", "Asian eats", "Izakaya & pocha", "Other"];

export default function SpawnPointForm({ editingSpawnPoint, setCurrentPage, showToast }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Gaming venue",
    neighborhood: "",
    address: "",
    latitude: "",
    longitude: "",
    hours: "",
    is_marta_accessible: false,
  });

  useEffect(() => {
    if (editingSpawnPoint) {
      setForm({
        name: editingSpawnPoint.name || "",
        category: editingSpawnPoint.category || "Gaming venue",
        neighborhood: editingSpawnPoint.neighborhood || "",
        address: editingSpawnPoint.address || "",
        latitude: editingSpawnPoint.latitude || "",
        longitude: editingSpawnPoint.longitude || "",
        hours: editingSpawnPoint.hours || "",
        is_marta_accessible: editingSpawnPoint.is_marta_accessible ?? false,
      });
    }
  }, [editingSpawnPoint]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      showToast(editingSpawnPoint ? "Spawn point updated! ✓" : "Spawn point created! ✓");
      setCurrentPage("spawn-points");
    } catch (err) {
      setError("Failed to save spawn point.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setCurrentPage("spawn-points")}>
        ← Back
      </button>

      <div className="page-header">
        <div className="page-eyebrow">404 Offline</div>
        <h1 className="page-title">{editingSpawnPoint ? "Edit Spawn Point" : "New Spawn Point"}</h1>
        <p className="page-sub">Fields marked with <span style={{ color: "#991B1B" }}>*</span> are required.</p>
      </div>

      {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Battle & Brew" maxLength={100} />
          <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", textAlign: "right" }}>{form.name.length}/100</span>
        </div>

        <div className="form-group">
          <label className="form-label">Category <span style={{ color: "#991B1B" }}>*</span></label>
          <select className="form-select" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Neighborhood <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Old Fourth Ward" maxLength={100} />
          <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", textAlign: "right" }}>{form.neighborhood.length}/100</span>
        </div>

        <div className="form-group">
          <label className="form-label">Address <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 427 Edgewood Ave SE, Atlanta, GA 30312" maxLength={255} />
          <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", textAlign: "right" }}>{form.address.length}/255</span>
        </div>

        <div className="form-group">
          <label className="form-label">
            Hours <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", fontWeight: "400" }}>(optional)</span>
          </label>
          <input
            className="form-input"
            name="hours"
            value={form.hours}
            onChange={handleChange}
            placeholder="e.g. Mon-Fri 5pm-2am, Sat-Sun 2pm-2am"
          />
          <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
            Format: Mon-Fri 5pm-2am, Sat-Sun 2pm-2am
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Coordinates <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", fontWeight: "400" }}>(optional — needed for map)</span></label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <input className="form-input" name="latitude" type="number" value={form.latitude} onChange={handleChange} placeholder="Latitude e.g. 33.749" step="any" />
            <input className="form-input" name="longitude" type="number" value={form.longitude} onChange={handleChange} placeholder="Longitude e.g. -84.388" step="any" />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input type="checkbox" name="is_marta_accessible" checked={form.is_marta_accessible} onChange={handleChange} />
          <span className="form-label" style={{ margin: 0 }}>MARTA accessible</span>
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingSpawnPoint ? "Update spawn point" : "Create spawn point"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("spawn-points")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}