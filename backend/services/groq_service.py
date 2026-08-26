# # 


# import os
# import json
# import re
# from dotenv import load_dotenv
# from groq import Groq

# load_dotenv()

# client = Groq(
#     api_key=os.getenv("GROQ_API_KEY")
# )

# MODEL = "openai/gpt-oss-20b"


# # ============================================================
# # COMMON JSON PARSER
# # ============================================================

# def _extract_json(text):
#     """
#     Safely extract and parse JSON from an LLM response.

#     Handles:
#     - ```json ... ```
#     - ``` ... ```
#     - leading/trailing explanation
#     - BOM characters
#     - JSON objects
#     - JSON arrays
#     """

#     if not text:
#         raise ValueError("Empty response from AI model")

#     text = str(text).strip()

#     # Remove BOM
#     text = text.lstrip("\ufeff")

#     # Remove markdown code fences
#     text = re.sub(
#         r"```(?:json|JSON)?",
#         "",
#         text
#     )

#     text = text.replace("```", "").strip()

#     # --------------------------------------------------------
#     # First attempt: direct JSON parsing
#     # --------------------------------------------------------

#     try:
#         return json.loads(text)
#     except json.JSONDecodeError:
#         pass

#     # --------------------------------------------------------
#     # Try extracting JSON array
#     # --------------------------------------------------------

#     start = text.find("[")
#     end = text.rfind("]")

#     if start != -1 and end != -1 and end > start:
#         candidate = text[start:end + 1]

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             pass

#     # --------------------------------------------------------
#     # Try extracting JSON object
#     # --------------------------------------------------------

#     start = text.find("{")
#     end = text.rfind("}")

#     if start != -1 and end != -1 and end > start:
#         candidate = text[start:end + 1]

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             pass

#     # --------------------------------------------------------
#     # Last attempt: fix common invalid JSON escape sequences
#     # --------------------------------------------------------

#     # JSON only allows these escape characters:
#     # " \ / b f n r t u
#     #
#     # Models sometimes return things like:
#     # \-  \%  \_  \*  \'
#     #
#     # These are invalid JSON.

#     cleaned = re.sub(
#         r'\\(?!["\\/bfnrtu])',
#         r'\\\\',
#         text
#     )

#     try:
#         return json.loads(cleaned)
#     except json.JSONDecodeError:
#         pass

#     # Try extracted array after fixing escapes
#     start = cleaned.find("[")
#     end = cleaned.rfind("]")

#     if start != -1 and end != -1 and end > start:
#         candidate = cleaned[start:end + 1]

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             pass

#     # Try extracted object after fixing escapes
#     start = cleaned.find("{")
#     end = cleaned.rfind("}")

#     if start != -1 and end != -1 and end > start:
#         candidate = cleaned[start:end + 1]

#         try:
#             return json.loads(candidate)
#         except json.JSONDecodeError:
#             pass

#     raise ValueError(
#         "No valid JSON found in response. "
#         f"First 500 characters:\n{text[:500]}"
#     )


# # ============================================================
# # GENERATE INTERVIEW QUESTIONS
# # ============================================================

# def generate_questions(role, skills, resume_text):

#     prompt = f"""
# You are a senior technical interviewer.

# Candidate Profile:
# - Engineering Student
# - Preparing for Campus Placements

# Target Role:
# {role}

# Skills:
# {", ".join(skills)}

# Resume:
# {resume_text}

# Instructions:

# 1. Generate exactly 10 interview questions.
# 2. Generate 4 resume-based questions.
# 3. Generate 6 fundamental technical questions.
# 4. Ask about:
#    - Projects
#    - Internships
#    - Certifications
#    - Technologies mentioned in the resume
# 5. Questions should be suitable for campus placements.
# 6. Number questions from 1 to 10.
# 7. Return only the questions.
# """

#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         temperature=0.3
#     )

#     return response.choices[0].message.content


# # ============================================================
# # EVALUATE INTERVIEW ANSWERS
# # ============================================================

# def evaluate_interview(questions, answers):

#     qa_text = ""

#     for i, (q, a) in enumerate(
#         zip(questions, answers),
#         start=1
#     ):
#         qa_text += f"""
# Question {i}:
# {q}

# Answer {i}:
# {a}

# """

#     prompt = f"""
# You are a senior technical interviewer evaluating a campus-placement candidate.

# Evaluate EACH answer separately.

# IMPORTANT RULES:

