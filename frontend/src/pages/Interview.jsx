// import { useContext, useState, useEffect, useRef } from "react";
// import { InterviewContext } from "../context/InterviewContext";
// import { useNavigate } from "react-router-dom";
// import PageShell from "../components/PageShell";
// import Card from "../components/Card";
// import Button from "../components/Button";
// import PageActions from "../components/PageActions";
// import { textareaStyle } from "../styles/shared";
// import { getStoredToken } from "../context/AuthContext";

// function Interview() {
//   const navigate = useNavigate();
//   const { role, questions, setResults } = useContext(InterviewContext);
//   const [loading, setLoading] = useState(false);
//   const [answerMode, setAnswerMode] = useState("manual");
//   const [listeningIndex, setListeningIndex] = useState(null);
//   const recognitionRef = useRef(null);

//   useEffect(() => {
//   const SpeechRecognition =
//     window.SpeechRecognition || window.webkitSpeechRecognition;

//   if (!SpeechRecognition) {
//     recognitionRef.current = null;
//     return;
//   }

//   const recognition = new SpeechRecognition();

//   recognition.continuous = true;
//   recognition.interimResults = true;
//   recognition.lang = "en-US";

//   recognition.onend = () => {
//     setListeningIndex(null);
//   };

//   recognition.onerror = (event) => {
//     console.error("Speech recognition error:", event.error);
//     setListeningIndex(null);
//   };

//   recognitionRef.current = recognition;

//   return () => {
//     recognition.stop();
//   };
// }, []);

//   const questionList = questions.split("\n").filter((q) => q.trim() !== "");
//   const [answers, setAnswers] = useState(Array(questionList.length).fill(""));

//   const answeredCount = answers.filter((a) => a.trim() !== "").length;
//   const progress = questionList.length > 0 ? Math.round((answeredCount / questionList.length) * 100) : 0;

//   const handleAnswerChange = (index, value) => {
//     const updated = [...answers];
//     updated[index] = value;
//     setAnswers(updated);
//   };

//   const toggleVoiceInput = (index) => {
//   const recognition = recognitionRef.current;

//   if (!recognition) {
//     alert(
//       "Voice input is not supported in this browser. Please use Google Chrome."
//     );
//     return;
//   }

//   // Stop listening if this question is already active
//   if (listeningIndex === index) {
//     recognition.stop();
//     setListeningIndex(null);
//     return;
//   }

//   // Stop any previous voice session
//   if (listeningIndex !== null) {
//     recognition.stop();
//   }

//   const currentAnswer = answers[index];

//   recognition.onresult = (event) => {
//     let transcript = "";

//     for (let i = event.resultIndex; i < event.results.length; i++) {
//       transcript += event.results[i][0].transcript;
//     }

//     const newAnswer = currentAnswer
//       ? `${currentAnswer} ${transcript}`
//       : transcript;

//     handleAnswerChange(index, newAnswer);
//   };

//   recognition.onstart = () => {
//     setListeningIndex(index);
//   };

//   recognition.onend = () => {
//     setListeningIndex(null);
//   };

//   recognition.start();
// };

//   const submitAnswers = async () => {
//     for (let answer of answers) {
//       if (answer.trim() === "") {
//         alert("Please answer all questions before submitting.");
//         return;
//       }
//     }
//     try {
//       setLoading(true);
//       const token = getStoredToken();
//       if (!token) { navigate("/login", { replace: true }); return; }
//       const apiBase = import.meta.env.DEV
//         ? "/api"
//         : (import.meta.env.VITE_API_URL || "https://smart-interview-coach-ozbd.onrender.com");
//       const response = await fetch(`${apiBase}/evaluate_answers`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ role, questions: questionList, answers }),
//       });
//       const data = await response.json();
//       setResults(data.results);
//       localStorage.setItem("summary", JSON.stringify(data.summary));
//       navigate("/results");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to evaluate answers.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <PageShell
//       step={3}
//       title="Mock Interview"
//       subtitle="Answer all questions thoughtfully before submitting"
//       actions={
//         <PageActions sticky>
//           <Button variant="secondary" onClick={() => navigate("/role")}>← Back</Button>
//           <Button onClick={submitAnswers} disabled={loading}>
//             {loading ? "⏳ Evaluating..." : "Submit Answers →"}
//           </Button>
//         </PageActions>
//       }

