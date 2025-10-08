# 📧 Configuración de Emails de Confirmación

## 🔍 Diagnóstico del Problema

El envío de emails de confirmación en Supabase puede fallar por varias razones:

1. **SMTP no configurado** - Supabase usa SMTP para enviar emails
2. **Templates de email deshabilitados** - Los templates pueden estar desactivados
3. **Configuración de dominio** - El dominio de redirección puede estar mal configurado
4. **Límites de email** - Puede haber límites en el plan de Supabase

## 🛠️ Solución Paso a Paso

### Paso 1: Verificar Configuración de Supabase

1. **Ve a tu dashboard de Supabase**: https://supabase.bayyana.es
2. **Navega a Authentication → Settings**
3. **Verifica estas configuraciones**:

#### ✅ Site URL
```
Site URL: https://exporthighlight.com
```

#### ✅ Redirect URLs
```
Redirect URLs: 
- https://exporthighlight.com/auth/callback
- http://localhost:3000/auth/callback (para desarrollo)
```

### Paso 2: Configurar SMTP (CRÍTICO)

1. **Ve a Settings → Auth → SMTP Settings**
2. **Configura un proveedor SMTP**:

#### Opción A: Gmail (Recomendado para desarrollo)
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: tu-email@gmail.com
SMTP Pass: tu-app-password (NO tu contraseña normal)
SMTP Admin Email: tu-email@gmail.com
SMTP Sender Name: ExportHighlight
```

#### Opción B: SendGrid (Recomendado para producción)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: tu-sendgrid-api-key
SMTP Admin Email: tu-email@tu-dominio.com
SMTP Sender Name: ExportHighlight
```

#### Opción C: Mailgun
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: tu-mailgun-smtp-user
SMTP Pass: tu-mailgun-smtp-password
SMTP Admin Email: tu-email@tu-dominio.com
SMTP Sender Name: ExportHighlight
```

### Paso 3: Habilitar Templates de Email

1. **Ve a Authentication → Email Templates**
2. **Habilita estos templates**:
   - ✅ Confirm signup
   - ✅ Reset password
   - ✅ Magic Link

3. **Personaliza los templates** (opcional):
```html
<!-- Confirm signup template -->
<h2>Welcome to ExportHighlight!</h2>
<p>Click the link below to confirm your account:</p>
<a href="{{ .ConfirmationURL }}">Confirm Account</a>
```

### Paso 4: Configurar Variables de Entorno

Crea o actualiza tu archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Email Configuration (opcional, para debugging)
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Paso 5: Verificar Configuración en el Código

El código actual en `AuthModal.tsx` ya está configurado correctamente:

```typescript
// Para registro
const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});

// Para magic link
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
});

// Para reset password
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/callback`,
});
```

## 🧪 Testing del Envío de Emails

### Test 1: Registro de Usuario
1. Abre la aplicación
2. Haz clic en "Create account"
3. Ingresa un email válido
4. Ingresa una contraseña
5. Haz clic en "Create Account"
6. **Verifica**: Deberías ver un mensaje de éxito
7. **Revisa tu email**: Deberías recibir un email de confirmación

### Test 2: Magic Link
1. Haz clic en "Sign in with Magic Link"
2. Ingresa tu email
3. Haz clic en "Send Magic Link"
4. **Revisa tu email**: Deberías recibir un magic link

### Test 3: Reset Password
1. Haz clic en "Forgot your password?"
2. Ingresa tu email
3. Haz clic en "Send Reset Link"
4. **Revisa tu email**: Deberías recibir un enlace de reset

## 🚨 Solución de Problemas

### Problema: No llegan emails
**Soluciones**:
1. ✅ Verifica que SMTP esté configurado
2. ✅ Revisa la carpeta de spam
3. ✅ Verifica que el email esté bien escrito
4. ✅ Comprueba los logs de Supabase

### Problema: Error de SMTP
**Soluciones**:
1. ✅ Verifica credenciales SMTP
2. ✅ Usa App Password para Gmail
3. ✅ Verifica que el puerto sea correcto (587)
4. ✅ Comprueba que el servidor SMTP esté activo

### Problema: Emails van a spam
**Soluciones**:
1. ✅ Configura SPF, DKIM, DMARC
2. ✅ Usa un dominio personalizado
3. ✅ Evita palabras spam en el contenido
4. ✅ Configura un sender name profesional

## 📋 Checklist de Configuración

- [ ] SMTP configurado en Supabase
- [ ] Site URL configurado correctamente
- [ ] Redirect URLs incluyen tu dominio
- [ ] Templates de email habilitados
- [ ] Variables de entorno configuradas
- [ ] Test de registro funcionando
- [ ] Test de magic link funcionando
- [ ] Test de reset password funcionando

## 🔧 Configuración para Coolify

Si estás usando Coolify, asegúrate de que:

1. **Variables de entorno estén configuradas** en Coolify
2. **El dominio esté configurado** correctamente
3. **Las URLs de redirección** apunten al dominio de Coolify

```bash
# En Coolify, configura estas variables:
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=https://tu-app.coolify.io
```

## 📞 Soporte

Si sigues teniendo problemas:

1. **Revisa los logs de Supabase** en el dashboard
2. **Verifica los logs de Coolify** si usas Coolify
3. **Comprueba la consola del navegador** para errores
4. **Testa con diferentes proveedores SMTP**

---

**Nota**: El envío de emails es responsabilidad de Supabase, no de Coolify. Coolify solo despliega tu aplicación, pero Supabase maneja la autenticación y el envío de emails.
