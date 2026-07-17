export function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startStr, endStr) {
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${start.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}–${end.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}, ${end.getFullYear()}`;
  }

  return `${start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`;
}