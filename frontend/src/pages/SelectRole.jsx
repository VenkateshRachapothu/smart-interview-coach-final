import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/InterviewContext";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import SkillChip from "../components/SkillChip";
import PageActions from "../components/PageActions";

const ROLES = [
  { name: "AI/ML Engineer", icon: "🤖", desc: "Machine learning, deep learning, Python" },
  { name: "Python Developer", icon: "🐍", desc: "Python, Django, Flask, APIs" },
  { name: "Data Analyst", icon: "📊", desc: "SQL, Excel, visualization, statistics" },
  { name: "Software Developer", icon: "💻", desc: "DSA, system design, OOP, databases" },
];

function SelectRole() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { role, setRole, setQuestions } = useContext(InterviewContext);
  const skills = JSON.parse(localStorage.getItem("skills")) || [];

  const startInterview = async () => {
    if (!role) { alert("Please select a role"); return; }
    try {
      setLoading(true);
      const resumeText = localStorage.getItem("resumeText");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/generate_questions`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ role, skills, resume_text: resumeText }),
});
      const data = await response.json();
      setQuestions(data.questions);
      navigate("/interview");
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      step={2}
      title="Select Role"
      subtitle="Choose the role you want to practice for"
      actions={
        <PageActions>
          <Button variant="secondary" onClick={() => navigate("/upload")}>← Back</Button>
          <Button onClick={startInterview} disabled={!role || loading}>
            {loading ? "⏳ Generating questions..." : "Start Interview →"}
          </Button>
        </PageActions>
      }
    >
      <Card title="🎯 Target Role" subtitle="Select the position you're interviewing for">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {ROLES.map((roleOption) => {
            const selected = role === roleOption.name;
            return (
              <label
                key={roleOption.name}
                style={{
                  display: "block", padding: "18px 20px",
                  borderRadius: "var(--radius-md)",
                  border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                  background: selected ? "var(--primary-light)" : "var(--card)",
                  cursor: "pointer", transition: "all 0.2s ease",
                  boxShadow: selected ? "0 0 0 3px var(--primary-glow)" : "none",
                }}
              >
                <input
                  type="radio" value={roleOption.name} checked={selected}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 24 }}>{roleOption.icon}</span>
                  <span style={{ fontWeight: 700, color: selected ? "var(--primary)" : "var(--text)", fontSize: 15 }}>
                    {roleOption.name}
                  </span>
                  {selected && (
                    <span style={{
                      marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
                      background: "var(--primary)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800,
                    }}>✓</span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {roleOption.desc}
                </p>
              </label>
            );
          })}
        </div>
      </Card>

      {skills.length > 0 && (
        <Card title="🛠️ Skills from Resume" subtitle="These skills will be used to personalize your questions">
          <div>
            {skills.map((skill, index) => (
              <SkillChip key={index} label={skill} />
            ))}
          </div>
        </Card>
      )}
    </PageShell>
  );
}

export default SelectRole;
