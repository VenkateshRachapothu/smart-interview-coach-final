import sqlite3

def save_interview(
    user_id,
    role,
    avg_score,
    summary
):

    conn = sqlite3.connect(
        "interview_history.db"
    )

    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO interviews(
            user_id,
            role,
            avg_score,
            summary
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            user_id,
            role,
            avg_score,
            summary
        )
    )

    conn.commit()
    conn.close()