# 1. Compare each answer ONLY with its own question.
# 2. Give partial marks if the answer contains partially correct concepts.
# 3. Give 0 only if the answer is blank or completely unrelated.
# 4. technical_score must be an integer from 0 to 10.
# 5. communication_score must be an integer from 0 to 10.
# 6. Mention correct points in strengths.
# 7. Mention exact missing or incorrect points in mistakes.
# 8. improved_answer should improve the candidate's answer.
# 9. correct_answer should provide an ideal interview answer.
# 10. Do NOT invent the candidate's experience.
# 11. Do NOT claim the candidate used technologies that are not present in the question/resume.
# 12. Keep the answers appropriate for a campus-placement interview.

# VERY IMPORTANT JSON RULES:

# - Return ONLY valid JSON.
# - Do NOT use Markdown.
# - Do NOT use ```json.
# - Do NOT add explanations before or after JSON.
# - All strings must use valid JSON escaping.
# - If you need a new line inside a JSON string, use \\n.
# - Never use invalid JSON escapes such as \\-, \\*, \\', \\%.
# - Do not put unescaped double quotes inside strings.
# - If code is included inside a string, escape double quotes and backslashes correctly.
# - Keep improved_answer and correct_answer as normal text whenever possible.
# - Do not include unnecessary code.

# Return exactly this JSON structure:

# [
#   {{
#     "technical_score": 0,
#     "communication_score": 0,
#     "strengths": "",
#     "mistakes": "",
#     "improved_answer": "",
#     "correct_answer": ""
#   }}
# ]

# Questions and Answers:

# {qa_text}
# """

#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         temperature=0.1
#     )

#     text = response.choices[0].message.content.strip()

#     print("\n===== EVALUATION RESPONSE =====")
#     print(text)
#     print("===============================\n")

#     try:

#         result = _extract_json(text)

#         # Make sure evaluation result is a list
#         if not isinstance(result, list):
#             raise ValueError(
#                 "Evaluation response is not a JSON array"
#             )

#         return result

#     except Exception as e:

#         print("EVALUATION JSON ERROR:", e)

#         with open(
#             "groq_error.txt",
#             "w",
#             encoding="utf-8"
#         ) as f:
#             f.write(text)

#         raise Exception(
#             "Evaluation JSON parsing failed. "
#             "Check groq_error.txt"
#         )


# # ============================================================
# # GENERATE OVERALL SUMMARY
# # ============================================================

# def generate_overall_summary(results):

#     prompt = f"""
# You are a senior technical interviewer.

# Analyze the following interview results.

# Results:

# {json.dumps(results, indent=2, ensure_ascii=False)}

# Return ONLY valid JSON.

# Do NOT use Markdown.
# Do NOT use ```json.
# Do NOT add any explanation outside the JSON.

# Return exactly:

# {{
#     "summary": "",
#     "strengths": "",
#     "weaknesses": "",
#     "advice": "",
#     "recommendation": ""
# }}

# Rules:

# 1. summary = overall performance.
# 2. strengths = strongest skills.
# 3. weaknesses = areas needing improvement.
# 4. advice = placement preparation advice.
# 5. recommendation must be exactly one of:
#    - Ready
#    - Almost Ready
#    - Needs Improvement
# """

#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         temperature=0.2
#     )

#     text = response.choices[0].message.content.strip()

#     print("\n===== SUMMARY RESPONSE =====")
#     print(text)
#     print("============================\n")

#     try:

#         return _extract_json(text)

#     except Exception as e:

#         print("SUMMARY JSON ERROR:", e)

#         with open(
#             "summary_error.txt",
#             "w",
#             encoding="utf-8"
#         ) as f:
#             f.write(text)

#         raise Exception(
#             "Summary JSON parsing failed. "
#             "Check summary_error.txt"
#         )


# # ============================================================
# # GENERATE LEARNING CONTENT
# # ============================================================

# def generate_learning_content(role, weak_skills):

#     if not isinstance(weak_skills, list):
#         weak_skills = [str(weak_skills)]

#     weak_skills = [
#         str(s).strip()
#         for s in weak_skills
#         if str(s).strip()
#     ]

#     if not weak_skills:
#         raise ValueError(
#             "weak_skills list is empty"
#         )

#     skills_str = ", ".join(weak_skills)

#     prompt = f"""
# You are a senior career coach and learning advisor.

# A candidate is preparing for the role:
# {role}

# They need improvement in these skills:
# {skills_str}

