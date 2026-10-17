import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* ----------------------------- Enums ----------------------------- */

export const APPLICATION_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer_received",
  "accepted",
  "rejected",
  "ghosted",
  "withdrawn",
] as const;
export const applicationStatusEnum = pgEnum("application_status", APPLICATION_STATUSES);

export const WORK_MODES = ["remote", "hybrid", "onsite"] as const;
export const workModeEnum = pgEnum("work_mode", WORK_MODES);

export const PAY_PERIODS = ["hourly", "monthly", "yearly"] as const;
export const payPeriodEnum = pgEnum("pay_period", PAY_PERIODS);

export const PRIORITIES = ["normal", "high", "dream"] as const;
export const priorityEnum = pgEnum("priority", PRIORITIES);

export const INTERVIEW_ROUNDS = [
  "hr",
  "technical",
  "managerial",
  "coding_assessment",
  "take_home",
  "other",
] as const;
export const interviewRoundEnum = pgEnum("interview_round", INTERVIEW_ROUNDS);

export const INTERVIEW_STATUSES = [
  "scheduled",
  "rescheduled",
  "completed",
  "cancelled",
  "no_show",
] as const;
export const interviewStatusEnum = pgEnum("interview_status", INTERVIEW_STATUSES);

export const INTERVIEW_OUTCOMES = ["pending", "passed", "failed"] as const;
export const interviewOutcomeEnum = pgEnum("interview_outcome", INTERVIEW_OUTCOMES);

export const TASK_STATES = ["pending", "completed"] as const;
export const taskStateEnum = pgEnum("task_state", TASK_STATES);

export const TASK_PRIORITIES = ["low", "normal", "high"] as const;
export const taskPriorityEnum = pgEnum("task_priority", TASK_PRIORITIES);

export const OFFER_DECISIONS = ["pending", "accepted", "declined", "expired"] as const;
export const offerDecisionEnum = pgEnum("offer_decision", OFFER_DECISIONS);

export const IMPORT_STATES = ["pending", "validated", "committed", "failed"] as const;
export const importStateEnum = pgEnum("import_state", IMPORT_STATES);

export const THEMES = ["light", "dark", "system"] as const;
export const themeEnum = pgEnum("theme", THEMES);

/* -------------------------- User profile ------------------------- */

export const userProfiles = pgTable(
  "user_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    displayName: text("display_name"),
    timezone: text("timezone").notNull().default("UTC"),
    theme: themeEnum("theme").notNull().default("system"),
    dateFormat: text("date_format").notNull().default("yyyy-MM-dd"),
    // follow-up + ghosted-review thresholds (days), weekly goal target, etc.
    preferences: jsonb("preferences").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("user_clerk_uidx").on(t.clerkUserId)],
);

/* ----------------------------- Company --------------------------- */

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    website: text("website"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("company_owner_idx").on(t.ownerId),
    // NOT unique: PRD warns on duplicates but must not auto-merge distinct companies.
    index("company_owner_normname_idx").on(t.ownerId, t.normalizedName),
  ],
);

/* ---------------------------- Platform --------------------------- */

export const platforms = pgTable(
  "platforms",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id"), // null => system-defined / seeded platform
    name: text("name").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("platform_owner_idx").on(t.ownerId)],
);

/* ------------------------- Resume version ------------------------ */

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    label: text("label").notNull(),
    // ImageKit metadata (never the binary itself)
    storageKey: text("storage_key"), // ImageKit fileId
    fileName: text("file_name"),
    filePath: text("file_path"), // ImageKit filePath used to sign URLs
    fileSize: integer("file_size"),
    mimeType: text("mime_type"),
    coverLetterUrl: text("cover_letter_url"),
    portfolioUrl: text("portfolio_url"),
    notes: text("notes"),
    isDefault: boolean("is_default").notNull().default(false),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("resume_owner_idx").on(t.ownerId)],
);

/* --------------------------- Application -------------------------- */

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    role: text("role").notNull(),
    status: applicationStatusEnum("status").notNull().default("saved"),

    appliedDate: date("applied_date"),
    salaryMin: numeric("salary_min", { precision: 14, scale: 2 }),
    salaryMax: numeric("salary_max", { precision: 14, scale: 2 }),
    currency: text("currency"),
    payPeriod: payPeriodEnum("pay_period"),

    location: text("location"),
    workMode: workModeEnum("work_mode"),
    techStack: text("tech_stack").array().notNull().default([]),

    platformId: uuid("platform_id").references(() => platforms.id, { onDelete: "set null" }),
    resumeVersionId: uuid("resume_version_id").references(() => resumeVersions.id, {
      onDelete: "set null",
    }),

    jobUrl: text("job_url"),
    jobId: text("job_id"),
    priority: priorityEnum("priority").notNull().default("normal"),

    recruiterName: text("recruiter_name"),
    recruiterEmail: text("recruiter_email"),
    recruiterPhone: text("recruiter_phone"),
    referralPerson: text("referral_person"),
    referralNotes: text("referral_notes"),

    notes: text("notes"),
    isArchived: boolean("is_archived").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("app_owner_idx").on(t.ownerId),
    index("app_owner_status_idx").on(t.ownerId, t.status),
    index("app_owner_applied_idx").on(t.ownerId, t.appliedDate),
    index("app_company_idx").on(t.companyId),
  ],
);

