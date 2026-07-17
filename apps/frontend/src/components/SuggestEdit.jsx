import { useState } from "react";
import { createSuggestion } from "../api/index.js";

const FIELDS = [
  { value: "name", label: "Name" },
  { value: "address", label: "Address" },
  { value: "hours", label: "Hours" },
  { value: "category", label: "Category" },
  { value: "neighborhood", label: "Neighborhood" },
  { value: "is_marta_accessible", label: "MARTA accessibility" },
  { value: "other", label: "Something else" },
];

export default function SuggestEdit({ spawnPoint, showToast }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    author_name: localStorage.getItem("comment-name") || "",
    field: "address",
    suggested_value: "",
    note: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function getCurrentValue() {
    switch (form.field) {
      case "name": return spawnPoint.name;
      case "address": return spawnPoint.address;
      case "hours": return spawnPoint.hours || "Not set";
      case "category": return spawnPoint.category;
      case "neighborhood": return spawnPoint.neighborhood;
      case "is_marta_accessible": return spawnPoint.is_marta_accessible ? "Yes" : "No";
      default: return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.author_name.trim() || !form.suggested_value.trim()) {
      setError("Name and suggestion are required.");
      return;
    }

    setSubmitting(true);
    try {
      await createSuggestion({
        spawn_point_id: spawnPoint.id,
        author_name: form.author_name.trim(),
        field: form.field,
        current_value: getCurrentValue(),
        suggested_value: form.suggested_value.trim(),
        note: form.note.trim() || null,
      });
      localStorage.setItem("comment-name", form.author_name.trim());
      showToast("Suggestion submitted! Thanks 🍑", "success");
      setOpen(false);
      setForm((prev) => ({ ...prev, suggested_value: "", note: "" }));
    } catch (err) {
      setError("Failed to submit suggestion.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      {!open && (
        <button className="btn-secondary" style={{ fontSize: "11px" }} onClick={() => setOpen(true)}>
          ✏️ Suggest an edit
        </button>
      )}
      {open && (
        <div className="card" style={{ cursor: "default" }}>
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1rem" }}>
            Suggest an Edit
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div className="form-group">
              <label className="form-label">Your name</label>
              <input
                className="form-input"
                name="author_name"
                value={form.author_name}
                onChange={handleChange}
                placeholder="Your name or handle..."
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label">What needs updating?</label>
              <select className="form-select" name="field" value={form.field} onChange={handleChange}>
                {FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              {getCurrentValue() && form.field !== "other" && (
                <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginTop: "4px" }}>
                  Current: {getCurrentValue()}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Suggested value</label>
              <input
                className="form-input"
                name="suggested_value"
                value={form.suggested_value}
                onChange={handleChange}
                placeholder={form.field === "other" ? "Describe what needs changing..." : "What should it be?"}
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Additional notes{" "}
                <span className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", fontWeight: "400" }}>(optional)</span>
              </label>
              <textarea
                className="form-input"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Anything else we should know?"
                rows={2}
                maxLength={300}
                style={{ resize: "vertical" }}
              />
            </div>

            {error && <div className="mono" style={{ fontSize: "11px", color: "#991B1B" }}>{error}</div>}

            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit suggestion"}
              </button>
              <button className="btn-secondary" type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}