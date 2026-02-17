import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Clock, MapPin, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Experiences() {
  const { t, language } = useLanguage();

  const { data: experiences, isLoading } = trpc.experiences.list.useQuery();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Compass className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{t("Curated Experiences", "Experiencias Curadas")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t(
              "Discover themed routes with handpicked locations, parking tips, and insider recommendations",
              "Descubre rutas temáticas con lugares seleccionados, consejos de estacionamiento y recomendaciones locales"
            )}
          </p>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("Loading experiences...", "Cargando experiencias...")}</p>
          </div>
        ) : experiences && experiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {experiences.map((exp) => (
              <Card key={exp.id} className="hover:shadow-xl transition-all border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {t("Curated Route", "Ruta Curada")}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{language === "en" ? exp.titleEn : exp.titleEs}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {language === "en" ? exp.descriptionEn : exp.descriptionEs}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Parking Tips */}
                  {exp.parkingTipsEn && exp.parkingTipsEs && (
                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">
                        {t("🅿️ Parking Tips", "🅿️ Consejos de Estacionamiento")}
                      </p>
                      <p className="text-sm">{language === "en" ? exp.parkingTipsEn : exp.parkingTipsEs}</p>
                    </div>
                  )}

                  {/* Best Time */}
                  {exp.bestTime && (
                    <div className="bg-primary/5 rounded-lg p-3 mb-4">
                      <p className="text-xs font-semibold text-primary mb-1">
                        {t("⏰ Best Time to Visit", "⏰ Mejor Momento para Visitar")}
                      </p>
                      <p className="text-sm">{exp.bestTime}</p>
                    </div>
                  )}

                  <Button
                    variant="default"
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      // Abrir Google Maps con la ubicación de Chula Vista
                      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=Chula+Vista,CA&travelmode=driving`;
                      window.open(mapsUrl, '_blank');
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {t("Start Experience", "Comenzar Experiencia")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t("No experiences available at the moment.", "No hay experiencias disponibles en este momento.")}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">
            {t("Want to suggest a new experience?", "¿Quieres sugerir una nueva experiencia?")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {t(
              "Help us create more curated routes by sharing your favorite local spots and hidden gems",
              "Ayúdanos a crear más rutas curadas compartiendo tus lugares favoritos y joyas ocultas"
            )}
          </p>
          <Button variant="default" size="lg">
            {t("Submit Your Idea", "Enviar Tu Idea")}
          </Button>
        </div>
      </div>
    </div>
  );
}
