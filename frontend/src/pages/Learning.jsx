import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, getStoredToken } from "../context/AuthContext";
import PageShell from "../components/PageShell";
import Card from "../components/Card";
import Button from "../components/Button";

// In dev, Vite proxy rewrites /api → localhost:5000.
// In production (Vercel), VITE_API_URL must be set to the Render backend URL.
function getApiBase() {
  if (import.meta.env.DEV) return "/api";
  return import.meta.env.VITE_API_URL || "https://smart-interview-coach-ozbd.onrender.com";
}

const ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "Machine Learning Engineer",
  "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "Product Manager",
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: "var(--success-light)", color: "var(--success)" },
  Intermediate: { bg: "var(--warning-light)", color: "var(--warning)" },
  Advanced: { bg: "var(--danger-light)", color: "var(--danger)" },
};

const STATUS_CONFIG = {
  not_started: { label: "Not Started", icon: "○", bg: "var(--bg2)", color: "var(--text-muted)" },
  in_progress: { label: "In Progress", icon: "⏳", bg: "var(--warning-light)", color: "var(--warning)" },
  completed: { label: "Completed", icon: "✓", bg: "var(--success-light)", color: "var(--success)" },
};

function Learning() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [weakSkills, setWeakSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [statuses, setStatuses] = useState({});
  const [activeTab, setActiveTab] = useState({});

  // Auto-populate from interview results
  useEffect(() => {
    const autoSkills = localStorage.getItem("autoWeakSkills");
    if (autoSkills) {
      try {
        const parsed = JSON.parse(autoSkills);
        setWeakSkills(parsed.join(", "));
        localStorage.removeItem("autoWeakSkills");
      } catch { /* ignore */ }
    }
    // Load saved progress
    const saved = localStorage.getItem("learningProgress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTopics(data.topics || []);
        setStatuses(data.statuses || {});
        setExpanded(Object.fromEntries((data.topics || []).map((_, i) => [i, false])));
      } catch { /* ignore */ }
    }
  }, []);

  const saveProgress = (newTopics, newStatuses) => {
    const data = { topics: newTopics, statuses: newStatuses, updatedAt: Date.now() };
    localStorage.setItem("learningProgress", JSON.stringify(data));
  };

  const handleGenerate = async () => {
    if (!role) { alert("Please select a role."); return; }
    const skillList = weakSkills.split(",").map((s) => s.trim()).filter(Boolean);
    if (skillList.length === 0) { alert("Please enter at least one skill."); return; }

    // Get token — use context value first, fall back to validated localStorage read
    const authToken = token || getStoredToken();
    if (!authToken) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setTopics([]);

      const apiBase = getApiBase();
      console.log("API BASE =", apiBase);
      const res = await fetch(`${apiBase}/learning`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ role, weak_skills: skillList }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned non-JSON response (status ${res.status})`);
      }

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      const newTopics = data.topics || [];
      if (newTopics.length === 0) {
        throw new Error("No topics were returned. Please try again.");
      }

      const initStatuses = Object.fromEntries(newTopics.map((_, i) => [i, "not_started"]));
      setTopics(newTopics);
      setStatuses(initStatuses);
      setExpanded(Object.fromEntries(newTopics.map((_, i) => [i, true])));
      setActiveTab(Object.fromEntries(newTopics.map((_, i) => [i, "overview"])));
      saveProgress(newTopics, initStatuses);
    } catch (err) {
      console.error("Learning generation error:", err);
      alert(`Failed to generate learning content: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (i, status) => {
    const updated = { ...statuses, [i]: status };
    setStatuses(updated);
    saveProgress(topics, updated);
  };

  const toggle = (i) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  const setTab = (i, tab) => setActiveTab((prev) => ({ ...prev, [i]: tab }));

  const completedCount = Object.values(statuses).filter((s) => s === "completed").length;
  const totalCount = topics.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const youtubeUrl = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const udemyUrl = (q) => `https://www.udemy.com/courses/search/?q=${encodeURIComponent(q)}`;
  const googleUrl = (q) => `https://www.google.com/search?q=${encodeURIComponent(q + " documentation tutorial")}`;

  return (
    <PageShell title="🎓 Learning Center" subtitle="Personalized learning recommendations based on your interview performance">
      {/* Input Form */}
      <Card title="Generate Learning Plan" subtitle="Enter your target role and skills to improve">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Target Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
              <option value="">-- Select a role --</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>
              Skills to Improve{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. React, SQL, System Design, OOP"
              value={weakSkills}
              onChange={(e) => setWeakSkills(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "⏳ Generating..." : "✨ Generate Learning Plan"}
        </Button>
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{
              width: 52, height: 52, border: "4px solid var(--border)",
              borderTop: "4px solid var(--primary)", borderRadius: "50%",
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            <p style={{ color: "var(--text)", fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
              🤖 AI is building your learning plan...
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Generating resources, practice questions, and learning paths
            </p>
          </div>
        </Card>
      )}

      {/* Progress Overview */}
      {topics.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                📊 Learning Progress
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
                {completedCount} of {totalCount} topics completed
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em" }}>
                {pct}%
              </span>
            </div>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          {/* Topic status chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            {topics.map((topic, i) => {
              const st = statuses[i] || "not_started";
              const cfg = STATUS_CONFIG[st];
              return (
                <span key={i} style={{
                  padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                  background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", gap: 4,
                }}>
                  {cfg.icon} {topic.skill}
                </span>
              );
            })}
          </div>
        </Card>
      )}

      {/* Topic Cards */}
      {topics.map((topic, i) => {
        const st = statuses[i] || "not_started";
        const stCfg = STATUS_CONFIG[st];
        const diff = topic.difficulty || "Intermediate";
        const diffCfg = DIFFICULTY_COLORS[diff] || DIFFICULTY_COLORS.Intermediate;
        const tab = activeTab[i] || "overview";

        return (
          <div key={i} className="animate-fade" style={{
            background: "var(--card)", borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)", border: "1px solid var(--border-light)",
            marginBottom: 20, overflow: "hidden",
            animationDelay: `${i * 0.08}s`,
          }}>
            {/* Topic Header */}
            <div
              onClick={() => toggle(i)}
              style={{
                padding: "20px 24px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                borderBottom: expanded[i] ? "1px solid var(--border-light)" : "none",
                background: st === "completed" ? "var(--success-light)" : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "var(--radius-sm)",
                  background: "var(--gradient)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  🎯
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", margin: 0 }}>
                      {topic.skill}
                    </h3>
                    <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: diffCfg.bg, color: diffCfg.color }}>
                      {diff}
                    </span>
                    <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: stCfg.bg, color: stCfg.color }}>
                      {stCfg.icon} {stCfg.label}
                    </span>
                  </div>
                  {topic.estimated_time && (
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                      ⏱️ {topic.estimated_time} · {topic.why_recommended || "Based on your interview performance"}
                    </p>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 18, color: "var(--text-muted)", flexShrink: 0, marginLeft: 12 }}>
                {expanded[i] ? "▲" : "▼"}
              </span>
            </div>

            {expanded[i] && (
              <div style={{ padding: "0 24px 24px" }}>
                {/* Status Controls */}
                <div style={{ display: "flex", gap: 8, paddingTop: 16, paddingBottom: 16, borderBottom: "1px solid var(--border-light)", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", alignSelf: "center" }}>Status:</span>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={(e) => { e.stopPropagation(); updateStatus(i, key); }}
                      style={{
                        padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
                        border: `1px solid ${st === key ? cfg.color : "var(--border)"}`,
                        background: st === key ? cfg.bg : "transparent",
                        color: st === key ? cfg.color : "var(--text-muted)",
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease",
                      }}
                    >
                      {cfg.icon} {cfg.label}
                    </button>
                  ))}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 4, paddingTop: 16, paddingBottom: 16, borderBottom: "1px solid var(--border-light)", flexWrap: "wrap" }}>
                  {["overview", "path", "resources", "practice"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(i, t)}
                      style={{
                        padding: "6px 16px", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 600,
                        border: "none", cursor: "pointer", fontFamily: "inherit",
                        background: tab === t ? "var(--primary)" : "var(--bg2)",
                        color: tab === t ? "#fff" : "var(--text-muted)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {t === "overview" ? "📋 Overview" : t === "path" ? "🗺️ Learning Path" : t === "resources" ? "📚 Resources" : "💡 Practice"}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ paddingTop: 20 }}>
                  {/* Overview Tab */}
                  {tab === "overview" && (
                    <div style={{ display: "grid", gap: 16 }}>
                      {topic.summary && (
                        <p style={{ color: "var(--text)", lineHeight: 1.8, fontSize: 14, margin: 0 }}>{topic.summary}</p>
                      )}
                      {topic.why_recommended && (
                        <div style={{ background: "var(--primary-light)", padding: "12px 16px", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--primary)" }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--primary)", marginBottom: 4 }}>💡 Why this was recommended</p>
                          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text)" }}>{topic.why_recommended}</p>
                        </div>
                      )}
                      {topic.key_concepts?.length > 0 && (
                        <div>
                          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            🎯 Key Concepts
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {topic.key_concepts.map((c, j) => (
                              <span key={j} style={{
                                background: "var(--bg2)", border: "1px solid var(--border)",
                                borderRadius: 999, padding: "4px 12px", fontSize: 13,
                                color: "var(--text)", fontWeight: 500,
                              }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {topic.estimated_time && (
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "var(--bg2)", padding: "10px 16px",
                            borderRadius: "var(--radius-sm)",
                          }}>
                            <span style={{ fontSize: 18 }}>⏱️</span>
                            <div>
                              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Est. Time</p>
                              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{topic.estimated_time}</p>
                            </div>
                          </div>
                          <div style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: diffCfg.bg, padding: "10px 16px",
                            borderRadius: "var(--radius-sm)",
                          }}>
                            <span style={{ fontSize: 18 }}>📈</span>
                            <div>
                              <p style={{ margin: 0, fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Difficulty</p>
                              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: diffCfg.color }}>{diff}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Learning Path Tab */}
                  {tab === "path" && (
                    <div>
                      {topic.learning_path?.length > 0 ? (
                        <div style={{ position: "relative" }}>
                          {topic.learning_path.map((step, j) => (
                            <div key={j} style={{ display: "flex", gap: 16, marginBottom: j < topic.learning_path.length - 1 ? 0 : 0 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                                  background: "var(--gradient)", color: "#fff",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 12, fontWeight: 800,
                                }}>
                                  {j + 1}
                                </div>
                                {j < topic.learning_path.length - 1 && (
                                  <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 24, margin: "4px 0" }} />
                                )}
                              </div>
                              <div style={{ paddingBottom: j < topic.learning_path.length - 1 ? 16 : 0, flex: 1 }}>
                                <div style={{
                                  background: "var(--bg2)", padding: "12px 16px",
                                  borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)",
                                }}>
                                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{step}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No learning path available for this topic.</p>
                      )}
                    </div>
                  )}

                  {/* Resources Tab */}
                  {tab === "resources" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                      {topic.youtube_searches?.length > 0 && (
                        <ResourceSection
                          icon="▶️" title="YouTube Tutorials" color="#ff0000" bg="#fff5f5"
                          items={topic.youtube_searches} getUrl={youtubeUrl} linkLabel="Watch →"
                        />
                      )}
                      {topic.udemy_searches?.length > 0 && (
                        <ResourceSection
                          icon="🎓" title="Udemy Courses" color="#a435f0" bg="#faf5ff"
                          items={topic.udemy_searches} getUrl={udemyUrl} linkLabel="Find →"
                        />
                      )}
                      {topic.google_doc_searches?.length > 0 && (
                        <ResourceSection
                          icon="📄" title="Docs & Articles" color="#1a73e8" bg="#f0f7ff"
                          items={topic.google_doc_searches} getUrl={googleUrl} linkLabel="Read →"
                        />
                      )}
                    </div>
                  )}

                  {/* Practice Tab */}
                  {tab === "practice" && (
                    <div style={{ display: "grid", gap: 16 }}>
                      {topic.practice_questions?.length > 0 && (
                        <div>
                          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            💡 Interview Questions
                          </p>
                          <div style={{ display: "grid", gap: 8 }}>
                            {topic.practice_questions.map((q, j) => (
                              <div key={j} style={{
                                display: "flex", gap: 12, padding: "12px 16px",
                                background: "var(--bg2)", borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--border-light)",
                              }}>
                                <span style={{
                                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                                  background: "var(--primary-light)", color: "var(--primary)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 11, fontWeight: 800,
                                }}>
                                  {j + 1}
                                </span>
                                <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{q}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {topic.coding_questions?.length > 0 && (
                        <div>
                          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            💻 Coding Challenges
                          </p>
                          <div style={{ display: "grid", gap: 8 }}>
                            {topic.coding_questions.map((q, j) => (
                              <div key={j} style={{
                                display: "flex", gap: 12, padding: "12px 16px",
                                background: "var(--bg2)", borderRadius: "var(--radius-sm)",
                                border: "1px solid var(--border-light)",
                                borderLeft: "3px solid var(--accent)",
                              }}>
                                <span style={{ fontSize: 16 }}>💻</span>
                                <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{q}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {!topic.practice_questions?.length && !topic.coding_questions?.length && (
                        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No practice questions available for this topic.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </PageShell>
  );
}

function ResourceSection({ icon, title, color, bg, items, getUrl, linkLabel }) {
  return (
    <div style={{
      background: bg, borderRadius: "var(--radius-md)", padding: 16,
      border: `1px solid ${color}22`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span>{icon}</span>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color }}>{title}</h4>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((q, i) => (
          <a
            key={i}
            href={getUrl(q)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 8, padding: "8px 12px", background: "#fff",
              borderRadius: "var(--radius-sm)", border: `1px solid ${color}22`,
              textDecoration: "none", transition: "opacity 0.15s",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--text)", flex: 1, lineHeight: 1.4 }}>{q}</span>
            <span style={{ fontSize: 12, color, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{linkLabel}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "var(--text)",
};

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border)", fontSize: 14, boxSizing: "border-box",
  background: "var(--bg)", color: "var(--text)", fontFamily: "inherit",
  transition: "border-color 0.2s ease", outline: "none",
};

export default Learning;
