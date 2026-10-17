import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications, companies } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import type { CompareQuery, CreateOfferBody, UpdateOfferBody } from "./dto/offers.dto.js";
import { offerDetails, type OfferDetails } from "./offers.models.js";

const MONEY_KEYS = ["basePay", "variablePay", "bonus"] as const;

function serialize(row: OfferDetails & { companyName?: string | null; role?: string | null }) {
  return {
    ...row,
    basePay: row.basePay == null ? null : Number(row.basePay),
    variablePay: row.variablePay == null ? null : Number(row.variablePay),
    bonus: row.bonus == null ? null : Number(row.bonus),
  };
}

async function assertOwnsApplication(ownerId: string, applicationId: string) {
  const [row] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Application not found");
}

function toMoneyStrings(body: Partial<CreateOfferBody>) {
  const out: Record<string, unknown> = { ...body };
  for (const key of MONEY_KEYS) {
    if (key in out) {
      const v = out[key] as number | null | undefined;
      out[key] = v == null ? null : String(v);
    }
  }
  return out;
}

export async function listOffers(ownerId: string) {
  const rows = await db
    .select({ offer: offerDetails, companyName: companies.name, role: applications.role })
    .from(offerDetails)
    .innerJoin(applications, eq(offerDetails.applicationId, applications.id))
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(eq(offerDetails.ownerId, ownerId));
  return rows.map((r) => serialize({ ...r.offer, companyName: r.companyName, role: r.role }));
}

export async function compareOffers(ownerId: string, query: CompareQuery) {
  const rows = await db
    .select({ offer: offerDetails, companyName: companies.name, role: applications.role })
    .from(offerDetails)
    .innerJoin(applications, eq(offerDetails.applicationId, applications.id))
    .leftJoin(companies, eq(applications.companyId, companies.id))
    .where(and(eq(offerDetails.ownerId, ownerId), inArray(offerDetails.id, query.ids)));

  const offers = rows.map((r) =>
    serialize({ ...r.offer, companyName: r.companyName, role: r.role }),
  );

  const currencies = new Set(offers.map((o) => o.currency ?? ""));
  const periods = new Set(offers.map((o) => o.payPeriod ?? ""));
  const comparable =
    offers.length > 0 &&
    currencies.size === 1 &&
    !currencies.has("") &&
    periods.size === 1 &&
    !periods.has("");

  return { offers, comparable };
}

export async function createOffer(ownerId: string, body: CreateOfferBody): Promise<OfferDetails> {
  await assertOwnsApplication(ownerId, body.applicationId);

  const [existing] = await db
    .select({ id: offerDetails.id })
    .from(offerDetails)
    .where(
      and(
        eq(offerDetails.ownerId, ownerId),
        eq(offerDetails.applicationId, body.applicationId),
      ),
    )
    .limit(1);
  if (existing) {
    throw ApiError.badRequest("An offer already exists for this application; update it instead");
  }

  const [row] = await db
    .insert(offerDetails)
    .values({ ownerId, ...(toMoneyStrings(body) as typeof offerDetails.$inferInsert) })
    .returning();
  return serialize(row);
}

export async function updateOffer(
  ownerId: string,
  id: string,
  body: UpdateOfferBody,
): Promise<OfferDetails> {
  const [existing] = await db
    .select()
    .from(offerDetails)
    .where(and(eq(offerDetails.id, id), eq(offerDetails.ownerId, ownerId)))
    .limit(1);
  if (!existing) throw ApiError.notFound("Offer not found");

  const [row] = await db
    .update(offerDetails)
    .set({ ...toMoneyStrings(body), updatedAt: new Date() })
    .where(and(eq(offerDetails.id, id), eq(offerDetails.ownerId, ownerId)))
    .returning();
  return serialize(row);
}

export async function deleteOffer(ownerId: string, id: string): Promise<void> {
  const [existing] = await db
    .select({ id: offerDetails.id })
    .from(offerDetails)
    .where(and(eq(offerDetails.id, id), eq(offerDetails.ownerId, ownerId)))
    .limit(1);
  if (!existing) throw ApiError.notFound("Offer not found");
  await db.delete(offerDetails).where(and(eq(offerDetails.id, id), eq(offerDetails.ownerId, ownerId)));
}