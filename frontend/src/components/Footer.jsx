function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "20px 24px",
      color: "var(--text-muted)",
      fontSize: 13,
      borderTop: "1px solid var(--border-light)",
      marginTop: "auto",
      background: "var(--card-glass)",
      backdropFilter: "blur(20px)",
    }}>
      <span>🧠 </span>
      <span style={{ background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 700 }}>
        Smart Interview Coach
      </span>
      <span> © 2026 · Built with AI</span>
    </footer>
  );
}

export default Footer;
