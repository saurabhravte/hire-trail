import type { APPLICATION_STATUSES } from "../db/schema.js";

type Status = (typeof APPLICATION_STATUSES)[number];

/** Saved records are never counted as submitted (PRD §7, §16). */
export const SUBMITTED_EXCLUDED: Status[] = ["saved"];

/** A "recorded response" from the employer side. */
export const RESPONDED_STATUSES: Status[] = [
  "interview",
  "offer_received",
  "accepted",
  "rejected",
];

export const REACHED_INTERVIEW: Status[] = ["interview", "offer_received", "accepted"];
export const REACHED_OFFER: Status[] = ["offer_received", "accepted"];