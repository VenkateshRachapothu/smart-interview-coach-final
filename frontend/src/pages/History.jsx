import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import { badgeStyle } from "../styles/shared";
import { getStoredToken } from "../context/AuthContext";

function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) { navigate("/login", { replace: true }); return; }
    const apiBase = import.meta.env.DEV
      ? "/api"
      : (import.meta.env.VITE_API_URL || "https://smart-interview-coach-ozbd.onrender.com");
    fetch(`${apiBase}/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { navigate("/login", { replace: true }); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setHistory(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((e) => { console.error(e); setLoading(false); });
  }, []);

  const getScoreColor = (score) => {
    const n = Number(score);
    if (n >= 8) return "var(--success)";
    if (n >= 5) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <PageShell title="Interview History" subtitle="Review your past interview sessions and track improvement">
      {loading ? (
        <div style={{ display: "grid", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: "var(--radius-md)" }} />
          ))}
        </div>
      ) : history.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🕐</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>No history yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 15 }}>
              Complete a mock interview to see your results here.
            </p>
            <Button onClick={() => navigate("/upload")}>🚀 Start Interview</Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {history.map((item, idx) => (
            <div key={item.id} className="animate-fade" style={{
              background: "var(--card)", borderRadius: "var(--radius-md)",
              padding: "20px 24px", boxShadow: "var(--shadow-md)",
              border: "1px solid var(--border-light)",
              animationDelay: `${idx * 0.05}s`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                    {item.role}
                  </h2>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    🕐 {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: `${getScoreColor(item.avg_score)}15`,
                    border: `2px solid ${getScoreColor(item.avg_score)}`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: getScoreColor(item.avg_score), lineHeight: 1 }}>
                      {item.avg_score}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 500 }}>/10</span>
                  </div>
                </div>
              </div>

              {/* Score bar */}
              <div style={{ marginBottom: 12 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${(Number(item.avg_score) / 10) * 100}%`,
                    background: getScoreColor(item.avg_score),
                  }} />
                </div>
              </div>

              {item.summary && (
                <div style={{
                  background: "var(--bg2)", padding: "10px 14px",
                  borderRadius: "var(--radius-sm)", fontSize: 13,
                  color: "var(--text-muted)", lineHeight: 1.6,
                }}>
                  {item.summary}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default History;
