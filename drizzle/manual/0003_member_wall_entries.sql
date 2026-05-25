CREATE TABLE IF NOT EXISTS "member_wall_entries" (
  "id" serial PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "email" varchar(320) NOT NULL,
  "phone" varchar(50),
  "business" varchar(255),
  "location" varchar(180),
  "likesToDo" text,
  "needs" text,
  "connect" text,
  "isPublic" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
