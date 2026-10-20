import { clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { logger } from "../../common/utils/logger.js";
import { db } from "../../common/db/index.js";
import {
  applicationActivity,
  applications,
  applicationStatusHistory,
  companies,
  contacts,
  importJobs,
  interviews,
  notifications,
  offerDetails,
  platforms,
  resumeVersions,
  tasks,
  weeklyGoals,
} from "../../common/db/schema.js";
import { deletePrivateFile } from "../../common/utils/imagekit.js";
import type { UpdatePreferencesBody, UpdateProfileBody } from "./dto/users.dto.js";
import {
  DEFAULT_PREFERENCES,
  userProfiles,
  type UserPreferences,
  type UserProfile,
} from "./users.models.js";

/** Create the profile row on first access. ownerId === verified Clerk user id. */
export async function getOrCreateProfile(ownerId: string): Promise<UserProfile> {
  const [existing] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, ownerId))
    .limit(1);
  if (existing) return existing;

  await db
    .insert(userProfiles)
    .values({ clerkUserId: ownerId, preferences: DEFAULT_PREFERENCES })
    .onConflictDoNothing();
  const [created] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.clerkUserId, ownerId))
    .limit(1);
  return created!;
}

export async function getProfile(ownerId: string) {
  const profile = await getOrCreateProfile(ownerId);
  return {
    ...profile,
    preferences: { ...DEFAULT_PREFERENCES, ...(profile.preferences as Partial<UserPreferences>) },
  };
}

export async function getTimezone(ownerId: string): Promise<string> {
  const profile = await getOrCreateProfile(ownerId);
  return profile.timezone || "UTC";
}

export async function updateProfile(ownerId: string, body: UpdateProfileBody) {
  await getOrCreateProfile(ownerId);
  const [row] = await db
    .update(userProfiles)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(userProfiles.clerkUserId, ownerId))
    .returning();
  return row;
}

export async function updatePreferences(ownerId: string, body: UpdatePreferencesBody) {
  const profile = await getOrCreateProfile(ownerId);
  const merged: UserPreferences = {
    ...DEFAULT_PREFERENCES,
    ...(profile.preferences as Partial<UserPreferences>),
    ...body,
  };
  const [row] = await db
    .update(userProfiles)
    .set({ preferences: merged, updatedAt: new Date() })
    .where(eq(userProfiles.clerkUserId, ownerId))
    .returning();
  return { ...row, preferences: merged };
}

/** Full personal-data export (PRD §4, §20). Resume binaries are not included. */
export async function exportUserData(ownerId: string) {
  const [
    profile,
    companyRows,
    contactRows,
    platformRows,
    resumeRows,
    applicationRows,
    statusHistoryRows,
    activityRows,
    interviewRows,
    taskRows,
    notificationRows,
    goalRows,
    offerRows,
  ] = await Promise.all([
    getProfile(ownerId),
    db.select().from(companies).where(eq(companies.ownerId, ownerId)),
    db.select().from(contacts).where(eq(contacts.ownerId, ownerId)),
    db.select().from(platforms).where(eq(platforms.ownerId, ownerId)),
    db.select().from(resumeVersions).where(eq(resumeVersions.ownerId, ownerId)),
    db.select().from(applications).where(eq(applications.ownerId, ownerId)),
    db
      .select()
      .from(applicationStatusHistory)
      .where(eq(applicationStatusHistory.ownerId, ownerId)),
    db.select().from(applicationActivity).where(eq(applicationActivity.ownerId, ownerId)),
    db.select().from(interviews).where(eq(interviews.ownerId, ownerId)),
    db.select().from(tasks).where(eq(tasks.ownerId, ownerId)),
    db.select().from(notifications).where(eq(notifications.ownerId, ownerId)),
    db.select().from(weeklyGoals).where(eq(weeklyGoals.ownerId, ownerId)),
    db.select().from(offerDetails).where(eq(offerDetails.ownerId, ownerId)),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    profile,
    companies: companyRows,
    contacts: contactRows,
    platforms: platformRows,
    resumes: resumeRows.map((r) => ({ ...r, storageKey: undefined })),
    applications: applicationRows,
    statusHistory: statusHistoryRows,
    activity: activityRows,
    interviews: interviewRows,
    tasks: taskRows,
    notifications: notificationRows,
    weeklyGoals: goalRows,
    offers: offerRows,
  };
}

/** Delete the user and every owned row, then best-effort remove ImageKit files. */
export async function deleteAccount(ownerId: string): Promise<void> {
  const resumes = await db
    .select({ storageKey: resumeVersions.storageKey })
    .from(resumeVersions)
    .where(eq(resumeVersions.ownerId, ownerId));

  await db.transaction(async (tx) => {
    // Applications cascade to status history, activity, interviews, offers.
    await tx.delete(applications).where(eq(applications.ownerId, ownerId));
    await tx.delete(tasks).where(eq(tasks.ownerId, ownerId));
    await tx.delete(notifications).where(eq(notifications.ownerId, ownerId));
    await tx.delete(contacts).where(eq(contacts.ownerId, ownerId));
    await tx.delete(companies).where(eq(companies.ownerId, ownerId));
    await tx.delete(platforms).where(eq(platforms.ownerId, ownerId));
    await tx.delete(resumeVersions).where(eq(resumeVersions.ownerId, ownerId));
    await tx.delete(weeklyGoals).where(eq(weeklyGoals.ownerId, ownerId));
    await tx.delete(importJobs).where(eq(importJobs.ownerId, ownerId));
    await tx.delete(userProfiles).where(eq(userProfiles.clerkUserId, ownerId));
  });

  await clerkClient.users
    .deleteUser(ownerId)
    .catch((e: unknown) => logger.warn("Clerk user deletion failed", { ownerId, error: String(e) }));

  await Promise.all(
    resumes
      .filter((r) => r.storageKey)
      .map((r) => deletePrivateFile(r.storageKey!).catch(() => undefined)),
  );
}