# Generate a comprehensive structured learning plan for EACH skill listed above.

# You MUST return ONLY a valid JSON object.

# No markdown.
# No explanation.
# No code fences.

# The JSON must follow this structure:

# {{
#   "topics": [
#     {{
#       "skill": "exact skill name from the list",
#       "difficulty": "Beginner",
#       "estimated_time": "6 hours",
#       "why_recommended": "One sentence why this skill needs improvement.",
#       "summary": "Two to three sentences about why this skill matters for the role.",
#       "key_concepts": [
#         "concept1",
#         "concept2",
#         "concept3",
#         "concept4",
#         "concept5"
#       ],
#       "learning_path": [
#         "Step 1: Introduction",
#         "Step 2: Core concepts",
#         "Step 3: Hands-on practice",
#         "Step 4: Advanced topics",
#         "Step 5: Mini project"
#       ],
#       "youtube_searches": [
#         "search query 1",
#         "search query 2",
#         "search query 3"
#       ],
#       "udemy_searches": [
#         "search query 1",
#         "search query 2"
#       ],
#       "google_doc_searches": [
#         "search query 1",
#         "search query 2"
#       ],
#       "practice_questions": [
#         "Question 1?",
#         "Question 2?",
#         "Question 3?",
#         "Question 4?",
#         "Question 5?"
#       ],
#       "coding_questions": [
#         "Coding problem 1",
#         "Coding problem 2"
#       ]
#     }}
#   ]
# }}

# Rules:

# - Generate exactly one topic object per skill.
# - difficulty must be exactly one of:
#   Beginner
#   Intermediate
#   Advanced
# - learning_path must have 5 to 7 steps.
# - practice_questions must have exactly 5 questions.
# - coding_questions must contain 2 to 3 problems for programming skills.
# - coding_questions must be [] for non-programming skills.
# - Return ONLY JSON.
# """

#     print(
#         f"\n===== LEARNING PROMPT SENT FOR: {skills_str} ====="
#     )

#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         temperature=0.3
#     )

#     raw = response.choices[0].message.content

#     print("\n===== LEARNING RAW RESPONSE =====")
#     print(raw)
#     print("=================================\n")

#     try:

#         result = _extract_json(raw)

#     except Exception as parse_err:

#         try:
#             with open(
#                 "learning_error.txt",
#                 "w",
#                 encoding="utf-8"
#             ) as f:
#                 f.write(raw)
#         except Exception:
#             pass

#         raise Exception(
#             f"Learning JSON parsing failed: {parse_err}"
#         )

#     if isinstance(result, list):

#         result = {
#             "topics": result
#         }

#     elif isinstance(result, dict) and "topics" not in result:

#         result = {
#             "topics": [result]
#         }

#     print(
#         f"===== LEARNING PARSED: "
#         f"{len(result.get('topics', []))} topics ====="
#     )

#     return result


# # ============================================================
# # ANALYZE RESUME
# # ============================================================

# def analyze_resume(resume_text):

#     prompt = f"""
# You are an ATS Resume Analyzer.

# Analyze the following resume.

# Resume:

# {resume_text}

# Return ONLY valid JSON.

# Do NOT use Markdown.
# Do NOT use ```json.
# Do NOT add explanation outside JSON.

# Return exactly:

# {{
#     "ats_score": 0,
#     "strengths": "",
#     "weaknesses": "",
#     "missing_skills": "",
#     "suggestions": ""
# }}

# Rules:

# 1. ats_score must be between 0 and 100.
# 2. strengths should mention good resume points.
# 3. weaknesses should mention missing areas.
# 4. missing_skills should mention important skills not found.
# 5. suggestions should give actionable improvements.
# 6. Return only JSON.
# """

#     response = client.chat.completions.create(
#         model=MODEL,
#         messages=[
#             {
#                 "role": "user",
#                 "content": prompt
#             }
#         ],
#         temperature=0.2
#     )

#     text = response.choices[0].message.content.strip()

#     print("\n===== ATS RESPONSE =====")
#     print(text)
#     print("========================\n")

#     try:

#         return _extract_json(text)

#     except Exception as e:

#         print("ATS JSON ERROR:", e)

#         with open(
#             "ats_error.txt",
#             "w",
#             encoding="utf-8"
#         ) as f:
#             f.write(text)

#         raise Exception(
#             "ATS JSON parsing failed. "
#             "Check ats_error.txt"
#         )



import os
import json
import re

