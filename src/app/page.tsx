import UploadForm from "@/components/UploadForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Resume Roast</h1>
      <p className="mb-8 text-lg text-zinc-500">
        Upload your resume and get brutally honest feedback.
      </p>
      <UploadForm />
    </main>
  );
}
