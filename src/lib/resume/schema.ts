/**
 * Shapes for the ResumeRocket "application pack" — the core value path.
 *
 * The same Zod schema is used three ways:
 *  - to validate the inbound request body in the route handler,
 *  - to constrain the model's output via structured outputs, and
 *  - to type the result the UI renders.
 *
 * Keep this dependency-light (only `zod`) so it imports cleanly on both the
 * server (route handler) and the client (form types).
 */
import { z } from "zod";

/** What the user pastes in. */
export const generateRequestSchema = z.object({
  /** Their current resume, pasted as plain text. */
  resumeText: z.string().trim().min(40, "Paste your resume (at least a few lines)."),
  /** The target job description, pasted as plain text. */
  jobDescription: z
    .string()
    .trim()
    .min(40, "Paste the job description (at least a few lines)."),
  /** Optional target job title to anchor tailoring when the JD is terse. */
  jobTitle: z.string().trim().max(200).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

/** One likely interview question with guidance on how to answer it. */
export const interviewQuestionSchema = z.object({
  question: z.string(),
  guidance: z.string(),
});

/**
 * The full application pack. This is the structured-output contract the model
 * must satisfy, so every field is required and described for the model.
 */
export const applicationPackSchema = z.object({
  /** 0-100 estimate of how well the tailored resume matches the JD / ATS keywords. */
  atsScore: z.number(),
  /** Short list of the most important keywords/skills the JD wants. */
  matchedKeywords: z.array(z.string()),
  /** Keywords from the JD the original resume was missing (now addressed). */
  missingKeywords: z.array(z.string()),
  /** The rewritten, ATS-friendly resume tailored to this job (plain text / markdown). */
  tailoredResume: z.string(),
  /** A matching cover letter for this specific role. */
  coverLetter: z.string(),
  /** 8-10 likely interview questions with answer guidance. */
  interviewQuestions: z.array(interviewQuestionSchema),
  /** An optimized LinkedIn headline. */
  linkedinHeadline: z.string(),
  /** An optimized LinkedIn "About" section. */
  linkedinAbout: z.string(),
});

export type ApplicationPack = z.infer<typeof applicationPackSchema>;
export type InterviewQuestion = z.infer<typeof interviewQuestionSchema>;