from dotenv import load_dotenv
from groq import Groq


# ============================================================
# GROQ CONFIGURATION
# ============================================================

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = "openai/gpt-oss-20b"


# ============================================================
# COMMON JSON PARSER
# ============================================================

def _extract_json(text):
    """
    Safely extract and parse JSON from an LLM response.
    """

    if not text:
        raise ValueError("Empty response from AI model")

    text = str(text).strip()

    # Remove BOM
    text = text.lstrip("\ufeff")

    # Remove markdown code fences
    text = re.sub(
        r"```(?:json|JSON)?",
        "",
        text
    )

    text = text.replace("```", "").strip()

    # --------------------------------------------------------
    # Direct JSON parsing
    # --------------------------------------------------------

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # --------------------------------------------------------
    # Extract JSON array
    # --------------------------------------------------------

    start = text.find("[")
    end = text.rfind("]")

    if start != -1 and end != -1 and end > start:

        candidate = text[start:end + 1]

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    # --------------------------------------------------------
    # Extract JSON object
    # --------------------------------------------------------

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:

        candidate = text[start:end + 1]

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    # --------------------------------------------------------
    # Fix invalid escape sequences
    # --------------------------------------------------------

    cleaned = re.sub(
        r'\\(?!["\\/bfnrtu])',
        r'\\\\',
        text
    )

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Try cleaned array
    start = cleaned.find("[")
    end = cleaned.rfind("]")

    if start != -1 and end != -1 and end > start:

        candidate = cleaned[start:end + 1]

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    # Try cleaned object
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1 and end > start:

        candidate = cleaned[start:end + 1]

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

    raise ValueError(
        "No valid JSON found in response. "
        f"First 500 characters:\n{text[:500]}"
    )


# ============================================================
# GENERATE INTERVIEW QUESTIONS
# ============================================================

def generate_questions(role, skills, resume_text):

    if not isinstance(skills, list):
        skills = [str(skills)]

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
7. Return only the questions.
8. Do not provide answers.
9. Do not provide explanations.
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


# ============================================================
# EVALUATE INTERVIEW ANSWERS
# ============================================================

def evaluate_interview(questions, answers):

    if not questions:
        raise ValueError("No interview questions received.")

    if not answers:
        raise ValueError("No interview answers received.")

    if len(questions) != len(answers):
        raise ValueError(
            f"Question/answer count mismatch: "
            f"{len(questions)} questions, "
            f"{len(answers)} answers."
        )

    qa_text = ""

    for i, (question, answer) in enumerate(
        zip(questions, answers),
        start=1
    ):
        qa_text += f"""
Question {i}:
{question}

Candidate Answer {i}:
{answer}

"""

    prompt = f"""
You are a senior technical interviewer evaluating a
campus-placement candidate.

Evaluate EACH answer independently.

IMPORTANT RULES:

1. There are exactly {len(questions)} questions.
2. Return exactly {len(questions)} evaluation objects.
3. Object 1 corresponds to Question 1.
4. Object 2 corresponds to Question 2.
5. Never skip a question.
6. Compare each answer ONLY with its own question.
7. Give partial marks when the answer contains partially
   correct concepts.
8. Give 0 only if the answer is blank or completely unrelated.
9. technical_score must be an integer from 0 to 10.
10. communication_score must be an integer from 0 to 10.

IMPORTANT:
Keep every text field SHORT.

11. strengths: maximum 1 short sentence.
12. mistakes: maximum 1 short sentence.
13. improved_answer: maximum 2 short sentences.
14. correct_answer: maximum 2 short sentences.
15. Do NOT invent candidate experience.
16. Keep answers appropriate for a campus-placement interview.
.

JSON RULES:

- Return ONLY valid JSON.
- Do NOT use Markdown.
- Do NOT use code fences.
- Do NOT add explanations before or after JSON.
- All strings must use valid JSON escaping.
- Do not use invalid backslash escapes.
- Do not put unescaped double quotes inside strings.

Return exactly this structure:

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

    text = ""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            max_completion_tokens=3000  
        )

        text = response.choices[0].message.content

        if not text:
            raise ValueError(
                "Groq returned an empty evaluation response."
            )

        text = text.strip()

        print("\n===== EVALUATION RESPONSE =====")
        print(text)
        print("===============================\n")

        # Parse JSON
        result = _extract_json(text)

        # Must be a list
        if not isinstance(result, list):
            raise ValueError(
                "Evaluation response is not a JSON array."
            )

        # Must contain one result per question
        if len(result) != len(questions):
            raise ValueError(
                f"Expected {len(questions)} evaluation results, "
                f"but received {len(result)}."
            )

        required_fields = [
            "technical_score",
            "communication_score",
            "strengths",
            "mistakes",
            "improved_answer",
            "correct_answer"
        ]

        # Validate every result
        for index, item in enumerate(result, start=1):

            if not isinstance(item, dict):
                raise ValueError(
                    f"Evaluation result {index} is not an object."
                )

            for field in required_fields:

                if field not in item:
                    raise ValueError(
                        f"Evaluation result {index} "
                        f"is missing field: {field}"
                    )

            # Convert scores to integers
            try:
                technical_score = int(
                    item["technical_score"]
                )
            except (ValueError, TypeError):
                technical_score = 0

            try:
                communication_score = int(
                    item["communication_score"]
                )
            except (ValueError, TypeError):
                communication_score = 0

            # Keep scores between 0 and 10
            item["technical_score"] = max(
                0,
                min(10, technical_score)
            )

            item["communication_score"] = max(
                0,
                min(10, communication_score)
            )

            # Make sure text fields are strings
            item["strengths"] = str(
                item.get("strengths", "")
            )

            item["mistakes"] = str(
                item.get("mistakes", "")
            )

            item["improved_answer"] = str(
                item.get("improved_answer", "")
            )

            item["correct_answer"] = str(
                item.get("correct_answer", "")
            )

        print(
            f"===== EVALUATION SUCCESS: "
            f"{len(result)} RESULTS ====="
        )

        return result

    except Exception as e:

        print("EVALUATION ERROR:", e)

        try:
            with open(
                "groq_error.txt",
                "w",
                encoding="utf-8"
            ) as f:
                f.write(
                    text if text else str(e)
                )
        except Exception:
            pass

        raise Exception(
            f"Evaluation failed: {e}"
        )


# ============================================================
# GENERATE OVERALL SUMMARY
# ============================================================

def generate_overall_summary(results):

    if not results:
        raise ValueError(
            "No evaluation results received."
        )

    results_json = json.dumps(
        results,
        indent=2,
        ensure_ascii=False
    )

    prompt = f"""
