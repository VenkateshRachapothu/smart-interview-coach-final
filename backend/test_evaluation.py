from services.groq_service import (
    evaluate_interview
)

questions = [
    "What is supervised learning?"
]

answers = [
    "It uses labelled data."
]

results = evaluate_interview(
    questions,
    answers
)

print(results)