import mammoth from "mammoth";

// Import the inner implementation to avoid module-level test-file reads that
// crash in serverless environments (Vercel, Lambda, etc.).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse/lib/pdf-parse") as (
  buf: Buffer
) => Promise<{ text: string }>;

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === "application/pdf") {
    const data = await pdfParse(buffer);
    return data.text.trim();
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value.trim();
  }

  // Images are sent directly to the vision model — no text extraction needed.
  return "";
}