You are a senior technical interviewer.

Analyze the following interview results.

Results:

{results_json}

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT use code fences.
Do NOT add explanations outside the JSON.

Return exactly:

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
5. recommendation must be exactly one of:
   - Ready
   - Almost Ready
   - Needs Improvement
"""

    text = ""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        text = response.choices[0].message.content.strip()

        print("\n===== SUMMARY RESPONSE =====")
        print(text)
        print("============================\n")

        result = _extract_json(text)

        if not isinstance(result, dict):
            raise ValueError(
                "Summary response is not a JSON object."
            )

        required_fields = [
            "summary",
            "strengths",
            "weaknesses",
            "advice",
            "recommendation"
        ]

        for field in required_fields:

            if field not in result:
                raise ValueError(
                    f"Summary missing field: {field}"
                )

        valid_recommendations = [
            "Ready",
            "Almost Ready",
            "Needs Improvement"
        ]

        if result["recommendation"] not in valid_recommendations:
            result["recommendation"] = "Needs Improvement"

        return result

    except Exception as e:

        print(
            "SUMMARY JSON ERROR:",
            e
        )

        try:
            with open(
                "summary_error.txt",
                "w",
                encoding="utf-8"
            ) as f:
                f.write(
                    text if text else str(e)
                )
        except Exception:
            pass

        raise Exception(
            f"Summary JSON parsing failed: {e}"
        )


# ============================================================
# GENERATE LEARNING CONTENT
# ============================================================

def generate_learning_content(role, weak_skills):

    if not isinstance(weak_skills, list):
        weak_skills = [str(weak_skills)]

    weak_skills = [
        str(skill).strip()
        for skill in weak_skills
        if str(skill).strip()
    ]

    if not weak_skills:
        raise ValueError(
            "weak_skills list is empty"
        )

    skills_str = ", ".join(weak_skills)

    prompt = f"""
You are a senior career coach and learning advisor.

A candidate is preparing for the role:

{role}

They need improvement in these skills:

{skills_str}

Generate a comprehensive structured learning plan
for EACH skill listed above.

Return ONLY valid JSON.

No markdown.
No explanation.
No code fences.

The JSON must follow this structure:

