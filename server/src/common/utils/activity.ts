import type { db } from "../db/index.js";
import { applicationActivity } from "../db/schema.js";

type DbExecutor = Pick<typeof db, "insert">;

export async function logApplicationActivity(
  ex: DbExecutor,
  data: {
    applicationId: string;
    ownerId: string;
    eventType: string;
    metadata?: Record<string, unknown>;
  },
) {
  await ex.insert(applicationActivity).values({
    applicationId: data.applicationId,
    ownerId: data.ownerId,
    eventType: data.eventType,
    metadata: data.metadata ?? {},
  });
}