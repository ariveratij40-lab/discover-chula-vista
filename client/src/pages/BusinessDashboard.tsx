import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Eye, Phone, MapPin, Share2, Globe, TrendingUp, Calendar } from "lucide-react";

export default function BusinessDashboard() {
  const { language } = useLanguage();
  const [restaurantId] = useState(1); // TODO: Get from auth context
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  const { data: analytics, isLoading } = trpc.business.getAnalytics.useQuery({
    restaurantId,
    period,
  });

  const { data: promotions } = trpc.business.getPromotions.useQuery({ restaurantId });
  const { data: menus } = trpc.business.getMenus.useQuery({ restaurantId });

  const translations = {
    en: {
      title: "Business Dashboard",
      subtitle: "Analytics and insights for your restaurant",
      overview: "Overview",
      analytics: "Analytics",
      promotions: "Promotions",
      menus: "Menus",
      period: "Period",
      last7Days: "Last 7 days",
      last30Days: "Last 30 days",
      last90Days: "Last 90 days",
      totalViews: "Total Views",
      directions: "Directions Clicks",
      calls: "Phone Calls",
      website: "Website Visits",
      shares: "Shares",
      dailyViews: "Daily Views Trend",
      userActions: "User Actions",
      noData: "No data available for this period",
      createPromotion: "Create Promotion",
      uploadMenu: "Upload Menu",
      activePromotions: "Active Promotions",
      uploadedMenus: "Uploaded Menus",
    },
    es: {
      title: "Panel de Negocio",
      subtitle: "Análisis e insights para tu restaurante",
      overview: "Resumen",
      analytics: "Análisis",
      promotions: "Promociones",
      menus: "Menús",
      period: "Período",
      last7Days: "Últimos 7 días",
      last30Days: "Últimos 30 días",
      last90Days: "Últimos 90 días",
      totalViews: "Vistas Totales",
      directions: "Clics en Direcciones",
      calls: "Llamadas Telefónicas",
      website: "Visitas al Sitio Web",
      shares: "Compartidos",
      dailyViews: "Tendencia de Vistas Diarias",
      userActions: "Acciones de Usuarios",
      noData: "No hay datos disponibles para este período",
      createPromotion: "Crear Promoción",
      uploadMenu: "Subir Menú",
      activePromotions: "Promociones Activas",
      uploadedMenus: "Menús Subidos",
    },
  };

  const t = translations[language];

  const stats = [
    {
      title: t.totalViews,
      value: analytics?.totalViews || 0,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t.directions,
      value: analytics?.clicks?.click_directions || 0,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t.calls,
      value: analytics?.clicks?.click_call || 0,
      icon: Phone,
      color: "text-cv-coral",
      bgColor: "bg-cv-coral/10",
    },
    {
      title: t.website,
      value: analytics?.clicks?.click_website || 0,
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: t.shares,
      value: analytics?.clicks?.share || 0,
      icon: Share2,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  const actionsData = [
    { name: t.directions, value: analytics?.clicks?.click_directions || 0 },
    { name: t.calls, value: analytics?.clicks?.click_call || 0 },
    { name: t.website, value: analytics?.clicks?.click_website || 0 },
    { name: t.shares, value: analytics?.clicks?.share || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">{t.title}</h1>
          <p className="text-lg text-neutral-600">{t.subtitle}</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex justify-end">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.period} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{t.last7Days}</SelectItem>
              <SelectItem value="30d">{t.last30Days}</SelectItem>
              <SelectItem value="90d">{t.last90Days}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
            <TabsTrigger value="promotions">{t.promotions}</TabsTrigger>
            <TabsTrigger value="menus">{t.menus}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-neutral-600">{stat.title}</CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-neutral-900">{stat.value.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Daily Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t.dailyViews}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.dailyViews && analytics.dailyViews.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailyViews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="oklch(0.55 0.12 210)" strokeWidth={2} name={t.totalViews} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-neutral-500 py-8">{t.noData}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.userActions}</CardTitle>
                <CardDescription>Breakdown of user interactions with your listing</CardDescription>
              </CardHeader>
              <CardContent>
                {actionsData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={actionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="oklch(0.55 0.12 210)" name="Actions" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-neutral-500 py-8">{t.noData}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-bold">{t.activePromotions}</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Calendar className="h-4 w-4 mr-2" />
                {t.createPromotion}
              </Button>
            </div>

            {promotions && promotions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotions.map((promo: any) => (
                  <Card key={promo.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{language === "en" ? promo.titleEn : promo.titleEs}</CardTitle>
                      <CardDescription>
                        {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm text-neutral-600">
                        <span>Views: {promo.views}</span>
                        <span>Clicks: {promo.clicks}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-neutral-500">{t.noData}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Menus Tab */}
          <TabsContent value="menus" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-serif font-bold">{t.uploadedMenus}</h2>
              <Button className="bg-primary hover:bg-primary/90">{t.uploadMenu}</Button>
            </div>

            {menus && menus.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menus.map((menu: any) => (
                  <Card key={menu.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{menu.title}</CardTitle>
                      <CardDescription>{new Date(menu.uploadedAt).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" onClick={() => window.open(menu.fileUrl, "_blank")}>
                        View Menu
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-neutral-500">{t.noData}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
