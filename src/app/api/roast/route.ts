import { NextRequest, NextResponse } from "next/server";
import { RoastResponse } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse<RoastResponse>> {
  // TODO: parse multipart form, extract resume text, call generateRoast
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
