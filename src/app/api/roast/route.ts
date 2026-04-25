import { NextRequest, NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/extractText";
import { generateRoast, generateRoastFromImage } from "@/lib/roastClient";
import { RoastResponse } from "@/lib/types";

export const maxDuration = 60;

const MAX_SIZE = 10 * 1024 * 1024;
const IMAGE_MIMES = ["image/jpeg", "image/png"];

export async function POST(
  req: NextRequest
): Promise<NextResponse<RoastResponse>> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10 MB limit." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let roast: string;

    if (IMAGE_MIMES.includes(file.type)) {
      roast = await generateRoastFromImage(
        buffer.toString("base64"),
        file.type
      );
    } else {
      const text = await extractTextFromBuffer(buffer, file.type);
      if (!text) {
        return NextResponse.json(
          { error: "Could not extract text from the file." },
          { status: 422 }
        );
      }
      roast = await generateRoast(text);
    }

    return NextResponse.json({ roast });
  } catch (err) {
    console.error("[/api/roast]", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }
}
