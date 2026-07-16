import { useState, useEffect } from "react";
import { rateSpawnPoint } from "../api/index.js";

export default function StarRating({ spawnPoint, onRated }) {
  const storageKey = `rating-${spawnPoint.id}`;
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rated, setRated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setSelected(parseInt(saved));
      setRated(true);
    }
  }, [storageKey]);

  const avgRating =
    spawnPoint.rating_count > 0
      ? (spawnPoint.rating_sum / spawnPoint.rating_count).toFixed(1)
      : null;

  async function handleRate(rating) {
    if (loading) return;
    const previousRating = rated ? selected : null;
    setLoading(true);
    try {
      const result = await rateSpawnPoint(
        spawnPoint.id,
        rating,
        previousRating,
      );
      setSelected(rating);
      setRated(true);
      localStorage.setItem(storageKey, rating);
      if (onRated) onRated(result.data);
    } catch (err) {
      console.error("Failed to rate spawn point");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={loading}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleRate(star)}
              style={{
                background: "none",
                border: "none",
                cursor: loading ? "default" : "pointer",
                fontSize: "22px",
                padding: "0",
                color:
                  star <=
                  (hovered ||
                    selected ||
                    (avgRating ? Math.round(avgRating) : 0))
                    ? "#FFAA7F"
                    : "var(--border)",
                transition: "color 0.1s",
              }}
            >
              ★
            </button>
          ))}
        </div>
        {avgRating && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--ink)",
              }}
            >
              {avgRating}
            </span>
            <span
              className="mono"
              style={{ fontSize: "10px", color: "var(--ink-3)" }}
            >
              ({spawnPoint.rating_count} rating
              {spawnPoint.rating_count !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>
      <div
        className="mono"
        style={{
          fontSize: "10px",
          color: rated ? "var(--sage-dark)" : "var(--ink-3)",
        }}
      >
        {rated
          ? `✓ Your rating: ${selected} star${selected !== 1 ? "s" : ""} — click to change`
          : avgRating
            ? "Click to rate this spot"
            : "Be the first to rate this spot"}
      </div>
    </div>
  );
}
