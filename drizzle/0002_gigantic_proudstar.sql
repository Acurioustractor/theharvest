CREATE TABLE `businesses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('markets','arts','accommodation','services','food','wellness','retail','other') NOT NULL,
	`description` text NOT NULL,
	`address` varchar(500),
	`phone` varchar(50),
	`email` varchar(320),
	`website` varchar(500),
	`facebook` varchar(500),
	`instagram` varchar(500),
	`imageUrl` varchar(1000),
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`submittedBy` varchar(255),
	`submitterEmail` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businesses_id` PRIMARY KEY(`id`)
);
