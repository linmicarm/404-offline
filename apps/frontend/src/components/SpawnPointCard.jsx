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

export default function SpawnPointCard({ spawnPoint, onClick, searchQuery }) {
  const openStatus = isOpenNow(spawnPoint.hours);
  const upcomingQuests = spawnPoint.side_quests || [];

  return (
    <div className="card" onClick={() => onClick && onClick(spawnPoint)}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)", marginBottom: "3px" }}>
            {searchQuery ? highlight(spawnPoint.name, searchQuery) : spawnPoint.name}
          </div>
          <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
            {searchQuery ? highlight(spawnPoint.neighborhood, searchQuery) : spawnPoint.neighborhood}
          </div>
        </div>
        <span className="tag tag-peach">{spawnPoint.category}</span>
      </div>

      <div className="mono" style={{ fontSize: "10px", color: "var(--ink-2)", marginBottom: "10px" }}>
        {spawnPoint.address}
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: upcomingQuests.length > 0 ? "10px" : "0" }}>
        {openStatus === true && <span className="tag tag-sage">🟢 Open now</span>}
        {openStatus === false && <span className="tag tag-neutral">🔴 Closed</span>}
        {spawnPoint.is_marta_accessible && <span className="tag tag-sage">🚇 MARTA</span>}
        {spawnPoint.rating_count > 0 && (
          <span className="tag tag-neutral" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ color: "#FFAA7F" }}>★</span>
            {(spawnPoint.rating_sum / spawnPoint.rating_count).toFixed(1)}
            <span style={{ color: "var(--ink-3)", fontSize: "9px" }}>({spawnPoint.rating_count})</span>
          </span>
        )}
        {spawnPoint._count && (
          <span className="tag tag-neutral">
            {spawnPoint._count.side_quests} side quest{spawnPoint._count.side_quests !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {upcomingQuests.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div className="mono" style={{ fontSize: "9px", color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "2px" }}>
            Upcoming
          </div>
          {upcomingQuests.map((quest) => (
            <div key={quest.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {quest.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                {quest.is_recurring && quest.recurrence && (
                  <span style={{ fontFamily: "monospace", fontSize: "9px", color: "var(--peach-dark)", background: "var(--peach-light)", border: "1.5px solid var(--peach)", borderRadius: "100px", padding: "1px 6px" }}>
                    {RECURRENCE_LABELS[quest.recurrence] || "🔁"}
                  </span>
                )}
                <span className="mono" style={{ fontSize: "9px", color: "var(--ink-3)" }}>{formatDateShort(quest.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}