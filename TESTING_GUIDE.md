# 🧪 Guía de Prueba - Kindle Notes Organizer

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Iniciar la aplicación

El servidor de desarrollo ya está corriendo. Abre tu navegador en:

```
http://localhost:3000
```

### 2️⃣ Probar el flujo completo SIN SUPABASE

La app funciona perfectamente **sin necesidad de configurar Supabase**. Estas funcionalidades están disponibles de inmediato:

#### **Paso 1: Subir archivo**
1. En la página principal verás un dropzone grande
2. Arrastra el archivo `tests/fixtures/example-clippings.txt` (o crea uno propio)
3. O haz clic para seleccionarlo

#### **Paso 2: Procesar**
1. Haz clic en "Procesar archivo"
2. El Web Worker procesará el archivo (verás un toast de éxito)
3. Serás redirigido a `/process`

#### **Paso 3: Ver resultados**
1. Verás las estadísticas: número de libros y notas
2. Verás un grid con todos los libros encontrados
3. Haz clic en cualquier libro para ver sus notas

#### **Paso 4: Explorar notas**
1. Busca en tiempo real escribiendo en el campo de búsqueda
2. Ve los metadatos: página, ubicación, fecha
3. Las notas aparecen diferenciadas de los highlights

#### **Paso 5: Exportar**
1. Haz clic en "Exportar MD"
2. Se descargará un archivo `.md` con formato perfecto
3. Intenta exportar un segundo libro → verás el modal de login (gating funciona)

---

## 📝 Crear tu propio archivo de prueba

Si quieres probar con tus propios datos:

### Formato español:
```
Sapiens: De animales a dioses (Yuval Noah Harari)
- Tu subrayado en la página 42 | Añadido el lunes, 5 de mayo de 2019 1:23:45

La revolución cognitiva es el punto de partida de la historia humana.
==========
```

### Formato inglés:
```
Atomic Habits (James Clear)
- Your Highlight on Location 245-247 | Added on Sunday, May 12, 2019 9:15:30 AM

You do not rise to the level of your goals. You fall to the level of your systems.
==========
```

### Formato de nota:
```
1984 (George Orwell)
- Tu nota en la página 128 | Añadido el jueves, 15 de mayo de 2019 20:30:00

Esta es mi nota personal sobre este pasaje.
==========
```

**Importante**: Cada entrada debe terminar con `==========` (8 o más signos de igual)

---

## 🔐 Probar con Supabase (Opcional)

Si quieres probar las funcionalidades completas (export masivo, guardar biblioteca):

### 1. Crear proyecto Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratis
3. Crea un nuevo proyecto

### 2. Ejecutar el schema
1. En Supabase, ve a "SQL Editor"
2. Copia todo el contenido de `supabase-schema.sql`
3. Pégalo y ejecuta
4. Verás las tablas creadas en "Table Editor"

### 3. Obtener credenciales
1. Ve a "Settings" → "API"
2. Copia:
   - `Project URL`
   - `anon public key`

### 4. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui
```

### 5. Reiniciar el servidor
```bash
# Detén el servidor (Ctrl+C en la terminal)
npm run dev
```

### 6. Probar funcionalidades con auth

#### **Login con Magic Link**
1. Ve a `/account`
2. Haz clic en "Iniciar sesión"
3. Ingresa tu email
4. Revisa tu bandeja (puede tardar 1-2 minutos)
5. Haz clic en el enlace mágico

#### **Login con Google (Opcional)**
1. En Supabase: "Authentication" → "Providers"
2. Habilita "Google"
3. Configura OAuth (sigue las instrucciones)
4. En la app, haz clic en "Continuar con Google"

#### **Guardar biblioteca**
1. Procesa un archivo My Clippings.txt
2. En la vista de resultados, haz clic en "Guardar en mi cuenta"
3. Ve a `/account` para ver tu biblioteca guardada

#### **Export masivo (ZIP)**
1. Con auth activa, en la vista de todos los libros
2. Haz clic en "Exportar todos (ZIP)"
3. Se descargará un ZIP con un .md por libro + README

#### **Gestionar biblioteca**
1. En `/account` verás todos tus libros guardados
2. Haz clic en un libro para ver sus notas
3. Usa el botón "Borrar" para eliminar un libro
4. Usa "Exportar todos (ZIP)" para descargar todo

---

## 🧪 Casos de prueba recomendados

### ✅ Test 1: Archivo vacío
- Sube un archivo .txt vacío
- Deberías ver un error: "El archivo está vacío"

### ✅ Test 2: Archivo inválido
- Intenta subir un PDF o imagen
- Deberías ver: "El archivo debe ser de tipo texto"

### ✅ Test 3: Multi-idioma
- Usa `tests/fixtures/example-clippings.txt`
- Contiene entradas en español e inglés
- Deberían parsearse correctamente ambas

### ✅ Test 4: Deduplicación
- El archivo de ejemplo tiene 2 entradas idénticas de "1984"
- Solo debería aparecer 1 en los resultados

### ✅ Test 5: Búsqueda
- Selecciona un libro con varias notas
- Escribe algo en el buscador
- Deberías ver filtrado en tiempo real

### ✅ Test 6: Gating sin login
- Exporta un libro (funciona)
- Intenta exportar un segundo libro
- Deberías ver el modal de login

### ✅ Test 7: Export con login (requiere Supabase)
- Inicia sesión
- Procesa archivo
- Haz clic en "Exportar todos (ZIP)"
- Deberías descargar un ZIP con todos los libros

### ✅ Test 8: Persistencia (requiere Supabase)
- Guarda libros en tu cuenta
- Cierra el navegador
- Abre de nuevo `/account`
- Deberías ver tus libros guardados

---

## 🐛 Solución de problemas

### El servidor no inicia
```bash
# Verifica que instalaste las dependencias
npm install

