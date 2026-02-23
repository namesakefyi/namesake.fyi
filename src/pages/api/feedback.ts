import type { APIRoute } from "astro";
import {
  FORM_FEEDBACK_SENTIMENT,
  FORM_SLUGS,
  type FormFeedbackSentiment,
  type FormSlug,
} from "@/constants/forms";

const VALID_SENTIMENTS = Object.keys(
  FORM_FEEDBACK_SENTIMENT,
) as FormFeedbackSentiment[];

export const POST: APIRoute = async ({ request, locals }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { form_slug, sentiment, comment } = body as Record<string, unknown>;

  if (
    typeof form_slug !== "string" ||
    !(FORM_SLUGS as readonly string[]).includes(form_slug)
  ) {
    return Response.json({ error: "Invalid form_slug" }, { status: 400 });
  }

  if (
    typeof sentiment !== "string" ||
    !VALID_SENTIMENTS.includes(sentiment as FormFeedbackSentiment)
  ) {
    return Response.json(
      { error: `sentiment must be one of: ${VALID_SENTIMENTS.join(", ")}` },
      { status: 400 },
    );
  }

  const commentTrimmed =
    typeof comment === "string" && comment.trim() !== ""
      ? comment.trim()
      : null;

  if (commentTrimmed && commentTrimmed.length > 1000) {
    return Response.json(
      { error: "Comment must be 1000 characters or fewer" },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For") ??
    null;
  const userAgent = request.headers.get("User-Agent") ?? null;

  const env = locals.runtime?.env;
  const db = env?.DB as D1Database | undefined;

  if (!db) {
    return Response.json({ error: "Database unavailable" }, { status: 503 });
  }

  if (ip) {
    const recent = await db
      .prepare(
        "SELECT COUNT(*) as count FROM form_feedback WHERE ip = ? AND submitted_at > datetime('now', '-1 hour')",
      )
      .bind(ip)
      .first<{ count: number }>();

    if (recent && recent.count >= 5) {
      return Response.json({ error: "Too many submissions" }, { status: 429 });
    }
  }

  await db
    .prepare(
      "INSERT INTO form_feedback (form_slug, sentiment, comment, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      form_slug as FormSlug,
      sentiment as FormFeedbackSentiment,
      commentTrimmed,
      ip,
      userAgent,
    )
    .run();

  const resendApiKey = env?.RESEND_API_KEY as string | undefined;
  if (resendApiKey) {
    const sentimentLabel =
      FORM_FEEDBACK_SENTIMENT[sentiment as FormFeedbackSentiment];
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "noreply@namesake.fyi",
          to: "hey@namesake.fyi",
          subject: `${sentimentLabel} feedback on ${form_slug}`,
          html: `<p>A user submitted <strong>${sentimentLabel}</strong> feedback on <a href="https://namesake.fyi/forms/${form_slug}">${form_slug}</a>.</p><p>${commentTrimmed ?? "<em>No comment</em>"}</p>`,
        }),
      });
      if (!emailRes.ok) {
        const errorBody = await emailRes.text();
        console.error(`Resend error ${emailRes.status}: ${errorBody}`);
      }
    } catch (err) {
      console.error("Resend fetch failed:", err);
    }
  }

  return Response.json({ success: true });
};
