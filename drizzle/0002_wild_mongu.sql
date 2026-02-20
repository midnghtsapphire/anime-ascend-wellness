CREATE TABLE `emergencyContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` text NOT NULL,
	`phone` varchar(20) NOT NULL,
	`email` varchar(320),
	`relationship` varchar(64),
	`isPrimary` boolean DEFAULT false,
	`notifyOnFall` boolean DEFAULT true,
	`notifyOnArrhythmia` boolean DEFAULT true,
	`notifyOnStress` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emergencyContacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exerciseSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('breathing','grounding','stretching','cardiac_recovery','stress_relief','meditation','progressive_relaxation') NOT NULL,
	`trigger` enum('arrhythmia','stress_episode','fall_recovery','manual','scheduled') DEFAULT 'manual',
	`triggerReadingId` int,
	`duration` int,
	`completedSteps` int DEFAULT 0,
	`totalSteps` int,
	`heartRateBefore` int,
	`heartRateAfter` int,
	`stressBefore` int,
	`stressAfter` int,
	`completed` boolean DEFAULT false,
	`companionMessages` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `exerciseSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fallEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`severity` enum('mild','moderate','severe') DEFAULT 'moderate',
	`accelerometerData` json,
	`gyroscopeData` json,
	`impactForce` decimal(8,2),
	`location` text,
	`alertSent` boolean DEFAULT false,
	`alertedContacts` json,
	`userResponded` boolean DEFAULT false,
	`responseTime` int,
	`falseAlarm` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fallEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `healthAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('arrhythmia','high_heart_rate','low_heart_rate','stress_episode','fall_detected','inactivity') NOT NULL,
	`severity` enum('info','warning','critical') DEFAULT 'warning',
	`message` text NOT NULL,
	`relatedReadingId` int,
	`acknowledged` boolean DEFAULT false,
	`acknowledgedAt` timestamp,
	`emergencyContactsNotified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `healthAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `heartReadings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bpm` int NOT NULL,
	`hrv` decimal(8,2),
	`rhythmStatus` enum('normal','irregular','arrhythmia_detected','tachycardia','bradycardia') DEFAULT 'normal',
	`confidence` decimal(5,2),
	`ppgData` json,
	`duration` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `heartReadings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stressReadings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stressLevel` int NOT NULL,
	`hrvBaseline` decimal(8,2),
	`heartRateAtReading` int,
	`triggers` json,
	`isEpisode` boolean DEFAULT false,
	`episodeDuration` int,
	`exerciseCompleted` boolean DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stressReadings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `emergencyContacts_userId_idx` ON `emergencyContacts` (`userId`);--> statement-breakpoint
CREATE INDEX `exerciseSessions_userId_idx` ON `exerciseSessions` (`userId`);--> statement-breakpoint
CREATE INDEX `exerciseSessions_type_idx` ON `exerciseSessions` (`type`);--> statement-breakpoint
CREATE INDEX `fallEvents_userId_idx` ON `fallEvents` (`userId`);--> statement-breakpoint
CREATE INDEX `fallEvents_severity_idx` ON `fallEvents` (`severity`);--> statement-breakpoint
CREATE INDEX `healthAlerts_userId_idx` ON `healthAlerts` (`userId`);--> statement-breakpoint
CREATE INDEX `healthAlerts_type_idx` ON `healthAlerts` (`type`);--> statement-breakpoint
CREATE INDEX `heartReadings_userId_idx` ON `heartReadings` (`userId`);--> statement-breakpoint
CREATE INDEX `heartReadings_rhythm_idx` ON `heartReadings` (`rhythmStatus`);--> statement-breakpoint
CREATE INDEX `stressReadings_userId_idx` ON `stressReadings` (`userId`);