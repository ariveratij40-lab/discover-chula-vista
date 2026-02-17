import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapPin, Calendar, Compass, Leaf, TrendingUp, Users, Building2, Globe2, Smartphone } from "lucide-react";

export default function Welcome() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Compass,
      titleEn: "Curated Experiences",
      titleEs: "Experiencias Curadas",
      descEn: "Discover themed routes crafted by locals",
      descEs: "Descubre rutas temáticas creadas por locales",
    },
    {
      icon: MapPin,
      titleEn: "Interactive Map",
      titleEs: "Mapa Interactivo",
      descEn: "Find hidden gems near you",
      descEs: "Encuentra joyas ocultas cerca de ti",
    },
    {
      icon: Calendar,
      titleEn: "Community Events",
      titleEs: "Eventos Comunitarios",
      descEn: "Stay updated on local happenings",
      descEs: "Mantente al día con eventos locales",
    },
    {
      icon: Leaf,
      titleEn: "Parks & Trails",
      titleEs: "Parques y Senderos",
      descEn: "Explore 120+ miles of outdoor beauty",
      descEs: "Explora más de 120 millas de belleza natural",
    },
  ];

  const stats = [
    {
      value: "278K+",
      labelEn: "Residents",
      labelEs: "Residentes",
    },
    {
      value: "$1.35B",
      labelEn: "Bayfront Investment",
      labelEs: "Inversión en Bayfront",
    },
    {
      value: "61%",
      labelEn: "Hispanic Heritage",
      labelEs: "Herencia Hispana",
    },
    {
      value: "#2",
      labelEn: "Largest City in SD County",
      labelEs: "2da Ciudad Más Grande del Condado",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/bayfront-hero.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 container text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {t("Discover Chula Vista", "Descubre Chula Vista")}
          </h1>
          <p className="text-xl md:text-2xl mb-2 max-w-3xl mx-auto font-light">
            {t(
              "Like Never Before",
              "Como Nunca Antes"
            )}
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {t(
              "Your personal guide to authentic experiences, hidden gems, and local favorites",
              "Tu guía personal para experiencias auténticas, joyas ocultas y favoritos locales"
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/home">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                <Smartphone className="w-5 h-5 mr-2" />
                {t("Start Exploring", "Comenzar a Explorar")}
              </Button>
            </Link>
            <Link href="/map">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                {t("View Map", "Ver Mapa")}
              </Button>
            </Link>
          </div>

          {/* Mobile Tip */}
          <Card className="mt-8 max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-6 text-center">
              <Smartphone className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="font-semibold text-lg mb-2">
                {t("📱 Better experience on your phone!", "📱 ¡Mejor experiencia en tu teléfono!")}
              </p>
              <p className="text-sm opacity-90">
                {t(
                  "Save this page to your home screen and take Chula Vista in your pocket",
                  "Guarda esta página en tu pantalla de inicio y lleva Chula Vista en tu bolsillo"
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">
              {t("See Chula Vista in Action", "Mira Chula Vista en Acción")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Watch our official video showcasing the best of what Chula Vista has to offer",
                "Mira nuestro video oficial mostrando lo mejor que Chula Vista tiene para ofrecer"
              )}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black">
              <div className="aspect-video">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="/images/bayfront-hero.jpg"
                  preload="metadata"
                >
                  <source
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663304158292/olXSPblNdmIvdgcF.mp4"
                    type="video/mp4"
                  />
                  {t(
                    "Your browser does not support the video tag.",
                    "Tu navegador no soporta la etiqueta de video."
                  )}
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Chula Vista Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              {t("Why Chula Vista?", "¿Por Qué Chula Vista?")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t(
                "Chula Vista is rapidly transforming from a quiet suburb into a vibrant hub of growth and opportunity. As the second-largest city in San Diego County with over 278,000 residents, it sits in a strategic location—just 7.5 miles from downtown San Diego and minutes from the US-Mexico border, offering unique access to two countries and cultures.",
                "Chula Vista se está transformando rápidamente de un suburbio tranquilo a un vibrante centro de crecimiento y oportunidad. Como la segunda ciudad más grande del Condado de San Diego con más de 278,000 residentes, se encuentra en una ubicación estratégica—a solo 7.5 millas del centro de San Diego y minutos de la frontera México-Estados Unidos, ofreciendo acceso único a dos países y culturas."
              )}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">
                    {language === "en" ? stat.labelEn : stat.labelEs}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">
                  {t("Economic Boom", "Auge Económico")}
                </h3>
                <p className="text-muted-foreground">
                  {t(
                    "The $1.35 billion Gaylord Pacific Resort & Convention Center opens May 2025, transforming the Bayfront into the West Coast's largest waterfront development. This includes 2,850 hotel rooms, 535 acres of parks, and massive job creation.",
                    "El complejo Gaylord Pacific Resort & Convention Center de $1.35 mil millones abre en mayo de 2025, transformando el Bayfront en el desarrollo costero más grande de la Costa Oeste. Esto incluye 2,850 habitaciones de hotel, 535 acres de parques y creación masiva de empleos."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">
                  {t("Cultural Diversity", "Diversidad Cultural")}
                </h3>
                <p className="text-muted-foreground">
                  {t(
                    "With 61% Hispanic heritage, 14% Asian, and a truly bilingual community, Chula Vista celebrates a rich multicultural identity. This diversity creates a unique blend of authentic cuisines, festivals, and traditions you won't find anywhere else.",
                    "Con 61% de herencia hispana, 14% asiática y una comunidad verdaderamente bilingüe, Chula Vista celebra una rica identidad multicultural. Esta diversidad crea una mezcla única de cocinas auténticas, festivales y tradiciones que no encontrarás en ningún otro lugar."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Building2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-3">
                  {t("Investment Hotspot", "Punto de Inversión")}
                </h3>
                <p className="text-muted-foreground">
                  {t(
                    "Ranked among the top 4 San Diego neighborhoods for real estate investment in 2025. With ongoing developments like the Pangaea project (50,000-seat stadium, hotels, tennis center), Chula Vista offers unmatched growth potential for investors and entrepreneurs.",
                    "Clasificada entre los 4 mejores vecindarios de San Diego para inversión inmobiliaria en 2025. Con desarrollos en curso como el proyecto Pangaea (estadio de 50,000 asientos, hoteles, centro de tenis), Chula Vista ofrece un potencial de crecimiento sin igual para inversionistas y emprendedores."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t("Experience Chula Vista", "Experimenta Chula Vista")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "From stunning bayfront views to vibrant downtown streets, discover what makes our city special",
                "Desde impresionantes vistas de la bahía hasta vibrantes calles del centro, descubre lo que hace especial a nuestra ciudad"
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Bayfront Park */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/bayfront-park.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {t("Bayfront Parks", "Parques del Bayfront")}
                </h3>
                <p className="text-sm opacity-90">
                  {t(
                    "535 acres of waterfront parks with trails, playgrounds, and breathtaking bay views",
                    "535 acres de parques costeros con senderos, áreas de juego y vistas impresionantes de la bahía"
                  )}
                </p>
              </div>
            </div>

            {/* Third Avenue */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg h-80">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/third-avenue.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {t("Third Avenue Village", "Third Avenue Village")}
                </h3>
                <p className="text-sm opacity-90">
                  {t(
                    "Historic downtown district with local restaurants, shops, and vibrant nightlife",
                    "Distrito histórico del centro con restaurantes locales, tiendas y vibrante vida nocturna"
                  )}
                </p>
              </div>
            </div>

            {/* Beach & Nature */}
            <div className="relative group overflow-hidden rounded-lg shadow-lg h-80 md:col-span-2">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: "url('/images/beach-nature.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-3xl font-bold mb-2">
                  {t("Beaches & Nature Trails", "Playas y Senderos Naturales")}
                </h3>
                <p className="text-base opacity-90 max-w-3xl">
                  {t(
                    "Explore over 120 miles of trails, pristine beaches, and coastal wetlands perfect for hiking, biking, and wildlife watching",
                    "Explora más de 120 millas de senderos, playas prístinas y humedales costeros perfectos para caminatas, ciclismo y observación de vida silvestre"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t("Everything You Need", "Todo Lo Que Necesitas")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "Discover Chula Vista like a local with our comprehensive guide",
                "Descubre Chula Vista como un local con nuestra guía completa"
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">
                    {language === "en" ? feature.titleEn : feature.titleEs}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "en" ? feature.descEn : feature.descEs}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              {t("How It Works", "Cómo Funciona")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("Explore", "Explora")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "Browse restaurants, events, and experiences curated by locals",
                  "Navega restaurantes, eventos y experiencias curadas por locales"
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("Discover", "Descubre")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "Use our interactive map to find hidden gems near you",
                  "Usa nuestro mapa interactivo para encontrar joyas ocultas cerca de ti"
                )}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t("Experience", "Experimenta")}
              </h3>
              <p className="text-muted-foreground">
                {t(
                  "Get directions, save favorites, and create your own adventure",
                  "Obtén direcciones, guarda favoritos y crea tu propia aventura"
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="pt-6 text-center py-12">
              <Globe2 className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                {t("Ready to Explore?", "¿Listo para Explorar?")}
              </h2>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                {t(
                  "Join thousands discovering authentic experiences in Chula Vista",
                  "Únete a miles descubriendo experiencias auténticas en Chula Vista"
                )}
              </p>
              <Link href="/home">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
                  {t("Get Started", "Comenzar Ahora")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
