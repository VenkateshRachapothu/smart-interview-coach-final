import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_questions(role, skills,resume_text):

    prompt = f"""
You are a senior technical interviewer.

Candidate Profile:
- Engineering Student
- Preparing for Campus Placements

Target Role:
{role}

Skills:
{", ".join(skills)}

Resume:
{resume_text}

Instructions:

1. Generate exactly 10 interview questions.
2. Generate 4 resume-based questions.
3. Generate 6 fundamental technical questions.
4. Ask about:
   - Projects
   - Internships
   - Certifications
   - Technologies mentioned in the resume
5. Questions should be suitable for campus placements.
6. Number questions from 1 to 10.
7. Return only questions.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


def evaluate_interview(questions, answers):

    qa_text = ""

    for i, (q, a) in enumerate(
        zip(questions, answers),
        start=1
    ):
        qa_text += f"""
Question {i}:
{q}

Answer {i}:
{a}

"""

    prompt = f"""
You are a senior technical interviewer.

Evaluate EACH answer separately.

Rules:

1. Compare each answer ONLY with its own question.
2. Give partial marks if concepts are partially correct.
3. Do NOT give 0 unless answer is blank or completely unrelated.
4. Technical Score = correctness of concepts.
5. Communication Score = clarity and explanation quality.
6. Mention exact mistakes.
7. Mention correct points in strengths.
8. Improve the candidate answer.
9. Give an ideal interview answer.
If the answer contains code:

- Return properly formatted code.
- Preserve indentation.
- Use \\n for line breaks.
- Never compress code into a single line.

IMPORTANT:

If code is required:

- Return properly formatted Python code.
- Use correct indentation.
- Use line breaks.
- Never compress code into a single line.
- Never use semicolons to combine statements.
- Write code exactly as a professional Python developer would.

Return ONLY valid JSON.

Format:

[
  {{
    "technical_score": 0,
    "communication_score": 0,
    "strengths": "",
    "mistakes": "",
    "improved_answer": "",
    "correct_answer": ""
  }}
]

Questions and Answers:

{qa_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text = response.choices[0].message.content.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    print("\n===== EVALUATION RESPONSE =====")
    print(text)
    print("===============================\n")

    try:

        return json.loads(text)

    except Exception as e:

        print("EVALUATION JSON ERROR:", e)

        with open(
            "groq_error.txt",
            "w",
            encoding="utf-8"
        ) as f:
            f.write(text)

        raise Exception(
            "Evaluation JSON parsing failed. Check groq_error.txt"
        )


def generate_overall_summary(results):

    prompt = f"""
You are a senior technical interviewer.

Analyze the following interview results.

Results:

{json.dumps(results, indent=2)}

Return ONLY valid JSON.

{{
    "summary": "",
    "strengths": "",
    "weaknesses": "",
    "advice": "",
    "recommendation": ""
}}

Rules:

1. summary = overall performance.
2. strengths = strongest skills.
3. weaknesses = areas needing improvement.
4. advice = placement preparation advice.
5. recommendation must be one of:
   - Ready
   - Almost Ready
   - Needs Improvement
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text = response.choices[0].message.content.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    print("\n===== SUMMARY RESPONSE =====")
    print(text)
    print("============================\n")

    try:

        return json.loads(text)

    except Exception as e:

        print("SUMMARY JSON ERROR:", e)

        with open(
            "summary_error.txt",
            "w",
            encoding="utf-8"
        ) as f:
            f.write(text)

        raise Exception(
            "Summary JSON parsing failed. Check summary_error.txt"
        )
def generate_learning_content(role, weak_skills):

    prompt = f"""
You are a senior career coach and learning advisor.

A candidate is preparing for the role: {role}
They need improvement in: {", ".join(weak_skills)}

Generate a comprehensive, structured learning plan for each skill.

Return ONLY valid JSON in this exact format:
{{
  "topics": [
    {{
      "skill": "skill name",
      "difficulty": "Beginner" or "Intermediate" or "Advanced",
      "estimated_time": "e.g. 6 hours or 2 days",
      "why_recommended": "1 sentence explaining why this was flagged as a weakness",
      "summary": "2-3 sentence explanation of why this skill matters for the role",
      "key_concepts": ["concept 1", "concept 2", "concept 3", "concept 4", "concept 5"],
      "learning_path": ["Step 1: Basics", "Step 2: Core concepts", "Step 3: Advanced topics", "Step 4: Practice problems", "Step 5: Mini project"],
      "youtube_searches": ["search query 1", "search query 2", "search query 3"],
      "udemy_searches": ["search query 1", "search query 2"],
      "google_doc_searches": ["search query 1", "search query 2"],
      "practice_questions": ["Interview question 1?", "Interview question 2?", "Interview question 3?", "Interview question 4?", "Interview question 5?"],
      "coding_questions": ["Coding problem 1 (if applicable)", "Coding problem 2"]
    }}
  ]
}}

Rules:
1. Generate one topic object per skill.
2. difficulty should reflect the typical learning curve for that skill.
3. estimated_time should be realistic (e.g. 4 hours, 1 day, 3 days).
4. learning_path should have 5-7 sequential steps from basics to advanced.
5. practice_questions should be 5 real interview questions for that skill.
6. coding_questions: include 2-3 coding problems only for programming topics, empty array otherwise.
7. youtube_searches should be specific tutorial search queries.
8. Return only JSON, no extra text.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(text)
    except Exception as e:
        print("LEARNING JSON ERROR:", e)
        raise Exception("Learning content JSON parsing failed")


def analyze_resume(resume_text):

    prompt = f"""
You are an ATS Resume Analyzer.

Analyze the following resume.

Resume:

{resume_text}

Return ONLY valid JSON.

{{
    "ats_score": 0,
    "strengths": "",
    "weaknesses": "",
    "missing_skills": "",
    "suggestions": ""
}}

Rules:

1. ats_score should be between 0 and 100.
2. strengths should mention good resume points.
3. weaknesses should mention missing areas.
4. missing_skills should mention important skills not found.
5. suggestions should give actionable improvements.
6. Return only JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text = response.choices[0].message.content.strip()

    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    try:

        return json.loads(text)

    except Exception as e:

        print("ATS JSON ERROR:", e)

        with open(
            "ats_error.txt",
            "w",
            encoding="utf-8"
        ) as f:
            f.write(text)

        raise Exception(
            "ATS JSON parsing failed. Check ats_error.txt"
        )


