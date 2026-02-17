import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Check, Star, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const PricingPage = () => {
  const { language } = useLanguage();
  const { data: plans, isLoading } = trpc.subscriptions.getPlans.useQuery();

  const content = {
    en: {
      title: "Grow Your Business with Discover Chula Vista",
      subtitle: "Choose the plan that fits your business goals and budget",
      cta: "Get Started",
      contact: "Contact Us",
      monthly: "/month",
      popular: "Most Popular",
      features: "Features",
      testimonial: {
        quote: "Since joining as a Pro member, we've seen a 40% increase in new customers. The professional video made all the difference!",
        author: "Maria González",
        business: "Casa de Sabor, Third Avenue"
      },
      guarantee: {
        title: "30-Day Money-Back Guarantee",
        description: "Try any plan risk-free. If you're not satisfied with the results, we'll refund your first month."
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            q: "How long does it take to get started?",
            a: "Once you sign up, your enhanced listing goes live within 24 hours. For Pro and Partner plans with video production, allow 5-7 business days for professional filming and editing."
          },
          {
            q: "Can I upgrade or downgrade my plan?",
            a: "Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle."
          },
          {
            q: "What if I don't have professional photos?",
            a: "No problem! We can arrange a professional photoshoot for an additional fee, or help you select the best images from your existing collection."
          },
          {
            q: "How do I track my results?",
            a: "All plans include access to our analytics dashboard where you can see views, clicks, calls, and direction requests in real-time."
          }
        ]
      }
    },
    es: {
      title: "Haz Crecer Tu Negocio con Discover Chula Vista",
      subtitle: "Elige el plan que se ajuste a tus objetivos y presupuesto",
      cta: "Comenzar",
      contact: "Contáctanos",
      monthly: "/mes",
      popular: "Más Popular",
      features: "Características",
      testimonial: {
        quote: "Desde que nos unimos como miembros Pro, hemos visto un aumento del 40% en nuevos clientes. ¡El video profesional marcó toda la diferencia!",
        author: "María González",
        business: "Casa de Sabor, Third Avenue"
      },
      guarantee: {
        title: "Garantía de Devolución de 30 Días",
        description: "Prueba cualquier plan sin riesgo. Si no estás satisfecho con los resultados, te reembolsaremos tu primer mes."
      },
      faq: {
        title: "Preguntas Frecuentes",
        items: [
          {
            q: "¿Cuánto tiempo toma empezar?",
            a: "Una vez que te registres, tu listado mejorado estará en línea en 24 horas. Para planes Pro y Socio con producción de video, permite 5-7 días hábiles para filmación y edición profesional."
          },
          {
            q: "¿Puedo mejorar o reducir mi plan?",
            a: "¡Sí! Puedes cambiar tu plan en cualquier momento. Las mejoras toman efecto inmediatamente, y las reducciones aplican al inicio de tu próximo ciclo de facturación."
          },
          {
            q: "¿Qué pasa si no tengo fotos profesionales?",
            a: "¡No hay problema! Podemos organizar una sesión fotográfica profesional por una tarifa adicional, o ayudarte a seleccionar las mejores imágenes de tu colección existente."
          },
          {
            q: "¿Cómo hago seguimiento a mis resultados?",
            a: "Todos los planes incluyen acceso a nuestro dashboard de analytics donde puedes ver vistas, clics, llamadas y solicitudes de direcciones en tiempo real."
          }
        ]
      }
    }
  };

  const t = content[language];

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "basic":
        return <Shield className="w-8 h-8 text-cv-teal" />;
      case "pro":
        return <Star className="w-8 h-8 text-cv-teal" />;
      case "partner":
        return <Crown className="w-8 h-8 text-cv-teal" />;
      default:
        return null;
    }
  };

  const isPopular = (planType: string) => planType === "pro";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream py-20">
        <div className="container">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-cv-teal via-cv-teal to-primary text-white py-20">
        <div className="container text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans?.map((plan: any) => {
            const features = JSON.parse(language === "en" ? plan.featuresEn : plan.featuresEs);
            const name = language === "en" ? plan.nameEn : plan.nameEs;
            const description = language === "en" ? plan.descriptionEn : plan.descriptionEs;
            const price = (plan.priceMonthly / 100).toFixed(0);

            return (
              <Card
                key={plan.id}
                className={`relative p-8 ${
                  isPopular(plan.planType)
                    ? "border-4 border-cv-teal shadow-2xl scale-105"
                    : "border-2 border-gray-200"
                }`}
              >
                {isPopular(plan.planType) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cv-teal text-white px-6 py-1 rounded-full text-sm font-semibold">
                    {t.popular}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.planType)}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                    {name}
                  </h3>
                  <p className="text-gray-600 mb-4">{description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-cv-teal">${price}</span>
                    <span className="text-gray-600 ml-2">{t.monthly}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    {t.features}
                  </p>
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    isPopular(plan.planType)
                      ? "bg-cv-teal hover:bg-cv-teal/90"
                      : "bg-cv-navy hover:bg-cv-navy/90"
                  }`}
                  size="lg"
                  onClick={() => {
                    // TODO: Implementar flujo de registro
                    window.location.href = `/business/register?plan=${plan.planType}`;
                  }}
                >
                  {t.cta}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-display text-gray-900 mb-6">
              "{t.testimonial.quote}"
            </blockquote>
            <div className="text-gray-600">
              <p className="font-semibold">{t.testimonial.author}</p>
              <p className="text-sm">{t.testimonial.business}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Guarantee Section */}
      <div className="bg-orange-50 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Shield className="w-16 h-16 text-cv-teal mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              {t.guarantee.title}
            </h2>
            <p className="text-lg text-gray-700">
              {t.guarantee.description}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container py-16">
        <h2 className="font-display text-4xl font-bold text-center text-gray-900 mb-12">
          {t.faq.title}
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {t.faq.items.map((item, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {item.q}
              </h3>
              <p className="text-gray-700">
                {item.a}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cv-teal to-primary py-16">
        <div className="container text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-6">
            {language === "en" ? "Ready to Get Started?" : "¿Listo para Comenzar?"}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === "en"
              ? "Join 35+ local businesses already growing with Discover Chula Vista"
              : "Únete a 35+ negocios locales que ya están creciendo con Discover Chula Vista"}
          </p>
          <Button
            size="lg"
            className="bg-white text-cv-teal hover:bg-gray-100 text-lg px-8"
            onClick={() => {
              window.location.href = "/business/register";
            }}
          >
            {t.cta}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
