import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Enums
export const cuisineEnum = pgEnum("cuisine", ["mexican", "asian", "italian", "american", "seafood", "brewery", "fine_dining", "other"]);
export const neighborhoodEnum = pgEnum("neighborhood", ["downtown", "otay_ranch", "eastlake", "third_avenue", "bayfront", "other"]);
export const priceRangeEnum = pgEnum("price_range", ["$", "$$", "$$$", "$$$$"]);
export const subscriptionLevelEnum = pgEnum("subscription_level", ["free", "basic", "pro", "partner"]);
export const eventCategoryEnum = pgEnum("category", ["arts", "family", "community", "music", "sports", "education", "other"]);
export const amenityCategoryEnum = pgEnum("amenity_category", ["trails", "parks", "water_sports", "nature_center", "other"]);
export const notificationTypeEnum = pgEnum("notification_type", ["alert", "event", "traffic", "emergency", "promotion"]);
export const notificationTargetEnum = pgEnum("target_neighborhood", ["all", "downtown", "otay_ranch", "eastlake", "third_avenue", "bayfront"]);
export const fileTypeEnum = pgEnum("file_type", ["pdf", "image"]);
export const entityTypeEnum = pgEnum("entity_type", ["restaurant", "event", "experience", "amenity"]);
export const eventTypeEnum = pgEnum("event_type", ["view", "click_directions", "click_call", "click_website", "share", "favorite"]);
export const planTypeEnum = pgEnum("plan_type", ["basic", "pro", "partner"]);

