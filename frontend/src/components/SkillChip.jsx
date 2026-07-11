function SkillChip({ label, color }) {
  return (
    <span style={{
      display: "inline-block",
      background: color ? `${color}15` : "var(--primary-light)",
      color: color || "var(--primary)",
      padding: "5px 12px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      marginRight: 6,
      marginBottom: 6,
      border: `1px solid ${color ? `${color}30` : "transparent"}`,
      letterSpacing: "0.01em",
    }}>
      {label}
    </span>
  );
}

export default SkillChip;
