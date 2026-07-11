import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";

const STEPS = [
  { icon: "📄", title: "Upload Resume", desc: "AI extracts your skills and runs ATS compatibility analysis instantly", color: "#6366f1", step: "01" },
  { icon: "🎯", title: "Select Role", desc: "Choose your target role and get tailored interview questions", color: "#8b5cf6", step: "02" },
  { icon: "💬", title: "Mock Interview", desc: "Answer AI-generated questions in a real interview simulation", color: "#06b6d4", step: "03" },
  { icon: "📊", title: "AI Evaluation", desc: "Get detailed scores, strengths, weaknesses, and improvement tips", color: "#10b981", step: "04" },
];

const FEATURES = [
  { icon: "🤖", title: "AI-Powered Evaluation", desc: "Advanced LLM evaluates your answers with detailed technical and communication scoring" },
  { icon: "📈", title: "Performance Analytics", desc: "Visual charts and radar analysis to track your improvement over time" },
  { icon: "🎓", title: "Personalized Learning", desc: "Auto-generated learning paths based on your specific weaknesses" },
  { icon: "📋", title: "PDF Reports", desc: "Download comprehensive interview reports with charts and recommendations" },
  { icon: "🗺️", title: "Learning Roadmap", desc: "Step-by-step roadmaps from basics to advanced for every weak topic" },
  { icon: "⚡", title: "Instant Feedback", desc: "Real-time AI analysis with improved answer suggestions" },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Software Engineer @ Google", text: "This platform helped me crack my dream job! The AI feedback was incredibly detailed and the learning recommendations were spot-on.", avatar: "P", score: "9.2/10" },
  { name: "Rahul M.", role: "Data Scientist @ Amazon", text: "The weakness detection and personalized learning paths are game-changing. I improved from 5/10 to 8.5/10 in just 2 weeks!", avatar: "R", score: "8.5/10" },
  { name: "Ananya K.", role: "ML Engineer @ Microsoft", text: "Best interview prep tool I've used. The radar chart analysis showed exactly where I needed to improve. Highly recommended!", avatar: "A", score: "9.0/10" },
];

const STATS = [
  { value: "10K+", label: "Interviews Completed", icon: "🎯" },
  { value: "95%", label: "Success Rate", icon: "📈" },
  { value: "50+", label: "Job Roles", icon: "💼" },
  { value: "4.9★", label: "User Rating", icon: "⭐" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Navbar />
      <PageContainer>

        {/* ── Hero ── */}
        <section style={{ textAlign: "center", padding: "72px 0 56px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--primary-light)", color: "var(--primary)",
            padding: "6px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            marginBottom: 24, letterSpacing: "0.04em", border: "1px solid var(--primary)22",
          }}>
            ✨ AI-Powered Interview Preparation Platform
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 64px)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 24,
            color: "var(--text)",
          }}>
            Land Your Dream Job with{" "}
            <span style={{ background: "var(--gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI Coaching
            </span>
          </h1>

          <p style={{
            color: "var(--text-muted)", fontSize: 18, maxWidth: 580,
            margin: "0 auto 40px", lineHeight: 1.75,
          }}>
            Upload your resume, practice with AI-generated questions, get detailed performance analysis, and receive personalized learning recommendations.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
            <Button size="lg" onClick={() => navigate("/upload")}>
              🚀 Start Free Interview
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate("/dashboard")}>
              📊 View Dashboard
            </Button>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 16, maxWidth: 640, margin: "0 auto",
          }}>
            {STATS.map(({ value, label, icon }) => (
              <div key={label} style={{
                background: "var(--card)", borderRadius: "var(--radius-md)",
                padding: "20px 16px", border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)", textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Process
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 10 }}>
              How it works
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Four simple steps from resume to job offer
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
            {STEPS.map((step, i) => (
              <div key={step.title} className="animate-fade" style={{
                background: "var(--card)", borderRadius: "var(--radius-lg)",
                padding: "28px 24px", border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden",
                animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  fontSize: 72, fontWeight: 900, color: `${step.color}08`,
                  lineHeight: 1, userSelect: "none",
                }}>
                  {step.step}
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: "var(--radius-md)",
                  background: `${step.color}15`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 26, marginBottom: 16,
                }}>
                  {step.icon}
                </div>
                <div style={{
                  display: "inline-block", background: `${step.color}15`,
                  color: step.color, padding: "2px 10px", borderRadius: 999,
                  fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: "0.04em",
                }}>
                  STEP {step.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{step.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Features
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Everything you need to succeed
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Comprehensive AI tools for complete interview preparation
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="animate-fade" style={{
                background: "var(--card)", borderRadius: "var(--radius-md)",
                padding: "22px", border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)", display: "flex", gap: 16, alignItems: "flex-start",
                animationDelay: `${i * 0.07}s`,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--radius-sm)",
                  background: "var(--gradient-soft)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5, color: "var(--text)" }}>{f.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "inline-block", background: "var(--success-light)", color: "var(--success)", padding: "4px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Success Stories
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.03em", marginBottom: 10 }}>
              Loved by candidates
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
              Join thousands who landed their dream jobs
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="animate-fade" style={{
                background: "var(--card)", borderRadius: "var(--radius-lg)",
                padding: "28px", border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-md)", animationDelay: `${i * 0.1}s`,
              }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map((s) => (
                    <span key={s} style={{ color: "#f59e0b", fontSize: 16 }}>★</span>
                  ))}
                </div>
                <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.75, marginBottom: 20, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "var(--gradient)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, fontWeight: 800, flexShrink: 0,
                  }}>
                    {t.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{t.role}</p>
                  </div>
                  <div style={{
                    background: "var(--success-light)", color: "var(--success)",
                    padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                  }}>
                    {t.score}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          textAlign: "center", padding: "56px 32px", marginBottom: 32,
          background: "var(--gradient-soft)", borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-light)", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40, width: 200, height: 200,
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "var(--text)", marginBottom: 14, letterSpacing: "-0.03em" }}>
              Ready to ace your interview?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
              Join 10,000+ candidates who improved their interview skills with AI coaching
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Button size="lg" onClick={() => navigate("/upload")}>
                🚀 Start Free Interview
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/signup")}>
                ✨ Create Account
              </Button>
            </div>
          </div>
        </section>

      </PageContainer>
      <Footer />
    </Layout>
  );
}

export default Home;