# Reinicia el servidor
npm run dev
```

### "Module not found"
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### No funciona el Web Worker
- Verifica que estés usando `http://localhost:3000` (no file://)
- Los workers solo funcionan con HTTP/HTTPS

### No se descarga el archivo MD
- Verifica permisos de descarga en tu navegador
- Algunos navegadores bloquean descargas múltiples

### Supabase no conecta
- Verifica que las variables en `.env.local` sean correctas
- Reinicia el servidor después de crear `.env.local`
- Verifica que ejecutaste el schema SQL completo

### Error "RLS enabled"
- Asegúrate de ejecutar TODO el script `supabase-schema.sql`
- Incluye las políticas RLS al final del script

---

## 📊 Validación de resultados

### Deberías ver:

**En la landing:**
- ✅ Hero con título y subtítulo
- ✅ Dropzone con mensaje de privacidad
- ✅ Sección "Cómo funciona" (3 pasos)
- ✅ Trust signals (4 puntos)

**Después de procesar:**
- ✅ Stats: X libros, Y notas
- ✅ Grid de libros con covers placeholder
- ✅ Contador de notas por libro

**En vista de libro:**
- ✅ Título y autor del libro
- ✅ Buscador de notas
- ✅ Lista de highlights/notas
- ✅ Metadatos (página, ubicación, fecha)
- ✅ Notas diferenciadas con badge

**Archivo MD exportado:**
- ✅ Header con título y autor
- ✅ Contador de highlights
- ✅ Highlights numerados
- ✅ Blockquotes (> )
- ✅ Notas con "**Nota:**"
- ✅ Separadores (---)

---

## ✨ Características para probar

- [ ] Drag & drop de archivo
- [ ] Click para seleccionar archivo
- [ ] Validación de archivo
- [ ] Progress durante procesamiento
- [ ] Toasts informativos
- [ ] Animaciones suaves
- [ ] Búsqueda en tiempo real
- [ ] Export Markdown individual
- [ ] Gating (bloqueo después de 1 export)
- [ ] Modal de auth
- [ ] Magic link (con Supabase)
- [ ] Google OAuth (con Supabase configurado)
- [ ] Guardar en cuenta (con Supabase)
- [ ] Ver biblioteca (con Supabase)
- [ ] Borrar libro (con Supabase)
- [ ] Export ZIP masivo (con Supabase + auth)
- [ ] Responsive (prueba en móvil)

---

## 🎯 Performance esperado

- **Archivo 1MB (~500 highlights)**: < 2 segundos
- **Archivo 5MB (~2500 highlights)**: < 5 segundos
- **UI nunca se congela** (gracias al Web Worker)
- **Búsqueda instantánea** (< 100ms)

---

## 📱 Responsive

Prueba en diferentes tamaños:
- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna
- **Nav**: Se adapta con menú hamburguesa

---

## 🎉 ¡Eso es todo!

Si todo funciona correctamente, deberías poder:
1. ✅ Subir My Clippings.txt
2. ✅ Ver libros organizados
3. ✅ Buscar en notas
4. ✅ Exportar a Markdown
5. ✅ (Opcional) Guardar y gestionar biblioteca con auth

**¿Problemas?** Revisa la consola del navegador (F12) para ver errores.

