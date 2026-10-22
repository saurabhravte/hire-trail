import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),


  CLIENT_URL: z
    .string()
    .default(process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
    .transform((url) => url.replace(/\/+$/, "")),

  DATABASE_URL: z.string().min(1),

  // Clerk (server-side verification)
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),

  // ImageKit (private resume/document storage) — used from Part 2 onward.
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;