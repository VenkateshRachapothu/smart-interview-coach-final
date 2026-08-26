\# Smart Interview Coach



An AI-powered interview preparation platform that analyzes resumes, generates personalized interview questions, conducts mock interviews, evaluates answers, and provides detailed performance insights and personalized learning recommendations.



\## 🚀 Live Demo



\[\*\*Try Smart Interview Coach →\*\*](https://smart-interview-coach-five.vercel.app/)



\---



\## 📌 Overview



Smart Interview Coach is a full-stack AI application designed to help candidates prepare for technical interviews.



Users can upload their resume, analyze their skills, select an interview role, generate personalized interview questions, complete a mock interview, and receive AI-powered evaluation and feedback.



After the interview evaluation, the system also identifies areas for improvement and generates personalized learning recommendations with learning paths, practice questions, and coding questions.



The application combines a React frontend, Flask REST API backend, SQLite database, and Groq-powered AI services.



\---



\## ✨ Features



\### 📄 Resume Analysis



\- Upload resumes in PDF format

\- Extract resume content

\- Identify technical skills

\- Analyze resume information

\- Provide resume-related insights

\- Identify relevant skills for selected roles



\### 🤖 AI Interview Question Generation



\- Generate personalized interview questions

\- Questions based on the candidate's resume

\- Questions based on the selected job role

\- AI-powered technical interview preparation



\### 🎤 Mock Interview



\- Interactive mock interview workflow

\- Displays AI-generated questions

\- Allows users to submit answers

\- Tracks interview progress

\- Evaluates candidate responses



\### 📊 AI Performance Evaluation



After completing an interview, the system provides:



\- Technical score

\- Communication score

\- Overall performance insights

\- Strengths

\- Mistakes

\- Areas for improvement

\- Improved answers

\- Reference/correct answers

\- Personalized recommendations



\### 📚 Personalized Learning Recommendations



The system analyzes interview weaknesses and recommends personalized learning content.



Learning recommendations include:



\- Skill or topic

\- Difficulty level

\- Estimated learning time

\- Reason for recommendation

\- Topic summary

\- Key concepts

\- Learning path

\- YouTube learning topics

\- Udemy learning topics

\- Practice questions

\- Coding questions



\### 📜 Interview History



Users can review their previous interview sessions and track their interview performance.



\### 👤 User Management



\- User registration

\- User login

\- Google authentication

\- JWT-based authentication

\- Personalized user experience



\---



\## 🏗️ System Architecture



```text

\&#x20;                   ┌──────────────────────┐

\&#x20;                   │    React + Vite      │

\&#x20;                   │      Frontend        │

\&#x20;                   └──────────┬───────────┘

\&#x20;                              │

\&#x20;                              │ REST API

\&#x20;                              ▼

\&#x20;                   ┌──────────────────────┐

\&#x20;                   │    Flask Backend     │

\&#x20;                   │       APIs           │

\&#x20;                   └──────────┬───────────┘

\&#x20;                              │

\&#x20;            ┌─────────────────┼─────────────────┐

\&#x20;            │                 │                 │

\&#x20;            ▼                 ▼                 ▼

\&#x20;     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐

\&#x20;     │   Resume    │   │   Groq AI   │   │   SQLite    │

\&#x20;     │ Processing  │   │   Service   │   │  Database   │

\&#x20;     └─────────────┘   └─────────────┘   └─────────────┘

\&#x20;            │                 │

\&#x20;            ▼                 ▼

\&#x20;     Skill Extraction   Question Generation

\&#x20;     Resume Analysis    Answer Evaluation

\&#x20;                        Learning Content







🔄 Application Workflow





User

\&#x20; │

\&#x20; ▼

Register / Login

\&#x20; │

\&#x20; ▼

Dashboard

\&#x20; │

\&#x20; ▼

Upload Resume

\&#x20; │

\&#x20; ▼

Resume Processing

\&#x20; │

\&#x20; ├──► Resume Analysis

\&#x20; │

\&#x20; └──► Skill Extraction

\&#x20;         │

\&#x20;         ▼

\&#x20;   Select Interview Role

\&#x20;         │

\&#x20;         ▼

\&#x20;AI-Generated Interview Questions

\&#x20;         │

\&#x20;         ▼

\&#x20;     Mock Interview

\&#x20;         │

\&#x20;         ▼

\&#x20;     Submit Answers

\&#x20;         │

\&#x20;         ▼

\&#x20;   AI Answer Evaluation

\&#x20;         │

\&#x20;         ▼

\&#x20;   Performance Analysis

\&#x20;         │

\&#x20;         ├──► Technical Score

\&#x20;         ├──► Communication Score

\&#x20;         ├──► Strengths

\&#x20;         ├──► Mistakes

\&#x20;         ├──► Improved Answers

\&#x20;         └──► Recommendations

\&#x20;         │

\&#x20;         ▼

\&#x20;Interview History

\&#x20;         │

\&#x20;         ▼

Personalized Learning Recommendations


## 🖥️ Application Screenshots

### 🏠 Landing Page

![Smart Interview Coach Landing Page](screenshots/landing-page.png)

### 🔐 Login

![Login Page](screenshots/login.png)

### 📄 Resume Upload

![Resume Upload](screenshots/resume-upload.png)

### 📊 ATS Resume Analysis

![ATS Resume Analysis](screenshots/ats-analysis.png)

### 🎯 Role Selection

![Role Selection](screenshots/role-selection.png)

### 🎤 Mock Interview

![Mock Interview](screenshots/mock-interview.png)

### 📋 Evaluation & Answers

![Evaluation and Answers](screenshots/evaluation-answers.png)

### 📚 Personalized Learning Recommendations

![Learning Recommendations](screenshots/learning.png)

### 📜 Interview History

![Interview History](screenshots/history.png)

### 📥 Download Summary

![Download Summary](screenshots/download-summary.png)

---





🛠️ Tech Stack

Frontend

React

Vite

JavaScript

React Router

Recharts

HTML

CSS

Backend

Python

Flask

Flask-CORS

Flask-JWT-Extended

REST APIs

Gunicorn

AI

Groq API

Large Language Model

AI-powered question generation

AI-powered answer evaluation

Personalized learning recommendations

Resume Processing

PyPDF2

pdfplumber

Database

SQLite

Authentication

JWT Authentication

Google Authentication

Deployment

Frontend: Vercel

Backend: Render





📂 Project Structure





smart-interview-coach/

│

├── backend/

│   ├── data/

│   ├── routes/

│   ├── services/

│   ├── uploads/

│   ├── app.py

│   ├── database.py

│   ├── requirements.txt

│   └── ...

│

├── frontend/

│   ├── public/

│   ├── src/

│   ├── package.json

│   ├── package-lock.json

│   ├── vite.config.js

│   └── ...

│

├── .gitignore

└── README.md



⚙️ Local Installation

Prerequisites



Make sure you have installed:



Python 3.10+

Node.js

npm



1\\. Clone the Repository

git clone https://github.com/VenkateshRachapothu/smart-interview-coach-final.git

cd smart-interview-coach-final

Git



2\\. Backend Setup



Navigate to the backend:



cd backend



Create a virtual environment:



python -m venv venv



Activate the virtual environment on Windows:



venv\\\\Scripts\\\\activate



Install the required dependencies:



pip install -r requirements.txt



Create a .env file inside the backend directory:



GROQ\\\_API\\\_KEY=your\\\_groq\\\_api\\\_key

JWT\\\_SECRET\\\_KEY=your\\\_secret\\\_key



Start the Flask backend:



python app.py



The backend will run locally on the configured Flask port.



3\\. Frontend Setup



Open another terminal.



Navigate to the frontend:



cd frontend



Install dependencies:



npm install



Create a .env file inside the frontend directory:



VITE\\\_API\\\_URL=http://127.0.0.1:5000



Start the Vite development server:



npm run dev



Open the local URL displayed by Vite in your browser.



🔐 Environment Variables



The project uses environment variables for sensitive configuration.



Backend



Create:



backend/.env



Add:



GROQ\\\_API\\\_KEY=your\\\_groq\\\_api\\\_key

JWT\\\_SECRET\\\_KEY=your\\\_secret\\\_key

Frontend



Create:



frontend/.env



Add:



VITE\\\_API\\\_URL=http://127.0.0.1:5000



Never commit .env files, API keys, passwords, or other secrets to GitHub.



🔌 Core Backend Functionality



The Flask backend provides functionality for:



User authentication

Google authentication

Resume upload

Resume processing

Skill extraction

Interview role selection

Interview question generation

Answer submission

AI answer evaluation

Interview history

Learning recommendations

🧠 AI Pipeline



The AI workflow consists of several stages:



Resume

\&#x20; ↓

Resume Text Extraction

\&#x20; ↓

Skill Extraction

\&#x20; ↓

Role Selection

\&#x20; ↓

Personalized Question Generation

\&#x20; ↓

Candidate Answers

\&#x20; ↓

AI Evaluation

\&#x20; ↓

Technical \\\& Communication Scores

\&#x20; ↓

Strengths \\\& Mistakes

\&#x20; ↓

Personalized Learning Recommendations

📊 AI Evaluation



The evaluation system generates structured feedback including:



Technical performance

Communication performance

Strengths

Mistakes

Improved answers

Correct/reference answers

Personalized recommendations



The evaluation results are used to identify the candidate's weak areas and generate targeted learning recommendations.



📚 Learning Recommendation System



The Learning Recommendation feature is designed to continue the candidate's preparation after the interview.



Based on identified weaknesses, the system generates personalized learning content containing:



Weak Skill / Topic

\&#x20;      ↓

Difficulty Level

\&#x20;      ↓

Estimated Learning Time

\&#x20;      ↓

Why It Is Recommended

\&#x20;      ↓

Topic Summary

\&#x20;      ↓

Key Concepts

\&#x20;      ↓

Learning Path

\&#x20;      ↓

Practice Questions

\&#x20;      ↓

Coding Questions



This creates a continuous learning cycle:



Interview

\&#x20;  ↓

Evaluation

\&#x20;  ↓

Weakness Identification

\&#x20;  ↓

Learning Recommendation

\&#x20;  ↓

Practice

\&#x20;  ↓

Better Interview Preparation



🌐 Deployment

Frontend



The React + Vite frontend is deployed using Vercel.



Live Website:



https://smart-interview-coach-five.vercel.app/



Backend



The Flask backend is deployed as a web service using Render.



AI Service



Groq API is used by the backend for AI-powered:



Interview question generation

Answer evaluation

Personalized learning recommendations

🔒 Security



The project follows basic security practices:



API keys are stored in environment variables.

.env files are excluded from Git.

Virtual environments are excluded from Git.

node\\\_modules is excluded from Git.

Uploaded resume files are excluded from Git.

Local database files are excluded from Git.

Authentication uses JWT.

🚧 Future Improvements

Voice-based mock interviews

Speech-to-text interview interaction

Real-time communication analysis

Advanced interview analytics

Interview difficulty levels

More job roles

Advanced learning progress tracking

Personalized interview preparation plans

Additional LLM providers

Cloud database integration

Real-time interview feedback

👨‍💻 Contributors

Venkatesh Rachapothu

Dinesh Katreddi



This project was developed as a collaborative academic and portfolio project.



📄 License



This project is intended for educational and portfolio purposes.




