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

  const commentValue =
    typeof comment === "string" && comment.trim() !== ""
      ? comment.trim()
      : null;

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

  await db
    .prepare(
      "INSERT INTO form_feedback (form_slug, sentiment, comment, ip, user_agent) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(
      form_slug as FormSlug,
      sentiment as FormFeedbackSentiment,
      commentValue,
      ip,
      userAgent,
    )
    .run();

  const resendApiKey = env?.RESEND_API_KEY as string | undefined;
  if (resendApiKey) {
    const sentimentLabel =
      FORM_FEEDBACK_SENTIMENT[sentiment as FormFeedbackSentiment];
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "feedback@namesake.fyi",
          to: "team@namesake.fyi",
          subject: `New form feedback: ${form_slug}`,
          text: `Form: ${form_slug}\nRating: ${sentimentLabel}\n\n${commentValue ?? "No comment"}`,
        }),
      });
    } catch {
      // Best-effort: don't fail the request if email fails
    }
  }

  return Response.json({ success: true });
};
