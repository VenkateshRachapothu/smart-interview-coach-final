function PageActions({ children, sticky = false }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 24,
      paddingTop: 20,
      borderTop: "1px solid var(--border-light)",
      ...(sticky ? {
        position: "sticky",
        bottom: 0,
        background: "var(--bg)",
        paddingBottom: 16,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      } : {}),
    }}>
      {children}
    </div>
  );
}

export default PageActions;
