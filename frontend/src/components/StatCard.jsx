function StatCard({ label, value, accent, icon, trend }) {
  return (
    <div
      className="animate-scale"
      style={{
        background: "var(--card)",
        padding: "20px 24px",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-md)",
        border: "1px solid var(--border-light)",
        minWidth: 180,
        flex: "1 1 180px",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Accent glow */}
      {accent && (
        <div style={{
          position: "absolute", top: 0, right: 0, width: 80, height: 80,
          background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
          borderRadius: "0 var(--radius-md) 0 100%",
        }} />
      )}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ margin: 0, marginBottom: 6, color: "var(--text-muted)", fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: 32, fontWeight: 800, color: accent || "var(--text)", lineHeight: 1, letterSpacing: "-0.02em" }}>
            {value}
          </p>
          {trend && (
            <p style={{ margin: "6px 0 0", fontSize: 12, color: trend > 0 ? "var(--success)" : "var(--danger)", fontWeight: 600 }}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs last
            </p>
          )}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: "var(--radius-sm)",
            background: accent ? `${accent}15` : "var(--primary-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
