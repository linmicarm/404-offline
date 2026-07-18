import { useState, useEffect } from "react";
import { getCons, deleteCon } from "../api/index.js";
import { SkeletonList } from "./Skeleton.jsx";
import { formatDateRange } from "../utils/formatDate.js";

const CON_IMAGES = {
  "MomoCon 2026": "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=1200&q=90",
  "DragonCon 2026": "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&q=90",
  "Anime Weekend Atlanta 2026": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=90",
  "HeroesCon Atlanta 2026": "https://images.unsplash.com/photo-1535615615570-3b839f4359be?w=1200&q=90",
};

const SIZE_COLORS = {
  Massive: { bg: "rgba(255,170,127,0.35)", color: "#FFCBA4", border: "rgba(255,170,127,0.5)" },
  Large: { bg: "rgba(255,170,127,0.35)", color: "#FFCBA4", border: "rgba(255,170,127,0.5)" },
  "Mid-size": { bg: "rgba(133,201,160,0.35)", color: "#A8E4BC", border: "rgba(133,201,160,0.5)" },
  Small: { bg: "rgba(255,252,247,0.2)", color: "rgba(255,252,247,0.9)", border: "rgba(255,252,247,0.3)" },
};

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow!";
  return `${diff} days away`;
}

export default function ConsPage({ setCurrentPage, setEditingCon, showModal, showToast }) {
  const [cons, setCons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCons();
  }, []);

  async function fetchCons() {
    setLoading(true);
    try {
      const data = await getCons();
      setCons(data);
    } catch (err) {
      setError("Failed to load cons.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    showModal({
      title: "Delete con",
      message: "Are you sure you want to delete this con?",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteCon(id);
          setCons(cons.filter((c) => c.id !== id));
          showToast("Con deleted.", "info");
        } catch (err) {
          showToast("Failed to delete con.", "error");
        }
      },
    });
  }

  const upcoming = cons.filter((c) => new Date(c.end_date + "T00:00:00") >= new Date());
  const past = cons.filter((c) => new Date(c.end_date + "T00:00:00") < new Date());

  return (
    <div className="page">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Con Calendar</h1>
          <p className="page-sub">The main quests live here. Explore Atlanta's biggest conventions, expos, and fan celebrations.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingCon(null); setCurrentPage("con-form"); }}>+ Add a convention</button>
      </div>

      {loading && <SkeletonList count={3} />}
      {error && <div className="error">{error}</div>}

      {!loading && !error && upcoming.length === 0 && (
        <div className="empty">No upcoming cons — add one!</div>
      )}

      {!loading && !error && upcoming.length > 0 && (
        <>
          <div className="section-label">Upcoming</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "2rem" }}>
            {upcoming.map((con) => {
              const countdown = daysUntil(con.start_date);
              const image = CON_IMAGES[con.name];
              const sizeStyle = SIZE_COLORS[con.size] || SIZE_COLORS.Small;

              return (
                <div key={con.id} style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", border: "1.5px solid var(--border)", background: "var(--surface)" }}>
                  <div style={{
                    height: "220px",
                    background: image ? `url(${image}) center/cover` : "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
                    position: "relative",
                    display: "flex",
                    alignItems: "flex-end",
                  }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.98) 0%, rgba(28,16,8,0.7) 50%, rgba(28,16,8,0.4) 100%)" }} />

                    {countdown && (
                      <div style={{ position: "absolute", top: "1rem", right: "1rem", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", background: "rgba(255,170,127,0.95)", color: "#1C1008", padding: "5px 12px", borderRadius: "100px" }}>
                        {countdown}
                      </div>
                    )}

                    <div style={{ position: "relative", zIndex: 1, padding: "1.25rem 1.5rem", width: "100%" }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: sizeStyle.bg, color: sizeStyle.color, border: `1px solid ${sizeStyle.border}`, padding: "4px 12px", borderRadius: "100px" }}>
                          {con.size}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: "rgba(255,252,247,0.2)", color: "#FFFCF7", border: "1px solid rgba(255,252,247,0.3)", padding: "4px 12px", borderRadius: "100px" }}>
                          {con.type}
                        </span>
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "32px", color: "#FFFCF7", lineHeight: 1.1, marginBottom: "8px" }}>
                        {con.name}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,252,247,0.75)", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                        <span>📅 {formatDateRange(con.start_date, con.end_date)}</span>
                        <span>📍 {con.venue} · {con.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                    {con.ticket_url && (
                      <a href={con.ticket_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: "none", fontSize: "12px" }}>Get tickets →</a>
                    )}
                    <button className="btn-secondary" onClick={() => { setEditingCon(con); setCurrentPage("con-form"); }}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(con.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !error && past.length > 0 && (
        <>
          <div className="section-label">Past cons</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {past.map((con) => (
              <div key={con.id} className="card" style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "14px", cursor: "default" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--ink)" }}>{con.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>
                    {formatDateRange(con.start_date, con.end_date)} · {con.venue}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button className="btn-secondary" onClick={() => { setEditingCon(con); setCurrentPage("con-form"); }}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(con.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}