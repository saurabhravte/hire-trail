import { describe, expect, it } from "vitest";
import { resolveTimeWindow, GREETINGS } from "./greetings";

function at(h: number, m = 0) {
  const d = new Date(2026, 0, 1, h, m, 0);
  return resolveTimeWindow(d);
}

describe("resolveTimeWindow boundaries", () => {
  it("04:59 → midnight", () => expect(at(4, 59)).toBe("midnight"));
  it("05:00 → earlyMorning", () => expect(at(5, 0)).toBe("earlyMorning"));
  it("08:59 → earlyMorning", () => expect(at(8, 59)).toBe("earlyMorning"));
  it("09:00 → morning", () => expect(at(9, 0)).toBe("morning"));
  it("11:59 → morning", () => expect(at(11, 59)).toBe("morning"));
  it("12:00 → afternoon", () => expect(at(12, 0)).toBe("afternoon"));
  it("16:59 → afternoon", () => expect(at(16, 59)).toBe("afternoon"));
  it("17:00 → evening", () => expect(at(17, 0)).toBe("evening"));
  it("20:59 → evening", () => expect(at(20, 59)).toBe("evening"));
  it("21:00 → night", () => expect(at(21, 0)).toBe("night"));
  it("23:59 → night", () => expect(at(23, 59)).toBe("night"));
  it("00:00 → midnight", () => expect(at(0, 0)).toBe("midnight"));
});

describe("greeting name handling", () => {
  it("uses the provided first name", () => {
    expect(GREETINGS.morning.greeting("Sam")).toContain("Sam");
  });
  it("every window has 4+ message variants", () => {
    for (const cfg of Object.values(GREETINGS)) {
      expect(cfg.messages.length).toBeGreaterThanOrEqual(4);
    }
  });
});