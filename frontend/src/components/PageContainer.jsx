function PageContainer({ children, style = {} }) {
  return (
    <main style={{
      maxWidth: 1140,
      margin: "0 auto",
      padding: "32px 24px",
      width: "100%",
      boxSizing: "border-box",
      flex: 1,
      textAlign: "left",
      ...style,
    }}>
      {children}
    </main>
  );
}

export default PageContainer;
