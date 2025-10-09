#!/bin/bash
# Script para limpiar cache de Docker en Coolify
# EJECUTAR EN EL SERVIDOR DE COOLIFY, NO EN TU MAC

echo "🧹 Limpiando cache de Docker para exporthighlight..."

# 1. Listar containers relacionados
echo "📦 Containers actuales:"
docker ps -a | grep exporthighlight

# 2. Parar container
echo "⏸️  Parando container..."
docker stop $(docker ps -q --filter "name=exporthighlight")

# 3. Eliminar container
echo "🗑️  Eliminando container..."
docker rm $(docker ps -aq --filter "name=exporthighlight")

# 4. Eliminar imágenes viejas
echo "🗑️  Eliminando imágenes viejas..."
docker images | grep exporthighlight | awk '{print $3}' | xargs docker rmi -f

# 5. Limpiar build cache de Docker
echo "🧹 Limpiando build cache..."
docker builder prune -af

# 6. Limpiar volúmenes sin usar
echo "🧹 Limpiando volúmenes..."
docker volume prune -f

echo "✅ Limpieza completa. Ahora ve a Coolify y haz 'Redeploy'"

