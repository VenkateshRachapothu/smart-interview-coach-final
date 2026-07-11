import { createContext, useState } from "react";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

  const [skills, setSkills] = useState([]);
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState([]);
  const [
  resumeAnalysis,
  setResumeAnalysis
] = useState(null);

  return (
    <InterviewContext.Provider
      value={{
        skills,
        setSkills,

        role,
        setRole,

        questions,
        setQuestions,

        answers,
        setAnswers,

        results,
        setResults,

        resumeAnalysis,
setResumeAnalysis,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};