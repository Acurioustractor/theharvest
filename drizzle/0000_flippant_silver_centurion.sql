DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM ('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "event_category" AS ENUM ('market', 'community', 'arts', 'workshop', 'music');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "event_status" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "business_category" AS ENUM ('markets', 'arts', 'accommodation', 'services', 'food', 'wellness', 'retail', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "business_status" AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"name" varchar(255) NOT NULL,
	"category" "business_category" NOT NULL,
	"description" text NOT NULL,
	"address" varchar(500),
	"phone" varchar(50),
	"email" varchar(320),
	"website" varchar(500),
	"facebook" varchar(500),
	"instagram" varchar(500),
	"imageUrl" varchar(1000),
	"status" "business_status" DEFAULT 'pending' NOT NULL,
	"submittedBy" varchar(255),
	"submitterEmail" varchar(320) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" timestamp NOT NULL,
	"time" varchar(100) NOT NULL,
	"location" varchar(255) NOT NULL,
	"category" "event_category" NOT NULL,
	"description" text NOT NULL,
	"contactEmail" varchar(320) NOT NULL,
	"status" "event_status" DEFAULT 'pending' NOT NULL,
	"submittedBy" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
