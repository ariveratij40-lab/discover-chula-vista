import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Restaurants router
  restaurants: router({
    list: publicProcedure
      .input(
        z
          .object({
            cuisine: z.string().optional(),
            neighborhood: z.string().optional(),
            familyFriendly: z.boolean().optional(),
            search: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const { getRestaurants } = await import("./db-helpers");
        return getRestaurants(input);
      }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getRestaurantById } = await import("./db-helpers");
      return getRestaurantById(input.id);
    }),
    getNearby: publicProcedure
      .input(
        z.object({
          latitude: z.string(),
          longitude: z.string(),
          radiusKm: z.number().default(5),
        })
      )
      .query(async ({ input }) => {
        const { getNearbyRestaurants } = await import("./db-helpers");
        return getNearbyRestaurants(input.latitude, input.longitude, input.radiusKm);
      }),
  }),

  // Events router
  events: router({
    list: publicProcedure
      .input(
        z
          .object({
            category: z.string().optional(),
            upcoming: z.boolean().optional(),
            search: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const { getEvents } = await import("./db-helpers");
        return getEvents(input);
      }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      const { getEventById } = await import("./db-helpers");
      return getEventById(input.id);
    }),
  }),

  // Curated Experiences router
  experiences: router({
    list: publicProcedure.query(async () => {
      const { getCuratedExperiences } = await import("./db-helpers");
      return getCuratedExperiences();
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const { getCuratedExperienceBySlug } = await import("./db-helpers");
      return getCuratedExperienceBySlug(input.slug);
    }),
  }),

  // Amenities router
  amenities: router({
    list: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(async ({ input }) => {
      const { getAmenities } = await import("./db-helpers");
      return getAmenities(input?.category);
    }),
  }),

  // Notifications router
  notifications: router({
    recent: publicProcedure.input(z.object({ limit: z.number().default(10) }).optional()).query(async ({ input }) => {
      const { getRecentNotifications } = await import("./db-helpers");
      return getRecentNotifications(input?.limit);
    }),
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          neighborhood: z.string().optional(),
          notificationTypes: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { createNotificationSubscription } = await import("./db-helpers");
        return createNotificationSubscription({
          userId: ctx.user?.id,
          email: input.email,
          neighborhood: input.neighborhood,
          notificationTypes: input.notificationTypes,
        });
      }),
  }),

  // Global search router
  search: router({
    global: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
      const { globalSearch } = await import("./db-helpers");
      return globalSearch(input.query);
    }),
  }),

  // Business Premium router (for restaurant owners)
  business: router({
    // Get analytics for a restaurant
    getAnalytics: publicProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          period: z.enum(["7d", "30d", "90d"]).default("30d"),
        })
      )
      .query(async ({ input }) => {
        const { getRestaurantAnalytics } = await import("./db-helpers");
        return getRestaurantAnalytics(input.restaurantId, input.period);
      }),

    // Track an event (view, click, etc.)
    trackEvent: publicProcedure
      .input(
        z.object({
          entityType: z.enum(["restaurant", "event", "experience", "amenity"]),
          entityId: z.number(),
          eventType: z.enum(["view", "click_directions", "click_call", "click_website", "share", "favorite"]),
          sessionId: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { trackEvent } = await import("./db-helpers");
        return trackEvent({
          ...input,
          userId: ctx.user?.id,
          userAgent: ctx.req.headers["user-agent"],
          ipAddress: ctx.req.ip || ctx.req.headers["x-forwarded-for"] as string,
        });
      }),

    // Get promotions for a restaurant
    getPromotions: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        const { getRestaurantPromotions } = await import("./db-helpers");
        return getRestaurantPromotions(input.restaurantId);
      }),

    // Create a new promotion
    createPromotion: publicProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          titleEn: z.string(),
          titleEs: z.string(),
          descriptionEn: z.string().optional(),
          descriptionEs: z.string().optional(),
          imageUrl: z.string().optional(),
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createPromotion } = await import("./db-helpers");
        return createPromotion({
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        });
      }),

    // Get menus for a restaurant
    getMenus: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        const { getRestaurantMenus } = await import("./db-helpers");
        return getRestaurantMenus(input.restaurantId);
      }),

    // Upload a menu
    uploadMenu: publicProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          title: z.string(),
          fileUrl: z.string(),
          fileType: z.enum(["pdf", "image"]),
        })
      )
      .mutation(async ({ input }) => {
        const { uploadMenu } = await import("./db-helpers");
        return uploadMenu(input);
      }),

    // Delete a menu
    deleteMenu: publicProcedure
      .input(z.object({ menuId: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteMenu } = await import("./db-helpers");
        return deleteMenu(input.menuId);
      }),
  }),

  // Subscriptions router
  subscriptions: router({
    // Get all subscription plans
    getPlans: publicProcedure.query(async () => {
      const { getSubscriptionPlans } = await import("./db-helpers");
      return getSubscriptionPlans();
    }),

    // Get subscription by restaurant ID
    getByRestaurantId: publicProcedure
      .input(z.object({ restaurantId: z.number() }))
      .query(async ({ input }) => {
        const { getSubscriptionByRestaurantId } = await import("./db-helpers");
        return getSubscriptionByRestaurantId(input.restaurantId);
      }),

    // Create a new subscription
    create: publicProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          planType: z.enum(["basic", "pro", "partner"]),
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { createSubscription } = await import("./db-helpers");
        return createSubscription(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
