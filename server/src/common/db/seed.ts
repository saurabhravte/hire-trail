import "dotenv/config";
import { faker } from "@faker-js/faker";
import { addDays, format, startOfWeek, subDays } from "date-fns";
import { eq } from "drizzle-orm";
import { db, closeDB } from "./index.js";
import {
  applications,
  applicationActivity,
  applicationStatusHistory,
  companies,
  contacts,
  interviews,
  notifications,
  offerDetails,
  platforms,
  resumeVersions,
  tasks,
  userProfiles,
  weeklyGoals,
  APPLICATION_STATUSES,
  INTERVIEW_ROUNDS,
  PRIORITIES,
  WORK_MODES,
} from "./schema.js";

/* --------------------------- helpers ---------------------------- */

type Status = (typeof APPLICATION_STATUSES)[number];

const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;
const chance = (p: number) => Math.random() < p;
const money = (min: number, max: number) =>
  String(Math.round((min + Math.random() * (max - min)) / 10000) * 10000);
const dateStr = (d: Date) => format(d, "yyyy-MM-dd");

const TECH = [
  "React", "TypeScript", "Node", "Postgres", "Go", "Python", "Kubernetes",
  "AWS", "GraphQL", "Redis", "Docker", "Rust", "Next.js", "Tailwind",
];

const DEFAULT_PLATFORMS = [
  "LinkedIn", "Naukri", "Wellfound", "Company career page", "Referral", "Indeed", "Other",
];

// Weighted status mix so the funnel/analytics look realistic.
const STATUS_WEIGHTS: [Status, number][] = [
  ["saved", 4],
  ["applied", 9],
  ["interview", 5],
  ["offer_received", 2],
  ["accepted", 1],
  ["rejected", 5],
  ["ghosted", 3],
  ["withdrawn", 1],
];
const WEIGHTED_STATUSES: Status[] = STATUS_WEIGHTS.flatMap(([s, n]) => Array<Status>(n).fill(s));

// The ordered path an application takes to reach a given status, for history.
function pathTo(status: Status): Status[] {
  switch (status) {
    case "saved":
      return ["saved"];
    case "applied":
      return ["applied"];
    case "ghosted":
      return ["applied", "ghosted"];
    case "withdrawn":
      return ["applied", "withdrawn"];
    case "rejected":
      return chance(0.5) ? ["applied", "rejected"] : ["applied", "interview", "rejected"];
    case "interview":
      return ["applied", "interview"];
    case "offer_received":
      return ["applied", "interview", "offer_received"];
    case "accepted":
      return ["applied", "interview", "offer_received", "accepted"];
    default:
      return ["applied"];
  }
}

/* ----------------------------- wipe ----------------------------- */

async function wipeUser(ownerId: string) {
  // Applications cascade to status history, activity, interviews, offers.
  await db.delete(applications).where(eq(applications.ownerId, ownerId));
  await db.delete(tasks).where(eq(tasks.ownerId, ownerId));
  await db.delete(notifications).where(eq(notifications.ownerId, ownerId));
  await db.delete(contacts).where(eq(contacts.ownerId, ownerId));
  await db.delete(companies).where(eq(companies.ownerId, ownerId));
  await db.delete(platforms).where(eq(platforms.ownerId, ownerId));
  await db.delete(resumeVersions).where(eq(resumeVersions.ownerId, ownerId));
  await db.delete(weeklyGoals).where(eq(weeklyGoals.ownerId, ownerId));
  await db.delete(userProfiles).where(eq(userProfiles.clerkUserId, ownerId));
}

/* ----------------------------- seed ----------------------------- */

