import { formatDateShort } from "../utils/formatDate.js";
import { highlight } from "../utils/highlight.jsx";

function isOpenNow(hoursStr) {
  if (!hoursStr) return null;
  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const segments = hoursStr.split(", ");
  for (const segment of segments) {
    const [daysPart, timePart] = segment.split(" ");
    if (!daysPart || !timePart) continue;
    const days = daysPart.split("-");
    const startIdx = dayNames.indexOf(days[0]);
    const endIdx = dayNames.indexOf(days[1] || days[0]);
    let inRange = startIdx <= endIdx ? day >= startIdx && day <= endIdx : day >= startIdx || day <= endIdx;
    if (!inRange) continue;
    const times = timePart.split("-");
    if (times.length < 2) continue;
    function parseTime(t) {
      const isPM = t.includes("pm");
      const clean = t.replace("pm", "").replace("am", "");
      const [h, m] = clean.split(":").map(Number);
      let hours = h;
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      return hours * 60 + (m || 0);
    }
    const openMin = parseTime(times[0]);
    const closeMin = parseTime(times[1]);
    if (closeMin < openMin) {
      if (currentMinutes >= openMin || currentMinutes < closeMin) return true;
    } else {
      if (currentMinutes >= openMin && currentMinutes < closeMin) return true;
    }
  }
  return false;
}

const RECURRENCE_LABELS = {
  weekly: "🔁 Weekly",
  biweekly: "🔁 Biweekly",
  monthly: "🔁 Monthly",
};

const CATEGORY_GRADIENTS = {
  "Gaming venue": "linear-gradient(135deg, #2C1810 0%, #6B3218 100%)",
  "Comics & cards": "linear-gradient(135deg, #1A1A2E 0%, #4A3060 100%)",
  "Kawaii shop": "linear-gradient(135deg, #3D1A2E 0%, #8B4069 100%)",
  "Boba & matcha": "linear-gradient(135deg, #1A2E1A 0%, #2D5A3D 100%)",
  "Cute cafe": "linear-gradient(135deg, #2E1A1A 0%, #6B3A3A 100%)",
  "Asian eats": "linear-gradient(135deg, #1A2A1A 0%, #3A5A3A 100%)",
  "Other": "linear-gradient(135deg, #1A1A1A 0%, #3A3A3A 100%)",
};

export default function SpawnPointCard({ spawnPoint, onClick, searchQuery }) {
  const openStatus = isOpenNow(spawnPoint.hours);
  const upcomingQuests = spawnPoint.side_quests || [];
  const gradient = CATEGORY_GRADIENTS[spawnPoint.category] || CATEGORY_GRADIENTS.Other;

  return (
    <div className="card" onClick={() => onClick && onClick(spawnPoint)} style={{ padding: 0, overflow: "hidden" }}>
      <div style={{
        height: "180px",
        background: spawnPoint.image_url ? `url(${spawnPoint.image_url}) center/cover` : gradient,
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        padding: "0.875rem",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(44,24,16,0.88) 0%, rgba(44,24,16,0.05) 60%)" }} />
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "#FFFCF7", marginBottom: "3px", lineHeight: 1.2 }}>
            {searchQuery ? highlight(spawnPoint.name, searchQuery) : spawnPoint.name}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "rgba(255,252,247,0.7)" }}>
            {searchQuery ? highlight(spawnPoint.neighborhood, searchQuery) : spawnPoint.neighborhood}
          </div>
        </div>
        <span style={{ position: "absolute", top: "10px", right: "10px", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "700", background: "rgba(255,252,247,0.15)", backdropFilter: "blur(4px)", color: "#FFFCF7", border: "1px solid rgba(255,252,247,0.2)", padding: "4px 10px", borderRadius: "100px" }}>
          {spawnPoint.category}
        </span>
      </div>

      <div style={{ padding: "1.125rem" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--ink-3)", marginBottom: "12px" }}>
          {spawnPoint.address}
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: upcomingQuests.length > 0 ? "12px" : "0" }}>
          {openStatus === true && <span className="tag tag-sage">🟢 Open now</span>}
          {openStatus === false && <span className="tag tag-neutral">🔴 Closed</span>}
          {spawnPoint.is_marta_accessible && <span className="tag tag-sage">🚇 MARTA</span>}
          {spawnPoint.rating_count > 0 && (
            <span className="tag tag-neutral" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <span style={{ color: "#FFAA7F" }}>★</span>
              {(spawnPoint.rating_sum / spawnPoint.rating_count).toFixed(1)}
              <span style={{ color: "var(--ink-3)", fontSize: "10px" }}>({spawnPoint.rating_count})</span>
            </span>
          )}
          {spawnPoint._count && (
            <span className="tag tag-neutral">
              {spawnPoint._count.side_quests} side quest{spawnPoint._count.side_quests !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {upcomingQuests.length > 0 && (
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "2px" }}>
              Upcoming
            </div>
            {upcomingQuests.map((quest) => (
              <div key={quest.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", fontWeight: "600", color: "var(--ink)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {quest.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                  {quest.is_recurring && quest.recurrence && (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--peach-dark)", background: "var(--peach-light)", border: "1.5px solid var(--peach)", borderRadius: "100px", padding: "2px 8px" }}>
                      {RECURRENCE_LABELS[quest.recurrence] || "🔁"}
                    </span>
                  )}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)" }}>{formatDateShort(quest.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}