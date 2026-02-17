import { getDb } from "../server/db";
import { subscriptionPlans } from "./schema";

async function seedSubscriptionPlans() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to database");
    process.exit(1);
  }

  console.log("Seeding subscription plans...");

  const plans = [
    {
      planType: "basic" as const,
      nameEn: "Basic (Enhanced Listing)",
      nameEs: "Básico (Listado Mejorado)",
      descriptionEn: "Perfect for businesses starting their digital presence in Chula Vista",
      descriptionEs: "Perfecto para negocios que comienzan su presencia digital en Chula Vista",
      priceMonthly: 19900, // $199.00 USD
      featuresEn: JSON.stringify([
        "Verified profile with \"Verified\" badge",
        "5 professional photos",
        "Appear in category searches",
        "Basic analytics dashboard",
        "Business hours and contact info",
        "Customer reviews display"
      ]),
      featuresEs: JSON.stringify([
        "Perfil verificado con insignia \"Verificado\"",
        "5 fotos profesionales",
        "Aparecer en búsquedas por categoría",
        "Dashboard de analytics básico",
        "Horarios y información de contacto",
        "Mostrar reseñas de clientes"
      ]),
      isActive: 1,
      displayOrder: 1,
    },
    {
      planType: "pro" as const,
      nameEn: "Pro (Video Spotlight)",
      nameEs: "Pro (Video Destacado)",
      descriptionEn: "Stand out with professional video and priority placement",
      descriptionEs: "Destácate con video profesional y posicionamiento prioritario",
      priceMonthly: 49900, // $499.00 USD
      featuresEn: JSON.stringify([
        "Everything in Basic plan",
        "30-second professional promotional video",
        "Priority placement in \"Recommended\" section",
        "\"Local Favorite\" badge",
        "Advanced analytics with conversion tracking",
        "Featured in homepage carousel",
        "Social media promotion",
        "Monthly performance report"
      ]),
      featuresEs: JSON.stringify([
        "Todo lo del plan Básico",
        "Video promocional profesional de 30 segundos",
        "Posicionamiento prioritario en sección \"Recomendados\"",
        "Insignia de \"Favorito Local\"",
        "Analytics avanzado con tracking de conversiones",
        "Destacado en carrusel de página principal",
        "Promoción en redes sociales",
        "Reporte mensual de rendimiento"
      ]),
      isActive: 1,
      displayOrder: 2,
    },
    {
      planType: "partner" as const,
      nameEn: "Partner (Complete Experience)",
      nameEs: "Socio (Experiencia Completa)",
      descriptionEn: "Maximum visibility with exclusive sponsorship opportunities",
      descriptionEs: "Máxima visibilidad con oportunidades de patrocinio exclusivo",
      priceMonthly: 99900, // $999.00 USD
      featuresEn: JSON.stringify([
        "Everything in Pro plan",
        "Exclusive sponsorship of a curated experience or category",
        "Featured in monthly newsletter (10,000+ subscribers)",
        "Premium analytics with competitor benchmarking",
        "Dedicated account manager",
        "Custom promotional campaigns",
        "Priority customer support",
        "Quarterly business review meeting",
        "Co-branded content opportunities",
        "Event sponsorship options"
      ]),
      featuresEs: JSON.stringify([
        "Todo lo del plan Pro",
        "Patrocinio exclusivo de experiencia curada o categoría",
        "Destacado en newsletter mensual (10,000+ suscriptores)",
        "Analytics premium con comparación competitiva",
        "Gerente de cuenta dedicado",
        "Campañas promocionales personalizadas",
        "Soporte al cliente prioritario",
        "Reunión trimestral de revisión de negocio",
        "Oportunidades de contenido co-branded",
        "Opciones de patrocinio de eventos"
      ]),
      isActive: 1,
      displayOrder: 3,
    },
  ];

  try {
    // Delete existing plans
    await db.delete(subscriptionPlans);
    
    // Insert new plans
    for (const plan of plans) {
      await db.insert(subscriptionPlans).values(plan);
      console.log(`✓ Created plan: ${plan.nameEn}`);
    }

    console.log("\n✅ Subscription plans seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding subscription plans:", error);
    process.exit(1);
  }
}

seedSubscriptionPlans();
