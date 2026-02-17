import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { MapPin, Calendar, Compass, Sparkles, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Fetch featured data
  const { data: restaurants } = trpc.restaurants.list.useQuery({ familyFriendly: true });
  const { data: events } = trpc.events.list.useQuery({ upcoming: true });
  const { data: experiences } = trpc.experiences.list.useQuery();

  const featuredRestaurants = restaurants?.slice(0, 3) || [];
  const upcomingEvents = events?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {t("Discover Chula Vista", "Descubre Chula Vista")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t(
                "Your complete guide to authentic experiences, restaurants, events, and hidden gems in Chula Vista",
                "Tu guía completa de experiencias auténticas, restaurantes, eventos y joyas ocultas en Chula Vista"
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setLocation("/restaurants")}>
                <MapPin className="w-5 h-5 mr-2" />
                {t("Explore Restaurants", "Explorar Restaurantes")}
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => setLocation("/experiences")}>
                <Compass className="w-5 h-5 mr-2" />
                {t("Curated Experiences", "Experiencias Curadas")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("Everything You Need to Explore", "Todo lo que Necesitas para Explorar")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t("Restaurants", "Restaurantes")}</CardTitle>
                <CardDescription>
                  {t(
                    "Filter by cuisine, neighborhood, and family-friendly options",
                    "Filtra por cocina, barrio y opciones familiares"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/restaurants" className="text-sm font-medium text-primary hover:underline">
                  {t("Browse Directory →", "Ver Directorio →")}
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t("Events", "Eventos")}</CardTitle>
                <CardDescription>
                  {t("Community events, arts, and cultural activities", "Eventos comunitarios, arte y actividades culturales")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/events" className="text-sm font-medium text-primary hover:underline">
                  {t("View Calendar →", "Ver Calendario →")}
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Compass className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t("Curated Experiences", "Experiencias Curadas")}</CardTitle>
                <CardDescription>
                  {t("Themed routes with 3-5 handpicked locations", "Rutas temáticas con 3-5 lugares seleccionados")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/experiences" className="text-sm font-medium text-primary hover:underline">
                  {t("Explore Routes →", "Explorar Rutas →")}
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Sparkles className="w-10 h-10 text-primary mb-2" />
                <CardTitle>{t("Amenities", "Amenidades")}</CardTitle>
                <CardDescription>
                  {t("Trails, parks, water sports, and nature centers", "Senderos, parques, deportes acuáticos y centros de naturaleza")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/amenities" className="text-sm font-medium text-primary hover:underline">
                  {t("Discover More →", "Descubrir Más →")}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {t("Featured Restaurants", "Restaurantes Destacados")}
              </h2>
              <Button variant="outline" onClick={() => setLocation("/restaurants")}>
                {t("View All", "Ver Todos")}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t(restaurant.nameEn, restaurant.nameEs)}
                    </CardTitle>
                    <CardDescription>
                      {t(restaurant.descriptionEn || "", restaurant.descriptionEs || "")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{restaurant.priceRange}</span>
                      <span>{restaurant.rating} ⭐</span>
                    </div>
                    <Link href={`/restaurants/${restaurant.id}`} className="text-sm font-medium text-primary hover:underline">
                      {t("View Details →", "Ver Detalles →")}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">{t("Upcoming Events", "Próximos Eventos")}</h2>
              <Button variant="outline" onClick={() => setLocation("/events")}>
                {t("View All", "Ver Todos")}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{t(event.titleEn, event.titleEs)}</CardTitle>
                    <CardDescription>
                      {new Date(event.startDate).toLocaleDateString()} • {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {t(event.descriptionEn || "", event.descriptionEs || "")}
                    </p>
                    <Link href={`/events/${event.id}`} className="text-sm font-medium text-primary hover:underline">
                      {t("Learn More →", "Saber Más →")}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curated Experiences Preview */}
      {experiences && experiences.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-secondary/10 to-primary/10">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">
              {t("Curated Experiences", "Experiencias Curadas")}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t(
                "Discover themed routes with handpicked locations, parking tips, and insider recommendations",
                "Descubre rutas temáticas con lugares seleccionados, consejos de estacionamiento y recomendaciones locales"
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.slice(0, 4).map((exp) => (
                <Card key={exp.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{t(exp.titleEn, exp.titleEs)}</CardTitle>
                    <CardDescription>{exp.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t(exp.descriptionEn, exp.descriptionEs)}
                    </p>
                    <Button variant="default" className="w-full" onClick={() => setLocation(`/experiences/${exp.slug}`)}>
                      {t("Start Experience →", "Comenzar Experiencia →")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center">
          <Bell className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            {t("Stay Updated", "Mantente Actualizado")}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            {t(
              "Get real-time notifications about city alerts, road closures, and special events",
              "Recibe notificaciones en tiempo real sobre alertas de la ciudad, cierres de carreteras y eventos especiales"
            )}
          </p>
          <Button size="lg" variant="secondary">
            <Bell className="w-5 h-5 mr-2" />
            {t("Subscribe to Notifications", "Suscribirse a Notificaciones")}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/50 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Discover Chula Vista. {t("All rights reserved.", "Todos los derechos reservados.")}</p>
        </div>
      </footer>
    </div>
  );
}
