#!/bin/bash

# ============================================
# Script de Backup de Base de Datos
# Discover Chula Vista
# ============================================

set -e

# Configuración
BACKUP_DIR="/opt/backups/discover-chula-vista"
CONTAINER_NAME="chula-vista-db"
DB_NAME="discover_chula_vista"
DB_USER="chulavista"
RETENTION_DAYS=30  # Mantener backups por 30 días

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Nombre del archivo con timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"

echo "============================================"
echo "Backup de Base de Datos - Discover Chula Vista"
echo "============================================"
echo "Fecha: $(date)"
echo "Archivo: $BACKUP_FILE"
echo ""

# Verificar que el contenedor está corriendo
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "ERROR: El contenedor $CONTAINER_NAME no está corriendo"
    exit 1
fi

# Realizar backup
echo "Iniciando backup..."
docker exec "$CONTAINER_NAME" mysqldump \
    -u "$DB_USER" \
    -p"${MYSQL_PASSWORD}" \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    "$DB_NAME" > "$BACKUP_FILE"

# Comprimir backup
echo "Comprimiendo backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verificar que el backup se creó correctamente
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✓ Backup completado exitosamente"
    echo "  Tamaño: $BACKUP_SIZE"
    echo "  Ubicación: $BACKUP_FILE"
else
    echo "✗ ERROR: El backup no se creó correctamente"
    exit 1
fi

# Eliminar backups antiguos
echo ""
echo "Limpiando backups antiguos (más de $RETENTION_DAYS días)..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
echo "✓ Limpieza completada"

# Mostrar backups disponibles
echo ""
echo "Backups disponibles:"
ls -lh "$BACKUP_DIR" | grep "backup_"

echo ""
echo "============================================"
echo "Backup completado"
echo "============================================"
