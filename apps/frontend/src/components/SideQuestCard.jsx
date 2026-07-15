export default function SideQuestCard({ sideQuest, onClick }) {
  return (
    <div className="card" onClick={() => onClick && onClick(sideQuest)}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "700",
            color: "var(--ink)",
            flex: 1,
            marginRight: "10px",
          }}
        >
          {sideQuest.name}
        </div>
        <span className="tag tag-peach">{sideQuest.category}</span>
      </div>

      <div
        style={{
          fontSize: "13px",
          color: "var(--ink-2)",
          marginBottom: "10px",
          lineHeight: "1.5",
        }}
      >
        {sideQuest.description}
      </div>

      {sideQuest.spawn_point && (
        <div
          className="mono"
          style={{
            fontSize: "10px",
            color: "var(--ink-3)",
            marginBottom: "8px",
          }}
        >
          📍 {sideQuest.spawn_point.name} · {sideQuest.spawn_point.neighborhood}
        </div>
      )}

      <div
        className="mono"
        style={{
          fontSize: "10px",
          color: "var(--ink-3)",
          marginBottom: "10px",
        }}
      >
        🗓 {sideQuest.date} · {sideQuest.time}
      </div>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span
          className={`tag ${sideQuest.is_free ? "tag-sage" : "tag-neutral"}`}
        >
          {sideQuest.is_free ? "Free" : `$${sideQuest.cost}`}
        </span>
        {sideQuest.is_beginner_friendly && (
          <span className="tag tag-sage">Beginner ok</span>
        )}
        {sideQuest.tags &&
          sideQuest.tags
            .split(",")
            .slice(0, 2)
            .map((tag) => (
              <span key={tag} className="tag tag-neutral">
                {tag.trim()}
              </span>
            ))}
      </div>
    </div>
  );
}
