import { useContext, useState } from "react";
import { InterviewContext } from "../context/InterviewContext";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import PageActions from "../components/PageActions";
import { textareaStyle } from "../styles/shared";
import { getStoredToken } from "../context/AuthContext";

function Interview() {
  const navigate = useNavigate();
  const { role, questions, setResults } = useContext(InterviewContext);
  const [loading, setLoading] = useState(false);

  const questionList = questions.split("\n").filter((q) => q.trim() !== "");
  const [answers, setAnswers] = useState(Array(questionList.length).fill(""));

  const answeredCount = answers.filter((a) => a.trim() !== "").length;
  const progress = questionList.length > 0 ? Math.round((answeredCount / questionList.length) * 100) : 0;

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const submitAnswers = async () => {
    for (let answer of answers) {
      if (answer.trim() === "") {
        alert("Please answer all questions before submitting.");
        return;
      }
    }
    try {
      setLoading(true);
      const token = getStoredToken();
      if (!token) { navigate("/login", { replace: true }); return; }
      const apiBase = import.meta.env.DEV
        ? "/api"
        : (import.meta.env.VITE_API_URL || "https://smart-interview-coach-ozbd.onrender.com");
      const response = await fetch(`${apiBase}/evaluate_answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role, questions: questionList, answers }),
      });
      const data = await response.json();
      setResults(data.results);
      localStorage.setItem("summary", JSON.stringify(data.summary));
      navigate("/results");
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate answers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      step={3}
      title="Mock Interview"
      subtitle="Answer all questions thoughtfully before submitting"
      actions={
        <PageActions sticky>
          <Button variant="secondary" onClick={() => navigate("/role")}>← Back</Button>
          <Button onClick={submitAnswers} disabled={loading}>
            {loading ? "⏳ Evaluating..." : "Submit Answers →"}
          </Button>
        </PageActions>
      }
    >
      {/* Progress Card */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 15 }}>
              {answeredCount} of {questionList.length} answered
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {role && (
              <span style={{
                background: "var(--primary-light)", color: "var(--primary)",
                padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              }}>
                🎯 {role}
              </span>
            )}
            <span style={{
              background: progress === 100 ? "var(--success-light)" : "var(--bg2)",
              color: progress === 100 ? "var(--success)" : "var(--text-muted)",
              padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
            }}>
              {progress}%
            </span>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      {/* Questions */}
      {questionList.map((question, index) => (
        <Card key={index} animate={false} style={{ animationDelay: `${index * 0.05}s` }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: answers[index].trim() ? "var(--success)" : "var(--gradient)",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800,
            }}>
              {answers[index].trim() ? "✓" : index + 1}
            </div>
            <p style={{ color: "var(--text)", lineHeight: 1.7, fontSize: 15, margin: 0, flex: 1 }}>
              {question}
            </p>
          </div>
          <textarea
            rows={5}
            placeholder="Type your answer here..."
            value={answers[index]}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            style={textareaStyle}
          />
          {answers[index].trim() && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 600 }}>✓ Answered</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {answers[index].trim().split(/\s+/).length} words</span>
            </div>
          )}
        </Card>
      ))}

      {loading && (
        <Card>
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{
              width: 48, height: 48, border: "4px solid var(--border)",
              borderTop: "4px solid var(--primary)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 500 }}>
              🤖 AI is evaluating your answers...
            </p>
          </div>
        </Card>
      )}
    </PageShell>
  );
}

export default Interview;
