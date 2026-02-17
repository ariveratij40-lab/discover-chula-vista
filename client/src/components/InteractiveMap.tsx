import { useEffect, useRef, useState } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MapMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: "restaurant" | "event" | "amenity";
  address?: string;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (marker: MapMarker) => void;
}

export function InteractiveMap({ markers, center, zoom = 12, height = "600px", onMarkerClick }: InteractiveMapProps) {
  const { t } = useLanguage();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Default center (Chula Vista City Hall)
  const defaultCenter = center || { lat: 32.6401, lng: -117.0842 };

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // Create InfoWindow instance
    infoWindowRef.current = new google.maps.InfoWindow();

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add markers for each location
    markers.forEach((markerData) => {
      const markerIcon = {
        restaurant: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23D35400'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
          scaledSize: new google.maps.Size(32, 32),
        },
        event: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23E67E22'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
          scaledSize: new google.maps.Size(32, 32),
        },
        amenity: {
          url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%2316A34A'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
          scaledSize: new google.maps.Size(32, 32),
        },
      };

      const marker = new google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstance,
        title: markerData.title,
        icon: markerIcon[markerData.type],
      });

      // Add click listener to marker
      marker.addListener("click", () => {
        const contentString = `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">${markerData.title}</h3>
            ${markerData.description ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${markerData.description}</p>` : ""}
            ${markerData.address ? `<p style="margin: 0; font-size: 12px; color: #999;"><strong>${t("Address", "Dirección")}:</strong> ${markerData.address}</p>` : ""}
          </div>
        `;

        infoWindowRef.current?.setContent(contentString);
        infoWindowRef.current?.open(mapInstance, marker);

        // Call optional callback
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are multiple
    if (markers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend({ lat: marker.lat, lng: marker.lng });
      });
      mapInstance.fitBounds(bounds);
    }
  };

  const handleFindNearMe = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userPos);
          
          if (map) {
            map.panTo(userPos);
            map.setZoom(14);
            
            // Add user location marker
            new google.maps.Marker({
              position: userPos,
              map: map,
              icon: {
                url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%234285F4'%3E%3Ccircle cx='12' cy='12' r='8'/%3E%3Ccircle cx='12' cy='12' r='3' fill='white'/%3E%3C/svg%3E",
                scaledSize: new google.maps.Size(24, 24),
              },
              title: t("Your Location", "Tu Ubicación"),
            });
          }
          
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert(t("Unable to get your location. Please enable location services.", "No se pudo obtener tu ubicación. Por favor habilita los servicios de ubicación."));
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert(t("Geolocation is not supported by your browser.", "La geolocalización no es compatible con tu navegador."));
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFindNearMe}
          disabled={isLoadingLocation}
          className="shadow-lg"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 mr-2" />
          )}
          {t("Near Me", "Cerca de Mí")}
        </Button>
      </div>

      <div style={{ width: "100%", height }}>
        <MapView
          onMapReady={handleMapReady}
          initialCenter={defaultCenter}
          initialZoom={zoom}
          className="w-full h-full"
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D35400]" />
            <span>{t("Restaurants", "Restaurantes")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#E67E22]" />
            <span>{t("Events", "Eventos")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span>{t("Amenities", "Amenidades")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
