import { useState, useEffect } from "react";
import { createSideQuest, updateSideQuest, getSpawnPoints } from "../api/index.js";

const CATEGORIES = ["Gaming", "Social", "Cosplay", "Language", "Tabletop", "Other"];
const RECURRENCES = ["weekly", "biweekly", "monthly"];

export default function SideQuestForm({ editingSideQuest, setCurrentPage, showToast }) {
  const isEditing = !!editingSideQuest;
  const [spawnPoints, setSpawnPoints] = useState([]);
  const [form, setForm] = useState({
    spawn_point_id: "",
    name: "",
    description: "",
    date: "",
    time: "",
    cost: "",
    is_free: true,
    is_beginner_friendly: false,
    is_recurring: false,
    recurrence: "",
    category: "Gaming",
    tags: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchSpawnPoints() {
      try {
        const data = await getSpawnPoints();
        setSpawnPoints(data);
        if (!isEditing && data.length > 0) {
          setForm((prev) => ({ ...prev, spawn_point_id: data[0].id }));
        }
      } catch (err) {
        console.error("Failed to load spawn points");
      }
    }
    fetchSpawnPoints();
  }, []);

  useEffect(() => {
    if (editingSideQuest) {
      setForm({
        spawn_point_id: editingSideQuest.spawn_point_id || "",
        name: editingSideQuest.name || "",
        description: editingSideQuest.description || "",
        date: editingSideQuest.date || "",
        time: editingSideQuest.time || "",
        cost: editingSideQuest.cost || "",
        is_free: editingSideQuest.is_free ?? true,
        is_beginner_friendly: editingSideQuest.is_beginner_friendly || false,
        is_recurring: editingSideQuest.is_recurring || false,
        recurrence: editingSideQuest.recurrence || "",
        category: editingSideQuest.category || "Gaming",
        tags: editingSideQuest.tags || "",
        image_url: editingSideQuest.image_url || "",
      });
    }
  }, [editingSideQuest]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const newErrors = {};
    if (!form.spawn_point_id) newErrors.spawn_point_id = "Please select a spawn point";
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time.trim()) newErrors.time = "Time is required";
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        cost: form.is_free ? null : parseFloat(form.cost) || null,
        spawn_point_id: parseInt(form.spawn_point_id),
      };
      if (isEditing) {
        await updateSideQuest(editingSideQuest.id, payload);
        showToast("Side quest updated! 🍑", "success");
      } else {
        await createSideQuest(payload);
        showToast("Side quest added! 🍑", "success");
      }
      setCurrentPage("side-quests");
    } catch (err) {
      showToast("Failed to save side quest.", "error");
    } finally {
      setLoading(false);
    }
  }

  const selectedSpawn = spawnPoints.find((s) => s.id === parseInt(form.spawn_point_id));

  return (
    <div className="page">
      <div style={{ marginBottom: "2rem" }}>
        <button className="btn-secondary" style={{ marginBottom: "1.5rem" }} onClick={() => setCurrentPage("side-quests")}>← Cancel</button>
        <h1 className="page-title">{isEditing ? `Edit ${editingSideQuest.name}` : "Add a Side Quest"}</h1>
        <p className="page-sub">{isEditing ? "Update the details for this side quest." : "Add a new event, meetup, or happening to the community calendar."}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: "720px" }}>
        {/* Location */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Where is it?</div>
          <div className="form-group">
            <label className="form-label">Spawn Point *</label>
            <select className="form-select" name="spawn_point_id" value={form.spawn_point_id} onChange={handleChange}>
              {spawnPoints.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.neighborhood}</option>)}
            </select>
            {errors.spawn_point_id && <span className="form-error">{errors.spawn_point_id}</span>}
          </div>
          {selectedSpawn && (
            <div style={{ marginTop: "10px", padding: "10px 14px", background: "var(--surface2)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", display: "flex", gap: "10px", alignItems: "center" }}>
              {selectedSpawn.image_url && (
                <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
                  <img src={selectedSpawn.image_url} alt={selectedSpawn.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "var(--ink)" }}>{selectedSpawn.name}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)" }}>{selectedSpawn.neighborhood} · {selectedSpawn.category}</div>
              </div>
            </div>
          )}
        </div>

        {/* Event details */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Event Details</div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Name *</label>
            <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Friday Night Magic — Standard" />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Description *</label>
            <textarea className="form-input" name="description" value={form.description} onChange={handleChange} placeholder="What should people expect? Who is it for? What should they bring?" rows={4} style={{ resize: "vertical" }} />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input className="form-input" name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. mtg,cards,beginner" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)", marginTop: "4px", display: "block" }}>Comma separated, lowercase</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input className="form-input" type="date" name="date" value={form.date} onChange={handleChange} />
              {errors.date && <span className="form-error">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Time *</label>
              <input className="form-input" name="time" value={form.time} onChange={handleChange} placeholder="e.g. 7:00 PM" />
              {errors.time && <span className="form-error">{errors.time}</span>}
            </div>
          </div>
        </div>

        {/* Cost & accessibility */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Cost & Accessibility</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)" }}>
              <input type="checkbox" id="is_free" name="is_free" checked={form.is_free} onChange={handleChange} style={{ width: "16px", height: "16px", accentColor: "var(--sage)", cursor: "pointer" }} />
              <label htmlFor="is_free" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink)", cursor: "pointer" }}>Free event</label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)" }}>
              <input type="checkbox" id="is_beginner_friendly" name="is_beginner_friendly" checked={form.is_beginner_friendly} onChange={handleChange} style={{ width: "16px", height: "16px", accentColor: "var(--sage)", cursor: "pointer" }} />
              <label htmlFor="is_beginner_friendly" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink)", cursor: "pointer" }}>Beginner friendly</label>
            </div>
          </div>
          {!form.is_free && (
            <div className="form-group">
              <label className="form-label">Cost ($)</label>
              <input className="form-input" name="cost" value={form.cost} onChange={handleChange} placeholder="e.g. 5" type="number" min="0" step="0.01" />
            </div>
          )}
        </div>

        {/* Recurring */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Recurring?</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", background: "var(--surface2)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", marginBottom: "1rem" }}>
            <input type="checkbox" id="is_recurring" name="is_recurring" checked={form.is_recurring} onChange={handleChange} style={{ width: "16px", height: "16px", accentColor: "var(--peach)", cursor: "pointer" }} />
            <label htmlFor="is_recurring" style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--ink)", cursor: "pointer" }}>This event repeats</label>
          </div>
          {form.is_recurring && (
            <div className="form-group">
              <label className="form-label">How often?</label>
              <select className="form-select" name="recurrence" value={form.recurrence} onChange={handleChange}>
                <option value="">Select frequency</option>
                {RECURRENCES.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Image */}
        <div style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "1.25rem" }}>Cover Image</div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://res.cloudinary.com/..." />
            {form.image_url && (
              <div style={{ marginTop: "8px", height: "160px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1.5px solid var(--border)", position: "relative" }}>
                <img
                  src={form.image_url}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                <div style={{ display: "none", position: "absolute", inset: 0, alignItems: "center", justifyContent: "center", background: "var(--surface2)", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>
                  ⚠️ Image failed to load — check the URL
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-primary" type="submit" disabled={loading} style={{ fontSize: "13px", padding: "12px 28px" }}>
            {loading ? "Saving..." : isEditing ? "Save changes" : "Add side quest"}
          </button>
          <button className="btn-secondary" type="button" onClick={() => setCurrentPage("side-quests")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}