CREATE TABLE `adminLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`adminId` int NOT NULL,
	`action` varchar(255) NOT NULL,
	`targetUserId` int,
	`targetType` varchar(64),
	`targetId` varchar(255),
	`details` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analyticsEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`eventName` varchar(255) NOT NULL,
	`eventData` json,
	`userAgent` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analyticsEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` varchar(64),
	`targetDate` timestamp,
	`progress` int DEFAULT 0,
	`status` enum('active','completed','abandoned') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habitLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`habitId` int NOT NULL,
	`userId` int NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `habitLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `habits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` varchar(64),
	`emoji` varchar(10),
	`color` varchar(7),
	`frequency` enum('daily','weekly','monthly') DEFAULT 'daily',
	`targetDays` int DEFAULT 7,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `habits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journalEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text,
	`content` text NOT NULL,
	`mood` varchar(32),
	`moodScore` int,
	`tags` json,
	`isPrivate` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journalEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`goalId` int NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`targetDate` timestamp,
	`isCompleted` boolean DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moodLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mood` varchar(32) NOT NULL,
	`moodScore` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moodLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`status` enum('pending','succeeded','failed','canceled','refunded') NOT NULL,
	`description` text,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeCustomerId` varchar(255) NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`tier` enum('free','premium','pro') NOT NULL,
	`status` enum('active','past_due','canceled','expired') NOT NULL,
	`tokensPerMonth` int NOT NULL,
	`currentTokens` int NOT NULL,
	`billingCycleStart` timestamp NOT NULL,
	`billingCycleEnd` timestamp NOT NULL,
	`canceledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` text NOT NULL,
	`description` text NOT NULL,
	`category` varchar(64),
	`status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`assignedTo` int,
	`resolution` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tokenTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('purchase','usage','refund','bonus') NOT NULL,
	`description` text,
	`relatedId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tokenTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `accessibilityMode` enum('default','wcag-aaa','eco-code','neuro-code','dyslexic','no-blue-light') DEFAULT 'default';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionTier` enum('free','premium','pro') DEFAULT 'free';--> statement-breakpoint
ALTER TABLE `users` ADD `tokenBalance` int DEFAULT 5;--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `stripeSubscriptionId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionStatus` enum('active','past_due','canceled','expired') DEFAULT 'active';--> statement-breakpoint
ALTER TABLE `users` ADD `subscriptionEndsAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `preferences` json;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `adminLogs_adminId_idx` ON `adminLogs` (`adminId`);--> statement-breakpoint
CREATE INDEX `adminLogs_targetUserId_idx` ON `adminLogs` (`targetUserId`);--> statement-breakpoint
CREATE INDEX `analyticsEvents_userId_idx` ON `analyticsEvents` (`userId`);--> statement-breakpoint
CREATE INDEX `analyticsEvents_eventName_idx` ON `analyticsEvents` (`eventName`);--> statement-breakpoint
CREATE INDEX `goals_userId_idx` ON `goals` (`userId`);--> statement-breakpoint
CREATE INDEX `habitLogs_habitId_idx` ON `habitLogs` (`habitId`);--> statement-breakpoint
CREATE INDEX `habitLogs_userId_idx` ON `habitLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `habits_userId_idx` ON `habits` (`userId`);--> statement-breakpoint
CREATE INDEX `journalEntries_userId_idx` ON `journalEntries` (`userId`);--> statement-breakpoint
CREATE INDEX `milestones_goalId_idx` ON `milestones` (`goalId`);--> statement-breakpoint
CREATE INDEX `milestones_userId_idx` ON `milestones` (`userId`);--> statement-breakpoint
CREATE INDEX `moodLogs_userId_idx` ON `moodLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `payments_userId_idx` ON `payments` (`userId`);--> statement-breakpoint
CREATE INDEX `subscriptions_userId_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `subscriptions_stripeCustomerId_idx` ON `subscriptions` (`stripeCustomerId`);--> statement-breakpoint
CREATE INDEX `supportTickets_userId_idx` ON `supportTickets` (`userId`);--> statement-breakpoint
CREATE INDEX `supportTickets_status_idx` ON `supportTickets` (`status`);--> statement-breakpoint
CREATE INDEX `tokenTransactions_userId_idx` ON `tokenTransactions` (`userId`);