//       {/* Answer Mode */}
// <Card
//   title="🎙️ Answer Mode"
//   subtitle="Choose how you want to answer the interview questions"
// >
//   <div
//     style={{
//       display: "flex",
//       gap: 12,
//       flexWrap: "wrap",
//     }}
//   >
//     {[
//       {
//         value: "manual",
//         label: "✍️ Manual",
//         description: "Type your answers",
//       },
//       {
//         value: "voice",
//         label: "🎤 Voice",
//         description: "Speak your answers",
//       },
//     ].map((mode) => {
//       const selected = answerMode === mode.value;

//       return (
//         <label
//           key={mode.value}
//           style={{
//             flex: "1 1 220px",
//             padding: "16px 18px",
//             borderRadius: "var(--radius-md)",
//             border: `2px solid ${
//               selected ? "var(--primary)" : "var(--border)"
//             }`,
//             background: selected
//               ? "var(--primary-light)"
//               : "var(--card)",
//             cursor: "pointer",
//             textAlign: "center",
//             transition: "all 0.2s ease",
//           }}
//         >
//           <input
//             type="radio"
//             name="answerMode"
//             value={mode.value}
//             checked={selected}
//             onChange={(e) => setAnswerMode(e.target.value)}
//             style={{ display: "none" }}
//           />

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: selected
//                 ? "var(--primary)"
//                 : "var(--text)",
//               marginBottom: 5,
//             }}
//           >
//             {mode.label}
//           </div>

//           <div
//             style={{
//               fontSize: 12,
//               color: "var(--text-muted)",
//             }}
//           >
//             {mode.description}
//           </div>
//         </label>
//       );
//     })}
//   </div>
// </Card>
//     >
//       {/* Progress Card */}
//       <Card>
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <span style={{ fontSize: 20 }}>💬</span>
//             <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 15 }}>
//               {answeredCount} of {questionList.length} answered
//             </span>
//           </div>
//           <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//             {role && (
//               <span style={{
//                 background: "var(--primary-light)", color: "var(--primary)",
//                 padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600,
//               }}>
//                 🎯 {role}
//               </span>
//             )}
//             <span style={{
//               background: progress === 100 ? "var(--success-light)" : "var(--bg2)",
//               color: progress === 100 ? "var(--success)" : "var(--text-muted)",
//               padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
//             }}>
//               {progress}%
//             </span>
//           </div>
//         </div>
//         <div className="progress-bar">
//           <div className="progress-fill" style={{ width: `${progress}%` }} />
//         </div>
//       </Card>

//       {/* Questions */}
//       {questionList.map((question, index) => (
//         <Card key={index} animate={false} style={{ animationDelay: `${index * 0.05}s` }}>
//           <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
//             <div style={{
//               width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
//               background: answers[index].trim() ? "var(--success)" : "var(--gradient)",
//               color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
//               fontSize: 13, fontWeight: 800,
//             }}>
//               {answers[index].trim() ? "✓" : index + 1}
//             </div>
//             <p style={{ color: "var(--text)", lineHeight: 1.7, fontSize: 15, margin: 0, flex: 1 }}>
//               {question}
//             </p>
//           </div>
//           <textarea
//             rows={5}
//             placeholder="Type your answer here..."
//             value={answers[index]}
//             onChange={(e) => handleAnswerChange(index, e.target.value)}
//             style={textareaStyle}
//           />
//           {answers[index].trim() && (
//             <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
//               <span style={{ fontSize: 12, color: "var(--success)", fontWeight: 600 }}>✓ Answered</span>
//               <span style={{ fontSize: 12, color: "var(--text-muted)" }}>· {answers[index].trim().split(/\s+/).length} words</span>
//             </div>
//           )}
//         </Card>
//       ))}