{{
  "topics": [
    {{
      "skill": "exact skill name from the list",
      "difficulty": "Beginner",
      "estimated_time": "6 hours",
      "why_recommended": "One sentence why this skill needs improvement.",
      "summary": "Two to three sentences about why this skill matters for the role.",
      "key_concepts": [
        "concept1",
        "concept2",
        "concept3",
        "concept4",
        "concept5"
      ],
      "learning_path": [
        "Step 1: Introduction",
        "Step 2: Core concepts",
        "Step 3: Hands-on practice",
        "Step 4: Advanced topics",
        "Step 5: Mini project"
      ],
      "youtube_searches": [
        "search query 1",
        "search query 2",
        "search query 3"
      ],
      "udemy_searches": [
        "search query 1",
        "search query 2"
      ],
      "google_doc_searches": [
        "search query 1",
        "search query 2"
      ],
      "practice_questions": [
        "Question 1?",
        "Question 2?",
        "Question 3?",
        "Question 4?",
        "Question 5?"
      ],
      "coding_questions": [
        "Coding problem 1",
        "Coding problem 2"
      ]
    }}
  ]
}}

Rules:

- Generate exactly one topic object per skill.
- difficulty must be exactly:
  Beginner
  Intermediate
  Advanced
- learning_path must have 5 to 7 steps.
- practice_questions must have exactly 5 questions.
- coding_questions must contain 2 to 3 problems for programming skills.
- coding_questions must be [] for non-programming skills.
- Return ONLY JSON.
"""

    raw = ""

    try:

        print(
            f"\n===== LEARNING PROMPT SENT FOR: "
            f"{skills_str} ====="
        )

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        raw = response.choices[0].message.content

        print("\n===== LEARNING RAW RESPONSE =====")
        print(raw)
        print("=================================\n")

        result = _extract_json(raw)

    except Exception as e:

        try:
            with open(
                "learning_error.txt",
                "w",
                encoding="utf-8"
            ) as f:
                f.write(
                    raw if raw else str(e)
                )
        except Exception:
            pass

        raise Exception(
            f"Learning JSON parsing failed: {e}"
        )

    if isinstance(result, list):

        result = {
            "topics": result
        }

    elif isinstance(result, dict) and "topics" not in result:

        result = {
            "topics": [result]
        }

    if not isinstance(result, dict):
        raise ValueError(
            "Learning response is not a JSON object."
        )

    if "topics" not in result:
        result["topics"] = []

    print(
        f"===== LEARNING PARSED: "
        f"{len(result.get('topics', []))} topics ====="
    )

    return result


# ============================================================
# ANALYZE RESUME
# ============================================================

def analyze_resume(resume_text):

    if not resume_text:
        raise ValueError(
            "Resume text is empty."
        )

    prompt = f"""
You are an ATS Resume Analyzer.

Analyze the following resume.

Resume:

{resume_text}

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT use code fences.
Do NOT add explanation outside JSON.

Return exactly:

{{
    "ats_score": 0,
    "strengths": "",
    "weaknesses": "",
    "missing_skills": "",
    "suggestions": ""
}}

Rules:

1. ats_score must be between 0 and 100.
2. strengths should mention good resume points.
3. weaknesses should mention missing areas.
4. missing_skills should mention important skills not found.
5. suggestions should give actionable improvements.
6. Return only JSON.
"""

    text = ""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2
        )

        text = response.choices[0].message.content.strip()

        print("\n===== ATS RESPONSE =====")
        print(text)
        print("========================\n")

        result = _extract_json(text)

        if not isinstance(result, dict):
            raise ValueError(
                "ATS response is not a JSON object."
            )

        required_fields = [
            "ats_score",
            "strengths",
            "weaknesses",
            "missing_skills",
            "suggestions"
        ]

        for field in required_fields:

            if field not in result:
                raise ValueError(
                    f"ATS response missing field: {field}"
                )

        try:
            score = int(
                result["ats_score"]
            )
        except (ValueError, TypeError):
            score = 0

        result["ats_score"] = max(
            0,
            min(100, score)
        )

        return result

    except Exception as e:

        print(
            "ATS JSON ERROR:",
            e
        )

        try:
            with open(
                "ats_error.txt",
                "w",
                encoding="utf-8"
            ) as f:
                f.write(
                    text if text else str(e)
                )
        except Exception:
            pass

        raise Exception(
            f"ATS JSON parsing failed: {e}"
        )