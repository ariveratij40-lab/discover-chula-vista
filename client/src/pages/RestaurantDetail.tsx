import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Share2, Navigation, Clock, DollarSign, Users, ChevronLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { MapView } from "@/components/Map";

export default function RestaurantDetail() {
  const { t, language } = useLanguage();
  const [, params] = useRoute("/restaurants/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0", 10);

  const { data: restaurant, isLoading } = trpc.restaurants.getById.useQuery({ id }, { enabled: id > 0 });

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

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("Restaurant not found", "Restaurante no encontrado")}</h1>
          <Button onClick={() => setLocation("/restaurants")}>
            {t("Back to Restaurants", "Volver a Restaurantes")}
          </Button>
        </div>
      </div>
    );
  }

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.address || '')}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "en" ? restaurant.nameEn : restaurant.nameEs,
          text: (language === "en" ? restaurant.descriptionEn : restaurant.descriptionEs) || undefined,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8 max-w-5xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => setLocation("/restaurants")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {t("Back to Restaurants", "Volver a Restaurantes")}
        </Button>

        {/* Hero Image */}
        {restaurant.imageUrl && (
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            <img 
              src={restaurant.imageUrl} 
              alt={language === "en" ? restaurant.nameEn : restaurant.nameEs}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">
                {language === "en" ? restaurant.nameEn : restaurant.nameEs}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{restaurant.cuisine}</Badge>
                <Badge variant="outline">{restaurant.neighborhood}</Badge>
                {restaurant.familyFriendly && (
                  <Badge variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    {t("Family Friendly", "Familiar")}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-lg text-muted-foreground">
            {language === "en" ? restaurant.descriptionEn : restaurant.descriptionEs}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button size="lg" onClick={handleGetDirections} className="w-full">
            <Navigation className="w-5 h-5 mr-2" />
            {t("Get Directions", "Obtener Direcciones")}
          </Button>
          {restaurant.phone && (
            <Button size="lg" variant="outline" className="w-full" asChild>
              <a href={`tel:${restaurant.phone}`}>
                <Phone className="w-5 h-5 mr-2" />
                {t("Call", "Llamar")}
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
                <h2 className="text-2xl font-bold mb-4">{t("Information", "Información")}</h2>
                
                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{t("Address", "Dirección")}</p>
                      <p className="text-muted-foreground">{restaurant.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  {restaurant.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t("Phone", "Teléfono")}</p>
                        <a href={`tel:${restaurant.phone}`} className="text-primary hover:underline">
                          {restaurant.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {restaurant.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t("Website", "Sitio Web")}</p>
                        <a 
                          href={restaurant.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {restaurant.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Hours */}
                  {(restaurant.hoursEn || restaurant.hoursEs) && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t("Hours", "Horario")}</p>
                        <p className="text-muted-foreground">{language === "en" ? restaurant.hoursEn : restaurant.hoursEs}</p>
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  {restaurant.priceRange && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">{t("Price Range", "Rango de Precios")}</p>
                        <p className="text-muted-foreground">{restaurant.priceRange}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">{t("Location", "Ubicación")}</h2>
                <div className="w-full h-80 rounded-lg overflow-hidden">
                  <MapView
                    initialCenter={{
                      lat: parseFloat(restaurant.latitude) || 32.6401,
                      lng: parseFloat(restaurant.longitude) || -117.0842
                    }}
                    initialZoom={15}
                    onMapReady={(map) => {
                      const lat = parseFloat(restaurant.latitude);
                      const lng = parseFloat(restaurant.longitude);
                      
                      if (!isNaN(lat) && !isNaN(lng)) {
                        const position = { lat, lng };
                        
                        new google.maps.marker.AdvancedMarkerElement({
                          map,
                          position,
                          title: language === "en" ? restaurant.nameEn : restaurant.nameEs,
                        });
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="sticky top-4">
              <CardContent className="pt-6">
                <h3 className="font-bold mb-4">{t("Quick Info", "Información Rápida")}</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t("Cuisine", "Cocina")}</p>
                    <p className="font-semibold">{restaurant.cuisine}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t("Neighborhood", "Barrio")}</p>
                    <p className="font-semibold">{restaurant.neighborhood}</p>
                  </div>
                  {restaurant.priceRange && (
                    <div>
                      <p className="text-muted-foreground">{t("Price", "Precio")}</p>
                      <p className="font-semibold">{restaurant.priceRange}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">{t("Family Friendly", "Familiar")}</p>
                    <p className="font-semibold">
                      {restaurant.familyFriendly ? t("Yes", "Sí") : t("No", "No")}
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
