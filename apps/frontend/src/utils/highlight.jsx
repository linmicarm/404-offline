export function highlight(text, query) {
  if (!query || !text) return text;

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);

  if (!normalizedText.includes(normalizedQuery)) return text;

  const index = normalizedText.indexOf(normalizedQuery);
  const before = text.slice(0, index);
  const match = text.slice(index, index + normalizedQuery.length);
  const after = text.slice(index + normalizedQuery.length);

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  return (
    <>
      {before}
      <mark
        style={{
          background: "var(--peach)",
          color: isDark ? "#12100E" : "var(--peach-dark)",
          borderRadius: "3px",
          padding: "0 2px",
          fontWeight: "700",
        }}
      >
        {match}
      </mark>
      {after}
    </>
  );
}
