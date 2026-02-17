import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { MapPin, Phone, Globe, Star, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Restaurants() {
  const { t, language } = useLanguage();
  const [cuisine, setCuisine] = useState<string | undefined>();
  const [neighborhood, setNeighborhood] = useState<string | undefined>();
  const [familyFriendly, setFamilyFriendly] = useState<boolean | undefined>();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: restaurants, isLoading } = trpc.restaurants.list.useQuery({
    cuisine,
    neighborhood,
    familyFriendly,
    search: searchQuery || undefined,
  });

  const cuisineOptions = [
    { value: "mexican", labelEn: "Mexican", labelEs: "Mexicana" },
    { value: "asian", labelEn: "Asian", labelEs: "Asiática" },
    { value: "italian", labelEn: "Italian", labelEs: "Italiana" },
    { value: "american", labelEn: "American", labelEs: "Americana" },
    { value: "seafood", labelEn: "Seafood", labelEs: "Mariscos" },
    { value: "brewery", labelEn: "Brewery", labelEs: "Cervecería" },
    { value: "fine_dining", labelEn: "Fine Dining", labelEs: "Alta Cocina" },
  ];

  const neighborhoodOptions = [
    { value: "downtown", labelEn: "Downtown", labelEs: "Centro" },
    { value: "otay_ranch", labelEn: "Otay Ranch", labelEs: "Otay Ranch" },
    { value: "eastlake", labelEn: "Eastlake", labelEs: "Eastlake" },
    { value: "third_avenue", labelEn: "Third Avenue", labelEs: "Third Avenue" },
    { value: "bayfront", labelEn: "Bayfront", labelEs: "Frente a la Bahía" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Restaurants", "Restaurantes")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Discover authentic flavors from Mexican to Asian cuisine",
              "Descubre sabores auténticos desde cocina mexicana hasta asiática"
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder={t("Search restaurants...", "Buscar restaurantes...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cuisine Filter */}
            <Select value={cuisine || "all"} onValueChange={(v) => setCuisine(v === "all" ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("All Cuisines", "Todas las Cocinas")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Cuisines", "Todas las Cocinas")}</SelectItem>
                {cuisineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelEn, option.labelEs)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Neighborhood Filter */}
            <Select value={neighborhood || "all"} onValueChange={(v) => setNeighborhood(v === "all" ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("All Neighborhoods", "Todos los Barrios")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Neighborhoods", "Todos los Barrios")}</SelectItem>
                {neighborhoodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelEn, option.labelEs)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Family Friendly Filter */}
            <Select
              value={familyFriendly === undefined ? "all" : familyFriendly ? "yes" : "no"}
              onValueChange={(v) => setFamilyFriendly(v === "all" ? undefined : v === "yes")}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("All Restaurants", "Todos los Restaurantes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Restaurants", "Todos los Restaurantes")}</SelectItem>
                <SelectItem value="yes">{t("Family Friendly", "Familiar")}</SelectItem>
                <SelectItem value="no">{t("Adults Only", "Solo Adultos")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setCuisine(undefined);
                setNeighborhood(undefined);
                setFamilyFriendly(undefined);
                setSearchQuery("");
              }}
            >
              {t("Clear Filters", "Limpiar Filtros")}
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("Loading restaurants...", "Cargando restaurantes...")}</p>
          </div>
        ) : restaurants && restaurants.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {t(`Found ${restaurants.length} restaurants`, `Se encontraron ${restaurants.length} restaurantes`)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          {language === "en" ? restaurant.nameEn : restaurant.nameEs}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{restaurant.priceRange}</span>
                          {restaurant.rating && (
                            <>
                              <span>•</span>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-primary text-primary mr-1" />
                                <span>{restaurant.rating}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {language === "en" ? restaurant.descriptionEn : restaurant.descriptionEs}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {restaurant.address && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{restaurant.address}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {t("Visit Website", "Visitar Sitio Web")}
                          </a>
                        </div>
                      )}
                    </div>
                    <Link href={`/restaurants/${restaurant.id}`}>
                      <Button variant="default" className="w-full mt-4">
                        {t("View Details", "Ver Detalles")}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("No restaurants found. Try adjusting your filters.", "No se encontraron restaurantes. Intenta ajustar tus filtros.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
