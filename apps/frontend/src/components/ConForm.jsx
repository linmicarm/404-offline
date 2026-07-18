import { useState, useEffect } from "react";
import { createCon, updateCon } from "../api/index.js";

const SIZES = ["Small", "Mid-size", "Large", "Massive"];
const TYPES = ["Anime", "Gaming", "Sci-Fi, Fantasy and Gaming", "Anime & Gaming", "Comics and Artist Alley", "Tabletop", "Multi-genre", "Other"];

export default function ConForm({ editingCon, setCurrentPage, showToast }) {
  const isEditing = !!editingCon;
  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    neighborhood: "",
    size: "Mid-size",
    type: "Anime & Gaming",
    ticket_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCon) {
      setForm({
        name: editingCon.name || "",
        start_date: editingCon.start_date || "",
        end_date: editingCon.end_date || "",
        venue: editingCon.venue || "",
        neighborhood: editingCon.neighborhood || "",
        size: editingCon.size || "Mid-size",
        type: editingCon.type || "Anime & Gaming",
        ticket_url: editingCon.ticket_url || "",
      });
    }
  }, [editingCon]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.start_date) newErrors.start_date = "Start date is required";
    if (!form.end_date) newErrors.end_date = "End date is required";
    if (!form.venue.trim()) newErrors.venue = "Venue is required";
    if (!form.neighborhood.trim()) newErrors.neighborhood = "Neighborhood is required";
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
      if (isEditing) {
        await updateCon(editingCon.id, form);
        showToast("Convention updated! 🍑", "success");
      } else {
        await createCon(form);
        showToast("Convention added! 🍑", "success");
      }
      setCurrentPage("cons");
    } catch (err) {
      showToast("Failed to save convention.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div style={{ marginBottom: "2rem" }}>
        <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setCurrentPage("cons")}>
          ← Cancel
        </button>
        <h1 className="page-title">{isEditing ? `Edit ${editingCon.name}` : "Add a Convention"}</h1>
        <p className="page-sub">{isEditing ? "Update the details for this convention." : "Add a new con to the Atlanta calendar."}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
        {/* Basic info */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Convention Info</div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. DragonCon 2026" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Size *</label>
              <select className="form-select" name="size" value={form.size} onChange={handleChange}>
                {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select className="form-select" name="type" value={form.type} onChange={handleChange}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input className="form-input" type="date" name="start_date" value={form.start_date} onChange={handleChange} />
              {errors.start_date && <span className="form-error">{errors.start_date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input className="form-input" type="date" name="end_date" value={form.end_date} onChange={handleChange} />
              {errors.end_date && <span className="form-error">{errors.end_date}</span>}
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Location</div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Venue *</label>
            <input className="form-input" name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Georgia World Congress Center" />
            {errors.venue && <span className="form-error">{errors.venue}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Neighborhood *</label>
            <input className="form-input" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Downtown Atlanta" />
            {errors.neighborhood && <span className="form-error">{errors.neighborhood}</span>}
          </div>
        </div>

        {/* Tickets */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Tickets</div>

          <div className="form-group">
            <label className="form-label">Ticket URL <span style={{ color: "var(--ink-3)", fontSize: "10px", fontWeight: "400" }}>(optional)</span></label>
            <input className="form-input" name="ticket_url" value={form.ticket_url} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" type="submit" disabled={loading} style={{ fontSize: "13px", padding: "12px 28px" }}>
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add convention"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("cons")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}