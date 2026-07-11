function Card({ children, style = {}, title, subtitle, glass = false, accent, animate = true }) {
  return (
    <div
      className={animate ? "animate-fade" : ""}
      style={{
        background: glass ? "var(--card-glass)" : "var(--card)",
        backdropFilter: glass ? "blur(20px)" : undefined,
        WebkitBackdropFilter: glass ? "blur(20px)" : undefined,
        borderRadius: "var(--radius-md)",
        padding: "24px",
        boxShadow: "var(--shadow-md)",
        border: accent ? `1px solid ${accent}33` : "1px solid var(--border-light)",
        marginBottom: 20,
        textAlign: "left",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
        ...style,
      }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: 16 }}>
          {title && (
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.01em" }}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-muted)" }}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
