# Quick Start - Deployment en VPS

## 🚀 Inicio Rápido (5 pasos)

### 1. Preparar VPS

```bash
# Conectar al VPS
ssh root@108.175.9.162

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Transferir Proyecto

```bash
# Opción A: Desde tu máquina local
scp -r /ruta/local/discover-chula-vista root@108.175.9.162:/opt/

# Opción B: Clonar desde Git
ssh root@108.175.9.162
cd /opt
git clone https://github.com/tu-usuario/discover-chula-vista.git
```

### 3. Configurar Variables

```bash
cd /opt/discover-chula-vista
cp .env.production.example .env.production
nano .env.production

# Cambiar estos valores:
# - MYSQL_ROOT_PASSWORD
# - MYSQL_PASSWORD
# - JWT_SECRET
```

### 4. Desplegar

```bash
# Usar el script automatizado
./deploy.sh

# O manualmente
docker-compose build
docker-compose --env-file .env.production up -d
```

### 5. Verificar

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f app

# Probar en navegador
# http://108.175.9.162
```

---

## 📚 Documentación Completa

Para instrucciones detalladas, consulta: **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

## 🆘 Problemas Comunes

### La app no inicia

```bash
docker-compose logs app
docker-compose restart app
```

### Error 502 en Nginx

```bash
docker-compose restart nginx
docker-compose logs nginx
```

### Base de datos no conecta

```bash
docker-compose logs mysql
docker-compose restart mysql
```

---

## 📞 Contacto

Para soporte, contacta al equipo de desarrollo.
