import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import StatCard from "../components/StatCard";

function Profile() {
  const [stats, setStats] = useState({ total: 0, average: 0, best: 0 });
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://smart-interview-coach-ozbd.onrender.com/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error(e));
  }, []);

  const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <PageShell title="My Profile" subtitle="Manage your account and view statistics">
      {/* Avatar Card */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "var(--gradient)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 800, flexShrink: 0,
            boxShadow: "0 4px 20px var(--primary-glow)",
          }}>
            {initials}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.02em" }}>
              {user.name || "User"}
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>{user.email || "—"}</p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8,
              background: "var(--primary-light)", color: "var(--primary)",
              padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
            }}>
              ✨ Active Member
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard label="Total Interviews" value={stats.total} icon="🎯" accent="var(--primary)" />
        <StatCard label="Average Score" value={stats.average ? `${stats.average}/10` : "—"} icon="📊" accent="var(--warning)" />
        <StatCard label="Best Score" value={stats.best ? `${stats.best}/10` : "—"} icon="🏆" accent="var(--success)" />
      </div>

      {/* Account Info */}
      <Card title="Account Information">
        <div style={{ display: "grid", gap: 16 }}>
          {[
            { label: "Full Name", value: user.name || "—", icon: "👤" },
            { label: "Email Address", value: user.email || "—", icon: "📧" },
            { label: "Member Since", value: "2026", icon: "📅" },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px", background: "var(--bg2)",
              borderRadius: "var(--radius-sm)",
            }}>
              <span style={{ fontSize: 20 }}>{row.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {row.label}
                </p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

export default Profile;
