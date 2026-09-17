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

  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [showText, setShowText] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const {
    skills,
    setSkills,
    resumeAnalysis,
    setResumeAnalysis,
    setCompany: setContextCompany,
    setJobDescription: setContextJobDescription,
  } = useContext(InterviewContext);

  const handleUpload = async () => {
  if (!company.trim()) {
    alert("Please enter the company name.");
    return;
  }

  if (!jobDescription.trim()) {
    alert("Please enter the job description.");
    return;
  }

  if (!file) {
    alert("Please select a PDF resume.");
    return;
  }

  try {
    setUploading(true);

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("company", company);
    formData.append("job_description", jobDescription);

      console.log("Sending resume:", file.name, file.size);

      const response = await fetch(
        "https://smart-interview-coach-final-backend.onrender.com/upload_resume",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(
        "Upload response status:",
        response.status,
        response.statusText
      );

      const text = await response.text();

      console.log("Raw upload response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned invalid response: ${text.substring(0, 200)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || `Upload failed with status ${response.status}`
        );
      }

      setResumeText(data.text || "");
      setSkills(data.skills || []);
      setResumeAnalysis(data.analysis || null);

      localStorage.setItem(
        "skills",
        JSON.stringify(data.skills || [])
      );

      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(data.analysis || {})
      );

      localStorage.setItem(
        "resumeText",
        data.text || ""
      );
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      alert(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const dropped = e.dataTransfer.files[0];

    if (dropped?.type === "application/pdf") {
      setFile(dropped);
    } else {
      alert("Please drop a PDF file.");
    }
  };

  const atsScore = resumeAnalysis?.ats_score;

  const scoreColor =
    atsScore >= 75
      ? "var(--success)"
      : atsScore >= 50
      ? "var(--warning)"
      : "var(--danger)";

  return (
    <PageShell
      step={1}
      title="Upload Resume"
      subtitle="Add your job details and upload your PDF resume for JD-based ATS analysis"
      actions={
        resumeAnalysis ? (
          <PageActions>
            <Button onClick={() => navigate("/role")}>
              Continue to Select Role →
            </Button>
          </PageActions>
        ) : null
      }
    >
      {/* Job Information */}
<Card
  title="💼 Job Information"
  subtitle="Tell us about the job you're applying for"
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "minmax(220px, 0.8fr) minmax(300px, 2fr)",
      gap: 18,
      alignItems: "start",
    }}
  >
    {/* Company */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 7,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text)",
        }}
      >
        Company Name
      </label>

      <input
        type="text"
        value={company}
        onChange={(e) => {
          setCompany(e.target.value);
          setContextCompany(e.target.value);
        }}
        placeholder="e.g. Google, Flipkart, Microsoft"
        style={{
          width: "100%",
          height: 44,
          padding: "0 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg2)",
          color: "var(--text)",
          fontSize: 14,
          boxSizing: "border-box",
          outline: "none",
        }}
      />
    </div>

    {/* Job Description */}
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 7,
          fontSize: 13,
          fontWeight: 600,
          color: "var(--text)",
        }}
      >
        Job Description
      </label>

      <textarea
        value={jobDescription}
        onChange={(e) => {
          setJobDescription(e.target.value);
          setContextJobDescription(e.target.value);
        }}
        placeholder="Paste the complete job description here..."
        rows={5}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg2)",
          color: "var(--text)",
          fontSize: 14,
          lineHeight: 1.5,
          resize: "vertical",
          boxSizing: "border-box",
          outline: "none",
          fontFamily: "inherit",
        }}
      />
    </div>
  </div>
</Card>

      {/* Upload Zone */}
<Card
  title="📄 Upload Resume"
  subtitle="Upload your PDF resume to compare it with the job description"
