import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGreeting } from "./use-greeting";

describe("useGreeting", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("falls back to 'there' when name is empty", () => {
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0));
    const { result } = renderHook(() => useGreeting(""));
    expect(result.current.greeting).toBe("Good morning, there");
    expect(result.current.greeting).not.toContain("undefined");
  });

  it("uses the first name when present", () => {
    vi.setSystemTime(new Date(2026, 0, 1, 14, 0, 0));
    const { result } = renderHook(() => useGreeting("Alex"));
    expect(result.current.greeting).toBe("Good afternoon, Alex");
  });

  it("updates when time crosses a boundary", () => {
    vi.setSystemTime(new Date(2026, 0, 1, 11, 59, 0));
    const { result } = renderHook(() => useGreeting("Sam"));
    expect(result.current.window).toBe("morning");

    act(() => {
      vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current.window).toBe("afternoon");
  });
});