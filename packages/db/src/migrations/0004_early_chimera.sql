ALTER TABLE "question" ADD COLUMN "validated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "question_validated_idx" ON "question" USING btree ("validated");