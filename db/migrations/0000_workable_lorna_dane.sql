CREATE TABLE `playlist_videos` (
	`playlist_id` text NOT NULL,
	`video_id` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT '2024-11-08T16:24:16.863Z' NOT NULL,
	`updated_at` text DEFAULT '2024-11-08T16:24:16.863Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `playlists_title_unique` ON `playlists` (`title`);--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT '2024-11-08T16:24:16.864Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_title_unique` ON `tags` (`title`);--> statement-breakpoint
CREATE TABLE `video_tags` (
	`tag_id` text NOT NULL,
	`video_id` text NOT NULL,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Untitled' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`videoUri` text NOT NULL,
	`thumbUri` text NOT NULL,
	`isFavorite` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT '2024-11-08T16:24:16.859Z' NOT NULL,
	`updated_at` text DEFAULT '2024-11-08T16:24:16.862Z' NOT NULL
);