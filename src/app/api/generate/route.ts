import { NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/resume/schema";
import {
  generateApplicationPack,
  NotConfiguredError,
  RefusedError,
} from "@/lib/resume/generate";

// Always run this handler at request time — it calls an external API with a
// secret and must never be prerendered or cached.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Please paste your resume and a job description.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const pack = await generateApplicationPack(parsed.data);
    return NextResponse.json({ pack });
  } catch (err) {
    if (err instanceof NotConfiguredError) {
      return NextResponse.json(
        { error: "ResumeRocket isn't configured yet — the team is enabling it." },
        { status: 503 },
      );
    }
    if (err instanceof RefusedError) {
      return NextResponse.json(
        { error: "We couldn't generate a pack for that input. Try different text." },
        { status: 422 },
      );
    }
    console.error("generate failed:", err);
    return NextResponse.json(
      { error: "Something went wrong generating your pack. Please try again." },
      { status: 500 },
    );
  }
}
