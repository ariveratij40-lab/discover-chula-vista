# Discover Chula Vista - TODO

## Base de Datos y Esquema
- [x] Crear tabla de restaurantes con campos completos
- [x] Crear tabla de eventos
- [x] Crear tabla de experiencias curadas
- [x] Crear tabla de amenidades locales
- [x] Crear tabla de notificaciones push
- [x] Crear tabla de suscripciones de usuarios
- [x] Ejecutar migraciones de base de datos

## Backend (tRPC Procedures)
- [x] Procedimiento para listar restaurantes con filtros
- [x] Procedimiento para obtener detalles de restaurante
- [x] Procedimiento para listar eventos con filtros
- [x] Procedimiento para obtener detalles de evento
- [x] Procedimiento para listar experiencias curadas
- [x] Procedimiento para obtener detalles de experiencia
- [x] Procedimiento para búsqueda avanzada
- [x] Procedimiento para suscripción a notificaciones
- [ ] Procedimientos de administración para negocios
- [ ] Procedimiento para estadísticas de negocios

## Frontend - Páginas Principales
- [x] Página de inicio con hero y navegación bilingüe
- [x] Página de directorio de restaurantes
- [ ] Página de detalle de restaurante
- [ ] Página de calendario de eventos
- [ ] Página de detalle de evento
- [ ] Página de experiencias curadas
- [ ] Página de detalle de experiencia
- [ ] Página de amenidades locales
- [ ] Página de búsqueda avanzada

## Frontend - Componentes
- [x] Componente de selector de idioma (ES/EN)
- [x] Componente de tarjeta de restaurante
- [ ] Componente de tarjeta de evento
- [x] Componente de filtros múltiples
- [ ] Componente de mapa interactivo
- [x] Componente de búsqueda con autocompletado
- [x] Componente de navegación responsive

## Integración de Google Maps
- [ ] Configurar Google Maps API
- [ ] Implementar mapa interactivo con marcadores
- [ ] Implementar geolocalización "Cerca de mí"
- [ ] Implementar navegación a ubicaciones
- [ ] Mostrar rutas para experiencias curadas

## Sistema de Notificaciones
- [ ] Implementar suscripción a notificaciones push
- [ ] Crear sistema de envío de notificaciones
- [ ] Implementar filtrado por ubicación y preferencias
- [ ] Panel para enviar notificaciones desde admin

## Panel de Administración
- [ ] Dashboard para negocios locales
- [ ] Formulario de actualización de información
- [ ] Sistema de subida de fotos y videos
- [ ] Gestión de horarios especiales
- [ ] Visualización de estadísticas

## Datos Reales
- [x] Poblar 30+ restaurantes con datos reales (16 restaurantes)
- [x] Poblar eventos comunitarios (5 eventos)
- [x] Crear 4 experiencias curadas completas
- [x] Agregar amenidades locales (4 amenidades)

