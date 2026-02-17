import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Waves, TreePine, Bike, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Amenities() {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<string | undefined>();

  const { data: amenities, isLoading } = trpc.amenities.list.useQuery({ category });

  const categoryOptions = [
    { value: "trails", labelEn: "Trails", labelEs: "Senderos", icon: TreePine },
    { value: "marina", labelEn: "Marina", labelEs: "Marina", icon: Waves },
    { value: "water_sports", labelEn: "Water Sports", labelEs: "Deportes Acuáticos", icon: Waves },
    { value: "parks", labelEn: "Parks", labelEs: "Parques", icon: TreePine },
    { value: "recreation", labelEn: "Recreation", labelEs: "Recreación", icon: Bike },
    { value: "other", labelEn: "Other", labelEs: "Otro", icon: Sparkles },
  ];

  const getCategoryIcon = (cat: string) => {
    const option = categoryOptions.find((o) => o.value === cat);
    return option ? option.icon : Sparkles;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Local Amenities", "Amenidades Locales")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Explore trails, marinas, water sports, parks, and outdoor recreation in Chula Vista",
              "Explora senderos, marinas, deportes acuáticos, parques y recreación al aire libre en Chula Vista"
            )}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <Select value={category || "all"} onValueChange={(v) => setCategory(v === "all" ? undefined : v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("All Categories", "Todas las Categorías")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Categories", "Todas las Categorías")}</SelectItem>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelEn, option.labelEs)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setCategory(undefined);
              }}
              className="md:col-span-2"
            >
              {t("Clear Filters", "Limpiar Filtros")}
            </Button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-green-600">120+</p>
              <p className="text-sm text-muted-foreground">{t("Miles of Trails", "Millas de Senderos")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="text-sm text-muted-foreground">{t("Marinas", "Marinas")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">{t("Parks & Recreation Areas", "Parques y Áreas de Recreación")}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("Loading amenities...", "Cargando amenidades...")}</p>
          </div>
        ) : amenities && amenities.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {t(`Found ${amenities.length} amenities`, `Se encontraron ${amenities.length} amenidades`)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity) => {
                const IconComponent = getCategoryIcon(amenity.category);
                return (
                  <Card key={amenity.id} className="hover:shadow-lg transition-shadow">
                    {amenity.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={amenity.imageUrl}
                          alt={language === "en" ? amenity.nameEn : amenity.nameEs}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{language === "en" ? amenity.nameEn : amenity.nameEs}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {language === "en" ? amenity.descriptionEn : amenity.descriptionEs}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {amenity.address && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{amenity.address}</span>
                        </div>
                      )}
                      {amenity.website && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(amenity.website!, "_blank")}
                        >
                          {t("Visit Website", "Visitar Sitio Web")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t(
                "No amenities found. Try adjusting your filters.",
                "No se encontraron amenidades. Intenta ajustar tus filtros."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
