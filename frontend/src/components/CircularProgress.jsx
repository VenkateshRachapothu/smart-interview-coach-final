function CircularProgress({ value = 0, size = 120, strokeWidth = 10, color = "var(--primary)", label, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--border)" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        {/* Center text */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 800, color, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {value}
          </span>
          {sublabel && (
            <span style={{ fontSize: size * 0.1, color: "var(--text-muted)", fontWeight: 500 }}>{sublabel}</span>
          )}
        </div>
      </div>
      {label && (
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textAlign: "center" }}>{label}</span>
      )}
    </div>
  );
}

export default CircularProgress;
