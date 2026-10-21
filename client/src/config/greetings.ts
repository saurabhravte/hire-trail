export type TimeWindow =
  | "earlyMorning"
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "midnight";

export interface WindowConfig {
  greeting: (firstName: string) => string;
  messages: string[];
}

export const GREETINGS: Record<TimeWindow, WindowConfig> = {
  earlyMorning: {
    greeting: (n) => `Good morning, ${n}`,
    messages: [
      "A fresh day, a fresh batch of opportunities.",
      "Early start — a good moment to line up today's applications.",
      "The quiet morning hours are great for focused applying.",
      "One thoughtful application beats ten rushed ones. Take your time.",
    ],
  },
  morning: {
    greeting: (n) => `Good morning, ${n}`,
    messages: [
      "A good time to tackle that application you've been meaning to send.",
      "Let's make a little progress on your search today.",
      "Pick one thing to move forward, and start there.",
      "Steady effort adds up — you've got this.",
    ],
  },
  afternoon: {
    greeting: (n) => `Good afternoon, ${n}`,
    messages: [
      "Halfway through the day — keep the momentum going.",
      "Take a short break, then back to it when you're ready.",
      "Every application is a step closer. Keep going.",
      "Nice work so far today.",
    ],
  },
  evening: {
    greeting: (n) => `Good evening, ${n}`,
    messages: [
      "A good moment to review where things stand.",
      "Wrapping up — note anything to follow up on tomorrow.",
      "Progress counts, even the small kind.",
      "Take a moment to appreciate what you got done today.",
    ],
  },
  night: {
    greeting: (n) => `Good night, ${n}`,
    messages: [
      "Time to wind down — your search will keep until morning.",
      "A little rest tonight sets up a better day tomorrow.",
      "You've done enough for today. Rest well.",
      "Jot down tomorrow's first task, then step away.",
    ],
  },
  midnight: {
    greeting: (n) => `Burning the midnight oil, ${n}?`,
    messages: [
      "It's late — be kind to yourself and get some rest.",
      "The jobs will still be here tomorrow. Sleep comes first.",
      "No pressure tonight — rest is part of the process.",
      "Whatever's on your mind, it can wait until you're rested.",
    ],
  },
};

/** Uses the device's LOCAL time, not the server's. */
export function resolveTimeWindow(date = new Date()): TimeWindow {
  const h = date.getHours();
  if (h >= 5 && h <= 8) return "earlyMorning";
  if (h >= 9 && h <= 11) return "morning";
  if (h >= 12 && h <= 16) return "afternoon";
  if (h >= 17 && h <= 20) return "evening";
  if (h >= 21 && h <= 23) return "night";
  return "midnight"; // 00:00–04:59
}

export function pickMessage(window: TimeWindow): string {
  const list = GREETINGS[window].messages;
  return list[Math.floor(Math.random() * list.length)]!;
}