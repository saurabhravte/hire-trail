import { describe, expect, it } from "vitest";
import { applicationFormSchema, emptyFormValues } from "./application-form.schema";

const base = { ...emptyFormValues, companyName: "Acme", role: "Engineer" };

describe("applicationFormSchema", () => {
  it("requires company name", () => {
    const r = applicationFormSchema.safeParse({ ...base, companyName: "" });
    expect(r.success).toBe(false);
  });

  it("requires role", () => {
    const r = applicationFormSchema.safeParse({ ...base, role: "" });
    expect(r.success).toBe(false);
  });

  it("allows a saved job without an applied date", () => {
    const r = applicationFormSchema.safeParse({ ...base, status: "saved", appliedDate: "" });
    expect(r.success).toBe(true);
  });

  it("requires applied date once submitted (status = applied)", () => {
    const r = applicationFormSchema.safeParse({ ...base, status: "applied", appliedDate: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.includes("appliedDate"))).toBe(true);
    }
  });

  it("accepts optional fields left blank", () => {
    const r = applicationFormSchema.safeParse({
      ...base,
      status: "saved",
      jobUrl: "",
      salaryMin: "",
      notes: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejects salaryMin greater than salaryMax", () => {
    const r = applicationFormSchema.safeParse({
      ...base,
      status: "saved",
      salaryMin: "200",
      salaryMax: "100",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an invalid job URL", () => {
    const r = applicationFormSchema.safeParse({ ...base, status: "saved", jobUrl: "not-a-url" });
    expect(r.success).toBe(false);
  });
});