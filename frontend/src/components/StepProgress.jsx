const STEPS = [
  { number: 1, label: "Upload", icon: "📄" },
  { number: 2, label: "Role", icon: "🎯" },
  { number: 3, label: "Interview", icon: "💬" },
  { number: 4, label: "Results", icon: "📊" },
];

function StepProgress({ currentStep }) {
  return (
    <div style={{
      background: "var(--card-glass)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border-light)",
      padding: "12px 24px",
    }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>
        {STEPS.map((step, index) => {
          const isComplete = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} style={{ display: "flex", alignItems: "center", flex: index < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: isComplete ? 14 : 13, fontWeight: 700,
                  background: isComplete ? "var(--success)" : isActive ? "var(--gradient)" : "var(--bg2)",
                  color: isComplete || isActive ? "#fff" : "var(--text-muted)",
                  border: isActive ? "2px solid transparent" : `1px solid var(--border)`,
                  boxShadow: isActive ? "0 0 0 3px var(--primary-glow)" : "none",
                  transition: "all 0.3s ease",
                }}>
                  {isComplete ? "✓" : step.icon}
                </div>
                <span style={{
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary)" : isComplete ? "var(--text)" : "var(--text-muted)",
                  transition: "color 0.3s ease",
                }}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 12px",
                  background: isComplete
                    ? "linear-gradient(90deg, var(--success), var(--primary))"
                    : "var(--border)",
                  borderRadius: 999, minWidth: 20,
                  transition: "background 0.3s ease",
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepProgress;
