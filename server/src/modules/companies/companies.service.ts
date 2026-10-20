import { and, asc, count, eq, ilike, sql } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { applications, contacts } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { buildPageMeta } from "../../common/utils/apiResponse.js";
import type {
  CreateCompanyBody,
  ListCompaniesQuery,
  UpdateCompanyBody,
} from "./dto/companies.dto.js";
import { companies, normalizeCompanyName, type Company } from "./companies.models.js";

export async function listCompanies(ownerId: string, query: ListCompaniesQuery) {
  const { page, pageSize, q } = query;
  const where = and(
    eq(companies.ownerId, ownerId),
    q ? ilike(companies.name, `%${q}%`) : undefined,
  );

  const [{ total }] = await db
    .select({ total: count() })
    .from(companies)
    .where(where);

  // Company rows with how many applications each has (PRD §10).
  const rows = await db
    .select({
      company: companies,
      applicationCount: sql<number>`(
        select count(*) from ${applications}
        where ${applications.companyId} = ${companies.id}
          and ${applications.ownerId} = ${ownerId}
      )`,
    })
    .from(companies)
    .where(where)
    .orderBy(asc(companies.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const data = rows.map((r) => ({ ...r.company, applicationCount: Number(r.applicationCount) }));
  return { data, meta: buildPageMeta(Number(total), page, pageSize) };
}

export async function getCompanyById(ownerId: string, id: string): Promise<Company> {
  const [row] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.id, id), eq(companies.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Company not found");
  return row;
}

export async function createCompany(ownerId: string, body: CreateCompanyBody): Promise<Company> {
  const [row] = await db
    .insert(companies)
    .values({
      ownerId,
      name: body.name,
      normalizedName: normalizeCompanyName(body.name),
      website: body.website,
      notes: body.notes,
    })
    .returning();
  return row;
}

export async function updateCompany(
  ownerId: string,
  id: string,
  body: UpdateCompanyBody,
): Promise<Company> {
  await getCompanyById(ownerId, id); // ownership + existence
  const [row] = await db
    .update(companies)
    .set({
      ...body,
      ...(body.name ? { normalizedName: normalizeCompanyName(body.name) } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(companies.id, id), eq(companies.ownerId, ownerId)))
    .returning();
  return row;
}

export async function deleteCompany(ownerId: string, id: string): Promise<void> {
  await getCompanyById(ownerId, id);
  // companyId on applications is ON DELETE SET NULL, so applications are preserved.
  await db.transaction(async (tx) => {
    await tx.delete(contacts).where(and(eq(contacts.companyId, id), eq(contacts.ownerId, ownerId)));
    await tx.delete(companies).where(and(eq(companies.id, id), eq(companies.ownerId, ownerId)));
  });
}

/**
 * Reuse an existing company by normalized name, or create one.
 * Reusing an exact normalized match is not "merging distinct companies".
 */
export async function findOrCreateCompany(ownerId: string, name: string): Promise<Company> {
  const normalized = normalizeCompanyName(name);
  const [existing] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.ownerId, ownerId), eq(companies.normalizedName, normalized)))
    .limit(1);
  if (existing) return existing;
  return createCompany(ownerId, { name, website: undefined, notes: undefined });
}