>
  <div
    onDragOver={(e) => {
      e.preventDefault();
      setDragOver(true);
    }}
    onDragLeave={() => setDragOver(false)}
    onDrop={handleDrop}
    style={{
      border: `2px dashed ${
        dragOver ? "var(--primary)" : "var(--border)"
      }`,
      borderRadius: 14,
      padding: "28px 20px",
      textAlign: "center",
      background: dragOver
        ? "var(--primary-light)"
        : "var(--bg2)",
      transition: "all 0.2s ease",
    }}
  >
    <div
      style={{
        fontSize: 38,
        marginBottom: 8,
      }}
    >
      📄
    </div>

    <p
      style={{
        margin: "0 0 5px",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--text)",
      }}
    >
      Drop your resume here
    </p>

    <p
      style={{
        margin: "0 0 15px",
        fontSize: 12,
        color: "var(--text-muted)",
      }}
    >
      PDF format • Upload your latest resume
    </p>

    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        background: "var(--gradient)",
        color: "#fff",
        padding: "10px 18px",
        borderRadius: 9,
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
        boxShadow: "0 4px 15px var(--primary-glow)",
      }}
    >
      📂 Browse Resume

      <input
        type="file"
        accept=".pdf"
        aria-label="Upload PDF resume"
        onChange={(e) => setFile(e.target.files[0])}
        style={{
          display: "none",
        }}
      />
    </label>
  </div>

  {file && (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 14,
        padding: "11px 14px",
        background: "var(--primary-light)",
        borderRadius: 10,
        border: "1px solid var(--primary)33",
      }}
    >
      <span style={{ fontSize: 20 }}>📄</span>

      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 13,
            color: "var(--text)",
          }}
        >
          {file.name}
        </p>

        <p
          style={{
            margin: "2px 0 0",
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      <Button
        onClick={handleUpload}
        disabled={uploading}
        size="sm"
      >
        {uploading ? "⏳ Analyzing..." : "🚀 Analyze Resume"}
      </Button>
    </div>
  )}

  {uploading && (
    <div
      style={{
        textAlign: "center",
        padding: "18px 0 4px",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 10px",
        }}
      />

      <p
        style={{
          margin: 0,
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        🤖 Comparing your resume with the job description...
      </p>
    </div>
  )}
</Card>

      {/* ATS Analysis */}
      {resumeAnalysis && (
        <Card
          title="🎯 ATS Resume Analysis"
          subtitle="AI-powered resume scoring and feedback"
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <StatCard
              label="ATS Score"
              value={`${resumeAnalysis.ats_score}/100`}
              icon="📊"
              accent={scoreColor}
            />
          </div>

          {/* Score bar */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontWeight: 500,
                }}
              >
                ATS Compatibility
              </span>

              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: scoreColor,
                }}
              >
                {resumeAnalysis.ats_score}%
              </span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${resumeAnalysis.ats_score}%`,
                  background: scoreColor,
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {resumeAnalysis.strengths && (
              <div
                style={{
                  background:
                    "var(--success-light)",
                  padding: "12px 16px",
                  borderRadius:
                    "var(--radius-sm)",
                  borderLeft:
                    "3px solid var(--success)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--success)",
                    marginBottom: 4,
                  }}
                >
                  ✅ Strengths
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--text)",
                  }}
                >
                  {resumeAnalysis.strengths}
                </p>
              </div>
            )}

            {resumeAnalysis.weaknesses && (
              <div
                style={{
                  background:
                    "var(--warning-light)",
                  padding: "12px 16px",
                  borderRadius:
                    "var(--radius-sm)",
                  borderLeft:
                    "3px solid var(--warning)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--warning)",
                    marginBottom: 4,
                  }}
                >
                  ⚠️ Areas to Improve
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--text)",
                  }}
                >
                  {resumeAnalysis.weaknesses}
                </p>
              </div>
            )}

            {resumeAnalysis.matching_skills && (
  <div
    style={{
      background:
        "var(--success-light)",
      padding: "12px 16px",
      borderRadius:
        "var(--radius-sm)",
      borderLeft:
        "3px solid var(--success)",
    }}
  >
    <p
      style={{
        margin: 0,
        fontSize: 13,
        fontWeight: 700,
        color: "var(--success)",
        marginBottom: 4,
      }}
    >
      🎯 Matching Skills
    </p>

    <p
      style={{
        margin: 0,
        fontSize: 13,
        lineHeight: 1.6,
        color: "var(--text)",
      }}
    >
      {resumeAnalysis.matching_skills}
    </p>
  </div>
)}

            {resumeAnalysis.missing_skills && (
              <div
                style={{
                  background:
                    "var(--danger-light)",
                  padding: "12px 16px",
                  borderRadius:
                    "var(--radius-sm)",
                  borderLeft:
                    "3px solid var(--danger)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--danger)",
                    marginBottom: 4,
                  }}
                >
                  ❌ Missing Skills
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--text)",
                  }}
                >
                  {resumeAnalysis.missing_skills}
                </p>
              </div>
            )}

            {resumeAnalysis.suggestions && (
              <div
                style={{
                  background:
                    "var(--primary-light)",
                  padding: "12px 16px",
                  borderRadius:
                    "var(--radius-sm)",
                  borderLeft:
                    "3px solid var(--primary)",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--primary)",
                    marginBottom: 4,
                  }}
                >
                  💡 Suggestions
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--text)",
                  }}
                >
                  {resumeAnalysis.suggestions}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <Card
          title="🛠️ Detected Skills"
          subtitle={`${skills.length} skills found in your resume`}
        >
          <div>
            {skills.map((skill, index) => (
              <SkillChip
                key={index}
                label={skill}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Resume Text */}
      {resumeText && (
        <Card>
          <button
            type="button"
            onClick={() =>
              setShowText(!showText)
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text)",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "inherit",
            }}
          >
            {showText ? "▼" : "▶"} View extracted text
          </button>

          {showText && (
            <pre
              style={{
                ...preStyle,
                marginTop: 12,
              }}
            >
              {resumeText}
            </pre>
          )}
        </Card>
      )}
    </PageShell>
  );
}

export default UploadResume;