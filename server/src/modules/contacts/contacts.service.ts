import { and, asc, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../common/db/index.js";
import { companies } from "../../common/db/schema.js";
import { ApiError } from "../../common/utils/ApiError.js";
import { buildPageMeta } from "../../common/utils/apiResponse.js";
import type {
  CreateContactBody,
  ListContactsQuery,
  UpdateContactBody,
} from "./dto/contacts.dto.js";
import { contacts, type Contact } from "./contacts.models.js";

async function assertOwnsCompany(ownerId: string, companyId: string) {
  const [row] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(and(eq(companies.id, companyId), eq(companies.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Company not found");
}

export async function listContacts(ownerId: string, query: ListContactsQuery) {
  const { page, pageSize, companyId, q } = query;
  const where = and(
    eq(contacts.ownerId, ownerId),
    companyId ? eq(contacts.companyId, companyId) : undefined,
    q ? or(ilike(contacts.name, `%${q}%`), ilike(contacts.email, `%${q}%`)) : undefined,
  );

  const [{ total }] = await db.select({ total: count() }).from(contacts).where(where);

  const data = await db
    .select()
    .from(contacts)
    .where(where)
    .orderBy(asc(contacts.name))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { data, meta: buildPageMeta(Number(total), page, pageSize) };
}

async function loadOwned(ownerId: string, id: string): Promise<Contact> {
  const [row] = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.ownerId, ownerId)))
    .limit(1);
  if (!row) throw ApiError.notFound("Contact not found");
  return row;
}

export async function getContactById(ownerId: string, id: string) {
  return loadOwned(ownerId, id);
}

export async function createContact(
  ownerId: string,
  body: CreateContactBody,
): Promise<Contact> {
  if (body.companyId) await assertOwnsCompany(ownerId, body.companyId);
  const [row] = await db
    .insert(contacts)
    .values({ ownerId, ...body, companyId: body.companyId ?? null })
    .returning();
  return row;
}

export async function updateContact(
  ownerId: string,
  id: string,
  body: UpdateContactBody,
): Promise<Contact> {
  await loadOwned(ownerId, id);
  if (body.companyId) await assertOwnsCompany(ownerId, body.companyId);
  const [row] = await db
    .update(contacts)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(contacts.id, id), eq(contacts.ownerId, ownerId)))
    .returning();
  return row;
}

export async function deleteContact(ownerId: string, id: string): Promise<void> {
  await loadOwned(ownerId, id);
  await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.ownerId, ownerId)));
}