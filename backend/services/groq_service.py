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
def _extract_json(text):
    """
    Robustly extract a JSON object or array from a string that may contain
    markdown fences, leading/trailing prose, or BOM characters.
    """
    # Remove BOM and strip whitespace
    text = text.strip().lstrip("\ufeff")

    # Remove all markdown code fences (```json, ```JSON, ```, etc.)
    import re
    text = re.sub(r"```[a-zA-Z]*", "", text)
    text = text.replace("```", "")
    text = text.strip()

    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Find the first { or [ and the matching closing bracket
    for start_char, end_char in (("{" , "}"), ("[", "]")):
        start = text.find(start_char)
        if start == -1:
            continue
        # Walk backwards from end to find last closing bracket
        end = text.rfind(end_char)
        if end == -1 or end <= start:
            continue
        candidate = text[start:end + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    raise ValueError(f"No valid JSON found in response. First 300 chars: {text[:300]}")


def generate_learning_content(role, weak_skills):
    # Ensure weak_skills is a non-empty list
    if not isinstance(weak_skills, list):
        weak_skills = [str(weak_skills)]
    weak_skills = [str(s).strip() for s in weak_skills if str(s).strip()]
    if not weak_skills:
        raise ValueError("weak_skills list is empty")

    skills_str = ", ".join(weak_skills)

    prompt = f"""You are a senior career coach and learning advisor.

A candidate is preparing for the role: {role}
They need improvement in these skills: {skills_str}

Generate a comprehensive structured learning plan for EACH skill listed above.

You MUST return ONLY a valid JSON object. No markdown, no explanation, no code fences.

The JSON must follow this exact structure:

{{"topics": [{{
  "skill": "exact skill name from the list",
  "difficulty": "Beginner",
  "estimated_time": "6 hours",
  "why_recommended": "One sentence why this skill needs improvement.",
  "summary": "Two to three sentences about why this skill matters for the role.",
  "key_concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "learning_path": ["Step 1: Introduction", "Step 2: Core concepts", "Step 3: Hands-on practice", "Step 4: Advanced topics", "Step 5: Mini project"],
  "youtube_searches": ["search query 1", "search query 2", "search query 3"],
  "udemy_searches": ["search query 1", "search query 2"],
  "google_doc_searches": ["search query 1", "search query 2"],
  "practice_questions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"],
  "coding_questions": ["Coding problem 1", "Coding problem 2"]
}}]}}

Rules:
- Generate exactly one topic object per skill.
- difficulty must be exactly one of: Beginner, Intermediate, Advanced
- estimated_time examples: "4 hours", "1 day", "3 days"
- learning_path must have 5 to 7 steps.
- practice_questions must have exactly 5 questions.
- coding_questions: provide 2 to 3 problems for programming skills, empty array [] for non-programming skills.
- Return ONLY the JSON. No other text before or after."""

    print(f"\n===== LEARNING PROMPT SENT FOR: {skills_str} =====")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content

    print("\n===== LEARNING RAW RESPONSE =====")
    print(raw)
    print("=================================\n")

    try:
        result = _extract_json(raw)
    except Exception as parse_err:
        # Save the raw response for debugging
        try:
            with open("learning_error.txt", "w", encoding="utf-8") as f:
                f.write(raw)
        except Exception:
            pass
        raise Exception(f"Learning JSON parsing failed: {parse_err}")

    # Normalise: result might be the topics list directly or wrapped in {{"topics": [...]}}
    if isinstance(result, list):
        result = {"topics": result}
    elif isinstance(result, dict) and "topics" not in result:
        # Some models return the first topic directly — wrap it
        result = {"topics": [result]}

    print(f"===== LEARNING PARSED: {len(result.get('topics', []))} topics =====")
    return result


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


