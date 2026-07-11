from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)


def generate_pdf(
    results,
    summary
):

    filename = "Interview_Report.pdf"

    doc = SimpleDocTemplate(
        filename
    )

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "Smart Interview Coach Report",
            styles["Title"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    content.append(
        Paragraph(
            "Overall Summary",
            styles["Heading1"]
        )
    )

    content.append(
        Paragraph(
            summary.get(
                "summary",
                ""
            ),
            styles["BodyText"]
        )
    )

    content.append(
        Spacer(1, 10)
    )

    content.append(
        Paragraph(
            f"<b>Strengths:</b> {summary.get('strengths', '')}",
            styles["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"<b>Weaknesses:</b> {summary.get('weaknesses', '')}",
            styles["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"<b>Advice:</b> {summary.get('advice', '')}",
            styles["BodyText"]
        )
    )

    content.append(
        Spacer(1, 20)
    )

    for i, item in enumerate(
        results,
        start=1
    ):

        content.append(
            Paragraph(
                f"Question {i}",
                styles["Heading2"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Question:</b> {item['question']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Your Answer:</b> {item['answer']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Technical Score:</b> {item['technical_score']}/10",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Communication Score:</b> {item['communication_score']}/10",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Strengths:</b> {item['strengths']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Mistakes:</b> {item['mistakes']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Improved Answer:</b> {item['improved_answer']}",
                styles["BodyText"]
            )
        )

        content.append(
            Paragraph(
                f"<b>Correct Answer:</b> {item['correct_answer']}",
                styles["BodyText"]
            )
        )

        content.append(
            Spacer(1, 20)
        )

    doc.build(content)

    return filename