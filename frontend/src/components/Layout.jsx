import { ToastContainer } from "./Toast";

function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Subtle background mesh */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 110%, rgba(139,92,246,0.05) 0%, transparent 60%)",
      }} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
        {children}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Layout;
