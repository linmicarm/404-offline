function isOpenNow(hoursStr) {
  if (!hoursStr) return null;

  const now = new Date();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = dayNames[day];

  const segments = hoursStr.split(", ");

  for (const segment of segments) {
    const [daysPart, timePart] = segment.split(" ");
    if (!daysPart || !timePart) continue;

    const days = daysPart.split("-");
    const startDay = days[0];
    const endDay = days[1] || days[0];

    const startIdx = dayNames.indexOf(startDay);
    const endIdx = dayNames.indexOf(endDay);

    let inRange = false;
    if (startIdx <= endIdx) {
      inRange = day >= startIdx && day <= endIdx;
    } else {
      inRange = day >= startIdx || day <= endIdx;
    }

    if (!inRange) continue;

    const times = timePart.split("-");
    if (times.length < 2) continue;

    function parseTime(t) {
      const isPM = t.includes("pm");
      const isAM = t.includes("am");
      const clean = t.replace("pm", "").replace("am", "");
      const [h, m] = clean.split(":").map(Number);
      let hours = h;
      if (isPM && hours !== 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
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

export default function SpawnPointCard({ spawnPoint, onClick }) {
  const openStatus = isOpenNow(spawnPoint.hours);

  return (
    <div className="card" onClick={() => onClick && onClick(spawnPoint)}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
        <div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "var(--ink)", marginBottom: "3px" }}>
            {spawnPoint.name}
          </div>
          <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)" }}>
            {spawnPoint.neighborhood}
          </div>
        </div>
        <span className="tag tag-peach">{spawnPoint.category}</span>
      </div>

      <div className="mono" style={{ fontSize: "10px", color: "var(--ink-2)", marginBottom: "10px" }}>
        {spawnPoint.address}
      </div>

      {spawnPoint.hours && (
        <div className="mono" style={{ fontSize: "10px", color: "var(--ink-3)", marginBottom: "10px" }}>
          🕐 {spawnPoint.hours}
        </div>
      )}

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {openStatus === true && (
          <span className="tag tag-sage">🟢 Open now</span>
        )}
        {openStatus === false && (
          <span className="tag tag-neutral">🔴 Closed</span>
        )}
        {spawnPoint.is_marta_accessible && (
          <span className="tag tag-sage">🚇 MARTA</span>
        )}
        {spawnPoint._count && (
          <span className="tag tag-neutral">
            {spawnPoint._count.side_quests} side quest{spawnPoint._count.side_quests !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}