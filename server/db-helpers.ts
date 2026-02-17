import { and, desc, eq, gte, like, or, sql } from "drizzle-orm";
import {
  amenities,
  curatedExperiences,
  events,
  experienceStops,
  notificationSubscriptions,
  notifications,
  restaurants,
  promotions,
  menus,
  trackingEvents,
  subscriptions,
  subscriptionPlans,
} from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Helpers para restaurantes
 */
export async function getRestaurants(filters?: {
  cuisine?: string;
  neighborhood?: string;
  familyFriendly?: boolean;
  search?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.cuisine) {
    conditions.push(eq(restaurants.cuisine, filters.cuisine as any));
  }

  if (filters?.neighborhood) {
    conditions.push(eq(restaurants.neighborhood, filters.neighborhood as any));
  }

  if (filters?.familyFriendly) {
    conditions.push(eq(restaurants.familyFriendly, 1));
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(restaurants.nameEn, `%${filters.search}%`),
        like(restaurants.nameEs, `%${filters.search}%`),
        like(restaurants.descriptionEn, `%${filters.search}%`),
        like(restaurants.descriptionEs, `%${filters.search}%`)
      )
    );
  }

  const query = db.select().from(restaurants);

  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(desc(restaurants.views));
  }

  return query.orderBy(desc(restaurants.views));
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(restaurants).where(eq(restaurants.id, id)).limit(1);

  if (result.length > 0) {
    // Increment view count
    await db.update(restaurants).set({ views: sql`${restaurants.views} + 1` }).where(eq(restaurants.id, id));
    return result[0];
  }

  return null;
}

export async function getNearbyRestaurants(lat: string, lng: string, radiusKm: number = 5) {
  const db = await getDb();
  if (!db) return [];

  // Simple distance calculation using Haversine formula
  // For production, consider using PostGIS or similar
  const allRestaurants = await db.select().from(restaurants);

  return allRestaurants.filter((restaurant) => {
    const distance = calculateDistance(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(restaurant.latitude),
      parseFloat(restaurant.longitude)
    );
    return distance <= radiusKm;
  });
}

/**
 * Helpers para eventos
 */
export async function getEvents(filters?: { category?: string; upcoming?: boolean; search?: string }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (filters?.category) {
    conditions.push(eq(events.category, filters.category as any));
  }

  if (filters?.upcoming) {
    conditions.push(gte(events.startDate, new Date()));
  }

  if (filters?.search) {
    conditions.push(
      or(
        like(events.titleEn, `%${filters.search}%`),
        like(events.titleEs, `%${filters.search}%`),
        like(events.descriptionEn, `%${filters.search}%`),
        like(events.descriptionEs, `%${filters.search}%`)
      )
    );
  }

  const query = db.select().from(events);

  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(events.startDate);
  }

  return query.orderBy(events.startDate);
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Helpers para experiencias curadas
 */
export async function getCuratedExperiences() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(curatedExperiences).orderBy(curatedExperiences.createdAt);
}

export async function getCuratedExperienceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(curatedExperiences).where(eq(curatedExperiences.slug, slug)).limit(1);

  if (result.length === 0) return null;

  const experience = result[0];

  // Get stops for this experience
  const stops = await db
    .select()
    .from(experienceStops)
    .where(eq(experienceStops.experienceId, experience.id))
    .orderBy(experienceStops.orderIndex);

  // Enrich stops with restaurant data if available
  const enrichedStops = await Promise.all(
    stops.map(async (stop) => {
      if (stop.restaurantId) {
        const restaurant = await getRestaurantById(stop.restaurantId);
        return { ...stop, restaurant };
      }
      return stop;
    })
  );

  return {
    ...experience,
    stops: enrichedStops,
  };
}

/**
 * Helpers para amenidades
 */
export async function getAmenities(category?: string) {
  const db = await getDb();
  if (!db) return [];

  if (category) {
    return db.select().from(amenities).where(eq(amenities.category, category as any));
  }

  return db.select().from(amenities);
}

/**
 * Helpers para notificaciones
 */
export async function getRecentNotifications(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(notifications).orderBy(desc(notifications.sentAt)).limit(limit);
}

export async function createNotificationSubscription(data: {
  userId?: number;
  email?: string;
  neighborhood?: string;
  notificationTypes?: string[];
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notificationSubscriptions).values({
    userId: data.userId,
    email: data.email,
    neighborhood: (data.neighborhood as any) || "all",
    notificationTypes: JSON.stringify(data.notificationTypes || []),
  });

  return result;
}

/**
 * Helper para búsqueda global
 */
