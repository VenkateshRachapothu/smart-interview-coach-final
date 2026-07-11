// CSS variable-based theme for dark/light mode support
const theme = {
  primary: "var(--primary)",
  primaryDark: "var(--primary-dark)",
  primaryLight: "var(--primary-light)",
  primaryGlow: "var(--primary-glow)",
  secondary: "var(--secondary)",
  accent: "var(--accent)",
  success: "var(--success)",
  successLight: "var(--success-light)",
  warning: "var(--warning)",
  warningLight: "var(--warning-light)",
  danger: "var(--danger)",
  dangerLight: "var(--danger-light)",
  background: "var(--bg)",
  background2: "var(--bg2)",
  card: "var(--card)",
  cardGlass: "var(--card-glass)",
  border: "var(--border)",
  borderLight: "var(--border-light)",
  text: "var(--text)",
  muted: "var(--text-muted)",
  textLight: "var(--text-light)",
  gradient: "var(--gradient)",
  gradientSoft: "var(--gradient-soft)",
  shadow: {
    sm: "var(--shadow-sm)",
    card: "var(--shadow-md)",
    elevated: "var(--shadow-lg)",
    glow: "var(--shadow-glow)",
  },
  spacing: { xs: 8, sm: 16, md: 24, lg: 32, xl: 48 },
  radius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
  maxWidth: 1140,
};

// Legacy light/dark theme objects (kept for backward compat)
const lightTheme = {
  background: "#f8fafc",
  card: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
  primary: "#6366f1",
  primaryLight: "#eef2ff",
  success: "#10b981",
};

const darkTheme = {
  background: "#0a0f1e",
  card: "#1e293b",
  text: "#f1f5f9",
  muted: "#94a3b8",
  border: "#334155",
  primary: "#818cf8",
  primaryLight: "#1e1b4b",
  success: "#34d399",
};

export { lightTheme, darkTheme };
export default theme;
