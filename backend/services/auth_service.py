import sqlite3

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)


def google_login_or_register(name, email):
    conn = sqlite3.connect("interview_history.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            (name, email, "")
        )
        conn.commit()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

    conn.close()
    return {"id": user[0], "name": user[1], "email": user[2]}

def register_user(
    name,
    email,
    password
):

    conn = sqlite3.connect(
        "interview_history.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:

        conn.close()

        return False, "Email already exists"

    hashed_password = (
        generate_password_hash(
            password
        )
    )

    cursor.execute(
        """
        INSERT INTO users
        (
            name,
            email,
            password
        )
        VALUES (?, ?, ?)
        """,
        (
            name,
            email,
            hashed_password
        )
    )

    conn.commit()

    conn.close()

    return True, "User registered successfully"


def login_user(
    email,
    password
):

    conn = sqlite3.connect(
        "interview_history.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    user = cursor.fetchone()

    conn.close()

    if not user:

        return None

    stored_password = user[3]

    if check_password_hash(
        stored_password,
        password
    ):

        return {
            "id": user[0],
            "name": user[1],
            "email": user[2]
        }

    return None