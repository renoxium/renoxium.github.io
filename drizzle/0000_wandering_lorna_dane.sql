CREATE TABLE `craft_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ord` integer NOT NULL,
	`number` text NOT NULL,
	`title` text NOT NULL,
	`meta` text NOT NULL,
	`scene` text NOT NULL,
	`body` text NOT NULL,
	`bullets` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `edge_rows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ord` integer NOT NULL,
	`dimension` text NOT NULL,
	`us` text NOT NULL,
	`them` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ord` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`services_json` text DEFAULT '[]' NOT NULL,
	`budget` text,
	`status` text DEFAULT 'new' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`follow_up_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`referer` text,
	`user_agent` text,
	`country` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
