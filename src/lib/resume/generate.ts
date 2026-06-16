/**
 * Server-only: turns a validated request into a tailored application pack by
 * calling Claude with a structured-output contract. Never import this from a
 * client component — it reads the secret API key from the environment.
 */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { applicationPackSchema, type ApplicationPack, type GenerateRequest } from "./schema";
import { buildUserMessage, SYSTEM_PROMPT } from "./prompt";

/** Default to the most capable model; override per-deploy if cost dictates. */
const MODEL = process.env.RESUME_MODEL ?? "claude-opus-4-8";

/** Set RESUME_DEMO_MODE=1 to exercise the full UX without an API key (local/dev). */
function demoModeEnabled(): boolean {
  return process.env.RESUME_DEMO_MODE === "1";
}

/** True when the app can actually generate (has a key, or demo mode is on). */
export function isConfigured(): boolean {
  return demoModeEnabled() || Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Thrown when generation can't run because no key is configured. */
export class NotConfiguredError extends Error {
  constructor() {
    super("ResumeRocket is not configured: set ANTHROPIC_API_KEY (or RESUME_DEMO_MODE=1).");
    this.name = "NotConfiguredError";
  }
}

/** Thrown when the model declined the request. */
export class RefusedError extends Error {
  constructor() {
    super("The model declined to generate a pack for this input.");
    this.name = "RefusedError";
  }
}

export async function generateApplicationPack(
  req: GenerateRequest,
): Promise<ApplicationPack> {
  if (demoModeEnabled()) return demoPack(req);
  if (!process.env.ANTHROPIC_API_KEY) throw new NotConfiguredError();

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(req) }],
    output_config: {
      effort: "medium",
      format: zodOutputFormat(applicationPackSchema),
    },
  });

  if (response.stop_reason === "refusal") throw new RefusedError();
  if (!response.parsed_output) {
    throw new Error("Model returned no structured output.");
  }
  return response.parsed_output;
}

/**
 * A clearly-labeled deterministic sample so the full UI flow can be demoed and
 * tested without spending tokens. NOT the production value path — gated behind
 * RESUME_DEMO_MODE and never enabled when a real key is present in prod.
 */
function demoPack(req: GenerateRequest): ApplicationPack {
  const role = req.jobTitle ?? "the target role";
  return {
    atsScore: 82,
    matchedKeywords: ["communication", "ownership", "delivery"],
    missingKeywords: ["[demo] add JD-specific keywords here"],
    tailoredResume:
      `[DEMO OUTPUT — set ANTHROPIC_API_KEY for real results]\n\n` +
      `Tailored resume for ${role}, based on the ${req.resumeText.length}-character ` +
      `resume you pasted. The live version rewrites every section to match the job.`,
    coverLetter:
      `[DEMO OUTPUT] Dear Hiring Manager, I'm excited to apply for ${role}. ` +
      `This placeholder shows where your tailored cover letter appears once a key is set.`,
    interviewQuestions: Array.from({ length: 8 }, (_, i) => ({
      question: `[DEMO] Likely interview question #${i + 1} for ${role}?`,
      guidance: "The live version gives specific, candidate-grounded answer guidance here.",
    })),
    linkedinHeadline: `[DEMO] ${role} | Results-driven professional`,
    linkedinAbout:
      "[DEMO] Your optimized LinkedIn About section appears here in the live version.",
  };
}
