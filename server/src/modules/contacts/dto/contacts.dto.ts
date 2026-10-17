import { z } from "zod";
import { paginationQuery } from "../../../common/dto/baseDto.js";

const emptyToUndef = (v: unknown) => (v === "" ? undefined : v);

export const createContactBody = z.object({
  companyId: z.preprocess(emptyToUndef, z.string().uuid().optional()),
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.preprocess(emptyToUndef, z.string().email().max(200).optional()),
  phone: z.preprocess(emptyToUndef, z.string().max(50).optional()),
  linkedinUrl: z.preprocess(emptyToUndef, z.string().url().max(500).optional()),
  role: z.preprocess(emptyToUndef, z.string().max(150).optional()),
  notes: z.preprocess(emptyToUndef, z.string().max(2000).optional()),
});

export const updateContactBody = z.object({
  companyId: z.preprocess(emptyToUndef, z.string().uuid().nullable().optional()),
  name: z.string().trim().min(1).max(200).optional(),
  email: z.preprocess(emptyToUndef, z.string().email().max(200).nullable().optional()),
  phone: z.preprocess(emptyToUndef, z.string().max(50).nullable().optional()),
  linkedinUrl: z.preprocess(emptyToUndef, z.string().url().max(500).nullable().optional()),
  role: z.preprocess(emptyToUndef, z.string().max(150).nullable().optional()),
  notes: z.preprocess(emptyToUndef, z.string().max(2000).nullable().optional()),
});

export const listContactsQuery = paginationQuery.extend({
  companyId: z.string().uuid().optional(),
  q: z.string().trim().optional(),
});

export type CreateContactBody = z.infer<typeof createContactBody>;
export type UpdateContactBody = z.infer<typeof updateContactBody>;
export type ListContactsQuery = z.infer<typeof listContactsQuery>;