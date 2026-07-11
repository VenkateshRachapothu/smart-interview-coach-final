import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: "⚡" },
  { to: "/upload", label: "Upload", icon: "📄" },
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/history", label: "History", icon: "🕐" },
  { to: "/learning", label: "Learning", icon: "🎓" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => { logout(); navigate("/login"); };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={navStyle}>
        <div style={navInnerStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <span style={logoIconStyle}>🧠</span>
            <span style={{ background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              InterviewCoach
            </span>
          </Link>

          {/* Desktop Links */}
          <div style={desktopLinksStyle} className="nav-desktop">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} style={linkStyle(isActive(link.to))}>
                {link.label}
                {isActive(link.to) && <span style={activeDotStyle} />}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={iconBtnStyle} aria-label="Toggle theme" title={darkMode ? "Light mode" : "Dark mode"}>
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user && (
              <>
                <div style={avatarStyle} title={user.name}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} style={logoutBtnStyle} className="hide-mobile">
                  Logout
                </button>
              </>
            )}

            {/* Mobile Toggle */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ ...iconBtnStyle, fontSize: 20 }}
              className="hide-desktop"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={mobileMenuStyle}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={mobileLinkStyle(isActive(link.to))}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout} style={{ ...mobileLinkStyle(false), border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}>
                <span>🚪</span><span>Logout</span>
              </button>
            )}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hide-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .hide-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}

const navStyle = {
  background: "var(--card-glass)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderBottom: "1px solid var(--border-light)",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
};

const navInnerStyle = {
  maxWidth: 1140,
  margin: "0 auto",
  padding: "0 24px",
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
};

const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  textDecoration: "none",
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  flexShrink: 0,
};

const logoIconStyle = {
  fontSize: 24,
  filter: "drop-shadow(0 0 8px rgba(99,102,241,0.4))",
};

const desktopLinksStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  flex: 1,
  justifyContent: "center",
};

const linkStyle = (active) => ({
  position: "relative",
  color: active ? "var(--primary)" : "var(--text-muted)",
  textDecoration: "none",
  fontWeight: active ? 600 : 500,
  fontSize: 14,
  padding: "6px 14px",
  borderRadius: "var(--radius-sm)",
  background: active ? "var(--primary-light)" : "transparent",
  transition: "all 0.2s ease",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
});

const activeDotStyle = {
  position: "absolute",
  bottom: -2,
  left: "50%",
  transform: "translateX(-50%)",
  width: 4,
  height: 4,
  borderRadius: "50%",
  background: "var(--primary)",
};

const iconBtnStyle = {
  background: "var(--bg2)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "8px 10px",
  cursor: "pointer",
  fontSize: 16,
  color: "var(--text)",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "var(--gradient)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 14,
  flexShrink: 0,
  boxShadow: "0 2px 8px var(--primary-glow)",
};

const logoutBtnStyle = {
  background: "transparent",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  color: "var(--text-muted)",
  transition: "all 0.2s ease",
};

const mobileMenuStyle = {
  borderTop: "1px solid var(--border-light)",
  padding: "12px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  background: "var(--card-glass)",
  backdropFilter: "blur(20px)",
};

const mobileLinkStyle = (active) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  color: active ? "var(--primary)" : "var(--text)",
  background: active ? "var(--primary-light)" : "transparent",
  fontWeight: active ? 600 : 500,
  fontSize: 15,
  textDecoration: "none",
  transition: "all 0.2s ease",
});

export default Navbar;
