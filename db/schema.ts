import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

// Contact details and assessment answers only exist in AES-GCM ciphertext.
export const consultationLeads = sqliteTable("consultation_leads", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  source: text("source").notNull(),
  payload: text("payload").notNull(),
  requestHash: text("request_hash").notNull(),
  submitterHash: text("submitter_hash").notNull(),
  reportTokenHash: text("report_token_hash"),
  notificationStatus: text("notification_status").notNull().default("pending"),
  notificationAttempts: integer("notification_attempts").notNull().default(0),
  notificationError: text("notification_error"),
  nextAttemptAt: integer("next_attempt_at"),
  notifiedAt: integer("notified_at"),
}, (table) => [
  uniqueIndex("lead_request_hash_idx").on(table.requestHash),
  index("lead_submitter_time_idx").on(table.submitterHash, table.createdAt),
  index("lead_outbox_idx").on(table.notificationStatus, table.nextAttemptAt),
]);
