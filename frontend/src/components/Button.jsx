function Button({ children, variant = "primary", disabled = false, onClick, type = "button", style = {}, size = "md" }) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "11px 22px", fontSize: 14 },
    lg: { padding: "14px 28px", fontSize: 16 },
  };

  const variants = {
    primary: {
      background: "var(--gradient)",
      color: "#ffffff",
      border: "none",
      boxShadow: "0 4px 15px var(--primary-glow)",
    },
    secondary: {
      background: "var(--card)",
      color: "var(--text)",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)",
    },
    ghost: {
      background: "transparent",
      color: "var(--primary)",
      border: "1px solid var(--primary-light)",
    },
    danger: {
      background: "var(--danger)",
      color: "#ffffff",
      border: "none",
      boxShadow: "0 4px 15px rgba(239,68,68,0.25)",
    },
    success: {
      background: "var(--success)",
      color: "#ffffff",
      border: "none",
      boxShadow: "0 4px 15px rgba(16,185,129,0.25)",
    },
  };

  const base = {
    ...sizes[size],
    borderRadius: "var(--radius-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontFamily: "inherit",
    opacity: disabled ? 0.55 : 1,
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.01em",
    ...variants[variant],
    ...style,
  };

  return (
    <button type={type} style={base} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
