import { z } from "zod";
import { paginationQuery } from "../../../common/dto/baseDto.js";

export const createCompanyBody = z.object({
  name: z.string().trim().min(1, "Company name is required").max(200),
  website: z.string().url().max(500).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional(),
});

export const updateCompanyBody = createCompanyBody.partial();

export const listCompaniesQuery = paginationQuery.extend({
  q: z.string().trim().optional(),
});

export type CreateCompanyBody = z.infer<typeof createCompanyBody>;
export type UpdateCompanyBody = z.infer<typeof updateCompanyBody>;
export type ListCompaniesQuery = z.infer<typeof listCompaniesQuery>;