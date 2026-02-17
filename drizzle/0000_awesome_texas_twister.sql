CREATE TYPE "public"."amenity_category" AS ENUM('trails', 'parks', 'water_sports', 'nature_center', 'other');--> statement-breakpoint
CREATE TYPE "public"."cuisine" AS ENUM('mexican', 'asian', 'italian', 'american', 'seafood', 'brewery', 'fine_dining', 'other');--> statement-breakpoint
CREATE TYPE "public"."entity_type" AS ENUM('restaurant', 'event', 'experience', 'amenity');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('arts', 'family', 'community', 'music', 'sports', 'education', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('view', 'click_directions', 'click_call', 'click_website', 'share', 'favorite');--> statement-breakpoint
CREATE TYPE "public"."file_type" AS ENUM('pdf', 'image');--> statement-breakpoint
CREATE TYPE "public"."neighborhood" AS ENUM('downtown', 'otay_ranch', 'eastlake', 'third_avenue', 'bayfront', 'other');--> statement-breakpoint
CREATE TYPE "public"."target_neighborhood" AS ENUM('all', 'downtown', 'otay_ranch', 'eastlake', 'third_avenue', 'bayfront');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('alert', 'event', 'traffic', 'emergency', 'promotion');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('basic', 'pro', 'partner');--> statement-breakpoint
CREATE TYPE "public"."price_range" AS ENUM('$', '$$', '$$$', '$$$$');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."subscription_level" AS ENUM('free', 'basic', 'pro', 'partner');--> statement-breakpoint
CREATE TABLE "amenities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_es" varchar(255) NOT NULL,
	"category" "amenity_category" NOT NULL,
	"description_en" text,
	"description_es" text,
	"address" text,
	"latitude" varchar(20),
	"longitude" varchar(20),
	"image_url" text,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "curated_experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_es" varchar(255) NOT NULL,
	"description_en" text NOT NULL,
	"description_es" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"image_url" text,
	"duration" varchar(50),
	"parking_tips_en" text,
	"parking_tips_es" text,
	"best_time" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "curated_experiences_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_es" varchar(255) NOT NULL,
	"description_en" text,
	"description_es" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"location" text NOT NULL,
	"address" text,
	"latitude" varchar(20),
	"longitude" varchar(20),
	"category" "category" NOT NULL,
	"image_url" text,
	"website" text,
	"is_free" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience_stops" (
	"id" serial PRIMARY KEY NOT NULL,
	"experience_id" integer NOT NULL,
	"restaurant_id" integer,
	"custom_location_en" varchar(255),
	"custom_location_es" varchar(255),
	"custom_address" text,
	"latitude" varchar(20),
	"longitude" varchar(20),
	"order_index" integer NOT NULL,
	"notes_en" text,
	"notes_es" text
);
--> statement-breakpoint
CREATE TABLE "geo_impressions" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"user_id" integer,
	"session_id" varchar(64),
	"user_latitude" varchar(20) NOT NULL,
	"user_longitude" varchar(20) NOT NULL,
	"distance_meters" integer NOT NULL,
	"was_clicked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"file_url" text NOT NULL,
	"file_type" "file_type" NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"email" varchar(320),
	"neighborhood" "target_neighborhood" DEFAULT 'all',
	"notification_types" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_es" varchar(255) NOT NULL,
	"message_en" text NOT NULL,
	"message_es" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"target_neighborhood" "target_neighborhood" DEFAULT 'all',
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"created_by" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_es" varchar(255) NOT NULL,
	"description_en" text,
	"description_es" text,
	"image_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_es" varchar(255) NOT NULL,
	"cuisine" "cuisine" NOT NULL,
	"neighborhood" "neighborhood" NOT NULL,
	"address" text NOT NULL,
	"latitude" varchar(20) NOT NULL,
	"longitude" varchar(20) NOT NULL,
	"description_en" text,
	"description_es" text,
	"phone" varchar(20),
	"website" text,
	"image_url" text,
	"family_friendly" boolean DEFAULT false NOT NULL,
	"price_range" "price_range" DEFAULT '$$',
	"rating" varchar(3),
	"hours_en" text,
	"hours_es" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" integer,
	"views" integer DEFAULT 0 NOT NULL,
	"subscription_level" "subscription_level" DEFAULT 'free' NOT NULL,
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"video_url" text,
	"badges" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sponsored_experience_id" integer
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_type" "plan_type" NOT NULL,
	"name_en" varchar(100) NOT NULL,
	"name_es" varchar(100) NOT NULL,
	"description_en" text NOT NULL,
	"description_es" text NOT NULL,
	"price_monthly" integer NOT NULL,
	"features_en" text NOT NULL,
	"features_es" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "subscription_plans_plan_type_unique" UNIQUE("plan_type")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"restaurant_id" integer NOT NULL,
	"plan_type" "plan_type" NOT NULL,
	"price_monthly" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"auto_renew" boolean DEFAULT true NOT NULL,
	"stripe_subscription_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_restaurant_id_unique" UNIQUE("restaurant_id")
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" "entity_type" NOT NULL,
	"entity_id" integer NOT NULL,
	"event_type" "event_type" NOT NULL,
	"user_id" integer,
	"session_id" varchar(64),
	"user_agent" text,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
