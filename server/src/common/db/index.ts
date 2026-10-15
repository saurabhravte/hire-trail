import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.js";

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client);

export const connectDB = async () => {
  await db.execute(sql`select 1`);
  console.log("Database connected");
};

export const closeDB = () => client.end();