//       {loading && (
//         <Card>
//           <div style={{ textAlign: "center", padding: "32px 0" }}>
//             <div style={{
//               width: 48, height: 48, border: "4px solid var(--border)",
//               borderTop: "4px solid var(--primary)", borderRadius: "50%",
//               animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
//             }} />
//             <p style={{ color: "var(--text-muted)", fontSize: 15, fontWeight: 500 }}>
//               🤖 AI is evaluating your answers...
//             </p>
//           </div>
//         </Card>
//       )}
//     </PageShell>
//   );
// }

// export default Interview;





import {
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
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

  const {
    role,
    questions,
    setResults,
  } = useContext(InterviewContext);

  const [loading, setLoading] = useState(false);

  // Answer mode
  const [answerMode, setAnswerMode] = useState("manual");

  // Currently listening question index
  const [listeningIndex, setListeningIndex] = useState(null);

  // Browser speech recognition reference
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onend = () => {
      setListeningIndex(null);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );
      setListeningIndex(null);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const questionList = questions
    .split("\n")
    .filter((q) => q.trim() !== "");

  const [answers, setAnswers] = useState(
    Array(questionList.length).fill("")
  );

  const answeredCount = answers.filter(
    (a) => a.trim() !== ""
  ).length;

  const progress =
    questionList.length > 0
      ? Math.round(
          (answeredCount / questionList.length) * 100
        )
      : 0;

  const handleAnswerChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const toggleVoiceInput = (index) => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    // Stop listening if this question is already active
    if (listeningIndex === index) {
      recognition.stop();
      setListeningIndex(null);
      return;
    }

    // Stop any previous voice session
    if (listeningIndex !== null) {
      recognition.stop();
    }

    const currentAnswer = answers[index];

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      const newAnswer = currentAnswer
        ? `${currentAnswer} ${transcript}`
        : transcript;

      handleAnswerChange(index, newAnswer);
    };

    recognition.onstart = () => {
      setListeningIndex(index);
    };

    recognition.onend = () => {
      setListeningIndex(null);
    };

    recognition.start();
  };

  const submitAnswers = async () => {
    for (let answer of answers) {
      if (answer.trim() === "") {
        alert(
          "Please answer all questions before submitting."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const token = getStoredToken();

      if (!token) {
        navigate("/login", {
          replace: true,
        });
        return;
      }

      const apiBase = import.meta.env.DEV
        ? "/api"
        : (
            import.meta.env.VITE_API_URL ||
            "https://smart-interview-coach-ozbd.onrender.com"
          );

      const response = await fetch(
        `${apiBase}/evaluate_answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role,
            questions: questionList,
            answers,
          }),
        }
      );

      const data = await response.json();

      setResults(data.results);

      localStorage.setItem(
        "summary",
        JSON.stringify(data.summary)
      );

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
          <Button
            variant="secondary"
            onClick={() => navigate("/role")}
          >
            ← Back
          </Button>

          <Button
            onClick={submitAnswers}
            disabled={loading}
          >
            {loading
              ? "⏳ Evaluating..."
              : "Submit Answers →"}
          </Button>
        </PageActions>
      }
    >
      {/* Answer Mode */}
      <Card
        title="🎙️ Answer Mode"
        subtitle="Choose how you want to answer the interview questions"
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              value: "manual",
              label: "✍️ Manual",
              description: "Type your answers",
            },
            {
              value: "voice",
              label: "🎤 Voice",
              description: "Speak your answers",
            },
          ].map((mode) => {
            const selected =
              answerMode === mode.value;

            return (
              <label
                key={mode.value}
                style={{
                  flex: "1 1 220px",
                  padding: "16px 18px",
                  borderRadius:
                    "var(--radius-md)",
                  border: `2px solid ${
                    selected
                      ? "var(--primary)"
                      : "var(--border)"
                  }`,
                  background: selected
                    ? "var(--primary-light)"
                    : "var(--card)",
                  cursor: "pointer",
                  textAlign: "center",
                  transition:
                    "all 0.2s ease",
                }}
              >
                <input
                  type="radio"
                  name="answerMode"
                  value={mode.value}
                  checked={selected}
                  onChange={(e) =>
                    setAnswerMode(
                      e.target.value
                    )
                  }
                  style={{
                    display: "none",
                  }}
                />

                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: selected
                      ? "var(--primary)"
                      : "var(--text)",
                    marginBottom: 5,
                  }}
                >
                  {mode.label}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color:
                      "var(--text-muted)",
                  }}
                >
                  {mode.description}
                </div>
              </label>
            );
          })}
        </div>
      </Card>

      {/* Progress Card */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 20,
              }}
            >
              💬
            </span>

            <span
              style={{
                fontWeight: 700,
                color: "var(--text)",
                fontSize: 15,
              }}
            >
              {answeredCount} of{" "}
              {questionList.length} answered
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {role && (
              <span
                style={{
                  background:
                    "var(--primary-light)",
                  color: "var(--primary)",
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                🎯 {role}
              </span>
            )}

            <span
              style={{
                background:
                  progress === 100
                    ? "var(--success-light)"
                    : "var(--bg2)",
                color:
                  progress === 100
                    ? "var(--success)"
                    : "var(--text-muted)",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {progress}%
            </span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </Card>

      {/* Questions */}
      {questionList.map(
        (question, index) => (
          <Card
            key={index}
            animate={false}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background:
                    answers[index].trim()
                      ? "var(--success)"
                      : "var(--gradient)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {answers[index].trim()
                  ? "✓"
                  : index + 1}
              </div>

              <p
                style={{
                  color: "var(--text)",
                  lineHeight: 1.7,
                  fontSize: 15,
                  margin: 0,
                  flex: 1,
                }}
              >
                {question}
              </p>
            </div>

            <textarea
              rows={5}
              placeholder="Type your answer here..."
              value={answers[index]}
              onChange={(e) =>
                handleAnswerChange(
                  index,
                  e.target.value
                )
              }
              style={textareaStyle}
            />
            
            {answerMode === "voice" && (
  <div
    style={{
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    }}
  >
    <Button
      variant={
        listeningIndex === index
          ? "secondary"
          : "primary"
      }
      onClick={() =>
        toggleVoiceInput(index)
      }
    >
      {listeningIndex === index
        ? "⏹️ Stop Speaking"
        : "🎤 Start Speaking"}
    </Button>

    {listeningIndex === index && (
      <span
        style={{
          fontSize: 13,
          color: "var(--primary)",
          fontWeight: 600,
        }}
      >
        🔴 Listening... Speak your answer
      </span>
    )}
  </div>
)}
            {answers[index].trim() && (
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--success)",
                    fontWeight: 600,
                  }}
                >
                  ✓ Answered
                </span>

                <span
                  style={{
                    fontSize: 12,
                    color:
                      "var(--text-muted)",
                  }}
                >
                  ·{" "}
                  {
                    answers[index]
                      .trim()
                      .split(/\s+/).length
                  }{" "}
                  words
                </span>
              </div>
            )}
          </Card>
        )
      )}

      {loading && (
        <Card>
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                border:
                  "4px solid var(--border)",
                borderTop:
                  "4px solid var(--primary)",
                borderRadius: "50%",
                animation:
                  "spin 0.8s linear infinite",
                margin:
                  "0 auto 16px",
              }}
            />

            <p
              style={{
                color:
                  "var(--text-muted)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              🤖 AI is evaluating your
              answers...
            </p>
          </div>
        </Card>
      )}
    </PageShell>
  );
}

export default Interview;