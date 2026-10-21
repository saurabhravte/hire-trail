import { clerkSetup } from "@clerk/testing/playwright";
import type { FullConfig } from "@playwright/test";

// Prepares Clerk testing tokens for the whole run.
// Requires CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in the environment.
export default async function globalSetup(_config: FullConfig) {
  await clerkSetup();
}