import { describe, expect, it } from "vitest";
import { buildUserMessage, SYSTEM_PROMPT } from "./prompt";

describe("SYSTEM_PROMPT", () => {
  it("instructs the model not to fabricate experience", () => {
    expect(SYSTEM_PROMPT).toMatch(/NEVER invent/);
  });

  it("mentions ATS so output is screener-friendly", () => {
    expect(SYSTEM_PROMPT).toMatch(/ATS/);
  });
});

describe("buildUserMessage", () => {
  const base = {
    resumeText: "Jane Doe — Software Engineer at Acme. Built APIs in Node.",
    jobDescription: "Seeking a Senior Backend Engineer fluent in TypeScript and AWS.",
  };

  it("includes both the resume and the job description verbatim", () => {
    const msg = buildUserMessage(base);
    expect(msg).toContain(base.resumeText);
    expect(msg).toContain(base.jobDescription);
  });

  it("labels each section so the model can tell them apart", () => {
    const msg = buildUserMessage(base);
    expect(msg).toContain("CANDIDATE'S CURRENT RESUME");
    expect(msg).toContain("TARGET JOB DESCRIPTION");
  });

  it("adds a target title line only when a jobTitle is provided", () => {
    expect(buildUserMessage(base)).not.toMatch(/Target job title:/);
    expect(
      buildUserMessage({ ...base, jobTitle: "Senior Backend Engineer" }),
    ).toMatch(/Target job title: Senior Backend Engineer/);
  });
});
