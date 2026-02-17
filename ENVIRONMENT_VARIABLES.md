# Variables de Entorno - Discover Chula Vista

Este documento lista todas las variables de entorno configuradas en el proyecto.

## ⚠️ Nota Importante

**Este proyecto NO usa archivos `.env` tradicionales.** Todas las variables de entorno son inyectadas automáticamente por el sistema de Manus durante el desarrollo y deployment.

Para agregar o modificar variables:
1. Ve al panel de **Settings → Secrets** en la UI de Manus
2. O solicita al desarrollador que use `webdev_request_secrets`

---

## 📊 Variables Configuradas Actualmente

### Base de Datos
```
DATABASE_URL
```
Conexión a la base de datos MySQL/TiDB (inyectada automáticamente)

---

### Autenticación y Seguridad
```
JWT_SECRET
```
Secret para firmar tokens JWT de sesión

```
OAUTH_SERVER_URL=https://api.manus.im
```
URL del servidor OAuth de Manus

```
VITE_OAUTH_PORTAL_URL=https://manus.im
```
URL del portal de login (accesible en frontend)

---

### Información de la Aplicación
```
VITE_APP_ID=ZTBFAzhh8obE8yrgMtFTcJ
```
ID único de la aplicación en Manus

```
VITE_APP_TITLE=Discover Chula Vista
```
Título de la aplicación (visible en navegador)

```
VITE_APP_LOGO=https://files.manuscdn.com/user_upload_by_module/web_dev_logo/310519663304158292/kfKNmToYybiJDarI.png
```
URL del logo de la aplicación

---

### Información del Propietario
```
OWNER_NAME=Alvaro Rivera
```
Nombre del propietario del proyecto

```
OWNER_OPEN_ID=jWTeJaxQ8Vf23NGjgaKmJ5
```
ID único del propietario en Manus

---

### APIs Internas de Manus
```
BUILT_IN_FORGE_API_URL=https://forge.manus.ai
```
URL de las APIs internas (LLM, Storage, Notifications, etc.)

```
BUILT_IN_FORGE_API_KEY
```
Token de autenticación para APIs (solo server-side)

```
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.ai
```
URL de las APIs para el frontend

```
VITE_FRONTEND_FORGE_API_KEY
```
Token de autenticación para APIs (accesible en frontend)

---

### Analytics
```
VITE_ANALYTICS_ENDPOINT=https://manus-analytics.com
```
Endpoint para el sistema de analytics

```
VITE_ANALYTICS_WEBSITE_ID=f2d02017-b3cd-4399-af59-4e5e1a83a8a3
```
ID único del sitio para tracking de analytics

---

### Deployment
```
DEPLOY_WASMER_OWNER=manus
```
Propietario del deployment en Wasmer

---

## 🔧 Variables Adicionales Sugeridas

Estas variables pueden agregarse según las necesidades del proyecto:

### Google Maps (si se necesita API key propia)
```
GOOGLE_MAPS_API_KEY=tu-api-key-aqui
```

### Stripe (para pagos)
```
STRIPE_SECRET_KEY=tu-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=tu-stripe-publishable-key
```

### SendGrid (para emails)
```
SENDGRID_API_KEY=tu-sendgrid-api-key
```

### AWS S3 (si se necesita bucket propio)
```
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_S3_BUCKET=nombre-del-bucket
```

---

## 📝 Convenciones

- **Variables con prefijo `VITE_`**: Accesibles en el frontend (cliente)
- **Variables sin prefijo `VITE_`**: Solo disponibles en el backend (servidor)
- **Valores sensibles**: Nunca deben exponerse en el código fuente o repositorio

---

## 🔒 Seguridad

- Todas las variables sensibles (API keys, secrets, passwords) están encriptadas
- Las variables de entorno se inyectan automáticamente en tiempo de ejecución
- NO se almacenan en archivos `.env` en el repositorio
- El acceso a variables sensibles está restringido según el contexto (frontend vs backend)

---

## 📚 Recursos

- [Documentación de Manus sobre Variables de Entorno](https://docs.manus.im)
- [Panel de Secrets en la UI](https://manus.im/project/settings/secrets)
