export interface AppNotification {
  id: string;
  ownerId: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  type: string;
  title: string;
  body: string | null;
  scheduledTime: string | null;
  dedupKey: string;
  readAt: string | null;
  dismissedAt: string | null;
  createdAt: string;
}