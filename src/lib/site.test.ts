import { describe, expect, it } from "vitest";
import { getGreeting, siteConfig } from "./site";

describe("getGreeting", () => {
  it("greets the site by default", () => {
    expect(getGreeting()).toBe(`Hello, ${siteConfig.name} 👋`);
  });

  it("greets a provided name", () => {
    expect(getGreeting("World")).toBe("Hello, World 👋");
  });
});
