import { api } from "@/lib/api-client";
import type { Platform } from "../types";

export const platformsService = {
  list: () => api.get<Platform[]>("/platforms"),
};