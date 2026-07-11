from flask import Flask, request, jsonify
from flask_cors import CORS
from services.pdf_service import generate_pdf
from flask import send_file
from flask_jwt_extended import JWTManager

from services.resume_parser import extract_text_from_pdf
from services.skill_extractor import extract_skills
from services.groq_service import (
    generate_questions,
    evaluate_interview,
    generate_overall_summary,
    analyze_resume,
    generate_learning_content
)
from services.auth_service import (
    register_user,
    login_user,
    google_login_or_register
)
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from services.history_service import save_interview

from database import init_db
from dotenv import load_dotenv
load_dotenv()

import os
import sqlite3

app = Flask(__name__)
init_db()
app.config["JWT_SECRET_KEY"] = "smart-interview-coach-secret"

jwt = JWTManager(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}}
)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response

@app.errorhandler(500)
def internal_error(e):
    import traceback
    err = traceback.format_exc()
    print("500 ERROR:", err)
    response = jsonify({"error": str(e), "trace": err})
    response.status_code = 500
    return response

UPLOAD_FOLDER = "uploads"
os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


@app.route("/")
def home():

    return jsonify({
        "message":
        "Smart Interview Coach Backend Running"
    })


@app.route(
    "/upload_resume",
    methods=["POST"]
)
def upload_resume():

    try:

        if "resume" not in request.files:

            return jsonify({
                "error":
                "No file uploaded"
            }), 400

        file = request.files["resume"]

        filepath = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        file.save(filepath)

        extracted_text = extract_text_from_pdf(
            filepath
        )

        skills = extract_skills(
            extracted_text
        )

        analysis = analyze_resume(
            extracted_text
        )

        print("\n===== RESUME TEXT =====")
        print(extracted_text[:500])
        print("=======================\n")

        print("\n===== ATS ANALYSIS =====")
        print(analysis)
        print("========================\n")

        return jsonify({
            "message":
            "Resume uploaded successfully",

            "text":
            extracted_text,

            "skills":
            skills,

            "analysis":
            analysis
        })

    except Exception as e:

        print(
            "UPLOAD ERROR:",
            e
        )

        return jsonify({
            "error":
            str(e)
        }), 500

@app.route(
    "/generate_questions",
    methods=["POST"]
)
def generate_interview_questions():

    try:

        data = request.get_json()

        role = data.get(
            "role",
            ""
        )

        skills = data.get(
            "skills",
            []
        )
        resume_text = data.get(
            "resume_text",
            ""
        )

        questions = generate_questions(
            role,
            skills,
            resume_text
        )

        return jsonify({
            "questions":
            questions
        })

    except Exception as e:

        print(
            "QUESTION ERROR:",
            e
        )

        return jsonify({
            "error":
            str(e)
        }), 500


@app.route(
    "/evaluate_answers",
    methods=["POST"]
)
@jwt_required()
def evaluate_answers():

    try:
        user_id = int(
    get_jwt_identity()
)

        data = request.get_json()

        role = data.get(
            "role",
            "Unknown"
        )

        questions = data.get(
            "questions",
            []
        )

        answers = data.get(
            "answers",
            []
        )
        
        print("\n===== QUESTIONS =====")
        print(questions)

        print("\n===== ANSWERS =====")
        print(answers)

        evaluations = evaluate_interview(
            questions,
            answers
        )

        results = []

        for question, answer, evaluation in zip(
            questions,
            answers,
            evaluations
        ):

            results.append({

                "question":
                question,

                "answer":
                answer,

                "technical_score":
                evaluation.get(
                    "technical_score",
                    0
                ),

                "communication_score":
                evaluation.get(
                    "communication_score",
                    0
                ),

                "strengths":
                evaluation.get(
                    "strengths",
                    ""
                ),

                "mistakes":
                evaluation.get(
                    "mistakes",
                    ""
                ),

                "improved_answer":
                evaluation.get(
                    "improved_answer",
                    ""
                ),

                "correct_answer":
                evaluation.get(
                    "correct_answer",
                    ""
                )

            })

        avg_score = 0

        if len(results) > 0:

            avg_score = round(
                sum(
                    item["technical_score"]
                    for item in results
                ) / len(results),
                1
            )

        overall_summary = (
            generate_overall_summary(
                results
            )
        )

        save_interview(
             user_id=user_id,
            role=role,
            avg_score=avg_score,
            summary=overall_summary["summary"]
        )

        print("\n===== RESULTS =====")
        print(results)

        print("\n===== SUMMARY =====")
        print(overall_summary)

        return jsonify({

            "results":
            results,

            "summary":
            overall_summary

        })

    except Exception as e:

        print(
            "EVALUATION ERROR:",
            e
        )

        return jsonify({
            "error":
            str(e)
        }), 500


