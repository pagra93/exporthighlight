# Variables de Entorno para SEO

Para completar la configuración SEO, necesitas crear un archivo `.env.local` con las siguientes variables:

```bash
# URL base del sitio (cambiar por tu dominio real)
NEXT_PUBLIC_SITE_URL=https://exporthighlight.com

# Verificación de Google Search Console
GOOGLE_SITE_VERIFICATION=8P-_YEg7P2XAK6li4aBJ3ut9AoHiq15Mn1HX

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-8GH0CLP0BS

# Redes sociales (cuando las tengas)
NEXT_PUBLIC_TWITTER_HANDLE=@exporthighlight
NEXT_PUBLIC_GITHUB_URL=https://github.com/yourusername/exporthighlight
```

## Pasos para configurar Google Search Console:

1. ✅ Ve a [Google Search Console](https://search.google.com/search-console)
2. ✅ Agrega tu propiedad web: `exporthighlight.com`
3. 🔄 Verifica la propiedad usando el método "DNS TXT" o "Archivo HTML"
4. 📋 Copia el código de verificación y pégalo en `GOOGLE_SITE_VERIFICATION`
5. 📤 Envía tu sitemap en `/sitemap.xml`

## Google Analytics 4 configurado:

✅ **ID de Medición**: `G-8GH0CLP0BS`
✅ **Componente integrado**: `components/analytics/GoogleAnalytics.tsx`
✅ **Eventos personalizados configurados**:
- `file_uploaded` - Cuando se sube un archivo
- `file_upload_error` - Cuando hay error al subir
- `file_processing_started` - Cuando inicia el procesamiento
- `file_processing_success` - Cuando se procesa exitosamente
- `file_processing_error` - Cuando hay error en el procesamiento

## Imágenes necesarias para SEO:

- `/public/og-image.png` - Imagen para Open Graph (1200x630px)
- `/public/logo.png` - Logo de la aplicación
- `/public/favicon.ico` - Favicon

## Próximos pasos:

1. ✅ Configurar Google Analytics
2. Crear contenido adicional (blog, guías)
3. Optimizar Core Web Vitals
4. Implementar breadcrumbs
5. Crear enlaces internos estratégicos