/**
 * Tabla de restaurantes con información completa
 */
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameEs: varchar("name_es", { length: 255 }).notNull(),
  cuisine: cuisineEnum("cuisine").notNull(),
  neighborhood: neighborhoodEnum("neighborhood").notNull(),
  address: text("address").notNull(),
  latitude: varchar("latitude", { length: 20 }).notNull(),
  longitude: varchar("longitude", { length: 20 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  phone: varchar("phone", { length: 20 }),
  website: text("website"),
  imageUrl: text("image_url"),
  familyFriendly: boolean("family_friendly").default(false).notNull(),
  priceRange: priceRangeEnum("price_range").default("$$"),
  rating: varchar("rating", { length: 3 }),
  hoursEn: text("hours_en"),
  hoursEs: text("hours_es"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  ownerId: integer("owner_id"), // FK to users table for business owners
  views: integer("views").default(0).notNull(),
  subscriptionLevel: subscriptionLevelEnum("subscription_level").default("free").notNull(),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  videoUrl: text("video_url"), // Video promocional para nivel Pro y Partner
  badges: text("badges"), // JSON array: ["verified", "local_favorite", "video_spotlight"]
  isFeatured: boolean("is_featured").default(false).notNull(), // Aparecer destacado en listados
  sponsoredExperienceId: integer("sponsored_experience_id"), // FK to curated_experiences para patrocinio exclusivo
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

/**
 * Tabla de eventos comunitarios
 */
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleEs: varchar("title_es", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location").notNull(),
  address: text("address"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  category: eventCategoryEnum("category").notNull(),
  imageUrl: text("image_url"),
  website: text("website"),
  isFree: boolean("is_free").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

/**
 * Tabla de experiencias curadas
 */
export const curatedExperiences = pgTable("curated_experiences", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleEs: varchar("title_es", { length: 255 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  imageUrl: text("image_url"),
  duration: varchar("duration", { length: 50 }), // e.g., "3-4 hours"
  parkingTipsEn: text("parking_tips_en"),
  parkingTipsEs: text("parking_tips_es"),
  bestTime: varchar("best_time", { length: 100 }), // e.g., "Friday evening"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type CuratedExperience = typeof curatedExperiences.$inferSelect;
export type InsertCuratedExperience = typeof curatedExperiences.$inferInsert;

/**
 * Tabla de lugares en experiencias curadas (relación muchos a muchos)
 */
export const experienceStops = pgTable("experience_stops", {
  id: serial("id").primaryKey(),
  experienceId: integer("experience_id").notNull(),
  restaurantId: integer("restaurant_id"),
  customLocationEn: varchar("custom_location_en", { length: 255 }),
  customLocationEs: varchar("custom_location_es", { length: 255 }),
  customAddress: text("custom_address"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  orderIndex: integer("order_index").notNull(),
  notesEn: text("notes_en"),
  notesEs: text("notes_es"),
});

export type ExperienceStop = typeof experienceStops.$inferSelect;
export type InsertExperienceStop = typeof experienceStops.$inferInsert;

/**
 * Tabla de amenidades locales
 */
export const amenities = pgTable("amenities", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameEs: varchar("name_es", { length: 255 }).notNull(),
  category: amenityCategoryEnum("category").notNull(),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  address: text("address"),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  imageUrl: text("image_url"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Amenity = typeof amenities.$inferSelect;
export type InsertAmenity = typeof amenities.$inferInsert;

/**
 * Tabla de notificaciones push
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleEs: varchar("title_es", { length: 255 }).notNull(),
  messageEn: text("message_en").notNull(),
  messageEs: text("message_es").notNull(),
  type: notificationTypeEnum("type").notNull(),
  targetNeighborhood: notificationTargetEnum("target_neighborhood").default("all"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull(), // FK to users (admin)
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Tabla de suscripciones a notificaciones
 */
export const notificationSubscriptions = pgTable("notification_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  email: varchar("email", { length: 320 }),
  neighborhood: notificationTargetEnum("neighborhood").default("all"),
  notificationTypes: text("notification_types"), // JSON array of types
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NotificationSubscription = typeof notificationSubscriptions.$inferSelect;
export type InsertNotificationSubscription = typeof notificationSubscriptions.$inferInsert;

/**
 * Tabla de promociones de negocios premium
 */
export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(), // FK to restaurants
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleEs: varchar("title_es", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionEs: text("description_es"),
  imageUrl: text("image_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  views: integer("views").default(0).notNull(),
  clicks: integer("clicks").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Promotion = typeof promotions.$inferSelect;
export type InsertPromotion = typeof promotions.$inferInsert;

/**
 * Tabla de menús de restaurantes
 */
export const menus = pgTable("menus", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(), // FK to restaurants
  title: varchar("title", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(), // URL to PDF or image
  fileType: fileTypeEnum("file_type").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export type Menu = typeof menus.$inferSelect;
export type InsertMenu = typeof menus.$inferInsert;

/**
 * Tabla de eventos de tracking (analytics)
 */
export const trackingEvents = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  userId: integer("user_id"), // Optional, for logged-in users
  sessionId: varchar("session_id", { length: 64 }), // For anonymous tracking
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type InsertTrackingEvent = typeof trackingEvents.$inferInsert;

/**
 * Tabla de suscripciones premium de negocios
 */
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().unique(), // FK to restaurants
  planType: planTypeEnum("plan_type").notNull(),
  priceMonthly: integer("price_monthly").notNull(), // En centavos USD (e.g., 19900 = $199.00)
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  autoRenew: boolean("auto_renew").default(true).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }), // Para integración con Stripe
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Tabla de planes de suscripción (catálogo)
 */
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  planType: planTypeEnum("plan_type").notNull().unique(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  nameEs: varchar("name_es", { length: 100 }).notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionEs: text("description_es").notNull(),
  priceMonthly: integer("price_monthly").notNull(), // En centavos USD
  featuresEn: text("features_en").notNull(), // JSON array de características
  featuresEs: text("features_es").notNull(), // JSON array de características
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;

/**
 * Tabla de impresiones geo-localizadas (marketing "Cerca de Mí")
 */
export const geoImpressions = pgTable("geo_impressions", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(), // FK to restaurants
  userId: integer("user_id"), // Optional
  sessionId: varchar("session_id", { length: 64 }),
  userLatitude: varchar("user_latitude", { length: 20 }).notNull(),
  userLongitude: varchar("user_longitude", { length: 20 }).notNull(),
  distanceMeters: integer("distance_meters").notNull(), // Distancia en metros
  wasClicked: boolean("was_clicked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GeoImpression = typeof geoImpressions.$inferSelect;
export type InsertGeoImpression = typeof geoImpressions.$inferInsert;