import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/InterviewContext";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import PageActions from "../components/PageActions";
import CircularProgress from "../components/CircularProgress";
import { showToast } from "../components/Toast";
import { preStyle, statRow, badgeStyle, getScoreColor } from "../styles/shared";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

function Results() {
  const navigate = useNavigate();
  const { results = [] } = useContext(InterviewContext);

  const totalScore = results.reduce((sum, item) => sum + Number(item.technical_score || 0), 0);
  const averageScore = results.length > 0 ? (totalScore / results.length).toFixed(1) : 0;
  const scoreNum = Number(averageScore);
  const scoreColor = scoreNum >= 8 ? "var(--success)" : scoreNum >= 5 ? "var(--warning)" : "var(--danger)";
  const scorePct = Math.round((scoreNum / 10) * 100);

  const chartData = results.map((item, index) => ({
    question: `Q${index + 1}`,
    score: item.technical_score,
  }));

  let summary = {};
  try {
    const storedSummary = localStorage.getItem("summary");
    if (storedSummary && storedSummary !== "undefined") {
      summary = JSON.parse(storedSummary);
    }
  } catch (error) {
    summary = {};
  }

  // Career readiness calculation
  const careerReadiness = scoreNum >= 8 ? 90 : scoreNum >= 6 ? 70 : scoreNum >= 4 ? 50 : 30;
  const careerLabel = scoreNum >= 8 ? "Job Ready" : scoreNum >= 6 ? "Almost Ready" : scoreNum >= 4 ? "Needs Practice" : "Early Stage";
  const careerColor = scoreNum >= 8 ? "var(--success)" : scoreNum >= 6 ? "var(--warning)" : scoreNum >= 4 ? "#f59e0b" : "var(--danger)";

  // Radar chart data derived from results
  const avgTech = results.length ? (results.reduce((s, r) => s + Number(r.technical_score || 0), 0) / results.length) : 0;
  const avgComm = results.length ? (results.reduce((s, r) => s + Number(r.communication_score || 0), 0) / results.length) : 0;
  const radarData = [
    { subject: "Technical", score: Math.round(avgTech * 10) },
    { subject: "Communication", score: Math.round(avgComm * 10) },
    { subject: "Problem Solving", score: Math.round(avgTech * 9) },
    { subject: "Confidence", score: Math.round(avgComm * 9) },
    { subject: "Knowledge", score: Math.round(avgTech * 10) },
    { subject: "Clarity", score: Math.round(avgComm * 10) },
  ];

  // Suggested roles based on score
  const suggestedRoles = scoreNum >= 8
    ? ["Senior Developer", "Tech Lead", "Solution Architect"]
    : scoreNum >= 6
    ? ["Software Developer", "Junior Engineer", "Associate Developer"]
    : ["Intern", "Trainee Developer", "Junior Analyst"];

  useEffect(() => {
    if (results.length > 0) {
      showToast("🎉 Interview evaluation complete! Check your results below.", "success");
      if (summary?.weaknesses) {
        setTimeout(() => showToast("📚 Learning recommendations are ready for you!", "info"), 1500);
      }
    }
  }, []);

  const downloadReport = async () => {
    try {
      const response = await fetch("https://smart-interview-coach-ozbd.onrender.com/download_report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results, summary }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Interview_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast("📥 Report downloaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to download report.", "error");
    }
  };

  const handleGoToLearning = () => {
    if (summary?.weaknesses) {
      const weakList = summary.weaknesses
        .split(/[,;.\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 2 && s.length < 60);
      if (weakList.length > 0) {
        localStorage.setItem("autoWeakSkills", JSON.stringify(weakList));
      }
    }
    navigate("/learning");
  };

  const recStyle = () => {
    const rec = (summary?.recommendation || "").toLowerCase();
    if (rec.includes("ready") && !rec.includes("almost")) return badgeStyle("var(--success-light)", "var(--success)");
    if (rec.includes("almost")) return badgeStyle("var(--warning-light)", "var(--warning)");
    return badgeStyle("var(--danger-light)", "var(--danger)");
  };

  return (
    <PageShell
      step={4}
      title="Interview Results"
      subtitle="Your AI-powered performance analysis and personalized recommendations"
      actions={
        <PageActions>
          <Button onClick={downloadReport}>📥 Download Report</Button>
          <Button variant="secondary" onClick={() => navigate("/upload")}>🔄 New Interview</Button>
          <Button variant="ghost" onClick={handleGoToLearning}>🎓 Learning Plan</Button>
          <Button variant="ghost" onClick={() => navigate("/history")}>🕐 History</Button>
        </PageActions>
      }
    >

      {/* ── Hero Score Section ── */}
      <Card style={{ background: "var(--gradient-soft)", border: "1px solid var(--border-light)" }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          {/* Circular Score */}
          <CircularProgress
            value={scorePct}
            size={140}
            strokeWidth={12}
            color={scoreColor}
            label="Overall Score"
            sublabel={`${averageScore}/10`}
          />

          {/* Career Readiness Ring */}
          <CircularProgress
            value={careerReadiness}
            size={120}
            strokeWidth={10}
            color={careerColor}
            label="Career Readiness"
            sublabel={`${careerReadiness}%`}
          />

          {/* Summary Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ marginBottom: 16 }}>
              {summary?.recommendation && (
                <span style={{ ...recStyle(), marginBottom: 12, display: "inline-flex" }}>
                  {summary.recommendation}
                </span>
              )}
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
                {careerLabel}
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {summary?.summary || `You scored ${averageScore}/10 across ${results.length} questions.`}
              </p>
            </div>

            {/* Suggested Roles */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Suggested Roles
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {suggestedRoles.map((r) => (
                  <span key={r} style={{
                    background: "var(--primary-light)", color: "var(--primary)",
                    padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Questions", value: results.length, icon: "❓" },
              { label: "Avg Score", value: `${averageScore}/10`, icon: "📊" },
              { label: "Best Answer", value: `${Math.max(...results.map(r => r.technical_score || 0), 0)}/10`, icon: "🏆" },
            ].map((s) => (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "var(--card)", padding: "10px 16px",
                borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)",
                minWidth: 160,
              }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Performance Analytics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 20 }}>

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <Card title="📈 Score Per Question" subtitle="Technical score breakdown" style={{ marginBottom: 0 }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="question" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <YAxis domain={[0, 10]} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)" }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} label={{ position: "top", fontSize: 10, fill: "var(--text-muted)" }}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Radar Chart */}
        {results.length > 0 && (
          <Card title="🕸️ Skills Radar" subtitle="Multi-dimensional performance analysis" style={{ marginBottom: 0 }}>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 10 }} />
                <Radar
                  name="Score" dataKey="score"
                  stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* ── Overall Analysis ── */}
      {summary?.summary && (
        <Card title="🧠 AI Performance Analysis">
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ background: "var(--bg2)", padding: "14px 18px", borderRadius: "var(--radius-sm)" }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "var(--text)" }}>
                <strong>📋 Summary:</strong> {summary.summary}
              </p>
            </div>
            {summary.strengths && (
              <div style={{ background: "var(--success-light)", padding: "14px 18px", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--success)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 6 }}>💪 Strengths</p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>{summary.strengths}</p>
              </div>
            )}
            {summary.weaknesses && (
              <div style={{ background: "var(--danger-light)", padding: "14px 18px", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--danger)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 6 }}>⚠️ Areas to Improve</p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>{summary.weaknesses}</p>
              </div>
            )}
            {summary.advice && (
              <div style={{ background: "var(--primary-light)", padding: "14px 18px", borderRadius: "var(--radius-sm)", borderLeft: "4px solid var(--primary)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--primary)", marginBottom: 6 }}>💡 Expert Advice</p>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--text)" }}>{summary.advice}</p>
              </div>
            )}
          </div>
          {summary.weaknesses && (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--border)", display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button onClick={handleGoToLearning} size="sm">
                🎓 Get Personalized Learning Plan →
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                📊 View Dashboard
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* ── Career Readiness Card ── */}
      <Card title="🎯 Career Readiness Analysis" accent={careerColor}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Readiness Level</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: careerColor, flexShrink: 0,
              }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: careerColor }}>{careerLabel}</span>
            </div>
            <div className="progress-bar" style={{ marginTop: 10 }}>
              <div className="progress-fill" style={{ width: `${careerReadiness}%`, background: careerColor }} />
            </div>
          </div>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Skill Gap Analysis</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
              {scoreNum >= 8
                ? "Excellent technical foundation. Ready for senior roles."
                : scoreNum >= 6
                ? "Good base skills. Focus on advanced topics and system design."
                : "Core concepts need strengthening. Follow the learning plan."}
            </p>
          </div>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Recommended Action</p>
            <Button size="sm" onClick={handleGoToLearning}>
              🎓 Start Learning Plan
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Per-Question Results ── */}
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.02em" }}>
          📝 Detailed Question Analysis
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 20 }}>
          Review each question with your answer, ideal answer, and improvement suggestions
        </p>
      </div>

      {results.map((item, index) => (
        <Card key={index} style={{ marginBottom: 20 }}>
          {/* Question Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                background: getScoreColor(item.technical_score),
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800,
              }}>
                {index + 1}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                Question {index + 1}
              </h3>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={badgeStyle("var(--primary-light)", "var(--primary)")}>
                Technical: {item.technical_score}/10
              </span>
              <span style={badgeStyle("var(--bg2)", "var(--text-muted)")}>
                Communication: {item.communication_score}/10
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div style={{ background: "var(--bg2)", padding: "14px 18px", borderRadius: "var(--radius-sm)", marginBottom: 16, borderLeft: "3px solid var(--primary)" }}>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.7, fontWeight: 500 }}>
              {item.question}
            </p>
          </div>

          {/* Answer Comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <p style={{
                fontWeight: 700, fontSize: 12, marginBottom: 8, textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: item.technical_score >= 7 ? "var(--success)" : item.technical_score >= 4 ? "var(--warning)" : "var(--danger)",
              }}>
                ✏️ Your Answer {item.technical_score >= 7 ? "✅" : item.technical_score >= 4 ? "⚠️" : "❌"}
              </p>
              <pre style={{
                ...preStyle,
                background: item.technical_score >= 7 ? "var(--success-light)" : item.technical_score >= 4 ? "var(--warning-light)" : "var(--danger-light)",
                borderLeft: `3px solid ${item.technical_score >= 7 ? "var(--success)" : item.technical_score >= 4 ? "var(--warning)" : "var(--danger)"}`,
                minHeight: 80,
              }}>
                {item.answer || "No answer provided"}
              </pre>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)" }}>
                ✅ Ideal AI Answer
              </p>
              <pre style={{ ...preStyle, background: "var(--primary-light)", borderLeft: "3px solid var(--primary)", minHeight: 80 }}>
                {item.correct_answer}
              </pre>
            </div>
          </div>

          {/* Score Bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Answer Quality</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: getScoreColor(item.technical_score) }}>
                {item.technical_score}/10
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${(item.technical_score / 10) * 100}%`,
                background: getScoreColor(item.technical_score),
              }} />
            </div>
          </div>

          {/* Strengths & Mistakes */}
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ background: "var(--success-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--success)" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--success)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>💪 Strengths</p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "var(--text)" }}>{item.strengths}</p>
            </div>
            <div style={{ background: "var(--danger-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--danger)" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--danger)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>🔧 Mistakes & Missing Points</p>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: "var(--text)" }}>{item.mistakes}</p>
            </div>
            <div style={{ background: "var(--bg2)", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>✨ Improved Version</p>
              <pre style={{ ...preStyle, background: "transparent", border: "none", padding: 0 }}>{item.improved_answer}</pre>
            </div>
          </div>
        </Card>
      ))}

    </PageShell>
  );
}

export default Results;