/* --------------------- Application status history ----------------- */

export const applicationStatusHistory = pgTable(
  "application_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    ownerId: text("owner_id").notNull(),
    previousStatus: applicationStatusEnum("previous_status"),
    newStatus: applicationStatusEnum("new_status").notNull(),
    note: text("note"),
    changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("status_hist_app_idx").on(t.applicationId)],
);

/* ----------------------- Application activity --------------------- */

export const applicationActivity = pgTable(
  "application_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    ownerId: text("owner_id").notNull(),
    eventType: text("event_type").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("activity_app_idx").on(t.applicationId)],
);

/* ----------------------------- Contact --------------------------- */

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    companyId: uuid("company_id").references(() => companies.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    linkedinUrl: text("linkedin_url"),
    role: text("role"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_owner_idx").on(t.ownerId), index("contact_company_idx").on(t.companyId)],
);

/* ---------------------------- Interview -------------------------- */

export const interviews = pgTable(
  "interviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    ownerId: text("owner_id").notNull(),
    roundType: interviewRoundEnum("round_type").notNull().default("other"),
    status: interviewStatusEnum("status").notNull().default("scheduled"),
    startTime: timestamp("start_time", { withTimezone: true }).notNull(),
    endTime: timestamp("end_time", { withTimezone: true }),
    timezone: text("timezone").notNull().default("UTC"),
    location: text("location"),
    meetingLink: text("meeting_link"),
    interviewer: text("interviewer"),
    questions: text("questions"),
    prepNotes: text("prep_notes"),
    outcome: interviewOutcomeEnum("outcome").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("interview_owner_idx").on(t.ownerId),
    index("interview_app_idx").on(t.applicationId),
    index("interview_start_idx").on(t.ownerId, t.startTime),
  ],
);

/* ------------------------------ Task ----------------------------- */

export const tasks = pgTable(
  "tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    applicationId: uuid("application_id").references(() => applications.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    dueTime: timestamp("due_time", { withTimezone: true }),
    timezone: text("timezone").notNull().default("UTC"),
    priority: taskPriorityEnum("priority").notNull().default("normal"),
    state: taskStateEnum("state").notNull().default("pending"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("task_owner_idx").on(t.ownerId), index("task_due_idx").on(t.ownerId, t.dueTime)],
);

/* -------------------------- Notification ------------------------- */

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: uuid("related_entity_id"),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    scheduledTime: timestamp("scheduled_time", { withTimezone: true }),
    // stable key => idempotent reminder processing, no duplicate notifications
    dedupKey: text("dedup_key").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    dismissedAt: timestamp("dismissed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("notif_owner_idx").on(t.ownerId),
    index("notif_dedup_idx").on(t.ownerId, t.dedupKey),
  ],
);

/* --------------------------- Weekly goal ------------------------- */

export const weeklyGoals = pgTable(
  "weekly_goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    targetCount: integer("target_count").notNull().default(0),
    weekStart: date("week_start").notNull(),
    weekEnd: date("week_end").notNull(),
    isPaused: boolean("is_paused").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("goal_owner_week_idx").on(t.ownerId, t.weekStart)],
);

/* -------------------------- Offer details ------------------------ */

export const offerDetails = pgTable(
  "offer_details",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    ownerId: text("owner_id").notNull(),
    basePay: numeric("base_pay", { precision: 14, scale: 2 }),
    variablePay: numeric("variable_pay", { precision: 14, scale: 2 }),
    bonus: numeric("bonus", { precision: 14, scale: 2 }),
    equityNotes: text("equity_notes"),
    currency: text("currency"),
    payPeriod: payPeriodEnum("pay_period"),
    benefits: text("benefits"),
    workMode: workModeEnum("work_mode"),
    location: text("location"),
    joiningDate: date("joining_date"),
    deadline: date("deadline"),
    decision: offerDecisionEnum("decision").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("offer_owner_idx").on(t.ownerId), index("offer_app_idx").on(t.applicationId)],
);

/* --------------------------- Import job -------------------------- */

export const importJobs = pgTable(
  "import_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: text("owner_id").notNull(),
    state: importStateEnum("state").notNull().default("pending"),
    totalRows: integer("total_rows").notNull().default(0),
    validRows: integer("valid_rows").notNull().default(0),
    errorRows: integer("error_rows").notNull().default(0),
    errorReport: jsonb("error_report").$type<unknown[]>().notNull().default([]),
    stagedData: jsonb("staged_data").$type<unknown[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("import_owner_idx").on(t.ownerId)],
);