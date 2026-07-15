import { useState, useEffect } from "react";
import { createCon, updateCon } from "../api/index.js";

const SIZES = ["Small", "Mid-size", "Large", "Massive"];
const TYPES = ["Anime", "Gaming", "Comics & Artist Alley", "Sci-Fi, Fantasy & Gaming", "Anime & Gaming", "General Pop Culture", "Other"];

export default function ConForm({ editingCon, setCurrentPage }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    start_date: "",
    end_date: "",
    venue: "",
    neighborhood: "",
    size: "Mid-size",
    type: "Anime",
    ticket_url: "",
  });

  useEffect(() => {
    if (editingCon) {
      setForm({
        name: editingCon.name || "",
        start_date: editingCon.start_date || "",
        end_date: editingCon.end_date || "",
        venue: editingCon.venue || "",
        neighborhood: editingCon.neighborhood || "",
        size: editingCon.size || "Mid-size",
        type: editingCon.type || "Anime",
        ticket_url: editingCon.ticket_url || "",
      });
    }
  }, [editingCon]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.start_date || !form.end_date || !form.venue || !form.neighborhood || !form.size || !form.type) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      if (editingCon) {
        await updateCon(editingCon.id, form);
      } else {
        await createCon(form);
      }
      setCurrentPage("cons");
    } catch (err) {
      setError("Failed to save con.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <button
        className="btn-secondary"
        style={{ marginBottom: "1.5rem" }}
        onClick={() => setCurrentPage("cons")}
      >
        ← Back
      </button>

      <div className="page-header">
        <div className="page-eyebrow">404 Offline</div>
        <h1 className="page-title">{editingCon ? "Edit Con" : "New Con"}</h1>
        <p className="page-sub">Fields marked with <span style={{ color: "#991B1B" }}>*</span> are required.</p>
      </div>

      {error && <div className="error" style={{ marginBottom: "1rem" }}>{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. MomoCon 2027" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div className="form-group">
            <label className="form-label">Start date <span style={{ color: "#991B1B" }}>*</span></label>
            <input className="form-input" type="date" name="start_date" value={form.start_date} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">End date <span style={{ color: "#991B1B" }}>*</span></label>
            <input className="form-input" type="date" name="end_date" value={form.end_date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Venue <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="venue" value={form.venue} onChange={handleChange} placeholder="e.g. Georgia World Congress Center" />
        </div>

        <div className="form-group">
          <label className="form-label">Neighborhood <span style={{ color: "#991B1B" }}>*</span></label>
          <input className="form-input" name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Downtown Atlanta" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div className="form-group">
            <label className="form-label">Size <span style={{ color: "#991B1B" }}>*</span></label>
            <select className="form-select" name="size" value={form.size} onChange={handleChange}>
              {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type <span style={{ color: "#991B1B" }}>*</span></label>
            <select className="form-select" name="type" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ticket URL <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", fontWeight: "400" }}>(optional)</span></label>
          <input className="form-input" name="ticket_url" value={form.ticket_url} onChange={handleChange} placeholder="https://..." />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : editingCon ? "Update con" : "Create con"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("cons")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}