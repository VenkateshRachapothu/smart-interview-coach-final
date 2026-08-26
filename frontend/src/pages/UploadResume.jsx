import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { InterviewContext } from "../context/InterviewContext";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";
import StatCard from "../components/StatCard";
import SkillChip from "../components/SkillChip";
import PageActions from "../components/PageActions";
import { preStyle } from "../styles/shared";

function UploadResume() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showText, setShowText] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const { skills, setSkills, resumeAnalysis, setResumeAnalysis } = useContext(InterviewContext);

  const handleUpload = async () => {
    if (!file) { alert("Please select a PDF resume."); return; }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", file);
      const response = await fetch("http://127.0.0.1:5000/upload_resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) { alert(data.error || "Upload failed"); return; }
      setResumeText(data.text || "");
      setSkills(data.skills || []);
      setResumeAnalysis(data.analysis || null);
      localStorage.setItem("skills", JSON.stringify(data.skills || []));
      localStorage.setItem("resumeAnalysis", JSON.stringify(data.analysis || {}));
      localStorage.setItem("resumeText", data.text);
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else alert("Please drop a PDF file.");
  };

  const atsScore = resumeAnalysis?.ats_score;
  const scoreColor = atsScore >= 75 ? "var(--success)" : atsScore >= 50 ? "var(--warning)" : "var(--danger)";

  return (
    <PageShell
      step={1}
      title="Upload Resume"
      subtitle="Upload your PDF to extract skills and run ATS analysis"
      actions={
        resumeAnalysis ? (
          <PageActions>
            <Button onClick={() => navigate("/role")}>Continue to Select Role →</Button>
          </PageActions>
        ) : null
      }
    >
      {/* Upload Zone */}
      <Card title="📄 Upload your resume">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? "var(--primary)" : "var(--border)"}`,
            borderRadius: "var(--radius-md)", padding: "40px 24px",
            textAlign: "center", background: dragOver ? "var(--primary-light)" : "var(--bg2)",
            transition: "all 0.2s ease", cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
          <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
            Drag & drop your PDF here
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
            or click to browse files
          </p>
          <label style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--gradient)", color: "#fff",
            padding: "10px 20px", borderRadius: "var(--radius-sm)",
            cursor: "pointer", fontWeight: 600, fontSize: 14,
            boxShadow: "0 4px 15px var(--primary-glow)",
          }}>
            📂 Browse PDF
            <input type="file" accept=".pdf" aria-label="Upload PDF resume"
              onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} />
          </label>
        </div>

        {file && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginTop: 16,
            padding: "12px 16px", background: "var(--primary-light)",
            borderRadius: "var(--radius-sm)", border: "1px solid var(--primary)33",
          }}>
            <span style={{ fontSize: 20 }}>📄</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{file.name}</p>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button onClick={handleUpload} disabled={uploading} size="sm">
              {uploading ? "⏳ Uploading..." : "🚀 Analyze"}
            </Button>
          </div>
        )}

        {uploading && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{
              width: 40, height: 40, border: "4px solid var(--border)",
              borderTop: "4px solid var(--primary)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
            }} />
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>🤖 Analyzing your resume with AI...</p>
          </div>
        )}
      </Card>

      {/* ATS Analysis */}
      {resumeAnalysis && (
        <Card title="🎯 ATS Resume Analysis" subtitle="AI-powered resume scoring and feedback">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
            <StatCard label="ATS Score" value={`${resumeAnalysis.ats_score}/100`} icon="📊" accent={scoreColor} />
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>ATS Compatibility</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor }}>{resumeAnalysis.ats_score}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${resumeAnalysis.ats_score}%`, background: scoreColor }} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {resumeAnalysis.strengths && (
              <div style={{ background: "var(--success-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--success)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 4 }}>✅ Strengths</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{resumeAnalysis.strengths}</p>
              </div>
            )}
            {resumeAnalysis.weaknesses && (
              <div style={{ background: "var(--warning-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--warning)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--warning)", marginBottom: 4 }}>⚠️ Areas to Improve</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{resumeAnalysis.weaknesses}</p>
              </div>
            )}
            {resumeAnalysis.missing_skills && (
              <div style={{ background: "var(--danger-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--danger)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 4 }}>❌ Missing Skills</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{resumeAnalysis.missing_skills}</p>
              </div>
            )}
            {resumeAnalysis.suggestions && (
              <div style={{ background: "var(--primary-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--primary)" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>💡 Suggestions</p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{resumeAnalysis.suggestions}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Card title="🛠️ Detected Skills" subtitle={`${skills.length} skills found in your resume`}>
          <div>
            {skills.map((skill, index) => (
              <SkillChip key={index} label={skill} />
            ))}
          </div>
        </Card>
      )}

      {/* Resume Text */}
      {resumeText && (
        <Card>
          <button
            type="button"
            onClick={() => setShowText(!showText)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 600, color: "var(--text)",
              padding: 0, display: "flex", alignItems: "center", gap: 8,
              fontFamily: "inherit",
            }}
          >
            {showText ? "▼" : "▶"} View extracted text
          </button>
          {showText && (
            <pre style={{ ...preStyle, marginTop: 12 }}>{resumeText}</pre>
          )}
        </Card>
      )}
    </PageShell>
  );
}

export default UploadResume;
