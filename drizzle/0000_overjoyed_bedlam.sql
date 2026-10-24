CREATE TABLE `consultation_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`source` text NOT NULL,
	`payload` text NOT NULL,
	`request_hash` text NOT NULL,
	`submitter_hash` text NOT NULL,
	`report_token_hash` text,
	`notification_status` text DEFAULT 'pending' NOT NULL,
	`notification_attempts` integer DEFAULT 0 NOT NULL,
	`notification_error` text,
	`next_attempt_at` integer,
	`notified_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `lead_request_hash_idx` ON `consultation_leads` (`request_hash`);--> statement-breakpoint
CREATE INDEX `lead_submitter_time_idx` ON `consultation_leads` (`submitter_hash`,`created_at`);--> statement-breakpoint
CREATE INDEX `lead_outbox_idx` ON `consultation_leads` (`notification_status`,`next_attempt_at`);