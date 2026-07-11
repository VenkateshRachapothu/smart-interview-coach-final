def extract_skills(text):

    skills_db = [
        "Python",
        "JavaScript",
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "SQL",
        "Machine Learning",
        "Deep Learning",
        "XGBoost",
        "Scikit-learn",
        "Pandas",
        "NumPy",
        "Flask",
        "HTML",
        "CSS",
        "Git",
        "Data Structures",
        "Algorithms",
        "DBMS",
        "OOP"
    ]

    found_skills = []

    text = text.lower()

    for skill in skills_db:
        if skill.lower() in text:
            found_skills.append(skill)

    return found_skills