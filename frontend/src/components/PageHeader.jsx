function PageHeader({ title, subtitle, badge }) {
  return (
    <header style={{ marginBottom: 28, textAlign: "left" }}>
      {badge && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "var(--primary-light)", color: "var(--primary)",
          padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
          marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          {badge}
        </div>
      )}
      <h1 style={{
        margin: 0, marginBottom: subtitle ? 8 : 0,
        fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 800,
        color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1.2,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}

export default PageHeader;
