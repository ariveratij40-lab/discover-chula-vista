# Guía de Deployment - Discover Chula Vista

## Guía Completa para Desplegar en VPS (108.175.9.162)

Esta guía te llevará paso a paso para desplegar la plataforma **Discover Chula Vista** en tu propio VPS con la dirección IP **108.175.9.162**.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener:

### En tu VPS (108.175.9.162)

- **Sistema Operativo**: Ubuntu 20.04 LTS o superior (recomendado) o cualquier distribución Linux compatible
- **Acceso SSH**: Acceso root o usuario con privilegios sudo
- **Puertos abiertos**: 
  - Puerto 80 (HTTP)
  - Puerto 443 (HTTPS)
  - Puerto 3306 (MySQL, opcional si quieres acceso externo)
- **Recursos mínimos**:
  - 2 GB RAM (4 GB recomendado)
  - 2 CPU cores
  - 20 GB de espacio en disco

### Software a instalar en el VPS

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Git

### En tu máquina local

- Git instalado
- Acceso SSH al VPS
- Cliente SCP o SFTP (para transferir archivos)

### Opcional pero recomendado

- Un dominio propio apuntando a 108.175.9.162 (para SSL/HTTPS)
- Cuenta de correo válida (para certificados SSL de Let's Encrypt)

---

## 🚀 Proceso de Deployment

### Paso 1: Preparar el VPS

Conéctate a tu VPS vía SSH:

```bash
ssh root@108.175.9.162
# O si tienes un usuario específico:
ssh tu-usuario@108.175.9.162
```

Actualiza el sistema:

```bash
sudo apt update && sudo apt upgrade -y
```

Instala Docker:

```bash
# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Agregar repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Verificar instalación
sudo docker --version
```

Instala Docker Compose:

```bash
# Descargar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permisos de ejecución
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker-compose --version
```

Agregar tu usuario al grupo docker (opcional, para no usar sudo):

```bash
sudo usermod -aG docker $USER
# Cerrar sesión y volver a conectar para que tome efecto
```

---

### Paso 2: Transferir el Proyecto al VPS

Desde tu máquina local, hay dos opciones:

#### Opción A: Usar Git (Recomendado)

Si tu proyecto está en un repositorio Git:

```bash
# En el VPS
cd /opt
sudo mkdir discover-chula-vista
sudo chown $USER:$USER discover-chula-vista
cd discover-chula-vista

# Clonar el repositorio
git clone https://github.com/tu-usuario/discover-chula-vista.git .
```

#### Opción B: Transferir archivos directamente

Desde tu máquina local:

```bash
# Comprimir el proyecto
cd /ruta/a/discover-chula-vista
tar -czf discover-chula-vista.tar.gz .

# Transferir al VPS
scp discover-chula-vista.tar.gz root@108.175.9.162:/opt/

# En el VPS, descomprimir
ssh root@108.175.9.162
cd /opt
mkdir discover-chula-vista
tar -xzf discover-chula-vista.tar.gz -C discover-chula-vista
cd discover-chula-vista
```

---

### Paso 3: Configurar Variables de Entorno

Crea el archivo de configuración de producción:

```bash
cd /opt/discover-chula-vista
cp .env.production.example .env.production
```

Edita el archivo con tus valores:

```bash
nano .env.production
```

**Valores importantes a configurar:**

```env
# Passwords de base de datos (¡CAMBIAR!)
MYSQL_ROOT_PASSWORD=tu-password-root-muy-seguro-aqui
MYSQL_PASSWORD=tu-password-usuario-muy-seguro-aqui

# JWT Secret (generar uno aleatorio)
JWT_SECRET=tu-jwt-secret-muy-largo-y-aleatorio-min-32-caracteres

# API Keys de Manus (solicitar si es necesario)
BUILT_IN_FORGE_API_KEY=tu-api-key-aqui
VITE_FRONTEND_FORGE_API_KEY=tu-frontend-key-aqui

# Dominio (si tienes uno)
DOMAIN=tu-dominio.com

# Email para SSL
SSL_EMAIL=tu-email@ejemplo.com
```

**Tip para generar JWT_SECRET seguro:**

```bash
openssl rand -base64 32
```

Guarda el archivo (Ctrl+O, Enter, Ctrl+X en nano).

---

### Paso 4: Configurar Nginx

Si tienes un dominio, actualiza la configuración de Nginx:

```bash
nano nginx/conf.d/chula-vista.conf
```

Reemplaza `108.175.9.162` con tu dominio en las líneas `server_name`.

Si solo usarás la IP, deja la configuración como está.

---

### Paso 5: Construir e Iniciar los Contenedores

Construye las imágenes Docker:

```bash
cd /opt/discover-chula-vista
docker-compose build
```

Esto puede tomar varios minutos la primera vez.

Inicia los servicios:

```bash
docker-compose --env-file .env.production up -d
```

Verifica que los contenedores estén corriendo:

```bash
docker-compose ps
```

Deberías ver algo como:

```
NAME                    STATUS              PORTS
chula-vista-app         Up                  0.0.0.0:3000->3000/tcp
chula-vista-db          Up (healthy)        0.0.0.0:3306->3306/tcp
chula-vista-nginx       Up                  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
chula-vista-certbot     Up
```

---

### Paso 6: Verificar el Deployment

Verifica los logs de la aplicación:

```bash
docker-compose logs -f app
```

Presiona Ctrl+C para salir de los logs.

Prueba que la aplicación esté funcionando:

```bash
curl http://localhost:3000
```

Desde tu navegador, visita:

```
http://108.175.9.162
```

Deberías ver la página de inicio de Discover Chula Vista.

---

### Paso 7: Configurar SSL/HTTPS (Opcional pero Recomendado)

**Nota:** Este paso requiere un dominio apuntando a tu VPS.

#### 7.1 Obtener certificado SSL

Detén Nginx temporalmente:

```bash
docker-compose stop nginx
```

Obtén el certificado:

```bash
docker-compose run --rm certbot certonly --standalone \
  --email tu-email@ejemplo.com \
  --agree-tos \
  --no-eff-email \
  -d tu-dominio.com \
  -d www.tu-dominio.com
```

#### 7.2 Actualizar configuración de Nginx

Edita el archivo de configuración:

```bash
nano nginx/conf.d/chula-vista.conf
```

1. En el bloque `server` del puerto 80, **comenta** la sección de proxy y **descomenta** la redirección HTTPS:

```nginx
# Comentar esto:
# location / {
#     proxy_pass http://app:3000;
#     ...
# }

# Descomentar esto:
location / {
    return 301 https://$server_name$request_uri;
}
```

2. **Descomenta** todo el bloque `server` del puerto 443 (HTTPS)

3. Actualiza las rutas de los certificados con tu dominio:

```nginx
ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
```

Guarda el archivo.

#### 7.3 Reiniciar Nginx

```bash
docker-compose up -d nginx
```

Verifica que funcione:

```
https://tu-dominio.com
```

---

### Paso 8: Poblar la Base de Datos

Si necesitas importar datos iniciales:

```bash
# Copiar el archivo SQL al contenedor
docker cp drizzle/seed-data.sql chula-vista-db:/tmp/

# Ejecutar el script
docker exec -it chula-vista-db mysql -u chulavista -p discover_chula_vista < /tmp/seed-data.sql
```

O accede directamente a MySQL:

```bash
docker exec -it chula-vista-db mysql -u chulavista -p
```

---

## 🔧 Comandos Útiles

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo la aplicación
docker-compose logs -f app

# Solo la base de datos
docker-compose logs -f mysql
```

### Reiniciar servicios

```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo la app
docker-compose restart app
```

### Detener servicios

```bash
docker-compose stop
```

### Iniciar servicios

```bash
docker-compose start
```

### Detener y eliminar contenedores

```bash
docker-compose down
```

### Detener, eliminar contenedores Y volúmenes (¡CUIDADO! Elimina la base de datos)

```bash
docker-compose down -v
```

### Reconstruir después de cambios en el código

```bash
docker-compose build app
docker-compose up -d app
```

### Acceder al contenedor de la aplicación

```bash
docker exec -it chula-vista-app sh
```

### Backup de la base de datos

```bash
docker exec chula-vista-db mysqldump -u chulavista -p discover_chula_vista > backup-$(date +%Y%m%d).sql
```

### Restaurar base de datos desde backup

```bash
docker exec -i chula-vista-db mysql -u chulavista -p discover_chula_vista < backup-20260216.sql
```

---

## 🔒 Seguridad

### Firewall

Configura el firewall para permitir solo los puertos necesarios:

```bash
# Instalar UFW si no está instalado
sudo apt install ufw

# Permitir SSH (¡IMPORTANTE! No te bloquees)
sudo ufw allow 22/tcp

# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Opcional: Permitir MySQL solo desde IPs específicas
# sudo ufw allow from TU_IP_LOCAL to any port 3306

# Habilitar firewall
sudo ufw enable

# Verificar estado
sudo ufw status
```

### Cambiar passwords por defecto

Asegúrate de haber cambiado todos los passwords en `.env.production`:

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`

### Actualizar regularmente

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Actualizar imágenes Docker
docker-compose pull
docker-compose up -d
```

---

## 🐛 Troubleshooting

### La aplicación no inicia

Verifica los logs:

```bash
docker-compose logs app
```

Problemas comunes:

- **Error de conexión a la base de datos**: Verifica que el contenedor `mysql` esté corriendo y healthy
- **Puerto 3000 ya en uso**: Detén cualquier otro servicio usando ese puerto

### Nginx muestra error 502 Bad Gateway

- Verifica que el contenedor `app` esté corriendo: `docker-compose ps`
- Revisa los logs de la app: `docker-compose logs app`
- Verifica la configuración de Nginx: `docker-compose exec nginx nginx -t`

### No puedo conectarme desde el navegador

- Verifica que el firewall permita los puertos 80 y 443
- Verifica que Nginx esté corriendo: `docker-compose ps nginx`
- Prueba desde el servidor: `curl http://localhost`

### Error de certificado SSL

- Verifica que el dominio apunte correctamente a tu IP
- Revisa los logs de certbot: `docker-compose logs certbot`
- Asegúrate de que el puerto 80 esté accesible durante la obtención del certificado

### La base de datos no persiste los datos

- Verifica que el volumen esté creado: `docker volume ls | grep mysql`
- No uses `docker-compose down -v` a menos que quieras eliminar los datos

---

## 📊 Monitoreo

### Verificar uso de recursos

```bash
# Ver uso de CPU y memoria de contenedores
docker stats

# Ver espacio en disco
df -h

# Ver logs de sistema
sudo journalctl -u docker
```

### Health checks

Los contenedores tienen health checks configurados. Verifica su estado:

```bash
docker-compose ps
```

La columna STATUS mostrará "Up (healthy)" si todo está bien.

---

## 🔄 Actualizaciones

Para actualizar la aplicación después de cambios en el código:

```bash
# 1. Detener la aplicación
docker-compose stop app

# 2. Hacer pull de los cambios (si usas Git)
git pull origin main

# 3. Reconstruir la imagen
docker-compose build app

# 4. Iniciar la aplicación
docker-compose up -d app

# 5. Verificar logs
docker-compose logs -f app
```

---

## 📝 Mantenimiento

### Limpieza de Docker

Docker puede acumular imágenes y contenedores no utilizados:

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune -a

# Eliminar volúmenes no utilizados (¡CUIDADO!)
docker volume prune

# Limpieza completa (¡CUIDADO!)
docker system prune -a
```

### Renovación automática de certificados SSL

Los certificados se renuevan automáticamente gracias al contenedor `certbot`. Verifica que esté corriendo:

```bash
docker-compose ps certbot
```

---

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica la configuración: revisa `.env.production` y `nginx/conf.d/chula-vista.conf`
3. Consulta la documentación de Docker: https://docs.docker.com
4. Contacta al desarrollador con los logs del error

---

## 📚 Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com)
- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Documentación de Nginx](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)

---

## ✅ Checklist de Deployment

- [ ] VPS configurado con Ubuntu y acceso SSH
- [ ] Docker y Docker Compose instalados
- [ ] Firewall configurado (puertos 80, 443 abiertos)
- [ ] Proyecto transferido al VPS
- [ ] Archivo `.env.production` configurado con passwords seguros
- [ ] Contenedores construidos e iniciados
- [ ] Aplicación accesible desde el navegador
- [ ] SSL/HTTPS configurado (si tienes dominio)
- [ ] Base de datos poblada con datos iniciales
- [ ] Backup de base de datos configurado
- [ ] Monitoreo básico configurado

---

**¡Felicidades! Tu plataforma Discover Chula Vista está ahora corriendo en tu propio VPS.**

Para cualquier duda o problema, no dudes en contactar al equipo de desarrollo.
