import { env } from "cloudflare:workers";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

declare const D1_MIGRATIONS: string[];

import { isRateLimited } from "../../../utils/rateLimitByIp";
import { POST } from "../feedback";

vi.mock("../../../utils/rateLimitByIp", () => ({
  isRateLimited: vi.fn().mockResolvedValue(false),
}));

const callPost = (request: Request) => POST({ request } as any);

const makeRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://namesake.fyi",
      ...headers,
    },
    body: JSON.stringify(body),
  });

const validBody = {
  form_slug: "court-order-ma",
  sentiment: "positive",
};

beforeAll(async () => {
  await env.DB.batch(D1_MIGRATIONS.map((s) => env.DB.prepare(s)));
});

beforeEach(async () => {
  await env.DB.exec("DELETE FROM form_feedback");
  vi.mocked(isRateLimited).mockResolvedValue(false);
});

describe("POST /api/feedback", () => {
  describe("validation", () => {
    it("returns 400 for malformed JSON", async () => {
      const request = new Request("http://localhost/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not json",
      });
      const response = await callPost(request);
      expect(response.status).toBe(400);
      expect(await response.json()).toMatchObject({ error: "Invalid JSON" });
    });

    it("returns 400 for an invalid form_slug", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, form_slug: "unknown-form" }),
      );
      expect(response.status).toBe(400);
    });

    it("returns 400 for an invalid sentiment", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, sentiment: "meh" }),
      );
      expect(response.status).toBe(400);
    });

    it("returns 400 when comment exceeds 1000 characters", async () => {
      const response = await callPost(
        makeRequest({ ...validBody, comment: "a".repeat(1001) }),
      );
      expect(response.status).toBe(400);
    });
  });

  describe("origin validation", () => {
    it("returns 403 when Origin header is missing", async () => {
      const request = new Request("http://localhost/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validBody),
      });
      expect((await callPost(request)).status).toBe(403);
    });

    it("returns 403 for a localhost origin", async () => {
      const response = await callPost(
        makeRequest(validBody, { Origin: "http://localhost:4321" }),
      );
      expect(response.status).toBe(403);
    });

    it("returns 403 for a preview deploy origin", async () => {
      const response = await callPost(
        makeRequest(validBody, { Origin: "https://namesake-fyi.pages.dev" }),
      );
      expect(response.status).toBe(403);
    });

    it("accepts requests from namesake.fyi", async () => {
      expect((await callPost(makeRequest(validBody))).status).toBe(200);
    });
  });

  describe("infrastructure errors", () => {
    it("returns 429 when the IP is rate limited", async () => {
      vi.mocked(isRateLimited).mockResolvedValueOnce(true);
      const response = await callPost(
        makeRequest(validBody, { "CF-Connecting-IP": "1.2.3.4" }),
      );
      expect(response.status).toBe(429);
      expect(await response.json()).toMatchObject({
        error: "Too many submissions",
      });
    });
  });

  describe("successful submission", () => {
    it("returns 200 and inserts the row", async () => {
      const response = await callPost(
        makeRequest(
          { ...validBody, comment: "Great form!" },
          { "CF-Connecting-IP": "1.2.3.4", "User-Agent": "TestBrowser/1.0" },
        ),
      );
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ success: true });

      const { results } = await env.DB.prepare(
        "SELECT * FROM form_feedback",
      ).all();
      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        form_slug: "court-order-ma",
        sentiment: "positive",
        comment: "Great form!",
        ip: "1.2.3.4",
        user_agent: "TestBrowser/1.0",
      });
    });

    it("stores null when comment is omitted", async () => {
      await callPost(makeRequest(validBody));
      const { results } = await env.DB.prepare(
        "SELECT comment FROM form_feedback",
      ).all();
      expect(results[0]).toMatchObject({ comment: null });
    });
  });
});
