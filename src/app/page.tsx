import { siteConfig } from "@/lib/site";
import { ResumeTool } from "./_components/ResumeTool";

const VALUE_PROPS = [
  {
    title: "ATS-optimized",
    body: "Beat the resume screeners. We weave in the keywords each job actually scans for.",
  },
  {
    title: "A full application pack",
    body: "Tailored resume, matching cover letter, likely interview questions, and LinkedIn copy.",
  },
  {
    title: "60 seconds, not an afternoon",
    body: "Paste your resume and the job. Get everything you need to apply with confidence.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-5 py-12 sm:py-16">
      <header className="flex flex-col items-center gap-5 text-center">
        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium tracking-wide text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
          🚀 {siteConfig.name}
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Tailor your resume to any job in 60 seconds
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Paste your resume and a job description. Get an ATS-optimized resume, a matching cover
          letter, likely interview questions, and LinkedIn copy — tuned to land more callbacks.
        </p>
      </header>

      <ResumeTool />

      <section className="grid gap-5 sm:grid-cols-3">
        {VALUE_PROPS.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{p.title}</h2>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400">{p.body}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500 dark:border-zinc-800">
        {siteConfig.name} — your AI career toolkit. We never store your resume.
      </footer>
    </main>
  );
}
