import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const useUserMock = vi.fn();
vi.mock("@clerk/react", () => ({ useUser: () => useUserMock() }));
vi.mock("motion/react", () => ({
  motion: { section: (p: any) => <section {...p} /> },
  useReducedMotion: () => true,
}));

import { WelcomeCard } from "@/features/dashboard/components/welcome-card";

describe("WelcomeCard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 10, 0, 0));
    sessionStorage.clear();
    localStorage.clear();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("shows a skeleton while the profile loads", () => {
    useUserMock.mockReturnValue({ user: null, isLoaded: false });
    const { container } = render(<WelcomeCard />);
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy();
    expect(screen.queryByText(/undefined/i)).toBeNull();
  });

  it("greets the user and dismisses", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    useUserMock.mockReturnValue({
      user: { id: "u1", firstName: "Sam" },
      isLoaded: true,
    });
    render(<WelcomeCard />);
    expect(screen.getByText("Good morning, Sam")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /dismiss/i }));
    await waitFor(() => expect(screen.queryByText("Good morning, Sam")).toBeNull());
    expect(sessionStorage.getItem("hiretrail:welcome-dismissed:u1")).toBe("1");
  });
});