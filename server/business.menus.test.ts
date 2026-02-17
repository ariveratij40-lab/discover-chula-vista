import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { restaurants, menus } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

describe("Business Menus Management", () => {
  let testRestaurantId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");

    // Get or create a test restaurant
    const existingRestaurants = await db.select().from(restaurants).limit(1);
    if (existingRestaurants.length > 0) {
      testRestaurantId = existingRestaurants[0].id;
    } else {
      const result = await db.insert(restaurants).values({
        nameEn: "Test Restaurant",
        nameEs: "Restaurante de Prueba",
        descriptionEn: "Test description",
        descriptionEs: "Descripción de prueba",
        cuisine: "mexican",
        priceRange: "$$",
        address: "123 Test St",
        neighborhood: "downtown",
        phone: "619-555-0100",
        website: "https://test.com",
        latitude: "32.6401",
        longitude: "-117.0842",
        familyFriendly: 1,
        photos: JSON.stringify([]),
        hours: JSON.stringify({}),
        rating: 4.5,
        views: 0,
      });
      testRestaurantId = Number(result.insertId);
    }
  });

  afterAll(async () => {
    // Clean up test menus
    const db = await getDb();
    if (!db) return;

    try {
      const testMenus = await db
        .select()
        .from(menus)
        .where(eq(menus.restaurantId, testRestaurantId));

      for (const menu of testMenus) {
        if (menu.title.includes("Test") || menu.title.includes("Breakfast") || menu.title.includes("Dinner")) {
          await db.delete(menus).where(eq(menus.id, menu.id));
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it("should upload a menu and retrieve it", async () => {
    const caller = appRouter.createCaller({});
    
    // Upload a menu
    await caller.business.uploadMenu({
      restaurantId: testRestaurantId,
      title: "Test Menu Upload",
      fileUrl: "https://example.com/test-menu.pdf",
      fileType: "pdf",
    });

    // Retrieve menus for the restaurant
    const retrievedMenus = await caller.business.getMenus({
      restaurantId: testRestaurantId,
    });

    expect(retrievedMenus).toBeDefined();
    expect(Array.isArray(retrievedMenus)).toBe(true);
    
    const uploadedMenu = retrievedMenus.find((m) => m.title === "Test Menu Upload");
    expect(uploadedMenu).toBeDefined();
    expect(uploadedMenu?.fileType).toBe("pdf");
    expect(uploadedMenu?.fileUrl).toBe("https://example.com/test-menu.pdf");
    expect(uploadedMenu?.restaurantId).toBe(testRestaurantId);
  });

  it("should delete a menu", async () => {
    const caller = appRouter.createCaller({});
    
    // Upload a menu to delete
    await caller.business.uploadMenu({
      restaurantId: testRestaurantId,
      title: "Menu to Delete Test",
      fileUrl: "https://example.com/delete-me.pdf",
      fileType: "pdf",
    });

    // Get the menu we just created
    const menusBeforeDelete = await caller.business.getMenus({
      restaurantId: testRestaurantId,
    });
    
    const menuToDelete = menusBeforeDelete.find((m) => m.title === "Menu to Delete Test");
    expect(menuToDelete).toBeDefined();
    
    if (!menuToDelete) {
      throw new Error("Menu not found");
    }

    // Delete the menu
    const deleteResult = await caller.business.deleteMenu({
      menuId: menuToDelete.id,
    });

    expect(deleteResult).toBeDefined();
    expect(deleteResult.success).toBe(true);

    // Verify menu was deleted
    const menusAfterDelete = await caller.business.getMenus({
      restaurantId: testRestaurantId,
    });

    const deletedMenu = menusAfterDelete.find((m) => m.id === menuToDelete.id);
    expect(deletedMenu).toBeUndefined();
  });

  it("should handle multiple menus for the same restaurant", async () => {
    const caller = appRouter.createCaller({});
    
    // Upload multiple menus
    await caller.business.uploadMenu({
      restaurantId: testRestaurantId,
      title: "Breakfast Menu Test",
      fileUrl: "https://example.com/breakfast.pdf",
      fileType: "pdf",
    });

    await caller.business.uploadMenu({
      restaurantId: testRestaurantId,
      title: "Dinner Menu Test",
      fileUrl: "https://example.com/dinner.jpg",
      fileType: "image",
    });

    const allMenus = await caller.business.getMenus({
      restaurantId: testRestaurantId,
    });

    const breakfastMenu = allMenus.find((m) => m.title === "Breakfast Menu Test");
    const dinnerMenu = allMenus.find((m) => m.title === "Dinner Menu Test");
    
    expect(breakfastMenu).toBeDefined();
    expect(breakfastMenu?.fileType).toBe("pdf");
    expect(breakfastMenu?.fileUrl).toBe("https://example.com/breakfast.pdf");
    
    expect(dinnerMenu).toBeDefined();
    expect(dinnerMenu?.fileType).toBe("image");
    expect(dinnerMenu?.fileUrl).toBe("https://example.com/dinner.jpg");
  });


});
