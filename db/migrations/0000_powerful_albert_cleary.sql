CREATE TABLE `playlist_videos` (
	`playlist_id` text NOT NULL,
	`video_id` text NOT NULL,
	`order` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`playlist_id`) REFERENCES `playlists`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`video_id`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `playlist_videos_playlist_id_video_id_unique` ON `playlist_videos` (`playlist_id`,`video_id`);--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT '2024-11-12T18:34:00.577Z' NOT NULL,
	`updated_at` text DEFAULT '2024-11-12T18:34:00.577Z' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `playlists_title_unique` ON `playlists` (`title`);--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Untitled' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`videoUri` text NOT NULL,
	`thumbUri` text NOT NULL,
	`isFavorite` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT '2024-11-12T18:34:00.574Z' NOT NULL,
	`updated_at` text DEFAULT '2024-11-12T18:34:00.576Z' NOT NULL
);