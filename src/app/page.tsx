"use client";

import { useState, useRef, useCallback } from "react";
import type { DragEvent, ChangeEvent } from "react";
import RoastDisplay from "@/components/RoastDisplay";

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png"];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Status = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [roast, setRoast] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((f: File): string | null => {
    if (!ACCEPTED_MIME.includes(f.type)) return "Only PDF, JPG, and PNG files are accepted.";
    if (f.size > MAX_SIZE) return "File must be under 10 MB.";
    return null;
  }, []);

  const pick = useCallback((f: File) => {
    const err = validate(f);
    if (err) { setValidationError(err); setFile(null); return; }
    setValidationError(null);
    setRoast(null);
    setApiError(null);
    setStatus("idle");
    setFile(f);
  }, [validate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) pick(e.target.files[0]);
  };

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setDragging(false); };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) pick(e.dataTransfer.files[0]);
  };

  const clear = () => {
    setFile(null);
    setValidationError(null);
    setRoast(null);
    setApiError(null);
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  };

  const submitRoast = async () => {
    if (!file) return;
    setStatus("loading");
    setRoast(null);
    setApiError(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/roast", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok || data.error) {
        setApiError(data.error ?? "Something went wrong. Try again.");
        setStatus("error");
      } else {
        setRoast(data.roast);
        setStatus("done");
      }
    } catch {
      setApiError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col font-sans">

      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🔥</span>
          <span className="font-extrabold text-xl tracking-tight">ResumeRoast</span>
        </div>
        <p className="text-sm text-zinc-400 italic hidden sm:block">Get Roasted. Get Better.</p>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-10 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-4">
            Your Resume Deserves{" "}
            <span className="text-[#ff6b6b]">Brutal Honesty</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400">
            Upload it. Get roasted. Actually improve.
          </p>
        </div>

        {/* Upload card */}
        <div className="w-full max-w-lg">

          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="sr-only"
          />

          {/* Drop zone */}
          <label
            htmlFor="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              "flex flex-col items-center justify-center w-full h-48 rounded-2xl",
              "border-2 border-dashed cursor-pointer transition-all select-none",
              dragging
                ? "border-[#ff6b6b] bg-[#ff6b6b]/10 scale-[1.01]"
                : "border-zinc-600 bg-zinc-800/50 hover:border-zinc-400 hover:bg-zinc-800",
            ].join(" ")}
          >
            <span className="text-4xl mb-3" aria-hidden="true">
              {dragging ? "🎯" : "📄"}
            </span>
            <p className="text-zinc-300 font-medium text-center px-4">
              Drag your resume here or{" "}
              <span className="text-[#ff6b6b] underline underline-offset-2">click to upload</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">PDF · JPG · PNG &mdash; max 10 MB</p>
          </label>

          {/* Selected file row */}
          {file && (
            <div className="mt-3 flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#ff6b6b] shrink-0 text-base" aria-hidden="true">📎</span>
                <span className="text-sm text-zinc-100 truncate">{file.name}</span>
                <span className="text-xs text-zinc-500 shrink-0 ml-1">{formatSize(file.size)}</span>
              </div>
              <button
                onClick={clear}
                aria-label="Remove file"
                className="ml-3 shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-600 transition-colors text-sm leading-none"
              >
                ✕
              </button>
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <p className="mt-2 text-sm text-[#ff6b6b] flex items-center gap-1">
              <span aria-hidden="true">⚠️</span> {validationError}
            </p>
          )}

          {/* CTA */}
          <button
            onClick={submitRoast}
            disabled={!file || status === "loading"}
            className={[
              "mt-5 w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all",
              file && status !== "loading"
                ? "bg-[#ff6b6b] text-white hover:bg-[#ff5252] active:scale-[0.98] shadow-lg shadow-[#ff6b6b]/20"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed",
            ].join(" ")}
          >
            {status === "loading" ? "Roasting…  🔥" : "Roast My Resume 🔥"}
          </button>
        </div>

        {/* Loading indicator */}
        {status === "loading" && (
          <div className="mt-10 flex flex-col items-center gap-3 text-zinc-400">
            <div className="w-8 h-8 rounded-full border-2 border-[#ff6b6b] border-t-transparent animate-spin" />
            <p className="text-sm">Reading your resume… bracing for impact</p>
          </div>
        )}

        {/* API error */}
        {status === "error" && apiError && (
          <div className="mt-8 w-full max-w-lg bg-red-950/40 border border-red-800 rounded-2xl px-5 py-4">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <span aria-hidden="true">⚠️</span> {apiError}
            </p>
          </div>
        )}

        {/* Roast result */}
        {status === "done" && roast && (
          <div className="mt-10 w-full max-w-lg">
            <RoastDisplay roast={roast} onReset={clear} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-sm text-zinc-600 border-t border-white/5">
        Made with{" "}
        <a
          href="https://claude.ai/code"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Claude Code
        </a>
      </footer>

    </div>
  );
}
