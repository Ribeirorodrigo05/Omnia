CREATE TYPE "public"."category_type" AS ENUM('folder', 'list', 'initiative');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(50) DEFAULT 'folder' NOT NULL,
	"type" "category_type" NOT NULL,
	"space_id" uuid NOT NULL,
	"folder_id" uuid,
	"creator_id" text NOT NULL,
	"started_at" timestamp,
	"ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
DROP TABLE "folders" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_space_id_spaces_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."spaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "categories_id_idx" ON "categories" USING btree ("id");--> statement-breakpoint
CREATE INDEX "categories_space_id_idx" ON "categories" USING btree ("space_id");--> statement-breakpoint
CREATE INDEX "categories_folder_id_idx" ON "categories" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "categories_creator_id_idx" ON "categories" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "categories_type_idx" ON "categories" USING btree ("type");