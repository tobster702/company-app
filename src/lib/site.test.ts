import { describe, expect, it } from "vitest";
import { pageTitle, siteConfig } from "./site";

describe("siteConfig", () => {
  it("is branded as ResumeRocket", () => {
    expect(siteConfig.name).toBe("ResumeRocket");
  });
});

describe("pageTitle", () => {
  it("returns the bare site name with no section", () => {
    expect(pageTitle()).toBe("ResumeRocket");
  });

  it("prefixes the section before the site name", () => {
    expect(pageTitle("Pricing")).toBe("Pricing — ResumeRocket");
  });
});
