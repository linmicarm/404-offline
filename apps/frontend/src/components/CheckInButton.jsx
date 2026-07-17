import { useState, useEffect } from "react";
import { checkinSpawnPoint } from "../api/index.js";

export default function CheckInButton({ spawnPoint, onCheckedIn }) {
  const storageKey = `checkin-${spawnPoint.id}`;
  const [checkedIn, setCheckedIn] = useState(false);
  const [count, setCount] = useState(spawnPoint.checkin_count || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setCheckedIn(true);
  }, [storageKey]);

  async function handleCheckin() {
    if (loading) return;
    setLoading(true);
    const action = checkedIn ? "decrement" : "increment";
    try {
      const result = await checkinSpawnPoint(spawnPoint.id, action);
      setCount(result.data.checkin_count);
      if (checkedIn) {
        localStorage.removeItem(storageKey);
        setCheckedIn(false);
      } else {
        localStorage.setItem(storageKey, "true");
        setCheckedIn(true);
      }
      if (onCheckedIn) onCheckedIn(result.data);
    } catch (err) {
      console.error("Failed to update check-in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <button
        onClick={handleCheckin}
        disabled={loading}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "12px",
          fontWeight: "700",
          background: checkedIn ? "var(--sage-light)" : "var(--surface2)",
          color: checkedIn ? "var(--sage-dark)" : "var(--ink-2)",
          border: `1.5px solid ${checkedIn ? "var(--sage)" : "var(--border)"}`,
          padding: "10px 20px",
          borderRadius: "100px",
          cursor: loading ? "default" : "pointer",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {checkedIn ? "✓ I've been here" : "📍 I've been here"}
        <span style={{
          background: checkedIn ? "var(--sage)" : "var(--border)",
          color: checkedIn ? "var(--sage-dark)" : "var(--ink-3)",
          borderRadius: "100px",
          padding: "2px 8px",
          fontSize: "10px",
        }}>
          {count}
        </span>
      </button>
      <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
        {checkedIn ? "Click to remove your check-in" : `${count} ${count === 1 ? "person has" : "people have"} visited this spot`}
      </div>
    </div>
  );
}