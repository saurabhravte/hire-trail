import { z } from "zod";
import { paginationQuery } from "../../../common/dto/baseDto.js";

export const listNotificationsQuery = paginationQuery.extend({
  unreadOnly: z.enum(["true", "false"]).default("false"),
});

export const updateNotificationBody = z
  .object({
    read: z.boolean().optional(),
    dismissed: z.boolean().optional(),
  })
  .refine((d) => d.read !== undefined || d.dismissed !== undefined, {
    message: "Provide read and/or dismissed",
  });

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuery>;
export type UpdateNotificationBody = z.infer<typeof updateNotificationBody>;