async function seed(ownerId: string) {
  console.log(`Seeding data for owner: ${ownerId}`);
  await wipeUser(ownerId);

  // Profile
  await db.insert(userProfiles).values({
    clerkUserId: ownerId,
    displayName: faker.person.firstName(),
    timezone: "Asia/Kolkata",
    theme: "system",
    preferences: {
      followUpThresholdDays: 7,
      ghostedReviewThresholdDays: 14,
      weeklyGoalDefault: 5,
      notifyInterviews: true,
      notifyFollowUps: true,
    },
  });

  // Platforms (system defaults, as the app seeds them)
  const platformRows = await db
    .insert(platforms)
    .values(DEFAULT_PLATFORMS.map((name) => ({ ownerId, name, isSystem: true })))
    .returning({ id: platforms.id });

  // Resume versions
  const resumeRows = await db
    .insert(resumeVersions)
    .values([
      { ownerId, label: "Backend v3", isDefault: true, notes: "ATS-optimized" },
      { ownerId, label: "Platform-focused v2", isDefault: false },
      { ownerId, label: "Generalist v1", isDefault: false },
    ])
    .returning({ id: resumeVersions.id });

  // Companies
  const companyCount = 14;
  const companyRows = await db
    .insert(companies)
    .values(
      Array.from({ length: companyCount }).map(() => {
        const name = faker.company.name();
        return {
          ownerId,
          name,
          normalizedName: name.trim().toLowerCase().replace(/\s+/g, " "),
          website: chance(0.7) ? faker.internet.url() : null,
          notes: chance(0.3) ? faker.company.catchPhrase() : null,
        };
      }),
    )
    .returning({ id: companies.id, name: companies.name });

  // Contacts (recruiters) for ~half the companies
  await db.insert(contacts).values(
    companyRows
      .filter(() => chance(0.5))
      .map((c) => ({
        ownerId,
        companyId: c.id,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: chance(0.5) ? faker.phone.number() : null,
        linkedinUrl: chance(0.6) ? `https://linkedin.com/in/${faker.internet.username()}` : null,
        role: pick(["Recruiter", "Hiring Manager", "Talent Partner", "Engineering Manager"]),
      })),
  );

  const now = new Date();
  const interviewValues: (typeof interviews.$inferInsert)[] = [];
  const offerValues: (typeof offerDetails.$inferInsert)[] = [];
  const activityValues: (typeof applicationActivity.$inferInsert)[] = [];
  const historyValues: (typeof applicationStatusHistory.$inferInsert)[] = [];

  // Applications (28)
  const appCount = 28;
  for (let i = 0; i < appCount; i++) {
    const status = pick(WEIGHTED_STATUSES);
    const company = pick(companyRows);
    // Applied 2–90 days ago (saved ones may have no applied date)
    const appliedAgo = faker.number.int({ min: 2, max: 90 });
    const appliedDate = status === "saved" && chance(0.5) ? null : subDays(now, appliedAgo);
    const salaryMin = chance(0.75) ? money(1_200_000, 2_400_000) : null;
    const salaryMax = salaryMin ? money(Number(salaryMin), Number(salaryMin) + 1_200_000) : null;

    const [app] = await db
      .insert(applications)
      .values({
        ownerId,
        companyId: company.id,
        role: faker.person.jobTitle(),
        status,
        appliedDate: appliedDate ? dateStr(appliedDate) : null,
        salaryMin,
        salaryMax,
        currency: salaryMin ? "INR" : null,
        payPeriod: salaryMin ? "yearly" : null,
        location: pick(["Remote", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Gurgaon"]),
        workMode: pick(WORK_MODES),
        techStack: faker.helpers.arrayElements(TECH, faker.number.int({ min: 2, max: 5 })),
        platformId: pick(platformRows).id,
        resumeVersionId: pick(resumeRows).id,
        jobUrl: chance(0.6) ? faker.internet.url() : null,
        priority: pick([...PRIORITIES, "normal", "normal"]), // bias to normal
        recruiterName: chance(0.4) ? faker.person.fullName() : null,
        notes: chance(0.3) ? faker.lorem.sentence() : null,
        isArchived: chance(0.1),
        createdAt: appliedDate ?? subDays(now, appliedAgo),
      })
      .returning({ id: applications.id });

    // Status history along the realistic path
    const path = pathTo(status);
    const baseDate = appliedDate ?? subDays(now, appliedAgo);
    path.forEach((s, idx) => {
      const changedAt = addDays(baseDate, idx * faker.number.int({ min: 2, max: 9 }));
      historyValues.push({
        applicationId: app.id,
        ownerId,
        previousStatus: idx === 0 ? null : path[idx - 1]!,
        newStatus: s,
        changedAt: changedAt > now ? now : changedAt,
      });
    });
    activityValues.push({
      applicationId: app.id,
      ownerId,
      eventType: "created",
      metadata: { status: path[0] },
      createdAt: baseDate,
    });

    // Interviews for anything that reached interview+
    if (["interview", "offer_received", "accepted", "rejected"].includes(status) && chance(0.85)) {
      const rounds = faker.number.int({ min: 1, max: 3 });
      for (let r = 0; r < rounds; r++) {
        // Mix of past and (for active interviews) upcoming
        const upcoming = status === "interview" && r === rounds - 1 && chance(0.7);
        const start = upcoming
          ? addDays(now, faker.number.int({ min: 1, max: 12 }))
          : subDays(now, faker.number.int({ min: 1, max: appliedAgo }));
        start.setHours(faker.number.int({ min: 9, max: 17 }), 0, 0, 0);
        interviewValues.push({
          applicationId: app.id,
          ownerId,
          roundType: pick(INTERVIEW_ROUNDS),
          status: upcoming ? "scheduled" : "completed",
          startTime: start,
          endTime: new Date(start.getTime() + 60 * 60_000),
          timezone: "Asia/Kolkata",
          meetingLink: chance(0.7) ? "https://meet.example.com/abc-defg-hij" : null,
          interviewer: faker.person.fullName(),
          outcome: upcoming ? "pending" : pick(["passed", "failed", "pending"]),
        });
      }
    }

    // Offers for offer/accepted
    if (["offer_received", "accepted"].includes(status)) {
      const base = Number(salaryMin ?? money(1_500_000, 2_200_000));
      offerValues.push({
        applicationId: app.id,
        ownerId,
        basePay: String(base),
        variablePay: String(Math.round(base * 0.15)),
        bonus: String(Math.round(base * 0.1)),
        currency: "INR",
        payPeriod: "yearly",
        benefits: "Health insurance, learning budget",
        workMode: pick(WORK_MODES),
        joiningDate: dateStr(addDays(now, 30)),
        deadline: dateStr(addDays(now, 10)),
        decision: status === "accepted" ? "accepted" : "pending",
      });
    }
  }

  if (historyValues.length) await db.insert(applicationStatusHistory).values(historyValues);
  if (activityValues.length) await db.insert(applicationActivity).values(activityValues);
  if (interviewValues.length) await db.insert(interviews).values(interviewValues);
  if (offerValues.length) await db.insert(offerDetails).values(offerValues);

  // Tasks: a few upcoming, a couple overdue, one done
  await db.insert(tasks).values([
    {
      ownerId,
      title: "Follow up with recruiter",
      dueTime: addDays(now, 1),
      timezone: "Asia/Kolkata",
      priority: "high",
      state: "pending",
    },
    {
      ownerId,
      title: "Prepare system design answers",
      dueTime: addDays(now, 3),
      timezone: "Asia/Kolkata",
      priority: "normal",
      state: "pending",
    },
    {
      ownerId,
      title: "Send thank-you note",
      dueTime: subDays(now, 2), // overdue
      timezone: "Asia/Kolkata",
      priority: "normal",
      state: "pending",
    },
    {
      ownerId,
      title: "Update portfolio",
      dueTime: subDays(now, 5),
      timezone: "Asia/Kolkata",
      priority: "low",
      state: "completed",
      completedAt: subDays(now, 4),
    },
  ]);

  // Weekly goal for the current week (Monday start)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  await db.insert(weeklyGoals).values({
    ownerId,
    targetCount: 5,
    weekStart: dateStr(weekStart),
    weekEnd: dateStr(addDays(weekStart, 6)),
    isPaused: false,
  });

  console.log(
    `Seeded: ${appCount} applications, ${companyCount} companies, ` +
    `${interviewValues.length} interviews, ${offerValues.length} offers.`,
  );
}

/* ----------------------------- main ----------------------------- */

async function main() {
  // Owner id comes from: CLI arg → SEED_OWNER_ID env var.
  const ownerId = process.argv[2] ?? process.env.SEED_OWNER_ID;

  if (!ownerId) {
    console.error(
      [
        "Missing Clerk user id.",
        "",
        "Usage:",
        "  bun run db:seed <clerk_user_id>",
        "  SEED_OWNER_ID=<clerk_user_id> bun run db:seed",
        "",
        "Get your id: sign in to the app, open the browser console, run:",
        "  await window.Clerk.user.id",
        "or copy it from the Clerk dashboard (Users → your user → User ID, starts with 'user_').",
      ].join("\n"),
    );
    process.exit(1);
  }

  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to seed in production (NODE_ENV=production).");
    process.exit(1);
  }

  try {
    await seed(ownerId);
    console.log("Done.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await closeDB();
  }
}

void main();