"use client";

import { useState } from "react";
import type { ApplicationPack } from "@/lib/resume/schema";
import { CopyButton } from "./CopyButton";

type Status = "idle" | "loading" | "done" | "error";

/** The core value path: paste resume + job description → tailored application pack. */
export function ResumeTool() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<ApplicationPack | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setPack(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle: jobTitle.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setPack(data.pack as ApplicationPack);
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Your current resume
            </span>
            <textarea
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here…"
              rows={12}
              className="resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Target job description
            </span>
            <textarea
              required
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job posting here…"
              rows={12}
              className="resize-y rounded-lg border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs leading-relaxed text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
        </div>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Target job title <span className="text-zinc-400">(optional)</span>
          </span>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Tailoring your pack…" : "Tailor my application — free"}
          </button>
          <span className="text-xs text-zinc-500">
            First pack free. Takes ~30–60 seconds.
          </span>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}
      </form>

      {pack && <PackView pack={pack} />}
    </div>
  );
}

function Section({
  title,
  copyText,
  children,
}: {
  title: string;
  copyText?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </section>
  );
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
      {children}
    </pre>
  );
}

function PackView({ pack }: { pack: ApplicationPack }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
            {pack.atsScore}
          </span>
          <span className="text-sm text-indigo-700/80 dark:text-indigo-300/80">/ 100 ATS match</span>
        </div>
        {pack.matchedKeywords.length > 0 && (
          <KeywordRow label="Matched" tone="match" words={pack.matchedKeywords} />
        )}
        {pack.missingKeywords.length > 0 && (
          <KeywordRow label="Now addressed" tone="missing" words={pack.missingKeywords} />
        )}
      </div>

      <Section title="Tailored resume" copyText={pack.tailoredResume}>
        <Pre>{pack.tailoredResume}</Pre>
      </Section>

      <Section title="Cover letter" copyText={pack.coverLetter}>
        <Pre>{pack.coverLetter}</Pre>
      </Section>

      <Section title="Likely interview questions">
        <ol className="flex list-decimal flex-col gap-4 pl-5">
          {pack.interviewQuestions.map((q, i) => (
            <li key={i} className="text-sm">
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{q.question}</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{q.guidance}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="LinkedIn optimization"
        copyText={`${pack.linkedinHeadline}\n\n${pack.linkedinAbout}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Headline</p>
        <Pre>{pack.linkedinHeadline}</Pre>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">About</p>
        <Pre>{pack.linkedinAbout}</Pre>
      </Section>
    </div>
  );
}

function KeywordRow({
  label,
  words,
  tone,
}: {
  label: string;
  words: string[];
  tone: "match" | "missing";
}) {
  const chip =
    tone === "match"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
      : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200";
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-zinc-500">{label}:</span>
      {words.map((w) => (
        <span key={w} className={`rounded-full px-2 py-0.5 text-xs font-medium ${chip}`}>
          {w}
        </span>
      ))}
    </div>
  );
}