@app.route("/history")
@jwt_required()
def get_history():

    try:
        user_id = int(
    get_jwt_identity()
)

        conn = sqlite3.connect(
            "interview_history.db"
        )

        conn.row_factory = (
            sqlite3.Row
        )

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT *
            FROM interviews
            WHERE user_id = ?
            ORDER BY id DESC
            """,
             (user_id,)
        )

        rows = cursor.fetchall()

        history = [
            dict(row)
            for row in rows
        ]

        conn.close()

        return jsonify(
            history
        )

    except Exception as e:

        print(
            "HISTORY ERROR:",
            e
        )

        return jsonify({
            "error":
            str(e)
        }), 500


@app.route("/dashboard")
@jwt_required()
def dashboard():

    try:
        user_id = int(
    get_jwt_identity()
)

        conn = sqlite3.connect(
            "interview_history.db"
        )

        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM interviews
            WHERE user_id =?
            """,
            (user_id,)
            
        )

        total = (
            cursor.fetchone()[0]
        )

        cursor.execute(
            """
            SELECT AVG(avg_score)
            FROM interviews
            WHERE user_id =?
            """,
            (user_id,)
            
        )

        average = (
            cursor.fetchone()[0]
        )

        cursor.execute(
            """
            SELECT MAX(avg_score)
            FROM interviews
            WHERE user_id =?
            """,
            (user_id,)
            
        )

        best = (
            cursor.fetchone()[0]
        )

        conn.close()

        return jsonify({

            "total":
            total,

            "average":
            round(
                average,
                1
            ) if average else 0,

            "best":
            best if best else 0

        })

    except Exception as e:

        print(
            "DASHBOARD ERROR:",
            e
        )

        return jsonify({
            "error":
            str(e)
        }), 500

@app.route(
    "/download_report",
    methods=["POST"]
)
def download_report():

    try:

        data = request.get_json()

        results = data["results"]
        summary = data["summary"]

        filename = generate_pdf(
            results,
            summary
        )

        return send_file(
            filename,
            as_attachment=True
        )

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@app.route(
    "/signup",
    methods=["POST"]
)
def signup():

    try:

        data = request.get_json()

        name = data.get(
            "name",
            ""
        )

        email = data.get(
            "email",
            ""
        )

        password = data.get(
            "password",
            ""
        )

        success, message = register_user(
            name,
            email,
            password
        )

        if not success:

            return jsonify({
                "error": message
            }), 400

        return jsonify({
            "message": message
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

@app.route(
    "/login",
    methods=["POST"]
)
def login():

    try:

        data = request.get_json()

        email = data.get(
            "email",
            ""
        )

        password = data.get(
            "password",
            ""
        )

        user = login_user(
            email,
            password
        )

        if not user:

            return jsonify({
                "error":
                "Invalid email or password"
            }), 401

        token = create_access_token(
            identity=str(user["id"])
        )

        return jsonify({

            "token": token,

            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }

        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
        

@app.route("/learning", methods=["POST"])
@jwt_required()
def learning():
    try:
        data = request.get_json()
        role = data.get("role", "")
        weak_skills = data.get("weak_skills", [])

        if not role:
            return jsonify({"error": "Role is required"}), 400

        content = generate_learning_content(role, weak_skills)
        return jsonify(content)

    except Exception as e:
        print("LEARNING ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/google-login", methods=["POST"])
def google_login():
    try:
        data = request.get_json()
        name = data.get("name", "")
        email = data.get("email", "")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = google_login_or_register(name, email)
        token = create_access_token(identity=str(user["id"]))

        return jsonify({"token": token, "user": user})

    except Exception as e:
        print("GOOGLE LOGIN ERROR:", e)
        return jsonify({"error": str(e)}), 401


if __name__ == "__main__":

    init_db()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )