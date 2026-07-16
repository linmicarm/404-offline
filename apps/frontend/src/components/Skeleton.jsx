export function SkeletonCard() {
  return (
    <div className="card" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ height: "16px", width: "60%", background: "var(--surface2)", borderRadius: "8px" }} />
        <div style={{ height: "16px", width: "20%", background: "var(--surface2)", borderRadius: "100px" }} />
      </div>
      <div style={{ height: "12px", width: "100%", background: "var(--surface2)", borderRadius: "8px", marginBottom: "8px" }} />
      <div style={{ height: "12px", width: "80%", background: "var(--surface2)", borderRadius: "8px", marginBottom: "12px" }} />
      <div style={{ height: "10px", width: "40%", background: "var(--surface2)", borderRadius: "8px", marginBottom: "10px" }} />
      <div style={{ display: "flex", gap: "6px" }}>
        <div style={{ height: "22px", width: "48px", background: "var(--surface2)", borderRadius: "100px" }} />
        <div style={{ height: "22px", width: "64px", background: "var(--surface2)", borderRadius: "100px" }} />
      </div>
    </div>
  );
}

export function SkeletonConCard() {
  return (
    <div className="card" style={{ display: "flex", padding: 0, overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ background: "var(--surface2)", borderRight: "1.5px solid var(--border)", padding: "1.25rem", minWidth: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <div style={{ height: "12px", width: "32px", background: "var(--border)", borderRadius: "6px" }} />
        <div style={{ height: "28px", width: "28px", background: "var(--border)", borderRadius: "6px" }} />
        <div style={{ height: "10px", width: "24px", background: "var(--border)", borderRadius: "6px" }} />
      </div>
      <div style={{ flex: 1, padding: "1.125rem" }}>
        <div style={{ height: "18px", width: "50%", background: "var(--surface2)", borderRadius: "8px", marginBottom: "10px" }} />
        <div style={{ height: "12px", width: "70%", background: "var(--surface2)", borderRadius: "8px", marginBottom: "10px" }} />
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
          <div style={{ height: "22px", width: "56px", background: "var(--surface2)", borderRadius: "100px" }} />
          <div style={{ height: "22px", width: "80px", background: "var(--surface2)", borderRadius: "100px" }} />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ height: "32px", width: "100px", background: "var(--surface2)", borderRadius: "100px" }} />
          <div style={{ height: "32px", width: "60px", background: "var(--surface2)", borderRadius: "100px" }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4, type = "card" }) {
  return (
    <div className="grid-2">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonConCard key={i} />
      ))}
    </div>
  );
}