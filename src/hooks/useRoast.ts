"use client";

import { useState } from "react";
import { UploadStatus, RoastResponse } from "@/lib/types";

export function useRoast() {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [result, setResult] = useState<RoastResponse | null>(null);
  // TODO: implement submit handler
  return { status, result };
}
