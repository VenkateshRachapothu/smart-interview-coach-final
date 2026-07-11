import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";
import Card from "../components/Card";
import Button from "../components/Button";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, average: 0, best: 0 });
  const [learning, setLearning] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://smart-interview-coach-ozbd.onrender.com/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error(e));

    // Load learning progress from localStorage
    const saved = localStorage.getItem("learningProgress");
    if (saved) {
      try { setLearning(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  const isEmpty = stats.total === 0;
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Learning progress calculation
  const completedTopics = learning?.topics?.filter((t) => t.status === "completed").length || 0;
  const totalTopics = learning?.topics?.length || 0;
  const learningPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <PageShell title="Dashboard" subtitle={`Welcome back, ${user.name || "there"}! 👋`}>
      {/* Stats Row */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        <StatCard label="Total Interviews" value={stats.total} icon="🎯" accent="var(--primary)" />
        <StatCard label="Average Score" value={stats.average ? `${stats.average}/10` : "—"} icon="📊" accent="var(--warning)" />
        <StatCard label="Best Score" value={stats.best ? `${stats.best}/10` : "—"} icon="🏆" accent="var(--success)" />
        {totalTopics > 0 && (
          <StatCard label="Learning Progress" value={`${learningPct}%`} icon="🎓" accent="var(--secondary)" />
        )}
      </div>

      {isEmpty ? (
        <Card>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
              Start your first interview
            </h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 15 }}>
              Upload your resume and practice with AI-generated questions to track your progress here.
            </p>
            <Button onClick={() => navigate("/upload")}>🚀 Start Interview</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Quick Actions */}
          <Card title="Quick Actions" subtitle="Continue your interview preparation">
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Button onClick={() => navigate("/upload")}>📄 New Interview</Button>
              <Button variant="secondary" onClick={() => navigate("/history")}>🕐 View History</Button>
              <Button variant="ghost" onClick={() => navigate("/learning")}>🎓 Learning Center</Button>
            </div>
          </Card>

          {/* Score Progress */}
          <Card title="Performance Overview" subtitle="Your interview score trend">
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Average Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{stats.average}/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(stats.average / 10) * 100}%` }} />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>Best Score</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--success)" }}>{stats.best}/10</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(stats.best / 10) * 100}%`, background: "var(--success)" }} />
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Recommended Learning Section */}
      {learning && totalTopics > 0 && (
        <Card
          title="📚 Recommended Learning"
          subtitle="Based on your latest interview performance"
          accent="var(--secondary)"
        >
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 500 }}>
                {completedTopics} of {totalTopics} topics completed
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--secondary)" }}>{learningPct}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${learningPct}%`, background: "linear-gradient(90deg, var(--secondary), var(--accent))" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {learning.topics.slice(0, 6).map((topic, i) => (
              <span key={i} style={{
                padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                background: topic.status === "completed" ? "var(--success-light)" : topic.status === "in_progress" ? "var(--warning-light)" : "var(--primary-light)",
                color: topic.status === "completed" ? "var(--success)" : topic.status === "in_progress" ? "var(--warning)" : "var(--primary)",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {topic.status === "completed" ? "✓" : topic.status === "in_progress" ? "⏳" : "○"} {topic.skill}
              </span>
            ))}
            {totalTopics > 6 && (
              <span style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "var(--bg2)", color: "var(--text-muted)" }}>
                +{totalTopics - 6} more
              </span>
            )}
          </div>

          <Button onClick={() => navigate("/learning")}>
            🎓 Continue Learning →
          </Button>
        </Card>
      )}

      {/* No learning yet but has interviews */}
      {!learning && !isEmpty && (
        <Card
          title="📚 Recommended Learning"
          subtitle="Complete an interview to get personalized learning recommendations"
          accent="var(--secondary)"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, flex: 1 }}>
              After your next interview, we'll analyze your weaknesses and create a personalized learning path with resources, practice questions, and progress tracking.
            </p>
            <Button variant="ghost" onClick={() => navigate("/learning")}>
              🎓 Explore Learning
            </Button>
          </div>
        </Card>
      )}
    </PageShell>
  );
}

export default Dashboard;
