import { useState, useEffect } from "react";
import { getSuggestions, updateSuggestionStatus } from "../api/index.js";
import { formatDateShort } from "../utils/formatDate.js";

const STATUS_COLORS = {
  pending: { bg: "var(--peach-light)", color: "var(--peach-dark)", border: "var(--peach)" },
  applied: { bg: "var(--sage-light)", color: "var(--sage-dark)", border: "var(--sage)" },
  dismissed: { bg: "var(--surface2)", color: "var(--ink-3)", border: "var(--border)" },
};

export default function SuggestionsPage({ showToast }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchSuggestions();
  }, []);

  async function fetchSuggestions() {
    try {
      const data = await getSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id, status) {
    try {
      await updateSuggestionStatus(id, status);
      setSuggestions(suggestions.map((s) =>
        s.id === id ? { ...s, status } : s
      ));
      showToast(status === "applied" ? "Marked as applied ✓" : "Dismissed.", "info");
    } catch (err) {
      showToast("Failed to update suggestion.", "error");
    }
  }

  const filtered = suggestions.filter((s) => filter === "all" || s.status === filter);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-eyebrow">Admin · 404 Offline</div>
        <h1 className="page-title">Suggestions</h1>
        <p className="page-sub">Community edits and corrections submitted by users.</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        {["pending", "applied", "dismissed", "all"].map((s) => (
          <button
            key={s}
            className={`filter-pill ${filter === s ? "active" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== "all" && (
              <span style={{ marginLeft: "6px", fontWeight: "700" }}>
                ({suggestions.filter((q) => q.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && <div className="loading">Loading suggestions... 🍑</div>}

      {!loading && filtered.length === 0 && (
        <div className="empty">No {filter} suggestions.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((suggestion) => {
            const colors = STATUS_COLORS[suggestion.status];
            return (
              <div key={suggestion.id} className="card" style={{ cursor: "default" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px", color: "var(--ink)", marginBottom: "3px" }}>
                      {suggestion.spawn_point?.name}
                    </div>
                    <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
                      {suggestion.spawn_point?.neighborhood} · {formatDateShort(suggestion.created_at.split("T")[0])}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", padding: "4px 10px", borderRadius: "100px", background: colors.bg, color: colors.color, border: `1.5px solid ${colors.border}` }}>
                    {suggestion.status}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                  <div style={{ background: "var(--surface2)", borderRadius: "var(--radius-md)", padding: "10px" }}>
                    <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Field</div>
                    <div style={{ fontWeight: "700", color: "var(--ink)", fontSize: "13px" }}>{suggestion.field}</div>
                  </div>
                  <div style={{ background: "var(--surface2)", borderRadius: "var(--radius-md)", padding: "10px" }}>
                    <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>From</div>
                    <div style={{ fontWeight: "700", color: "var(--ink)", fontSize: "13px" }}>{suggestion.author_name}</div>
                  </div>
                </div>

                {suggestion.current_value && (
                  <div style={{ marginBottom: "8px" }}>
                    <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Current value</div>
                    <div style={{ fontSize: "13px", color: "var(--ink-2)", padding: "8px 12px", background: "var(--surface2)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--border)" }}>
                      {suggestion.current_value}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: suggestion.note ? "8px" : "12px" }}>
                  <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Suggested value</div>
                  <div style={{ fontSize: "13px", color: "var(--ink)", padding: "8px 12px", background: "var(--peach-light)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--peach)", fontWeight: "600" }}>
                    {suggestion.suggested_value}
                  </div>
                </div>

                {suggestion.note && (
                  <div style={{ marginBottom: "12px" }}>
                    <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Note</div>
                    <div style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: "1.6" }}>{suggestion.note}</div>
                  </div>
                )}

                {suggestion.status === "pending" && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn-secondary" style={{ background: "var(--sage-light)", borderColor: "var(--sage)", color: "var(--sage-dark)" }} onClick={() => handleStatus(suggestion.id, "applied")}>
                      ✓ Mark applied
                    </button>
                    <button className="btn-secondary" onClick={() => handleStatus(suggestion.id, "dismissed")}>
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}