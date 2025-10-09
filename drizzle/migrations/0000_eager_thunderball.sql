CREATE TABLE `account_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name_ja` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_types_code_unique` ON `account_types` (`code`);--> statement-breakpoint
CREATE TABLE `asset_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`name_ja` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `asset_types_code_unique` ON `asset_types` (`code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` text,
	`image` text,
	`plan_code` text DEFAULT 'FREE' NOT NULL,
	`status` text DEFAULT 'ACTIVE' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `journals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`account_type_id` integer,
	`asset_type_id` integer,
	`base_currency` text DEFAULT 'JPY',
	`name` text,
	`code` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`checked` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`account_type_id`) REFERENCES `account_types`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`asset_type_id`) REFERENCES `asset_types`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `journals_user_created_at_idx` ON `journals` (`user_id`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `journals_user_display_order_idx` ON `journals` (`user_id`,`display_order`);--> statement-breakpoint
CREATE TABLE `trades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`journal_id` integer NOT NULL,
	`side` text NOT NULL,
	`price_value` integer,
	`price_scale` integer,
	`quantity_value` integer,
	`quantity_scale` integer,
	`traded_date` text,
	`reason` text,
	`memo` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`journal_id`) REFERENCES `journals`(`id`) ON UPDATE no action ON DELETE cascade
);
