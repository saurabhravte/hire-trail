DROP INDEX "user_clerk_uidx";--> statement-breakpoint
CREATE UNIQUE INDEX "user_clerk_uidx" ON "user_profiles" USING btree ("clerk_user_id");