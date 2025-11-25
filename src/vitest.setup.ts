import "@testing-library/jest-dom/vitest";
import fs from "node:fs";
import path from "node:path";
import { afterEach, beforeEach, vi } from "vitest";

// Mock fetch for PDF tests
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = vi.fn((input: RequestInfo | URL) => {
    const url = input.toString();

    // Handle file paths (either relative like "public/forms/..." or absolute like "/src/forms/...")
    // Check if this looks like a file path rather than a full URL
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      const relativePath = url.startsWith("/") ? url.slice(1) : url;
      const filePath = path.join(process.cwd(), relativePath);

      try {
        const buffer = fs.readFileSync(filePath);
        // Determine content type based on file extension
        const contentType = filePath.endsWith(".pdf")
          ? "application/pdf"
          : filePath.endsWith(".png")
            ? "image/png"
            : "application/octet-stream";

        return Promise.resolve(
          new Response(buffer, {
            status: 200,
            statusText: "OK",
            headers: new Headers({
              "content-type": contentType,
            }),
          }),
        );
      } catch (_error) {
        return Promise.resolve(
          new Response(null, {
            status: 404,
            statusText: `File not found: ${filePath}`,
            headers: new Headers({
              "content-type": "text/html",
            }),
          }),
        );
      }
    }

    // For HTTP(S) URLs, use the original fetch
    return originalFetch(input);
  });
});

afterEach(() => {
  global.fetch = originalFetch;
});
