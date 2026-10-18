CREATE TYPE "public"."application_status" AS ENUM('saved', 'applied', 'interview', 'offer_received', 'accepted', 'rejected', 'ghosted', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."import_state" AS ENUM('pending', 'validated', 'committed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."interview_outcome" AS ENUM('pending', 'passed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."interview_round" AS ENUM('hr', 'technical', 'managerial', 'coding_assessment', 'take_home', 'other');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'rescheduled', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."offer_decision" AS ENUM('pending', 'accepted', 'declined', 'expired');--> statement-breakpoint
CREATE TYPE "public"."pay_period" AS ENUM('hourly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('normal', 'high', 'dream');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'normal', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_state" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."theme" AS ENUM('light', 'dark', 'system');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TABLE "application_activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"event_type" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"previous_status" "application_status",
	"new_status" "application_status" NOT NULL,
	"note" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"company_id" uuid,
	"role" text NOT NULL,
	"status" "application_status" DEFAULT 'saved' NOT NULL,
	"applied_date" date,
	"salary_min" numeric(14, 2),
	"salary_max" numeric(14, 2),
	"currency" text,
	"pay_period" "pay_period",
	"location" text,
	"work_mode" "work_mode",
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"platform_id" uuid,
	"resume_version_id" uuid,
	"job_url" text,
	"job_id" text,
	"priority" "priority" DEFAULT 'normal' NOT NULL,
	"recruiter_name" text,
	"recruiter_email" text,
	"recruiter_phone" text,
	"referral_person" text,
	"referral_notes" text,
	"notes" text,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"website" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"company_id" uuid,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"linkedin_url" text,
	"role" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"state" "import_state" DEFAULT 'pending' NOT NULL,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"valid_rows" integer DEFAULT 0 NOT NULL,
	"error_rows" integer DEFAULT 0 NOT NULL,
	"error_report" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"staged_data" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"round_type" "interview_round" DEFAULT 'other' NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"location" text,
	"meeting_link" text,
	"interviewer" text,
	"questions" text,
	"prep_notes" text,
	"outcome" "interview_outcome" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"related_entity_type" text,
	"related_entity_id" uuid,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"scheduled_time" timestamp with time zone,
	"dedup_key" text NOT NULL,
	"read_at" timestamp with time zone,
	"dismissed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"owner_id" text NOT NULL,
	"base_pay" numeric(14, 2),
	"variable_pay" numeric(14, 2),
	"bonus" numeric(14, 2),
	"equity_notes" text,
	"currency" text,
	"pay_period" "pay_period",
	"benefits" text,
	"work_mode" "work_mode",
	"location" text,
	"joining_date" date,
	"deadline" date,
	"decision" "offer_decision" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"label" text NOT NULL,
	"storage_key" text,
	"file_name" text,
	"file_path" text,
	"file_size" integer,
	"mime_type" text,
	"cover_letter_url" text,
	"portfolio_url" text,
	"notes" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"application_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"due_time" timestamp with time zone,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"priority" "task_priority" DEFAULT 'normal' NOT NULL,
	"state" "task_state" DEFAULT 'pending' NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"display_name" text,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"theme" "theme" DEFAULT 'system' NOT NULL,
	"date_format" text DEFAULT 'yyyy-MM-dd' NOT NULL,
	"preferences" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weekly_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"target_count" integer DEFAULT 0 NOT NULL,
	"week_start" date NOT NULL,
	"week_end" date NOT NULL,
	"is_paused" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_activity" ADD CONSTRAINT "application_activity_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_resume_version_id_resume_versions_id_fk" FOREIGN KEY ("resume_version_id") REFERENCES "public"."resume_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_details" ADD CONSTRAINT "offer_details_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_app_idx" ON "application_activity" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "status_hist_app_idx" ON "application_status_history" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "app_owner_idx" ON "applications" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "app_owner_status_idx" ON "applications" USING btree ("owner_id","status");--> statement-breakpoint
CREATE INDEX "app_owner_applied_idx" ON "applications" USING btree ("owner_id","applied_date");--> statement-breakpoint
CREATE INDEX "app_company_idx" ON "applications" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_owner_idx" ON "companies" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "company_owner_normname_idx" ON "companies" USING btree ("owner_id","normalized_name");--> statement-breakpoint
CREATE INDEX "contact_owner_idx" ON "contacts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "contact_company_idx" ON "contacts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "import_owner_idx" ON "import_jobs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "interview_owner_idx" ON "interviews" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "interview_app_idx" ON "interviews" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "interview_start_idx" ON "interviews" USING btree ("owner_id","start_time");--> statement-breakpoint
CREATE INDEX "notif_owner_idx" ON "notifications" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "notif_dedup_idx" ON "notifications" USING btree ("owner_id","dedup_key");--> statement-breakpoint
CREATE INDEX "offer_owner_idx" ON "offer_details" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "offer_app_idx" ON "offer_details" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "platform_owner_idx" ON "platforms" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "resume_owner_idx" ON "resume_versions" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "task_owner_idx" ON "tasks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "task_due_idx" ON "tasks" USING btree ("owner_id","due_time");--> statement-breakpoint
CREATE INDEX "user_clerk_uidx" ON "user_profiles" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "goal_owner_week_idx" ON "weekly_goals" USING btree ("owner_id","week_start");