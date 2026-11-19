CREATE TABLE `class_admin_invites` (
	`id` varchar(36) NOT NULL,
	`class_id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`status` enum('pending','accepted','revoked') NOT NULL DEFAULT 'pending',
	`invited_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_admin_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `class_admin_invites_email_class_uidx` UNIQUE(`email`,`class_id`)
);
--> statement-breakpoint
CREATE TABLE `class_bans` (
	`class_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_bans_class_id_user_id_pk` PRIMARY KEY(`class_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `class_members` (
	`class_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`role` enum('admin','member') NOT NULL DEFAULT 'member',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `class_members_class_id_user_id_pk` PRIMARY KEY(`class_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `classes` (
	`id` varchar(36) NOT NULL,
	`name` varchar(150) NOT NULL,
	`created_by` varchar(36),
	`status` enum('pending','active','rejected','archived') NOT NULL DEFAULT 'pending',
	`is_listed` boolean NOT NULL DEFAULT true,
	`invite_code` varchar(32),
	`member_limit` int,
	`style` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classes_id` PRIMARY KEY(`id`),
	CONSTRAINT `classes_invite_code_unique` UNIQUE(`invite_code`)
);
--> statement-breakpoint
CREATE TABLE `assignment_reminders` (
	`id` varchar(36) NOT NULL,
	`assignment_id` varchar(36) NOT NULL,
	`remind_at` timestamp NOT NULL,
	`sent_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assignment_reminders_id` PRIMARY KEY(`id`),
	CONSTRAINT `assignment_reminders_assignment_remind_uidx` UNIQUE(`assignment_id`,`remind_at`)
);
--> statement-breakpoint
CREATE TABLE `assignments` (
	`id` varchar(36) NOT NULL,
	`subclass_id` varchar(36) NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text,
	`created_by` varchar(36),
	`due_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` varchar(36) NOT NULL,
	`subclass_id` varchar(36) NOT NULL,
	`uploaded_by` varchar(36),
	`title` varchar(150) NOT NULL,
	`file_url` varchar(2048),
	`link_url` varchar(2048),
	`file_name` varchar(255),
	`file_size` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` varchar(36) NOT NULL,
	`subclass_id` varchar(36) NOT NULL,
	`weekday` int NOT NULL,
	`start_time` time NOT NULL,
	`end_time` time NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schedules_id` PRIMARY KEY(`id`),
	CONSTRAINT `schedules_weekday_check` CHECK(`schedules`.`weekday` BETWEEN 1 AND 7)
);
--> statement-breakpoint
CREATE TABLE `subclass_pj` (
	`subclass_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subclass_pj_subclass_id_user_id_pk` PRIMARY KEY(`subclass_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `subclasses` (
	`id` varchar(36) NOT NULL,
	`class_id` varchar(36) NOT NULL,
	`name` varchar(150) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subclasses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posters` (
	`id` varchar(36) NOT NULL,
	`title` varchar(150) NOT NULL,
	`image_url` varchar(2048) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`endpoint` varchar(512) NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `push_subscriptions_endpoint_uidx` UNIQUE(`endpoint`)
);
--> statement-breakpoint
ALTER TABLE `class_admin_invites` ADD CONSTRAINT `class_admin_invites_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_admin_invites` ADD CONSTRAINT `class_admin_invites_invited_by_users_id_fk` FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_bans` ADD CONSTRAINT `class_bans_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_bans` ADD CONSTRAINT `class_bans_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_members` ADD CONSTRAINT `class_members_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `class_members` ADD CONSTRAINT `class_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignment_reminders` ADD CONSTRAINT `assignment_reminders_assignment_id_assignments_id_fk` FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_subclass_id_subclasses_id_fk` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assignments` ADD CONSTRAINT `assignments_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_subclass_id_subclasses_id_fk` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_subclass_id_subclasses_id_fk` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subclass_pj` ADD CONSTRAINT `subclass_pj_subclass_id_subclasses_id_fk` FOREIGN KEY (`subclass_id`) REFERENCES `subclasses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subclass_pj` ADD CONSTRAINT `subclass_pj_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subclasses` ADD CONSTRAINT `subclasses_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `push_subscriptions` ADD CONSTRAINT `push_subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `class_admin_invites_invited_by_idx` ON `class_admin_invites` (`invited_by`);--> statement-breakpoint
CREATE INDEX `class_bans_user_id_idx` ON `class_bans` (`user_id`);--> statement-breakpoint
CREATE INDEX `class_members_user_id_idx` ON `class_members` (`user_id`);--> statement-breakpoint
CREATE INDEX `classes_created_by_idx` ON `classes` (`created_by`);--> statement-breakpoint
CREATE INDEX `assignment_reminders_remind_at_idx` ON `assignment_reminders` (`remind_at`);--> statement-breakpoint
CREATE INDEX `assignment_reminders_sent_at_idx` ON `assignment_reminders` (`sent_at`);--> statement-breakpoint
CREATE INDEX `assignments_subclass_id_idx` ON `assignments` (`subclass_id`);--> statement-breakpoint
CREATE INDEX `assignments_created_by_idx` ON `assignments` (`created_by`);--> statement-breakpoint
CREATE INDEX `assignments_due_at_idx` ON `assignments` (`due_at`);--> statement-breakpoint
CREATE INDEX `materials_subclass_id_idx` ON `materials` (`subclass_id`);--> statement-breakpoint
CREATE INDEX `materials_uploaded_by_idx` ON `materials` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `schedules_subclass_id_idx` ON `schedules` (`subclass_id`);--> statement-breakpoint
CREATE INDEX `subclass_pj_user_id_idx` ON `subclass_pj` (`user_id`);--> statement-breakpoint
CREATE INDEX `subclasses_class_id_idx` ON `subclasses` (`class_id`);--> statement-breakpoint
CREATE INDEX `push_subscriptions_user_id_idx` ON `push_subscriptions` (`user_id`);