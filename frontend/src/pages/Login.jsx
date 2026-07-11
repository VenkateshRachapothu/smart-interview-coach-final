import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

const BACKEND = "https://smart-interview-coach-ozbd.onrender.com";
const LOCAL_BACKEND = "/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Login failed"); return; }
      login(data.user, data.token);
      navigate("/upload");
    } catch (error) {
      console.error(error);
      alert("Unable to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleLoading(true);
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      if (!userInfoRes.ok) throw new Error("Failed to fetch Google user info");
      const userInfo = await userInfoRes.json();
      const response = await fetch(`${LOCAL_BACKEND}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userInfo.name, email: userInfo.email }),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Google login failed"); return; }
      login(data.user, data.token);
      navigate("/upload");
    } catch (error) {
      console.error("Google login error:", error);
      alert(`Google login failed: ${error.message}`);
    } finally {
      setGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => alert(`Google sign-in error: ${err.error_description || err.error || "Unknown error"}`),
  });

  return (
    <Layout>
      <Navbar />
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 130px)", padding: "24px" }}>
        <div className="animate-scale" style={{
          width: "100%", maxWidth: 420,
          background: "var(--card)", borderRadius: "var(--radius-lg)",
          padding: "40px", boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-light)",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
              Welcome back
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Sign in to continue your interview prep</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
            </div>
            <Button type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
              {loading ? "Signing in..." : "Sign In →"}
            </Button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button onClick={() => googleLogin()} disabled={googleLoading} style={googleBtnStyle}>
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up free</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

const labelStyle = { display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "var(--text)" };

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)", fontSize: 14, boxSizing: "border-box",
  background: "var(--bg)", color: "var(--text)", fontFamily: "inherit",
  transition: "border-color 0.2s ease", outline: "none",
};

const googleBtnStyle = {
  width: "100%", padding: "11px", display: "flex", alignItems: "center",
  justifyContent: "center", gap: 10, border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)", background: "var(--card)", color: "var(--text)",
  fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  transition: "all 0.2s ease", boxShadow: "var(--shadow-sm)",
};

export default Login;
