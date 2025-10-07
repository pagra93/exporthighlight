# 🔐 Configuración de Supabase

## Paso 1: Crear archivo `.env.local`

Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
```

⚠️ **IMPORTANTE**: Necesitas reemplazar `TU_ANON_KEY_AQUI` con tu **anon key** real.

## Paso 2: Obtener tu Anon Key

1. Ve a tu dashboard de Supabase: https://supabase.bayyana.es
2. Ve a **Settings** → **API**
3. Copia el valor de **anon public key**
4. Pégalo en el archivo `.env.local`

## Paso 3: Ejecutar el Schema SQL

1. Ve a tu dashboard de Supabase
2. Ve a **SQL Editor**
3. Copia TODO el contenido del archivo `supabase-schema.sql`
4. Pégalo en el editor y haz clic en **Run**

## Paso 4: Reiniciar el servidor

```bash
# Detén el servidor actual (Ctrl+C)
npm run dev
```

## ✅ Verificación

Una vez configurado, deberías poder:
- ✅ Iniciar sesión con email/password
- ✅ Login con Google (si lo configuras en Supabase)
- ✅ Guardar tu biblioteca
- ✅ Exportar todos los libros en ZIP

---

## 📝 Comandos Rápidos

```bash
# Crear el archivo .env.local (copia y pega en terminal)
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY_AQUI
EOF

# Después edita el archivo para poner tu key real:
# nano .env.local  (o usa tu editor favorito)
```

