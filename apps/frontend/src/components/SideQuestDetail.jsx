import { useState, useEffect } from "react";
import { getSideQuestById, deleteSideQuest, updateGoingCount } from "../api/index.js";
import CommentSection from "./CommentSection.jsx";
import MapView from "./MapView.jsx";
import SideQuestCard from "./SideQuestCard.jsx";
import { formatDate } from "../utils/formatDate.js";

const CATEGORY_GRADIENTS = {
  Gaming: "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
  Social: "linear-gradient(135deg, #1A2E1A 0%, #2D5A3D 100%)",
  Cosplay: "linear-gradient(135deg, #2E1A2E 0%, #6B3A6B 100%)",
  Language: "linear-gradient(135deg, #1A2A2E 0%, #2D4A5A 100%)",
  Tabletop: "linear-gradient(135deg, #2A1A10 0%, #5A3A20 100%)",
  Other: "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
};

const RECURRENCE_LABELS = {
  weekly: "🔁 Every week",
  biweekly: "🔁 Every two weeks",
  monthly: "🔁 Every month",
};

function parseTimeTo24(timeStr) {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}${String(minutes || 0).padStart(2, "0")}00`;
}

function generateICS(quest) {
  const date = quest.date.replace(/-/g, "");
  const startTime = parseTimeTo24(quest.time);
  const endHour = String(parseInt(startTime.substring(0, 2)) + 2).padStart(2, "0");
  const endTime = `${endHour}${startTime.substring(2)}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//404 Offline//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${quest.name}`,
    `DTSTART:${date}T${startTime}`,
    `DTEND:${date}T${endTime}`,
    `DESCRIPTION:${quest.description?.replace(/\n/g, "\\n") || ""}`,
    `LOCATION:${quest.spawn_point?.address || quest.spawn_point?.name || ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function downloadICS(quest) {
  const ics = generateICS(quest);
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${quest.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SideQuestDetail({ sideQuest, setCurrentPage, setEditingSideQuest, showModal, showToast, setSelectedSpawnPoint, setSelectedSideQuest }) {
  const [quest, setQuest] = useState(sideQuest);
  const [loading, setLoading] = useState(!sideQuest);
  const [error, setError] = useState(null);
  const [isGoing, setIsGoing] = useState(() => !!localStorage.getItem(`going-${sideQuest?.id}`));
  const [goingLoading, setGoingLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sideQuest) return;
    async function fetchQuest() {
      try {
        const data = await getSideQuestById(sideQuest.id);
        setQuest(data);
      } catch (err) {
        setError("Failed to load side quest.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuest();
  }, [sideQuest]);

  async function handleGoing() {
    if (goingLoading) return;
    setGoingLoading(true);
    try {
      const action = isGoing ? "decrement" : "increment";
      const result = await updateGoingCount(quest.id, action);
      setQuest({ ...quest, going_count: result.data.going_count });
      if (isGoing) {
        localStorage.removeItem(`going-${quest.id}`);
        setIsGoing(false);
      } else {
        localStorage.setItem(`going-${quest.id}`, "true");
        setIsGoing(true);
      }
    } catch (err) {
      showToast("Failed to update.", "error");
    } finally {
      setGoingLoading(false);
    }
  }

  function handleShare() {
    const text = `${quest.name} — ${formatDate(quest.date)} at ${quest.time}${quest.spawn_point ? ` @ ${quest.spawn_point.name}` : ""}. Found on 404 Offline.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDelete() {
    showModal({
      title: "Delete side quest",
      message: "Are you sure you want to delete this side quest? This action cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      danger: true,
      onConfirm: async () => {
        try {
          await deleteSideQuest(quest.id);
          showToast("Side quest deleted.", "info");
          setCurrentPage("side-quests");
        } catch (err) {
          showToast("Failed to delete side quest.", "error");
        }
      },
    });
  }

  if (loading) return (
    <div>
      <div style={{ height: "380px", background: "linear-gradient(135deg, #2C1810 0%, #1A1A1A 100%)", position: "relative", overflow: "hidden" }}>
        <div className="skeleton" style={{ position: "absolute", inset: 0 }} />
      </div>
      <div className="page">
        <div className="skeleton" style={{ height: "32px", width: "60%", borderRadius: "8px", marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: "20px", width: "40%", borderRadius: "8px", marginBottom: "2rem" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="skeleton" style={{ height: "120px", borderRadius: "16px" }} />
          <div className="skeleton" style={{ height: "120px", borderRadius: "16px" }} />
        </div>
      </div>
    </div>
  );

  if (error) return <div className="error">{error}</div>;
  if (!quest) return <div className="error">Side quest not found.</div>;

  const gradient = CATEGORY_GRADIENTS[quest.category] || CATEGORY_GRADIENTS.Other;
  const relatedQuests = quest.spawn_point?.side_quests?.filter((q) => q.id !== quest.id) || [];

  return (
    <div>
      {/* Hero */}
      <div style={{
        minHeight: "380px",
        background: quest.image_url ? `url(${quest.image_url}) center/cover` : gradient,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,16,8,0.98) 0%, rgba(28,16,8,0.6) 50%, rgba(28,16,8,0.2) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "2rem 2.5rem", maxWidth: "1400px", width: "100%" }}>
          <button
            onClick={() => setCurrentPage("side-quests")}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(255,252,247,0.12)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,252,247,0.2)", color: "#FFFCF7", padding: "6px 14px", borderRadius: "100px", cursor: "pointer", marginBottom: "1.25rem", display: "inline-block" }}
          >
            ← Back to side quests
          </button>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "rgba(255,252,247,0.5)", marginBottom: "8px" }}>
            {quest.category}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 64px)", color: "#FFFCF7", lineHeight: 1.05, letterSpacing: "-0.5px", marginBottom: "1rem" }}>
            {quest.name}
          </h1>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", background: quest.is_free ? "rgba(133,201,160,0.3)" : "rgba(255,252,247,0.15)", color: quest.is_free ? "#A8E4BC" : "#FFFCF7", border: `1px solid ${quest.is_free ? "rgba(133,201,160,0.5)" : "rgba(255,252,247,0.25)"}`, padding: "4px 12px", borderRadius: "100px" }}>
              {quest.is_free ? "Free" : `$${quest.cost}`}
            </span>
            {quest.is_beginner_friendly && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", background: "rgba(133,201,160,0.3)", color: "#A8E4BC", border: "1px solid rgba(133,201,160,0.5)", padding: "4px 12px", borderRadius: "100px" }}>
                Beginner ok
              </span>
            )}
            {quest.is_recurring && quest.recurrence && (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: "700", background: "rgba(255,170,127,0.3)", color: "#FFCBA4", border: "1px solid rgba(255,170,127,0.5)", padding: "4px 12px", borderRadius: "100px" }}>
                {RECURRENCE_LABELS[quest.recurrence]}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={handleGoing}
              disabled={goingLoading}
              style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "700", background: isGoing ? "var(--sage)" : "var(--peach)", color: isGoing ? "#1A4D32" : "#6B3218", border: "none", padding: "12px 24px", borderRadius: "100px", cursor: goingLoading ? "default" : "pointer", transition: "all 0.15s" }}
            >
              {isGoing ? `✓ Going (${quest.going_count})` : `I'm going — ${quest.going_count} interested`}
            </button>
            <button
              onClick={() => downloadICS(quest)}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(255,252,247,0.12)", color: "rgba(255,252,247,0.7)", border: "1px solid rgba(255,252,247,0.2)", padding: "10px 18px", borderRadius: "100px", cursor: "pointer" }}
            >
              📅 Add to calendar
            </button>
            <button
              onClick={handleShare}
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "rgba(255,252,247,0.12)", color: copied ? "#A8E4BC" : "rgba(255,252,247,0.7)", border: `1px solid ${copied ? "rgba(133,201,160,0.5)" : "rgba(255,252,247,0.2)"}`, padding: "10px 18px", borderRadius: "100px", cursor: "pointer", transition: "all 0.2s" }}
            >
              {copied ? "✓ Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Date + going box */}
        <div style={{ position: "absolute", top: "2rem", right: "2.5rem", background: "rgba(28,16,8,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,252,247,0.15)", borderRadius: "var(--radius-xl)", padding: "1.25rem", minWidth: "200px", zIndex: 2 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,252,247,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Date</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "15px", color: "#FFFCF7", marginBottom: "2px" }}>{formatDate(quest.date)}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,252,247,0.6)", marginBottom: "1rem" }}>{quest.time}</div>
          <div style={{ borderTop: "1px solid rgba(255,252,247,0.1)", paddingTop: "1rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "rgba(255,252,247,0.4)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "4px" }}>Going</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--peach)", lineHeight: 1 }}>{quest.going_count}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "rgba(255,252,247,0.4)", marginTop: "2px" }}>people interested</div>
          </div>
        </div>
      </div>

      <div className="page">
        {/* About */}
        <div style={{ marginBottom: "2rem" }}>
          <div className="section-label">About this event</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "17px", color: "var(--ink-2)", lineHeight: 1.8 }}>
            {quest.description}
          </p>
        </div>

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "2rem" }}>
          <div className="card" style={{ cursor: "default" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Cost</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "var(--ink)" }}>{quest.is_free ? "Free" : `$${quest.cost}`}</div>
          </div>
          <div className="card" style={{ cursor: "default" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Skill level</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--ink)" }}>{quest.is_beginner_friendly ? "All welcome" : "Some experience helpful"}</div>
          </div>
          {quest.is_recurring && (
            <div className="card" style={{ cursor: "default" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Frequency</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--ink)" }}>{RECURRENCE_LABELS[quest.recurrence] || "Recurring"}</div>
            </div>
          )}
          {quest.spawn_point && (
            <div
              className="card"
              style={{ cursor: "pointer", borderColor: "var(--peach)" }}
              onClick={() => { setSelectedSpawnPoint(quest.spawn_point); setCurrentPage("spawn-point-detail"); }}
            >
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--peach-dark)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px" }}>Location →</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--ink)", marginBottom: "2px" }}>{quest.spawn_point.name}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>{quest.spawn_point.neighborhood}</div>
            </div>
          )}
        </div>

        {/* Related events */}
        {relatedQuests.length > 0 && (
          <>
            <div className="section-label">More at {quest.spawn_point?.name}</div>
            <div className="grid-2" style={{ marginBottom: "2rem" }}>
              {relatedQuests.slice(0, 4).map((q) => (
                <SideQuestCard
                  key={q.id}
                  sideQuest={{ ...q, spawn_point: quest.spawn_point }}
                  onClick={(clicked) => { setSelectedSideQuest(clicked); setCurrentPage("side-quest-detail"); }}
                />
              ))}
            </div>
          </>
        )}

        {/* Map — moved to bottom */}
    {quest.spawn_point?.latitude && quest.spawn_point?.longitude && (
  <>
    <div className="section-label">Where it's at</div>
    {quest.spawn_point.address && (
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-3)", marginBottom: "10px" }}>
        📍 {quest.spawn_point.address}
      </div>
    )}
    <div style={{ height: "300px", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "2rem", border: "1.5px solid var(--border)" }}>
      <MapView spawnPoints={[quest.spawn_point]} onSelectSpawnPoint={() => {}} singlePin />
    </div>
  </>
)}

        <CommentSection sideQuestId={quest.id} showToast={showToast} />

        <div style={{ display: "flex", gap: "10px", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <button className="btn-secondary" onClick={() => { setEditingSideQuest(quest); setCurrentPage("side-quest-form"); }}>
            Edit side quest
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete side quest
          </button>
        </div>
      </div>
    </div>
  );
}