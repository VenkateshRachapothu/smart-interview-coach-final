import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

function getApiBase() {
  if (import.meta.env.DEV) return "/api";
  return import.meta.env.VITE_API_URL || "https://smart-interview-coach-ozbd.onrender.com";
}

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${getApiBase()}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Signup failed"); return; }
      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to signup.");
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
              Create account
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Start your interview preparation journey</p>
          </div>

          <form onSubmit={handleSignup}>
            {[
              { name: "name", type: "text", placeholder: "John Doe", label: "Full Name" },
              { name: "email", type: "email", placeholder: "you@example.com", label: "Email" },
              { name: "password", type: "password", placeholder: "••••••••", label: "Password" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{field.label}</label>
                <input
                  type={field.type} name={field.name} placeholder={field.placeholder}
                  value={formData[field.name]} onChange={handleChange}
                  required style={inputStyle}
                />
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <Button type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
                {loading ? "Creating Account..." : "Create Account →"}
              </Button>
            </div>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign in</Link>
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

export default Signup;
