import { useState, useEffect } from "react";
import { createSpawnPoint, updateSpawnPoint } from "../api/index.js";

const CATEGORIES = ["Gaming venue", "Comics & cards", "Boba & matcha", "Cute cafe", "Kawaii shop", "Asian eats", "Other"];

export default function SpawnPointForm({ editingSpawnPoint, setCurrentPage, showToast }) {
  const isEditing = !!editingSpawnPoint;
  const [form, setForm] = useState({
    name: "",
    category: "Gaming venue",
    neighborhood: "",
    address: "",
    latitude: "",
    longitude: "",
    hours: "",
    image_url: "",
    description: "",
    is_marta_accessible: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        image_url: editingSpawnPoint.image_url || "",
        description: editingSpawnPoint.description || "",
        is_marta_accessible: editingSpawnPoint.is_marta_accessible || false,
      });
    }
  }, [editingSpawnPoint]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.neighborhood.trim()) newErrors.neighborhood = "Neighborhood is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };

      if (isEditing) {
        await updateSpawnPoint(editingSpawnPoint.id, payload);
        showToast("Spawn point updated! 🍑", "success");
      } else {
        await createSpawnPoint(payload);
        showToast("Spawn point added! 🍑", "success");
      }
      setCurrentPage("spawn-points");
    } catch (err) {
      showToast("Failed to save spawn point.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div style={{ marginBottom: "2rem" }}>
        <button
          className="btn-secondary"
          style={{ marginBottom: "1.5rem" }}
          onClick={() => setCurrentPage("spawn-points")}
        >
          ← Cancel
        </button>
        <h1 className="page-title">{isEditing ? `Edit ${editingSpawnPoint.name}` : "Add a Spawn Point"}</h1>
        <p className="page-sub">{isEditing ? "Update the details for this spawn point." : "Add a new venue, shop, or hangout spot to the map."}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
        {/* Basic info */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Basic Info</div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Battle & Brew" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Neighborhood *</label>
              <input className="form-input" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Old Fourth Ward" />
              {errors.neighborhood && <span className="form-error">{errors.neighborhood}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <input className="form-input" name="address" value={form.address} onChange={handleChange} placeholder="e.g. 427 Edgewood Ave SE, Atlanta, GA 30312" />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>
        </div>

        {/* Description */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>About this place</div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell people what makes this spot special — the vibe, what to expect, who hangs out here..."
              rows={5}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        {/* Hours & access */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Hours & Access</div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Hours</label>
            <input className="form-input" name="hours" value={form.hours} onChange={handleChange} placeholder="e.g. Mon-Thu 4pm-12am, Fri 4pm-2am, Sat 12pm-2am" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)", marginTop: "4px", display: "block" }}>Format: Day-Day HHam/pm-HHam/pm, separated by commas</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)" }}>
            <input
              type="checkbox"
              id="marta"
              name="is_marta_accessible"
              checked={form.is_marta_accessible}
              onChange={handleChange}
              style={{ width: "16px", height: "16px", accentColor: "var(--sage)", cursor: "pointer" }}
            />
            <label htmlFor="marta" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink)", cursor: "pointer" }}>
              🚇 MARTA accessible
            </label>
          </div>
        </div>

        {/* Media */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Media</div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
            {form.image_url && (
              <div style={{ marginTop: "8px", height: "120px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1.5px solid var(--border)" }}>
                <img src={form.image_url} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Map Coordinates <span style={{ color: "var(--ink-3)", fontSize: "9px" }}>(optional — needed to show on map)</span></div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input className="form-input" name="latitude" value={form.latitude} onChange={handleChange} placeholder="e.g. 33.7537" />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input className="form-input" name="longitude" value={form.longitude} onChange={handleChange} placeholder="e.g. -84.3762" />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" type="submit" disabled={loading} style={{ fontSize: "13px", padding: "12px 28px" }}>
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add spawn point"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("spawn-points")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}