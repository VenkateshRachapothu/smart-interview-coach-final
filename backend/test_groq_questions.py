from services.groq_service import generate_questions

skills = [
    "Python",
    "Machine Learning",
    "Flask"
]

questions = generate_questions(
    "AI/ML Engineer",
    skills
)

print(questions)