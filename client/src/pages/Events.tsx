import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, DollarSign, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Events() {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [upcoming, setUpcoming] = useState<boolean>(true);

  const { data: events, isLoading } = trpc.events.list.useQuery({
    category,
    search: searchQuery || undefined,
    upcoming,
  });

  const categoryOptions = [
    { value: "arts", labelEn: "Arts", labelEs: "Arte" },
    { value: "family", labelEn: "Family", labelEs: "Familia" },
    { value: "community", labelEn: "Community", labelEs: "Comunidad" },
    { value: "music", labelEn: "Music", labelEs: "Música" },
    { value: "sports", labelEn: "Sports", labelEs: "Deportes" },
    { value: "education", labelEn: "Education", labelEs: "Educación" },
    { value: "other", labelEn: "Other", labelEs: "Otro" },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === "en" ? "en-US" : "es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(language === "en" ? "en-US" : "es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Events", "Eventos")}</h1>
          <p className="text-muted-foreground">
            {t(
              "Discover community events, arts, and cultural activities in Chula Vista",
              "Descubre eventos comunitarios, arte y actividades culturales en Chula Vista"
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
                  placeholder={t("Search events...", "Buscar eventos...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

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

            {/* Time Filter */}
            <Select value={upcoming ? "upcoming" : "all"} onValueChange={(v) => setUpcoming(v === "upcoming")}>
              <SelectTrigger>
                <SelectValue placeholder={t("All Events", "Todos los Eventos")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">{t("Upcoming Events", "Próximos Eventos")}</SelectItem>
                <SelectItem value="all">{t("All Events", "Todos los Eventos")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setCategory(undefined);
                setSearchQuery("");
                setUpcoming(true);
              }}
              className="md:col-span-2"
            >
              {t("Clear Filters", "Limpiar Filtros")}
            </Button>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("Loading events...", "Cargando eventos...")}</p>
          </div>
        ) : events && events.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {t(`Found ${events.length} events`, `Se encontraron ${events.length} eventos`)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  {event.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={event.imageUrl}
                        alt={language === "en" ? event.titleEn : event.titleEs}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {language === "en" ? event.titleEn : event.titleEs}
                        </CardTitle>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>{formatTime(event.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                          {event.isFree === 1 && (
                            <div className="flex items-center gap-2 text-green-600">
                              <DollarSign className="w-4 h-4 flex-shrink-0" />
                              <span className="font-medium">{t("Free Event", "Evento Gratuito")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3 mb-4">
                      {language === "en" ? event.descriptionEn : event.descriptionEs}
                    </CardDescription>
                    <Link href={`/events/${event.id}`}>
                      <Button variant="default" className="w-full">
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
              {t("No events found. Try adjusting your filters.", "No se encontraron eventos. Intenta ajustar tus filtros.")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
