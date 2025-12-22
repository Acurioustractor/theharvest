CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`date` timestamp NOT NULL,
	`time` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	`category` enum('market','community','arts','workshop','music') NOT NULL,
	`description` text NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`submittedBy` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