export async function globalSearch(query: string) {
  const db = await getDb();
  if (!db) return { restaurants: [], events: [], experiences: [] };

  const [restaurantResults, eventResults, experienceResults] = await Promise.all([
    db
      .select()
      .from(restaurants)
      .where(
        or(
          like(restaurants.nameEn, `%${query}%`),
          like(restaurants.nameEs, `%${query}%`),
          like(restaurants.descriptionEn, `%${query}%`),
          like(restaurants.descriptionEs, `%${query}%`)
        )
      )
      .limit(10),
    db
      .select()
      .from(events)
      .where(
        or(
          like(events.titleEn, `%${query}%`),
          like(events.titleEs, `%${query}%`),
          like(events.descriptionEn, `%${query}%`),
          like(events.descriptionEs, `%${query}%`)
        )
      )
      .limit(10),
    db
      .select()
      .from(curatedExperiences)
      .where(
        or(
          like(curatedExperiences.titleEn, `%${query}%`),
          like(curatedExperiences.titleEs, `%${query}%`),
          like(curatedExperiences.descriptionEn, `%${query}%`),
          like(curatedExperiences.descriptionEs, `%${query}%`)
        )
      )
      .limit(10),
  ]);

  return {
    restaurants: restaurantResults,
    events: eventResults,
    experiences: experienceResults,
  };
}

/**
 * Utility: Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Helpers para analytics y negocios premium
 */

export async function trackEvent(data: {
  entityType: "restaurant" | "event" | "experience" | "amenity";
  entityId: number;
  eventType: "view" | "click_directions" | "click_call" | "click_website" | "share" | "favorite";
  userId?: number;
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(trackingEvents).values(data);
  return { success: true };
}

export async function getRestaurantAnalytics(restaurantId: number, period: "7d" | "30d" | "90d" = "30d") {
  const db = await getDb();
  if (!db) return null;

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get total views
  const viewsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(trackingEvents)
    .where(
      and(
        eq(trackingEvents.entityType, "restaurant"),
        eq(trackingEvents.entityId, restaurantId),
        eq(trackingEvents.eventType, "view"),
        sql`${trackingEvents.createdAt} >= ${startDate.toISOString()}`
      )
    );

  // Get clicks by type
  const clicksResult = await db
    .select({
      eventType: trackingEvents.eventType,
      count: sql<number>`COUNT(*)`,
    })
    .from(trackingEvents)
    .where(
      and(
        eq(trackingEvents.entityType, "restaurant"),
        eq(trackingEvents.entityId, restaurantId),
        sql`${trackingEvents.createdAt} >= ${startDate.toISOString()}`
      )
    )
    .groupBy(trackingEvents.eventType);

  // Get daily views for chart
  const dailyViewsResult = await db
    .select({
      date: sql<string>`DATE(${trackingEvents.createdAt})`,
      count: sql<number>`COUNT(*)`,
    })
    .from(trackingEvents)
    .where(
      and(
        eq(trackingEvents.entityType, "restaurant"),
        eq(trackingEvents.entityId, restaurantId),
        eq(trackingEvents.eventType, "view"),
        sql`${trackingEvents.createdAt} >= ${startDate.toISOString()}`
      )
    )
    .groupBy(sql`DATE(${trackingEvents.createdAt})`)
    .orderBy(sql`DATE(${trackingEvents.createdAt})`);

  return {
    totalViews: viewsResult[0]?.count || 0,
    clicks: clicksResult.reduce((acc, row) => {
      acc[row.eventType] = row.count;
      return acc;
    }, {} as Record<string, number>),
    dailyViews: dailyViewsResult,
  };
}

export async function getRestaurantPromotions(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(promotions)
    .where(eq(promotions.restaurantId, restaurantId))
    .orderBy(desc(promotions.createdAt));
}

export async function createPromotion(data: {
  restaurantId: number;
  titleEn: string;
  titleEs: string;
  descriptionEn?: string;
  descriptionEs?: string;
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(promotions).values(data);
  return result;
}

export async function getRestaurantMenus(restaurantId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(menus)
    .where(eq(menus.restaurantId, restaurantId))
    .orderBy(desc(menus.uploadedAt));
}

export async function uploadMenu(data: {
  restaurantId: number;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "image";
}) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(menus).values(data);
  return result;
}

export async function deleteMenu(menuId: number) {
  const db = await getDb();
  if (!db) return null;

  await db.delete(menus).where(eq(menus.id, menuId));
  return { success: true };
}


/**
 * Helpers para suscripciones
 */
export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, 1))
    .orderBy(subscriptionPlans.displayOrder);
}

export async function getSubscriptionByRestaurantId(restaurantId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.restaurantId, restaurantId))
    .limit(1);

  return result[0] || null;
}

export async function createSubscription(data: {
  restaurantId: number;
  planType: "basic" | "pro" | "partner";
  startDate: string;
  endDate: string;
}) {
  const db = await getDb();
  if (!db) return null;

  // Get plan details
  const plan = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.planType, data.planType))
    .limit(1);

  if (!plan[0]) {
    throw new Error("Plan not found");
  }

  const result = await db.insert(subscriptions).values({
    restaurantId: data.restaurantId,
    planType: data.planType,
    priceMonthly: plan[0].priceMonthly,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    isActive: 1,
    autoRenew: 1,
  });

  // Update restaurant subscription level
  await db
    .update(restaurants)
    .set({
      subscriptionLevel: data.planType,
      subscriptionStartDate: new Date(data.startDate),
      subscriptionEndDate: new Date(data.endDate),
    })
    .where(eq(restaurants.id, data.restaurantId));

  return result;
}
