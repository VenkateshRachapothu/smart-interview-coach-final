export const textareaStyle = {
  width: "100%",
  minHeight: 120,
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  fontSize: 14,
  lineHeight: 1.7,
  fontFamily: "inherit",
  resize: "vertical",
  boxSizing: "border-box",
  background: "var(--bg)",
  color: "var(--text)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  outline: "none",
};

export const preStyle = {
  whiteSpace: "pre-wrap",
  background: "var(--bg2)",
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  fontSize: 13,
  lineHeight: 1.7,
  margin: 0,
  color: "var(--text)",
  fontFamily: "inherit",
};

export const sectionLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
};

export const gridTwoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
};

export const statRow = {
  display: "flex",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 20,
};

export const badgeStyle = (bg = "var(--primary-light)", color = "var(--primary)") => ({
  background: bg,
  color: color,
  padding: "6px 14px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
});

export const getScoreColor = (score) => {
  const num = Number(score);
  if (num >= 8) return "var(--success)";
  if (num >= 5) return "var(--warning)";
  return "var(--danger)";
};

export const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)",
  fontSize: 14,
  boxSizing: "border-box",
  background: "var(--bg)",
  color: "var(--text)",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  outline: "none",
};
