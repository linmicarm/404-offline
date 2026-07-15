export default function SpawnPointCard({ spawnPoint, onClick }) {
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

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {spawnPoint.is_marta_accessible && (
          <span className="tag tag-sage">MARTA accessible</span>
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