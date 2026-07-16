import { useState, useEffect } from "react";
import { getCons, deleteCon } from "../api/index.js";
import { SkeletonList } from "./Skeleton.jsx";

const SIZE_COLORS = {
  Massive: "tag-peach",
  Large: "tag-peach",
  "Mid-size": "tag-sage",
  Small: "tag-neutral",
};

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow!";
  return `${diff} days away`;
}

export default function ConsPage({
  setCurrentPage,
  setEditingCon,
  showModal,
  showToast,
}) {
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

  const upcoming = cons.filter((c) => new Date(c.end_date) >= new Date());
  const past = cons.filter((c) => new Date(c.end_date) < new Date());

  return (
    <div className="page">
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div className="page-eyebrow">Atlanta, GA · 404</div>
          <h1 className="page-title">Con Calendar</h1>
          <p className="page-sub">
            Atlanta's convention season, all in one place.
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingCon(null);
            setCurrentPage("con-form");
          }}
        >
          + Add con
        </button>
      </div>

      {loading && <SkeletonList count={3} />}
      {error && <div className="error">{error}</div>}

      {!loading && !error && upcoming.length === 0 && (
        <div className="empty">No upcoming cons — add one!</div>
      )}

      {!loading && !error && upcoming.length > 0 && (
        <>
          <div className="section-label">Upcoming</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "2rem",
            }}
          >
            {upcoming.map((con) => {
              const countdown = daysUntil(con.start_date);
              return (
                <div
                  key={con.id}
                  className="card"
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    padding: 0,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      background: "var(--surface2)",
                      borderRight: "1.5px solid var(--border)",
                      padding: "1.25rem",
                      minWidth: "100px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: "11px",
                        color: "var(--ink-3)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {new Date(con.start_date).toLocaleString("default", {
                        month: "short",
                      })}
                    </div>
                    <div
                      style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        color: "var(--ink)",
                        lineHeight: 1,
                      }}
                    >
                      {new Date(con.start_date).getDate()}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: "9px", color: "var(--ink-3)" }}
                    >
                      – {new Date(con.end_date).getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1, padding: "1.125rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "800",
                          color: "var(--ink)",
                        }}
                      >
                        {con.name}
                      </div>
                      {countdown && (
                        <span
                          className="tag tag-peach"
                          style={{ whiteSpace: "nowrap", marginLeft: "8px" }}
                        >
                          {countdown}
                        </span>
                      )}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: "10px",
                        color: "var(--ink-3)",
                        marginBottom: "8px",
                      }}
                    >
                      📍 {con.venue} · {con.neighborhood}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        className={`tag ${SIZE_COLORS[con.size] || "tag-neutral"}`}
                      >
                        {con.size}
                      </span>
                      <span className="tag tag-neutral">{con.type}</span>
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {con.ticket_url && (
                        <a
                          href={con.ticket_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary"
                          style={{ textDecoration: "none", fontSize: "11px" }}
                        >
                          Get tickets →
                        </a>
                      )}
                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setEditingCon(con);
                          setCurrentPage("con-form");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(con.id)}
                      >
                        Delete
                      </button>
                    </div>
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {past.map((con) => (
              <div
                key={con.id}
                className="card"
                style={{
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "var(--ink)",
                    }}
                  >
                    {con.name}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: "10px", color: "var(--ink-3)" }}
                  >
                    {con.start_date} · {con.venue}
                  </div>
                </div>
                <div
                  style={{ marginLeft: "auto", display: "flex", gap: "6px" }}
                >
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setEditingCon(con);
                      setCurrentPage("con-form");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(con.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
