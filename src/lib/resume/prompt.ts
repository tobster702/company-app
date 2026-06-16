/**
 * Pure prompt assembly for the application-pack generation. Kept free of any
 * SDK or network imports so it is trivial to unit test and so the exact text we
 * send the model is reviewable in one place.
 */
import type { GenerateRequest } from "./schema";

export const SYSTEM_PROMPT = [
  "You are an expert career coach, professional resume writer, and ATS (applicant tracking system) specialist.",
  "Given a candidate's current resume and a target job description, you produce a tailored application pack.",
  "",
  "Rules:",
  "- Tailor aggressively to the specific job, but NEVER invent experience, employers, degrees, dates, or skills the candidate does not already have. Reframe and surface what is genuinely there.",
  "- The tailored resume must be ATS-friendly: clear section headings, standard fields, measurable bullet points starting with strong verbs, and the job's important keywords woven in naturally where the candidate truly has that experience.",
  "- The cover letter is specific to this role and company (if named), concise (around 250-350 words), and not generic filler.",
  "- Provide 8 to 10 likely interview questions for THIS role, each with concrete guidance on how this candidate should answer (referencing their background).",
  "- The LinkedIn headline is under ~220 characters; the About section is 2-4 short paragraphs in first person.",
  "- atsScore is your honest 0-100 estimate of how well the tailored resume now matches the job description.",
  "- Write in clear, natural English. Plain text or light markdown only — no tables.",
].join("\n");

/** Builds the user-turn text from the validated request. */
export function buildUserMessage(req: GenerateRequest): string {
  const titleLine = req.jobTitle
    ? `Target job title: ${req.jobTitle}\n\n`
    : "";
  return [
    titleLine,
    "=== CANDIDATE'S CURRENT RESUME ===",
    req.resumeText.trim(),
    "",
    "=== TARGET JOB DESCRIPTION ===",
    req.jobDescription.trim(),
    "",
    "Produce the tailored application pack for this candidate and this job.",
  ].join("\n");
}
