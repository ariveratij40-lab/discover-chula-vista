import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Sparkles } from "lucide-react";

export default function MapPage() {
  const { t, language } = useLanguage();
  const [selectedType, setSelectedType] = useState<"all" | "restaurants" | "events" | "amenities">("all");

  // Fetch data
  const { data: restaurants } = trpc.restaurants.list.useQuery({});
  const { data: events } = trpc.events.list.useQuery({ upcoming: true });
  const { data: amenities } = trpc.amenities.list.useQuery();

  // Convert data to markers
  const restaurantMarkers = (restaurants || [])
    .filter((r) => r.latitude && r.longitude)
    .map((r) => ({
      id: r.id,
      lat: parseFloat(r.latitude!),
      lng: parseFloat(r.longitude!),
      title: language === "en" ? r.nameEn : r.nameEs,
      description: language === "en" ? r.descriptionEn || undefined : r.descriptionEs || undefined,
      type: "restaurant" as const,
      address: r.address || undefined,
    }));

  const eventMarkers = (events || [])
    .filter((e) => e.latitude && e.longitude)
    .map((e) => ({
      id: e.id,
      lat: parseFloat(e.latitude!),
      lng: parseFloat(e.longitude!),
      title: language === "en" ? e.titleEn : e.titleEs,
      description: language === "en" ? e.descriptionEn || undefined : e.descriptionEs || undefined,
      type: "event" as const,
      address: e.location || undefined,
    }));

  const amenityMarkers = (amenities || [])
    .filter((a) => a.latitude && a.longitude)
    .map((a) => ({
      id: a.id,
      lat: parseFloat(a.latitude!),
      lng: parseFloat(a.longitude!),
      title: language === "en" ? a.nameEn : a.nameEs,
      description: language === "en" ? a.descriptionEn || undefined : a.descriptionEs || undefined,
      type: "amenity" as const,
      address: a.address || undefined,
    }));

  // Filter markers based on selected type
  const getFilteredMarkers = () => {
    switch (selectedType) {
      case "restaurants":
        return restaurantMarkers;
      case "events":
        return eventMarkers;
      case "amenities":
        return amenityMarkers;
      default:
        return [...restaurantMarkers, ...eventMarkers, ...amenityMarkers];
    }
  };

  const filteredMarkers = getFilteredMarkers();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{t("Interactive Map", "Mapa Interactivo")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Explore restaurants, events, and amenities across Chula Vista",
              "Explora restaurantes, eventos y amenidades en Chula Vista"
            )}
          </p>
        </div>

        {/* Filters */}
        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as typeof selectedType)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              <MapPin className="w-4 h-4 mr-2" />
              {t("All", "Todos")}
            </TabsTrigger>
            <TabsTrigger value="restaurants">
              <MapPin className="w-4 h-4 mr-2" />
              {t("Restaurants", "Restaurantes")} ({restaurantMarkers.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              {t("Events", "Eventos")} ({eventMarkers.length})
            </TabsTrigger>
            <TabsTrigger value="amenities">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("Amenities", "Amenidades")} ({amenityMarkers.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Map */}
        <Card>
          <CardContent className="p-0">
            {filteredMarkers.length > 0 ? (
              <InteractiveMap markers={filteredMarkers} height="calc(100vh - 350px)" zoom={12} />
            ) : (
              <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                {t("No locations to display on the map", "No hay ubicaciones para mostrar en el mapa")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{restaurantMarkers.length}</p>
                  <p className="text-sm text-muted-foreground">{t("Restaurants", "Restaurantes")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{eventMarkers.length}</p>
                  <p className="text-sm text-muted-foreground">{t("Events", "Eventos")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{amenityMarkers.length}</p>
                  <p className="text-sm text-muted-foreground">{t("Amenities", "Amenidades")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