## Diseño y Estilo
- [x] Implementar paleta de colores (#D35400, #E67E22, #FAF9F6)
- [x] Configurar tipografía (Playfair Display, Lato)
- [x] Diseño responsive optimizado para móvil
- [x] Implementar sistema bilingüe completo

## Testing y Deployment
- [ ] Escribir tests unitarios para procedimientos críticos
- [ ] Probar funcionalidad en móvil
- [ ] Verificar integración de Google Maps
- [ ] Crear checkpoint final

## Bugs Reportados
- [x] Corregir error de etiquetas <a> anidadas en componentes

## Integración de Google Maps (Nueva Solicitud)
- [x] Configurar componente de mapa con Google Maps API
- [x] Agregar marcadores para restaurantes
- [x] Agregar marcadores para eventos
- [x] Implementar geolocalización "Cerca de mí"
- [x] Crear página de mapa interactivo
- [x] Agregar InfoWindows con información de lugares

## Páginas Faltantes (Bug Reportado)
- [x] Crear página de Eventos con filtros
- [x] Crear página de Experiencias Curadas
- [x] Crear página de Amenidades
- [x] Registrar rutas en App.tsx

## Bugs Reportados (Nuevos)
- [x] Corregir botón "Comenzar Experiencia" para abrir Google Maps
- [x] Crear página inicial motivacional para invitar a usar la app en el celular

## Páginas de Detalle (Nueva Solicitud)
- [x] Crear página de detalle de restaurante con galería y mapa
- [x] Crear página de detalle de evento con información completa
- [x] Actualizar enlaces en tarjetas de restaurantes
- [x] Actualizar enlaces en tarjetas de eventos
- [x] Registrar rutas dinámicas en App.tsx

## Rediseño de Página Welcome (Nueva Solicitud)
- [x] Agregar descripción de Chula Vista (ubicación, importancia)
- [x] Destacar crecimiento económico y oportunidades de inversión
- [x] Incluir sección sobre diversidad cultural
- [x] Agregar estadísticas y datos de la ciudad

## Panel de Negocios Premium (Nueva Solicitud)
- [x] Extender esquema de base de datos con tablas de analytics y promociones
- [x] Crear tabla de eventos de tracking (visitas, clics, llamadas)
- [ ] Agregar campo de rol "premium" para negocios
- [x] Crear procedimientos backend para analytics y estadísticas
- [x] Desarrollar dashboard de negocios con gráficas de tendencias
- [ ] Implementar sistema de subida de menús (PDF/imágenes)
- [ ] Crear formulario de gestión de promociones
- [ ] Agregar página de login para negocios
- [ ] Implementar tracking de eventos en frontend

## Enlace al Dashboard (Nueva Solicitud)
- [x] Agregar enlace "Para Negocios" en el navbar que dirija a /business/dashboard

## Formulario de Gestión de Menús (Nueva Solicitud)
- [x] Crear componente de subida de archivos con drag-and-drop
- [x] Implementar validación de archivos (PDF, JPG, PNG, tamaño máximo)
- [x] Integrar con S3 para almacenamiento de archivos
- [x] Crear procedimientos backend para gestión de menús (uploadMenu, getMenus, deleteMenu)
- [x] Agregar listado de menús existentes con opciones de ver/eliminar
- [x] Integrar formulario en el dashboard de negocios


## Sistema de Monetización y Paquetes Premium (Basado en Modelo de Negocio)
- [x] Crear tabla de suscripciones con planes (Básico $199, Pro $499, Socio $999)
- [x] Implementar sistema de paquetes premium para negocios
- [x] Agregar campo de nivel de suscripción a tabla de restaurantes
- [x] Poblar tabla de planes con datos reales
- [x] Crear procedimientos backend para suscripciones (getPlans, getByRestaurantId, create)
- [x] Crear página pública de planes y precios para negocios
- [ ] Crear dashboard de analytics avanzado para negocios premium
- [ ] Implementar badges de verificación ("Verificado", "Local Favorite", "Video Spotlight")
- [ ] Crear sistema de patrocinios para rutas temáticas
- [ ] Implementar contenido destacado en listados
- [ ] Agregar tracking de conversiones (impresiones → clics → visitas)
- [ ] Crear sistema de reportes de datos de comportamiento (para vender a terceros)
- [ ] Implementar marketing geo-localizado (recomendaciones destacadas "Cerca de mí")
- [ ] Implementar sistema de pagos con Stripe (opcional)
- [ ] Crear página de registro para nuevos negocios


## Actualización de Paleta de Colores (Alineación con Ciudad Oficial)
- [x] Analizar colores oficiales de chulavistaca.gov
- [x] Definir nueva paleta: Azul Teal #0088A8, Navy #1B3A57, Coral #FF6B35
- [x] Actualizar variables CSS en index.css
- [x] Actualizar componentes principales (PricingPage, BusinessDashboard)
- [x] Crear clases de utilidad personalizadas (bg-cv-teal, text-cv-navy, etc.)
- [x] Verificar funcionamiento en dev server
- [x] Probar en página principal


## Mejoras de UX y Contenido Visual (Nueva Solicitud)
- [x] Reparar botón de experiencias que no funciona (corregida ruta en App.tsx)
- [x] Buscar imágenes de fondo de Chula Vista (playas, parques, downtown)
- [x] Agregar imágenes de fondo atractivas en página principal
- [x] Actualizar hero con imagen real de Chula Vista Bayfront
- [x] Crear sección de galería con imágenes de Bayfront Parks, Third Avenue y Nature Trails
- [x] Agregar efectos hover y transiciones en imágenes
- [x] Verificar navegación en todas las páginas


## Video Comercial de Chula Vista (Nueva Solicitud)
- [x] Subir video comercial a S3 (9.6MB)
- [x] Obtener URL pública del video (CDN: files.manuscdn.com)
- [x] Integrar video en página principal (Welcome)
- [x] Crear sección destacada con diseño atractivo para el video
- [x] Agregar controles de reproducción y poster image
- [x] Verificar visualización correcta en dev server
