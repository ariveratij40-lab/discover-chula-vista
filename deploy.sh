#!/bin/bash

# ============================================
# Script de Deployment Automatizado
# Discover Chula Vista
# ============================================

set -e  # Salir si hay algún error

echo "============================================"
echo "Discover Chula Vista - Deployment Script"
echo "============================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml no encontrado. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

print_success "Directorio del proyecto verificado"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

print_success "Docker encontrado: $(docker --version)"

# Verificar que Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

print_success "Docker Compose encontrado: $(docker-compose --version)"

# Verificar archivo de configuración
if [ ! -f ".env.production" ]; then
    print_warning "Archivo .env.production no encontrado"
    
    if [ -f ".env.production.example" ]; then
        print_info "Copiando .env.production.example a .env.production"
        cp .env.production.example .env.production
        print_warning "¡IMPORTANTE! Edita .env.production con tus valores antes de continuar"
        print_info "Ejecuta: nano .env.production"
        exit 1
    else
        print_error "No se encontró .env.production.example"
        exit 1
    fi
fi

print_success "Archivo de configuración encontrado"

# Preguntar modo de deployment
echo ""
print_info "Selecciona el modo de deployment:"
echo "1) Primera instalación (build completo)"
echo "2) Actualización (rebuild y restart)"
echo "3) Solo restart (sin rebuild)"
read -p "Opción [1-3]: " deploy_mode

case $deploy_mode in
    1)
        print_info "Iniciando primera instalación..."
        
        # Detener contenedores existentes si los hay
        print_info "Deteniendo contenedores existentes..."
        docker-compose down 2>/dev/null || true
        
        # Build
        print_info "Construyendo imágenes Docker (esto puede tomar varios minutos)..."
        docker-compose build
        print_success "Imágenes construidas"
        
        # Iniciar servicios
        print_info "Iniciando servicios..."
        docker-compose --env-file .env.production up -d
        print_success "Servicios iniciados"
        ;;
        
    2)
        print_info "Iniciando actualización..."
        
        # Detener app
        print_info "Deteniendo aplicación..."
        docker-compose stop app
        
        # Rebuild
        print_info "Reconstruyendo imagen de la aplicación..."
        docker-compose build app
        print_success "Imagen reconstruida"
        
        # Iniciar
        print_info "Iniciando aplicación..."
        docker-compose --env-file .env.production up -d app
        print_success "Aplicación actualizada"
        ;;
        
    3)
        print_info "Reiniciando servicios..."
        docker-compose restart
        print_success "Servicios reiniciados"
        ;;
        
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

# Esperar a que los servicios estén listos
echo ""
print_info "Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los contenedores
echo ""
print_info "Estado de los contenedores:"
docker-compose ps

# Verificar health de la base de datos
echo ""
print_info "Verificando salud de la base de datos..."
for i in {1..30}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        print_success "Base de datos está lista"
        break
    fi
    
    if [ $i -eq 30 ]; then
        print_error "La base de datos no respondió después de 30 intentos"
        print_info "Revisa los logs: docker-compose logs mysql"
        exit 1
    fi
    
    sleep 1
done

# Verificar que la aplicación responde
echo ""
print_info "Verificando que la aplicación responde..."
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_success "Aplicación está respondiendo"
else
    print_warning "La aplicación no responde en el puerto 3000"
    print_info "Revisa los logs: docker-compose logs app"
fi

# Mostrar información de acceso
echo ""
echo "============================================"
print_success "Deployment completado"
echo "============================================"
echo ""
print_info "Acceso a la aplicación:"
echo "  - Local: http://localhost"
echo "  - Externo: http://108.175.9.162"
echo ""
print_info "Comandos útiles:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Ver logs de la app: docker-compose logs -f app"
echo "  - Detener: docker-compose stop"
echo "  - Reiniciar: docker-compose restart"
echo ""
print_warning "Próximos pasos:"
echo "  1. Verifica que la aplicación funciona: http://108.175.9.162"
echo "  2. Configura SSL/HTTPS si tienes un dominio"
echo "  3. Configura backups automáticos de la base de datos"
echo "  4. Configura monitoreo y alertas"
echo ""
