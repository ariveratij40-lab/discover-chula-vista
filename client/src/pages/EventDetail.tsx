import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Globe, Share2, Navigation, Clock, DollarSign, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { MapView } from "@/components/Map";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function EventDetail() {
  const { t, language } = useLanguage();
  const [, params] = useRoute("/events/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0", 10);

  const { data: event, isLoading } = trpc.events.getById.useQuery({ id }, { enabled: id > 0 });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">{t("Loading...", "Cargando...")}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("Event not found", "Evento no encontrado")}</h1>
          <Button onClick={() => setLocation("/events")}>
            {t("Back to Events", "Volver a Eventos")}
          </Button>
        </div>
      </div>
    );
  }

  const handleGetDirections = () => {
    const destination = event.address || event.location || '';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "en" ? event.titleEn : event.titleEs,
          text: (language === "en" ? event.descriptionEn : event.descriptionEs) || undefined,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert(t("Link copied to clipboard!", "¡Enlace copiado al portapapeles!"));
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "PPP", { locale: language === "es" ? es : undefined });
  };

  const formatTime = (date: Date) => {
    return format(date, "p", { locale: language === "es" ? es : undefined });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-5xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation("/events")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t("Back to Events", "Volver a Eventos")}
        </Button>

        {/* Hero Image */}
        {event.imageUrl && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            <img 
              src={event.imageUrl} 
              alt={language === "en" ? event.titleEn : event.titleEs}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {language === "en" ? event.titleEn : event.titleEs}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{event.category}</Badge>
                {event.isFree === 1 && (
                  <Badge variant="outline">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {t("Free", "Gratis")}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {event.descriptionEn || event.descriptionEs ? (
            <p className="text-lg text-muted-foreground">
              {language === "en" ? event.descriptionEn : event.descriptionEs}
            </p>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {(event.address || event.location) && (
            <Button size="lg" onClick={handleGetDirections} className="w-full">
              <Navigation className="w-5 h-5 mr-2" />
              {t("Get Directions", "Obtener Direcciones")}
            </Button>
          )}
          {event.website && (
            <Button size="lg" variant="outline" className="w-full" asChild>
              <a href={event.website} target="_blank" rel="noopener noreferrer">
                <Globe className="w-5 h-5 mr-2" />
                {t("Visit Website", "Visitar Sitio Web")}
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Information Cards */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">{t("Event Details", "Detalles del Evento")}</h2>
                
                <div className="space-y-4">
                  {/* Date and Time */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{t("Date & Time", "Fecha y Hora")}</p>
                      <p className="text-muted-foreground">
                        {formatDate(new Date(event.startDate))}
                      </p>
                      <p className="text-muted-foreground">
                        {formatTime(new Date(event.startDate))}
                        {event.endDate && ` - ${formatTime(new Date(event.endDate))}`}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{t("Location", "Ubicación")}</p>
                      <p className="text-muted-foreground">{event.location}</p>
                      {event.address && event.address !== event.location && (
                        <p className="text-sm text-muted-foreground">{event.address}</p>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  {event.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t("Website", "Sitio Web")}</p>
                        <a 
                          href={event.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {event.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{t("Price", "Precio")}</p>
                      <p className="text-muted-foreground">
                        {event.isFree === 1 ? t("Free", "Gratis") : t("Check website for pricing", "Consultar sitio web para precios")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {event.latitude && event.longitude && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">{t("Location", "Ubicación")}</h2>
                  <div className="w-full h-80 rounded-lg overflow-hidden">
                    <MapView
                      initialCenter={{
                        lat: parseFloat(event.latitude) || 32.6401,
                        lng: parseFloat(event.longitude) || -117.0842
                      }}
                      initialZoom={15}
                      onMapReady={(map) => {
                        const lat = parseFloat(event.latitude || "0");
                        const lng = parseFloat(event.longitude || "0");
                        
                        if (!isNaN(lat) && !isNaN(lng)) {
                          const position = { lat, lng };
                          
                          new google.maps.marker.AdvancedMarkerElement({
                            map,
                            position,
                            title: language === "en" ? event.titleEn : event.titleEs,
                          });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">{t("Quick Info", "Información Rápida")}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("Category", "Categoría")}</p>
                    <p className="font-semibold capitalize">{event.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("Date", "Fecha")}</p>
                    <p className="font-semibold">{formatDate(new Date(event.startDate))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("Time", "Hora")}</p>
                    <p className="font-semibold">{formatTime(new Date(event.startDate))}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("Price", "Precio")}</p>
                    <p className="font-semibold">
                      {event.isFree === 1 ? t("Free", "Gratis") : t("Paid", "De pago")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
