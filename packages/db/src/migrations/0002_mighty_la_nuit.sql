CREATE TABLE "difficulty" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" integer NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "difficulty_name_unique" UNIQUE("name"),
	CONSTRAINT "difficulty_level_unique" UNIQUE("level")
);
--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "difficulty_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_difficulty_id_difficulty_id_fk" FOREIGN KEY ("difficulty_id") REFERENCES "public"."difficulty"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "question_difficulty_id_idx" ON "question" USING btree ("difficulty_id");--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN "difficulty";