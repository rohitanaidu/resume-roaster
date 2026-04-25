export interface RoastRequest {
  resumeText: string;
}

export interface RoastResponse {
  roast?: string;
  error?: string;
}

export type UploadStatus = "idle" | "uploading" | "loading" | "success" | "error";
